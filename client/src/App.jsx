import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";
import Events from "./pages/Events";
import MyEvents from "./pages/MyEvents";
import AdminEvents from "./pages/AdminEvents";
import AddEvent from "./pages/AddEvent";
import EditEvent from "./pages/EditEvent";
import AdminMembers from "./pages/AdminMembers";
import AddMember from "./pages/AddMember";
import EditMember from "./pages/EditMember";
import Join from "./pages/Join";
import AdminJoins from "./pages/AdminJoins";
import AdminCertificates from "./pages/AdminCertificates";
import AddCertificate from "./pages/AddCertificate";
import ViewCertificate from "./pages/ViewCertificate";
import MemberProfile from "./pages/MemberProfile";
import MembersDirectory from "./pages/MembersDirectory";
import BatchCertificates from "./pages/BatchCertificates";
import VerifyCertificate from "./pages/VerifyCertificate";
import CertificateVerification from "./pages/CertificateVerification";
import Announcements from "./pages/Announcements";
import AnnouncementDetail from "./pages/AnnouncementDetail";
import AdminAnnouncements from "./pages/AdminAnnouncements";
import Resources from "./pages/Resources";
import AdminResources from "./pages/AdminResources";
import Membership from "./pages/Membership";
import Navbar from "./components/Navbar";
import MobileNav from "./components/MobileNav";

export default function App() {
  return (
    <BrowserRouter>
      <div className="pb-5 pb-md-0">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/membership" element={<Membership />} />
          <Route path="/events" element={<Events />} />
          <Route path="/join" element={<Join />} />
          <Route path="/members" element={<MembersDirectory />} />
          <Route path="/certificate/:id" element={<ViewCertificate />} />
          <Route path="/verify/:hash" element={<VerifyCertificate />} />
          <Route path="/certificate-verification" element={<CertificateVerification />} />
          <Route path="/member/:id" element={<MemberProfile />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/announcements/:id" element={<AnnouncementDetail />} />
          <Route path="/admin/events" element={<AdminEvents />} />
          <Route path="/admin/add-event" element={<AddEvent />} />
          <Route path="/admin/edit-event/:id" element={<EditEvent />} />
          <Route path="/admin/members" element={<AdminMembers />} />
          <Route path="/admin/add-member" element={<AddMember />} />
          <Route path="/admin/edit-member/:id" element={<EditMember />} />
          <Route path="/admin/joins" element={<AdminJoins />} />
          <Route path="/admin/certificates" element={<AdminCertificates />} />
          <Route path="/admin/add-certificate" element={<AddCertificate />} />
          <Route path="/admin/batch-certificates" element={<BatchCertificates />} />
          <Route path="/admin/announcements" element={<AdminAnnouncements />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/admin/resources" element={<AdminResources />} />
          <Route path="/my-events" element={<MyEvents />} />
        </Routes>
        <MobileNav />
      </div>
    </BrowserRouter>
  );
}
