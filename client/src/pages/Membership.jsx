import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Users, Award, BookOpen, Star, Zap, Target, 
  CheckCircle, ArrowRight, TrendingUp, Shield,
  GraduationCap, Calendar, Trophy, Heart,
  ChevronRight, Play, Download, ExternalLink
} from "lucide-react";

const Membership = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);

  const joinSteps = [
    {
      title: "Create Account",
      description: "Sign up with your email and basic information",
      icon: <Users size={24} className="text-primary" />,
      details: "Visit our registration page and fill out the simple form with your personal information and contact details."
    },
    {
      title: "Verify Email",
      description: "Confirm your email address to activate account",
      icon: <Shield size={24} className="text-success" />,
      details: "Check your inbox for a verification email and click the confirmation link to activate your account."
    },
    {
      title: "Complete Profile",
      description: "Fill in your professional details and interests",
      icon: <GraduationCap size={24} className="text-info" />,
      details: "Update your profile with your academic background, interests, and professional goals to personalize your experience."
    },
    {
      title: "Join Events",
      description: "Participate in workshops, seminars, and competitions",
      icon: <Calendar size={24} className="text-warning" />,
      details: "Browse upcoming events and register for sessions that match your interests and career goals."
    },
    {
      title: "Earn Rewards",
      description: "Collect points, certificates, and achievements",
      icon: <Trophy size={24} className="text-warning" />,
      details: "Participate actively to earn points, certificates, and recognition in our community."
    }
  ];

  const benefits = [
    {
      icon: <Award size={32} className="text-warning" />,
      title: "Certification Programs",
      description: "Earn official IEEE certificates for your participation and achievements in various events and workshops."
    },
    {
      icon: <BookOpen size={32} className="text-primary" />,
      title: "Educational Resources",
      description: "Access our library of articles, tutorials, webinars, and research materials curated by industry experts."
    },
    {
      icon: <TrendingUp size={32} className="text-success" />,
      title: "Points System",
      description: "Track your progress with our XP points system that recognizes your contributions and participation."
    },
    {
      icon: <Users size={32} className="text-info" />,
      title: "Community Network",
      description: "Connect with 500+ engineering students and professionals in our vibrant community."
    },
    {
      icon: <Zap size={32} className="text-purple" />,
      title: "Exclusive Workshops",
      description: "Participate in hands-on workshops led by industry experts and IEEE professionals."
    },
    {
      icon: <Target size={32} className="text-orange" />,
      title: "Career Opportunities",
      description: "Access exclusive job postings, internships, and networking opportunities with industry partners."
    }
  ];

  const testimonials = [
    {
      name: "Ahmed Hassan",
      role: "Computer Engineering Student",
      quote: "Joining IEEE SUTECH transformed my college experience. The workshops helped me land my dream internship!",
      points: "2,450 XP"
    },
    {
      name: "Sarah Mohamed",
      role: "Electrical Engineering Graduate",
      quote: "The certification programs gave me a competitive edge in my job applications. Highly recommended!",
      points: "3,120 XP"
    },
    {
      name: "Omar Ali",
      role: "Software Developer",
      quote: "The community connections I made here opened doors to amazing collaboration opportunities.",
      points: "1,875 XP"
    }
  ];

  return (
    <div className="position-relative overflow-hidden">
      {/* Hero Section */}
      <div className="bg-ieee-gradient text-white py-5">
        <div className="container py-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="row align-items-center"
          >
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold mb-4">
                Join IEEE SUTECH Student Branch
              </h1>
              <p className="lead mb-4">
                Become part of the world's largest technical professional organization dedicated to advancing technology for humanity.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <button 
                  className="btn btn-light btn-lg rounded-pill px-4 d-flex align-items-center"
                  onClick={() => navigate("/register")}
                >
                  Join Now <ArrowRight size={20} className="ms-2" />
                </button>
                <button 
                  className="btn btn-outline-light btn-lg rounded-pill px-4 d-flex align-items-center"
                  onClick={() => navigate("/about")}
                >
                  Learn More <ExternalLink size={20} className="ms-2" />
                </button>
              </div>
            </div>
            <div className="col-lg-6 mt-4 mt-lg-0">
              <div className="d-flex justify-content-center">
                <div className="position-relative">
                  <div className="bg-white bg-opacity-10 rounded-4 p-4 backdrop-blur-sm">
                    <div className="text-center">
                      <div className="d-flex justify-content-center mb-3">
                        <div className="bg-white bg-opacity-20 rounded-circle p-3">
                          <Heart size={48} className="text-white" />
                        </div>
                      </div>
                      <h3 className="text-white mb-2">1,200+ Members</h3>
                      <p className="text-white opacity-75 mb-0">Strong community growing every day</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Steps to Join */}
      <div className="py-5">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center mb-5"
          >
            <h2 className="display-6 fw-bold mb-3">How to Join IEEE SUTECH</h2>
            <p className="text-muted lead">Simple steps to become part of our technical community</p>
          </motion.div>

          <div className="row g-4">
            {joinSteps.map((step, index) => (
              <motion.div 
                key={index}
                className="col-md-6 col-lg-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div 
                  className={`ieee-card h-100 p-4 text-center ${
                    activeStep === index ? 'border-start border-4 border-primary' : ''
                  }`}
                  onMouseEnter={() => setActiveStep(index)}
                  onMouseLeave={() => setActiveStep(0)}
                >
                  <div className="d-flex justify-content-center mb-3">
                    <div className={`rounded-circle d-flex align-items-center justify-content-center ${
                      activeStep === index ? 'bg-primary' : 'bg-light'
                    }`} style={{ width: '60px', height: '60px' }}>
                      {step.icon}
                    </div>
                  </div>
                  <h4 className="mb-2">{step.title}</h4>
                  <p className="text-muted mb-3">{step.description}</p>
                  <div className={`small text-start p-3 rounded-3 ${
                    activeStep === index ? 'bg-light' : 'd-none'
                  }`}>
                    {step.details}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-5 bg-light">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-5"
          >
            <h2 className="display-6 fw-bold mb-3">Membership Benefits</h2>
            <p className="text-muted lead">What you get as an IEEE SUTECH member</p>
          </motion.div>

          <div className="row g-4">
            {benefits.map((benefit, index) => (
              <motion.div 
                key={index}
                className="col-md-6 col-lg-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="ieee-card h-100 p-4 text-center">
                  <div className="d-flex justify-content-center mb-3">
                    <div className="bg-ieee-gradient rounded-circle p-3">
                      {benefit.icon}
                    </div>
                  </div>
                  <h4 className="mb-3">{benefit.title}</h4>
                  <p className="text-muted">{benefit.description}</p>
                  <div className="d-flex justify-content-center">
                    <CheckCircle size={20} className="text-success" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-5">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-5"
          >
            <h2 className="display-6 fw-bold mb-3">Success Stories</h2>
            <p className="text-muted lead">What our members say about their experience</p>
          </motion.div>

          <div className="row g-4">
            {testimonials.map((testimonial, index) => (
              <motion.div 
                key={index}
                className="col-md-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="ieee-card h-100 p-4">
                  <div className="d-flex align-items-center mb-3">
                    <div className="me-3">
                      <div className="rounded-circle bg-ieee-gradient d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                        <span className="text-white fw-bold">{testimonial.name.charAt(0)}</span>
                      </div>
                    </div>
                    <div>
                      <h6 className="mb-0">{testimonial.name}</h6>
                      <small className="text-muted">{testimonial.role}</small>
                    </div>
                  </div>
                  <p className="text-muted fst-italic mb-3">"{testimonial.quote}"</p>
                  <div className="d-flex align-items-center">
                    <Star size={16} className="text-warning me-1" />
                    <span className="small text-muted">{testimonial.points}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-5 bg-ieee-gradient text-white">
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="display-5 fw-bold mb-3">Ready to Join Our Community?</h2>
            <p className="lead mb-4">Become part of the world's largest technical professional organization</p>
            <div className="d-flex justify-content-center gap-3 flex-wrap">
              <button 
                className="btn btn-light btn-lg rounded-pill px-5 d-flex align-items-center"
                onClick={() => navigate("/register")}
              >
                Join Now <ArrowRight size={20} className="ms-2" />
              </button>
              <button 
                className="btn btn-outline-light btn-lg rounded-pill px-5 d-flex align-items-center"
                onClick={() => navigate("/events")}
              >
                Explore Events <Calendar size={20} className="ms-2" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-5">
        <div className="container">
          <div className="row g-4 text-center">
            <motion.div 
              className="col-md-3 col-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="bg-ieee-gradient text-white rounded-4 p-4">
                <Users size={32} className="mx-auto mb-2" />
                <h3 className="display-6 mb-1">1,200+</h3>
                <p className="mb-0">Active Members</p>
              </div>
            </motion.div>
            <motion.div 
              className="col-md-3 col-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="bg-ieee-gradient text-white rounded-4 p-4">
                <Award size={32} className="mx-auto mb-2" />
                <h3 className="display-6 mb-1">500+</h3>
                <p className="mb-0">Certificates Issued</p>
              </div>
            </motion.div>
            <motion.div 
              className="col-md-3 col-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <div className="bg-ieee-gradient text-white rounded-4 p-4">
                <Calendar size={32} className="mx-auto mb-2" />
                <h3 className="display-6 mb-1">120+</h3>
                <p className="mb-0">Events Hosted</p>
              </div>
            </motion.div>
            <motion.div 
              className="col-md-3 col-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <div className="bg-ieee-gradient text-white rounded-4 p-4">
                <Star size={32} className="mx-auto mb-2" />
                <h3 className="display-6 mb-1">25K+</h3>
                <p className="mb-0">XP Points Earned</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Membership;