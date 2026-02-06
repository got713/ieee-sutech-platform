import express from "express";
import Certificate from "../models/Certificate.js";
import Member from "../models/Member.js";
import crypto from "crypto";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";
import { generateCertificatePDF } from "../utils/pdfService.js";
import { sendCertificateEmail, sendBatchCertificateEmails } from "../utils/emailService.js";

const router = express.Router();

// Get all certificates (admin only)
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const certificates = await Certificate.find()
      .populate("memberId", "name email")
      .sort({ createdAt: -1 });
    res.json(certificates);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get certificates by email (public - for students to view their certificates)
router.get("/student/:email", async (req, res) => {
  try {
    const certificates = await Certificate.find({ studentEmail: req.params.email })
      .sort({ eventDate: -1 });
    res.json(certificates);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single certificate (public - for sharing)
router.get("/:id", async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id)
      .populate("memberId", "name email");
    if (!certificate) {
      return res.status(404).json({ message: "Certificate not found" });
    }
    res.json(certificate);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create certificate (admin only)
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const certificate = new Certificate(req.body);
    
    // Generate verification hash
    const verificationHash = crypto.randomBytes(32).toString('hex');
    certificate.verificationHash = verificationHash;
    
    const savedCertificate = await certificate.save();
    res.status(201).json(savedCertificate);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update certificate (admin only)
router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    const certificate = await Certificate.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!certificate) {
      return res.status(404).json({ message: "Certificate not found" });
    }
    res.json(certificate);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete certificate (admin only)
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const certificate = await Certificate.findByIdAndDelete(req.params.id);
    if (!certificate) {
      return res.status(404).json({ message: "Certificate not found" });
    }
    res.json({ message: "Certificate deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Batch create certificates (admin only)
router.post("/batch", protect, adminOnly, async (req, res) => {
  try {
    const { recipients, eventName, eventDate, certificateType, description, backgroundImage, issuedBy } = req.body;

    // Validate recipients array
    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return res.status(400).json({ message: "Recipients array is required and must not be empty" });
    }

    // Validate required fields
    if (!eventName || !eventDate || !certificateType) {
      return res.status(400).json({ message: "Event name, date, and certificate type are required" });
    }

    const certificates = [];
    const errors = [];

    // Process each recipient
    for (let i = 0; i < recipients.length; i++) {
      const recipient = recipients[i];
      
      try {
        // If memberId is provided, validate it
        let memberData = null;
        if (recipient.memberId) {
          memberData = await Member.findById(recipient.memberId);
          if (!memberData) {
            errors.push({
              index: i,
              recipient: recipient,
              error: "Member not found"
            });
            continue;
          }
        }

        // Create certificate
        const certificate = new Certificate({
          studentName: recipient.studentName || memberData?.name,
          studentEmail: recipient.studentEmail || memberData?.email,
          eventName,
          eventDate,
          certificateType,
          description: recipient.customDescription || description,
          backgroundImage,
          issuedBy,
          memberId: recipient.memberId || null,
          verificationHash: crypto.randomBytes(32).toString('hex')
        });

        const savedCertificate = await certificate.save();
        certificates.push(savedCertificate);
      } catch (err) {
        errors.push({
          index: i,
          recipient: recipient,
          error: err.message
        });
      }
    }

    res.status(201).json({
      message: `Successfully created ${certificates.length} certificate(s)`,
      success: certificates.length,
      failed: errors.length,
      certificates,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Batch create certificates from event participants (admin only)
router.post("/batch/event", protect, adminOnly, async (req, res) => {
  try {
    const { memberIds, eventName, eventDate, certificateType, description, backgroundImage, issuedBy } = req.body;

    // Validate memberIds array
    if (!memberIds || !Array.isArray(memberIds) || memberIds.length === 0) {
      return res.status(400).json({ message: "Member IDs array is required and must not be empty" });
    }

    // Validate required fields
    if (!eventName || !eventDate || !certificateType) {
      return res.status(400).json({ message: "Event name, date, and certificate type are required" });
    }

    const certificates = [];
    const errors = [];

    // Process each member
    for (let i = 0; i < memberIds.length; i++) {
      const memberId = memberIds[i];
      
      try {
        const member = await Member.findById(memberId);
        if (!member) {
          errors.push({
            memberId,
            error: "Member not found"
          });
          continue;
        }

        // Create certificate
        const certificate = new Certificate({
          studentName: member.name,
          studentEmail: member.email,
          eventName,
          eventDate,
          certificateType,
          description,
          backgroundImage,
          issuedBy,
          memberId: member._id,
          verificationHash: crypto.randomBytes(32).toString('hex')
        });

        const savedCertificate = await certificate.save();
        certificates.push(savedCertificate);

        // Optional: Update member points
        if (certificateType === "winner") {
          member.points = (member.points || 0) + 50;
        } else if (certificateType === "achievement") {
          member.points = (member.points || 0) + 30;
        } else if (certificateType === "speaker") {
          member.points = (member.points || 0) + 25;
        } else if (certificateType === "participation") {
          member.points = (member.points || 0) + 10;
        }
        await member.save();
      } catch (err) {
        errors.push({
          memberId,
          error: err.message
        });
      }
    }

    res.status(201).json({
      message: `Successfully created ${certificates.length} certificate(s) and updated points`,
      success: certificates.length,
      failed: errors.length,
      certificates,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Generate PDF for certificate (public)
router.get("/pdf/:id", async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id);
    if (!certificate) {
      return res.status(404).json({ message: "Certificate not found" });
    }

    // Generate PDF with verification URL
    const verificationUrl = certificate.verificationHash 
      ? `${req.protocol}://${req.get('host')}/verify/${certificate.verificationHash}`
      : null;
      
    const pdfBuffer = await generateCertificatePDF({
      studentName: certificate.studentName,
      eventName: certificate.eventName,
      eventDate: certificate.eventDate,
      certificateType: certificate.certificateType,
      description: certificate.description,
      issuedBy: certificate.issuedBy,
      verificationUrl
    });

    // Set headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Certificate_${certificate.studentName.replace(/\s+/g, '_')}.pdf`);
    res.send(pdfBuffer);
  } catch (err) {
    console.error("PDF generation error:", err);
    res.status(500).json({ message: "Failed to generate PDF: " + err.message });
  }
});

// Send certificate via email (admin only)
router.post("/email/:id", protect, adminOnly, async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id);
    if (!certificate) {
      return res.status(404).json({ message: "Certificate not found" });
    }

    // Generate PDF
    const pdfBuffer = await generateCertificatePDF({
      studentName: certificate.studentName,
      eventName: certificate.eventName,
      eventDate: certificate.eventDate,
      certificateType: certificate.certificateType,
      description: certificate.description,
      issuedBy: certificate.issuedBy
    });

    // Certificate URL for online viewing
    const certificateUrl = `${req.protocol}://${req.get('host')}/certificate/${certificate._id}`;

    // Send email
    const result = await sendCertificateEmail({
      to: certificate.studentEmail,
      studentName: certificate.studentName,
      eventName: certificate.eventName,
      certificateUrl,
      pdfAttachment: pdfBuffer
    });

    if (result.success) {
      res.json({ 
        message: "Certificate sent successfully",
        email: certificate.studentEmail,
        messageId: result.messageId
      });
    } else {
      res.status(500).json({ 
        message: "Failed to send email",
        error: result.error
      });
    }
  } catch (err) {
    console.error("Email sending error:", err);
    res.status(500).json({ message: "Failed to send certificate: " + err.message });
  }
});

// Batch send certificates via email (admin only)
router.post("/email/batch/send", protect, adminOnly, async (req, res) => {
  try {
    const { certificateIds } = req.body;

    if (!certificateIds || !Array.isArray(certificateIds) || certificateIds.length === 0) {
      return res.status(400).json({ message: "Certificate IDs array is required" });
    }

    const certificates = await Certificate.find({ _id: { $in: certificateIds } });
    
    if (certificates.length === 0) {
      return res.status(404).json({ message: "No certificates found" });
    }

    // Generate PDFs and prepare email data
    const emailData = [];
    for (const cert of certificates) {
      const pdfBuffer = await generateCertificatePDF({
        studentName: cert.studentName,
        eventName: cert.eventName,
        eventDate: cert.eventDate,
        certificateType: cert.certificateType,
        description: cert.description,
        issuedBy: cert.issuedBy
      });

      emailData.push({
        studentEmail: cert.studentEmail,
        studentName: cert.studentName,
        eventName: cert.eventName,
        url: `${req.protocol}://${req.get('host')}/certificate/${cert._id}`,
        pdfBuffer
      });
    }

    // Send batch emails
    const results = await sendBatchCertificateEmails(emailData);

    res.json({
      message: `Sent ${results.success} email(s), ${results.failed} failed`,
      success: results.success,
      failed: results.failed,
      errors: results.errors.length > 0 ? results.errors : undefined
    });
  } catch (err) {
    console.error("Batch email error:", err);
    res.status(500).json({ message: "Failed to send certificates: " + err.message });
  }
});

// Verify certificate by hash (public)
router.get("/verify/:hash", async (req, res) => {
  try {
    const certificate = await Certificate.findOne({ verificationHash: req.params.hash })
      .populate("memberId", "name email");
    
    if (!certificate) {
      return res.status(404).json({ 
        verified: false,
        message: "Certificate not found or invalid verification code" 
      });
    }

    res.json({
      verified: true,
      certificate: {
        studentName: certificate.studentName,
        studentEmail: certificate.studentEmail,
        eventName: certificate.eventName,
        eventDate: certificate.eventDate,
        certificateType: certificate.certificateType,
        issuedBy: certificate.issuedBy,
        issuedOn: certificate.createdAt,
        certificateId: certificate._id
      }
    });
  } catch (err) {
    res.status(500).json({ 
      verified: false,
      message: "Verification failed: " + err.message 
    });
  }
});

export default router;
