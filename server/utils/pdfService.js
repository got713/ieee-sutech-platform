import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import QRCode from "qrcode";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Generate certificate PDF
export const generateCertificatePDF = async (certificateData) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { studentName, eventName, eventDate, certificateType, description, issuedBy, verificationUrl } = certificateData;

      // Create PDF document
      const doc = new PDFDocument({
        size: 'A4',
        layout: 'landscape',
        margins: { top: 50, bottom: 50, left: 50, right: 50 }
      });

      // Buffer to store PDF
      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });
      doc.on('error', reject);

      // Colors based on certificate type
      const colors = {
        participation: { primary: '#667eea', secondary: '#764ba2' },
        achievement: { primary: '#4facfe', secondary: '#00f2fe' },
        winner: { primary: '#f093fb', secondary: '#f5576c' },
        speaker: { primary: '#43e97b', secondary: '#38f9d7' }
      };

      const color = colors[certificateType] || colors.participation;

      // Draw decorative border
      doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40)
         .lineWidth(3)
         .strokeColor(color.primary)
         .stroke();

      doc.rect(30, 30, doc.page.width - 60, doc.page.height - 60)
         .lineWidth(1)
         .strokeColor(color.secondary)
         .stroke();

      // Add decorative corners
      const cornerSize = 40;
      // Top-left corner
      doc.moveTo(40, 40).lineTo(40 + cornerSize, 40).stroke();
      doc.moveTo(40, 40).lineTo(40, 40 + cornerSize).stroke();
      // Top-right corner
      doc.moveTo(doc.page.width - 40, 40).lineTo(doc.page.width - 40 - cornerSize, 40).stroke();
      doc.moveTo(doc.page.width - 40, 40).lineTo(doc.page.width - 40, 40 + cornerSize).stroke();
      // Bottom-left corner
      doc.moveTo(40, doc.page.height - 40).lineTo(40 + cornerSize, doc.page.height - 40).stroke();
      doc.moveTo(40, doc.page.height - 40).lineTo(40, doc.page.height - 40 - cornerSize).stroke();
      // Bottom-right corner
      doc.moveTo(doc.page.width - 40, doc.page.height - 40).lineTo(doc.page.width - 40 - cornerSize, doc.page.height - 40).stroke();
      doc.moveTo(doc.page.width - 40, doc.page.height - 40).lineTo(doc.page.width - 40, doc.page.height - 40 - cornerSize).stroke();

      // Title
      doc.fontSize(48)
         .fillColor(color.primary)
         .font('Helvetica-Bold')
         .text('CERTIFICATE', 0, 80, { align: 'center' });

      // Certificate type
      doc.fontSize(18)
         .fillColor('#666')
         .font('Helvetica')
         .text(`of ${certificateType.charAt(0).toUpperCase() + certificateType.slice(1)}`, 0, 140, { align: 'center' });

      // Horizontal line
      doc.moveTo(200, 170)
         .lineTo(doc.page.width - 200, 170)
         .strokeColor(color.secondary)
         .lineWidth(2)
         .stroke();

      // "This is to certify that"
      doc.fontSize(16)
         .fillColor('#333')
         .font('Helvetica')
         .text('This is to certify that', 0, 200, { align: 'center' });

      // Student name (main focus)
      doc.fontSize(36)
         .fillColor(color.primary)
         .font('Helvetica-Bold')
         .text(studentName, 0, 240, { align: 'center' });

      // Underline for name
      const nameWidth = doc.widthOfString(studentName);
      const nameX = (doc.page.width - nameWidth) / 2;
      doc.moveTo(nameX, 285)
         .lineTo(nameX + nameWidth, 285)
         .strokeColor(color.secondary)
         .lineWidth(1)
         .stroke();

      // Event description
      doc.fontSize(16)
         .fillColor('#333')
         .font('Helvetica')
         .text('has successfully participated in', 0, 310, { align: 'center' });

      // Event name
      doc.fontSize(24)
         .fillColor(color.primary)
         .font('Helvetica-Bold')
         .text(eventName, 0, 345, { align: 'center' });

      // Event date
      const formattedDate = new Date(eventDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      doc.fontSize(14)
         .fillColor('#666')
         .font('Helvetica')
         .text(`Held on ${formattedDate}`, 0, 385, { align: 'center' });

      // Description (if provided)
      if (description) {
        doc.fontSize(12)
           .fillColor('#555')
           .font('Helvetica')
           .text(description, 100, 420, {
             align: 'center',
             width: doc.page.width - 200
           });
      }

      // Signature section
      const signatureY = doc.page.height - 150;

      // Left signature
      doc.fontSize(12)
         .fillColor('#333')
         .font('Helvetica')
         .text('_____________________', 150, signatureY, { align: 'center', width: 200 });

      doc.fontSize(10)
         .fillColor('#666')
         .text('Date', 150, signatureY + 25, { align: 'center', width: 200 });

      // Right signature
      doc.fontSize(12)
         .fillColor('#333')
         .font('Helvetica')
         .text('_____________________', doc.page.width - 350, signatureY, { align: 'center', width: 200 });

      if (issuedBy) {
        doc.fontSize(10)
           .fillColor('#666')
           .text(issuedBy, doc.page.width - 350, signatureY + 25, { align: 'center', width: 200 });
      } else {
        doc.fontSize(10)
           .fillColor('#666')
           .text('Authorized Signatory', doc.page.width - 350, signatureY + 25, { align: 'center', width: 200 });
      }

      // Footer
      doc.fontSize(10)
         .fillColor('#999')
         .font('Helvetica')
         .text('IEEE SUTECH Student Branch', 0, doc.page.height - 60, { align: 'center' });

      // QR Code for verification (if verification URL provided)
      if (verificationUrl) {
        try {
          const qrCodeDataUrl = await QRCode.toDataURL(verificationUrl, {
            width: 100,
            margin: 1,
            color: {
              dark: color.primary,
              light: '#ffffff'
            }
          });

          // Convert data URL to buffer
          const qrBuffer = Buffer.from(qrCodeDataUrl.split(',')[1], 'base64');
          
          // Add QR code to bottom left
          doc.image(qrBuffer, 50, doc.page.height - 120, { width: 80, height: 80 });
          
          // Add "Scan to Verify" text
          doc.fontSize(8)
             .fillColor('#666')
             .text('Scan to Verify', 50, doc.page.height - 35, { width: 80, align: 'center' });
        } catch (qrError) {
          console.error('QR Code generation error:', qrError);
        }
      }

      // Certificate ID (at bottom right)
      doc.fontSize(8)
         .fillColor('#ccc')
         .text(`Certificate ID: ${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, 
               doc.page.width - 250, doc.page.height - 35, { width: 200, align: 'right' });

      // Finalize PDF
      doc.end();

    } catch (error) {
      reject(error);
    }
  });
};

// Save PDF to file (optional - for local storage)
export const saveCertificatePDF = async (certificateData, outputPath) => {
  try {
    const pdfBuffer = await generateCertificatePDF(certificateData);
    fs.writeFileSync(outputPath, pdfBuffer);
    return { success: true, path: outputPath };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
