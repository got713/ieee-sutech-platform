import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { 
  ChevronLeft, ChevronRight, Users, Calendar, Award, 
  Zap, TrendingUp, Target, CheckCircle, ArrowRight,
  Bell, Sparkles, Newspaper, BookOpen, Trophy,
  ShieldCheck, QrCode, FileText, ScanFace, Search
} from "lucide-react";
import MemberSpotlight from "../components/MemberSpotlight";

export default function Home() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);

  useEffect(() => {
    // Fetch members for spotlight
    axios.get("http://localhost:5000/api/members/public")
      .then(res => {
        setMembers(res.data);
      })
      .catch(err => {
        console.error("Error fetching members:", err);
      });
  }, []);

  // Hero Carousel Data
  const slides = [
    {
      title: "IEEE SUTECH Student Branch",
      subtitle: "Empowering Tomorrow's Engineers Today",
      description: "Join a global network of innovators, learners, and leaders shaping the future of technology.",
      image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
      cta: "Join Now",
      ctaLink: "/membership"
    },
    {
      title: "Upcoming Tech Workshop",
      subtitle: "Machine Learning & AI Fundamentals",
      description: "Join our hands-on workshop on March 15th. Learn from industry experts and build your first ML model.",
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
      cta: "Register Now",
      ctaLink: "/events"
    },
    {
      title: "Achievements Unlocked",
      subtitle: "500+ Certificates Issued This Year",
      description: "Be part of our growing community. Earn certificates, gain experience, and showcase your skills.",
      image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
      cta: "View Members",
      ctaLink: "/members"
    }
  ];

  // Announcement Ticker Data
  const announcements = [
    "🎉 New Workshop: Introduction to Robotics - March 20, 2024",
    "🏆 Congratulations to our Hackathon Winners!",
    "📢 IEEE Membership Drive - Special Discount Available",
    "🚀 Tech Talk Series: Blockchain Technology - Coming Soon"
  ];

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  const features = [
    {
      icon: Calendar,
      title: "Tech Events",
      description: "Workshops, seminars, and competitions throughout the year",
      color: "primary"
    },
    {
      icon: Award,
      title: "Certifications",
      description: "Earn verified certificates for your achievements",
      color: "warning"
    },
    {
      icon: Users,
      title: "Community",
      description: "Connect with 500+ engineering students and professionals",
      color: "success"
    },
    {
      icon: TrendingUp,
      title: "Skill Growth",
      description: "Track your progress with XP points and rankings",
      color: "info"
    }
  ];

  return (
    <div className="position-relative overflow-hidden">
      {/* Announcement Ticker */}
      <div className="bg-ieee-gradient text-white py-2 shadow-sm">
        <div className="container">
          <div className="d-flex align-items-center">
            <Bell size={16} className="me-2 flex-shrink-0" />
            <div className="overflow-hidden">
              <motion.div
                className="d-flex gap-5"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              >
                {announcements.map((announcement, index) => (
                  <span key={index} className="text-nowrap fw-bold small">
                    {announcement}
                  </span>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Carousel */}
      <div className="position-relative" style={{ height: "600px", overflow: "hidden" }}>
        {slides.map((slide, index) => (
          <motion.div
            key={index}
            className="position-absolute top-0 start-0 w-100 h-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: currentSlide === index ? 1 : 0 }}
            transition={{ duration: 0.5 }}
            style={{ pointerEvents: currentSlide === index ? "auto" : "none" }}
          >
            {/* Background Image with Overlay */}
            <div 
              className="position-absolute top-0 start-0 w-100 h-100"
              style={{
                backgroundImage: `url(${slide.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center"
              }}
            >
              <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark" style={{ opacity: 0.6 }}></div>
            </div>

            {/* Content */}
            <div className="container position-relative h-100 d-flex align-items-center">
              <div className="row w-100">
                <div className="col-lg-8">
                  <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: currentSlide === index ? 1 : 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                  >
                    <span className="badge bg-accent-gradient text-white px-3 py-2 mb-3 d-inline-flex align-items-center">
                      <Sparkles size={16} className="me-2" /> {slide.subtitle}
                    </span>
                    <h1 className="display-3 fw-bold text-white mb-4">{slide.title}</h1>
                    <p className="lead text-white mb-4" style={{ maxWidth: "600px" }}>
                      {slide.description}
                    </p>
                    <button 
                      className="btn btn-accent btn-lg rounded-pill px-5 d-inline-flex align-items-center"
                      onClick={() => {
                        if (slide.ctaLink === "/membership") {
                          navigate("/membership");
                        } else {
                          navigate(slide.ctaLink);
                        }
                      }}
                    >
                      {slide.cta} <ArrowRight size={20} className="ms-2" />
                    </button>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Carousel Controls */}
        <button 
          className="btn btn-light rounded-circle position-absolute top-50 start-0 translate-middle-y ms-4 shadow"
          onClick={prevSlide}
          style={{ width: "50px", height: "50px", zIndex: 10 }}
        >
          <ChevronLeft size={24} />
        </button>
        <button 
          className="btn btn-light rounded-circle position-absolute top-50 end-0 translate-middle-y me-4 shadow"
          onClick={nextSlide}
          style={{ width: "50px", height: "50px", zIndex: 10 }}
        >
          <ChevronRight size={24} />
        </button>

        {/* Indicators */}
        <div className="position-absolute bottom-0 start-50 translate-middle-x mb-4 d-flex gap-2" style={{ zIndex: 10 }}>
          {slides.map((_, index) => (
            <button
              key={index}
              className={`btn p-0 rounded-pill ${currentSlide === index ? 'bg-white' : 'bg-white bg-opacity-50'}`}
              style={{ width: currentSlide === index ? "40px" : "10px", height: "10px", transition: "all 0.3s" }}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="container my-5">
        <div className="row g-3">
          {isLoggedIn ? (
            <>
              <div className="col-6 col-md-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn btn-ieee w-100 py-4 rounded-4 d-flex flex-column align-items-center gap-2"
                  onClick={() => navigate("/dashboard")}
                >
                  <Zap size={32} />
                  <span className="fw-bold">Dashboard</span>
                </motion.button>
              </div>
              <div className="col-6 col-md-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn btn-info w-100 py-4 rounded-4 d-flex flex-column align-items-center gap-2 text-white"
                  onClick={() => navigate("/announcements")}
                >
                  <Newspaper size={32} />
                  <span className="fw-bold">News</span>
                </motion.button>
              </div>
              <div className="col-6 col-md-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn btn-purple w-100 py-4 rounded-4 d-flex flex-column align-items-center gap-2 text-white"
                  onClick={() => navigate("/resources")}
                >
                  <BookOpen size={32} />
                  <span className="fw-bold">Resources</span>
                </motion.button>
              </div>
              <div className="col-6 col-md-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn btn-warning w-100 py-4 rounded-4 d-flex flex-column align-items-center gap-2 text-white"
                  onClick={() => navigate("/my-events")}
                >
                  <Calendar size={32} />
                  <span className="fw-bold">My Events</span>
                </motion.button>
              </div>
              <div className="col-6 col-md-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn btn-success w-100 py-4 rounded-4 d-flex flex-column align-items-center gap-2 text-white"
                  onClick={() => navigate("/members")}
                >
                  <Users size={32} />
                  <span className="fw-bold">Members</span>
                </motion.button>
              </div>
              <div className="col-6 col-md-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn btn-warning w-100 py-4 rounded-4 d-flex flex-column align-items-center gap-2 text-white"
                  onClick={() => navigate("/events")}
                >
                  <Calendar size={32} />
                  <span className="fw-bold">Events</span>
                </motion.button>
              </div>
            </>
          ) : (
            <>
              <div className="col-6 col-md-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn btn-ieee w-100 py-4 rounded-4 d-flex flex-column align-items-center gap-2"
                  onClick={() => navigate("/login")}
                >
                  <Zap size={32} />
                  <span className="fw-bold">Login</span>
                </motion.button>
              </div>
              <div className="col-6 col-md-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn btn-info w-100 py-4 rounded-4 d-flex flex-column align-items-center gap-2 text-white"
                  onClick={() => navigate("/announcements")}
                >
                  <Newspaper size={32} />
                  <span className="fw-bold">News</span>
                </motion.button>
              </div>
              <div className="col-6 col-md-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn btn-purple w-100 py-4 rounded-4 d-flex flex-column align-items-center gap-2 text-white"
                  onClick={() => navigate("/resources")}
                >
                  <BookOpen size={32} />
                  <span className="fw-bold">Resources</span>
                </motion.button>
              </div>
              <div className="col-6 col-md-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn btn-warning w-100 py-4 rounded-4 d-flex flex-column align-items-center gap-2 text-white"
                  onClick={() => navigate("/my-events")}
                >
                  <Calendar size={32} />
                  <span className="fw-bold">My Events</span>
                </motion.button>
              </div>
              <div className="col-6 col-md-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn btn-success w-100 py-4 rounded-4 d-flex flex-column align-items-center gap-2 text-white"
                  onClick={() => navigate("/members")}
                >
                  <Users size={32} />
                  <span className="fw-bold">Members</span>
                </motion.button>
              </div>
              <div className="col-6 col-md-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn btn-warning w-100 py-4 rounded-4 d-flex flex-column align-items-center gap-2 text-white"
                  onClick={() => navigate("/events")}
                >
                  <Calendar size={32} />
                  <span className="fw-bold">Events</span>
                </motion.button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Member Spotlight Section */}
      <div className="container my-5">
        <MemberSpotlight 
          members={members} 
          title="Featured Members" 
          subtitle="Recognizing outstanding contributors in our community" 
        />
      </div>

      {/* Features Section */}
      <div className="bg-light py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-6 fw-bold mb-2">Why Join IEEE SUTECH?</h2>
            <p className="text-muted lead">Unlock endless opportunities for growth and innovation</p>
          </div>
          <div className="row g-4">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                className="col-md-6 col-lg-3"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="ieee-card h-100 p-4 text-center">
                  <div className={`rounded-circle bg-${feature.color} bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-3`} style={{ width: "80px", height: "80px" }}>
                    <feature.icon size={36} className={`text-${feature.color}`} />
                  </div>
                  <h5 className="fw-bold mb-3">{feature.title}</h5>
                  <p className="text-muted small">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Certificate Verification Section */}
      <div className="container my-5">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="row align-items-center"
        >
          <div className="col-lg-6">
            <div className="ieee-card p-5 h-100">
              <h3 className="display-6 fw-bold mb-4 d-flex align-items-center">
                <ShieldCheck className="me-3 text-primary" size={32} />
                Verify Certificate Authenticity
              </h3>
              <p className="lead text-muted mb-4">
                Ensure the genuineness of IEEE SUTECH certificates with our secure verification system.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <button 
                  className="btn btn-ieee btn-lg d-flex align-items-center"
                  onClick={() => navigate("/certificate-verification")}
                >
                  <QrCode size={20} className="me-2" />
                  Verify Now
                </button>
                <button 
                  className="btn btn-outline-ieee btn-lg d-flex align-items-center"
                  onClick={() => navigate("/membership")}
                >
                  <FileText size={20} className="me-2" />
                  Learn More
                </button>
              </div>
            </div>
          </div>
          <div className="col-lg-6 mt-4 mt-lg-0">
            <div className="ieee-card p-4 h-100">
              <h4 className="mb-4">Why Verify Certificates?</h4>
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="d-flex align-items-start gap-3">
                    <div className="bg-primary bg-opacity-10 rounded-circle p-2">
                      <ShieldCheck size={20} className="text-primary" />
                    </div>
                    <div>
                      <h6 className="mb-1">Authenticity</h6>
                      <p className="text-muted small mb-0">Confirm certificates are genuine and officially issued</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex align-items-start gap-3">
                    <div className="bg-success bg-opacity-10 rounded-circle p-2">
                      <CheckCircle size={20} className="text-success" />
                    </div>
                    <div>
                      <h6 className="mb-1">Trust</h6>
                      <p className="text-muted small mb-0">Build confidence in certificate credibility</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex align-items-start gap-3">
                    <div className="bg-warning bg-opacity-10 rounded-circle p-2">
                      <Search size={20} className="text-warning" />
                    </div>
                    <div>
                      <h6 className="mb-1">Verification</h6>
                      <p className="text-muted small mb-0">Instant validation using QR codes or IDs</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex align-items-start gap-3">
                    <div className="bg-info bg-opacity-10 rounded-circle p-2">
                      <ScanFace size={20} className="text-info" />
                    </div>
                    <div>
                      <h6 className="mb-1">Security</h6>
                      <p className="text-muted small mb-0">Protected against fraud and counterfeiting</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* CTA Section */}
      <div className="bg-ieee-gradient text-white py-5">
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="display-5 fw-bold mb-3">Ready to Start Your Journey?</h2>
            <p className="lead mb-4">Join hundreds of students building the future of technology</p>
            <button 
              className="btn btn-light btn-lg rounded-pill px-5 d-inline-flex align-items-center"
              onClick={() => navigate(isLoggedIn ? "/dashboard" : "/register")}
            >
              <CheckCircle size={20} className="me-2" />
              {isLoggedIn ? "Go to Dashboard" : "Join Now"}
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
