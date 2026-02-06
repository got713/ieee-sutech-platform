import { useNavigate, useLocation } from "react-router-dom";
import { Home, Calendar, Users, Shield, User, Bell, BookOpen } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";

const MobileNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      axios.get("http://localhost:5000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        setIsAdmin(res.data.role === "admin");
      })
      .catch(() => setIsAdmin(false));
    }
  }, [token]);

  if (!token) return null;

  const navItems = [
    { icon: Home, label: "Home", path: "/dashboard" },
    { icon: BookOpen, label: "Resources", path: "/resources" },
    { icon: Calendar, label: "My Events", path: "/my-events" },
    { icon: Bell, label: "News", path: "/announcements" },
    { icon: Calendar, label: "Events", path: "/events" },
    { icon: Users, label: "Members", path: "/members" },
  ];

  if (isAdmin) {
    navItems.push({ icon: Shield, label: "Admin", path: "/admin" });
  }

  return (
    <div className="d-md-none position-fixed bottom-0 start-0 end-0 bg-white border-top shadow-lg z-3">
      <div className="d-flex justify-content-around align-items-center py-2">
        {navItems.map((item, index) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <button
              key={index}
              className={`btn btn-link text-decoration-none d-flex flex-column align-items-center gap-1 ${isActive ? 'text-primary' : 'text-muted'}`}
              onClick={() => navigate(item.path)}
              style={{ border: 'none', background: 'none' }}
            >
              <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span style={{ fontSize: '10px', fontWeight: isActive ? '700' : '400' }}>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MobileNav;
