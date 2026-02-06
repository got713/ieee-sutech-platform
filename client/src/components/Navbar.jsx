import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Home, Calendar, Users, Shield, User, Bell, BookOpen, 
  Menu, X, LogOut, Settings, Award, Info, Mail
} from "lucide-react";
import axios from "axios";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUserData = async () => {
      if (token) {
        try {
          const res = await axios.get("http://localhost:5000/api/auth/me", {
            headers: { Authorization: `Bearer ${token}` }
          });
          setCurrentUser(res.data);
          setIsAdmin(res.data.role === "admin");
        } catch (error) {
          console.error("Error fetching user data:", error);
          localStorage.removeItem("token");
          setCurrentUser(null);
          setIsAdmin(false);
        }
      } else {
        setCurrentUser(null);
        setIsAdmin(false);
      }
    };

    fetchUserData();
  }, [token]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setCurrentUser(null);
    setIsAdmin(false);
    setShowProfileDropdown(false);
    navigate("/login");
  };

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Calendar, label: "Events", path: "/events" },
    { icon: Users, label: "Members", path: "/members" },
    { icon: Award, label: "Certificates", path: "/certificate-verification" },
    { icon: Info, label: "About", path: "/membership" },
  ];

  if (isAdmin) {
    navItems.push({ icon: Shield, label: "Admin", path: "/admin" });
  }

  const isActive = (path) => location.pathname === path;

  return (
    <motion.nav 
      className="navbar navbar-expand-lg navbar-dark bg-ieee-gradient shadow-sm"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="container-fluid">
        {/* Logo */}
        <motion.a 
          className="navbar-brand d-flex align-items-center"
          href="/"
          whileHover={{ scale: 1.05 }}
          onClick={(e) => {
            e.preventDefault();
            navigate("/");
          }}
        >
          <div className="d-flex align-items-center">
            <div className="bg-white text-ieee-navy rounded-circle p-2 me-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
              </svg>
            </div>
            <span className="fw-bold fs-4">IEEE SUTECH</span>
          </div>
        </motion.a>

        {/* Mobile menu button */}
        <button
          className="navbar-toggler border-0"
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Navigation links */}
        <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`}>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {navItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <motion.li 
                  key={index} 
                  className="nav-item mx-1"
                  whileHover={{ y: -2 }}
                >
                  <button
                    className={`nav-link d-flex align-items-center gap-2 ${
                      isActive(item.path) ? 'text-ieee-orange active' : 'text-white'
                    }`}
                    onClick={() => {
                      navigate(item.path);
                      setIsMenuOpen(false);
                    }}
                  >
                    <IconComponent size={18} />
                    <span>{item.label}</span>
                  </button>
                </motion.li>
              );
            })}
          </ul>

          {/* Profile dropdown or login button */}
          <div className="d-flex align-items-center">
            {currentUser ? (
              <div className="dropdown" ref={dropdownRef}>
                <motion.button
                  className="btn btn-outline-light dropdown-toggle d-flex align-items-center gap-2"
                  type="button"
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  whileHover={{ scale: 1.02 }}
                >
                  <User size={18} />
                  <span>{currentUser.name.split(' ')[0]}</span>
                </motion.button>
                
                {showProfileDropdown && (
                  <motion.ul
                    className="dropdown-menu dropdown-menu-end"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <li>
                      <button 
                        className="dropdown-item d-flex align-items-center gap-2"
                        onClick={() => {
                          navigate("/dashboard");
                          setShowProfileDropdown(false);
                        }}
                      >
                        <User size={16} />
                        Profile
                      </button>
                    </li>
                    <li>
                      <button 
                        className="dropdown-item d-flex align-items-center gap-2"
                        onClick={() => {
                          navigate("/my-events");
                          setShowProfileDropdown(false);
                        }}
                      >
                        <Calendar size={16} />
                        My Events
                      </button>
                    </li>
                    <li>
                      <button 
                        className="dropdown-item d-flex align-items-center gap-2"
                        onClick={() => {
                          navigate("/resources");
                          setShowProfileDropdown(false);
                        }}
                      >
                        <BookOpen size={16} />
                        Resources
                      </button>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button 
                        className="dropdown-item d-flex align-items-center gap-2 text-danger"
                        onClick={handleLogout}
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </li>
                  </motion.ul>
                )}
              </div>
            ) : (
              <motion.button
                className="btn btn-outline-light"
                onClick={() => navigate("/login")}
                whileHover={{ scale: 1.05 }}
              >
                Login
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;