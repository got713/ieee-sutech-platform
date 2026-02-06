import { motion } from "framer-motion";
import { Award, Star, Medal, Trophy } from "lucide-react";

const MemberSpotlight = ({ members = [], title = "Member Spotlight", subtitle = "Our top contributors and community leaders" }) => {
  // Get top contributors (members with 50+ points)
  const topMembers = members
    .filter(member => (member.points || 0) >= 50)
    .sort((a, b) => (b.points || 0) - (a.points || 0))
    .slice(0, 4);

  if (topMembers.length === 0) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="row mb-5"
    >
      <div className="col-12">
        <div className="text-center mb-4">
          <h3 className="display-6 mb-3">
            <Trophy className="me-2 text-warning" size={32} />
            {title}
          </h3>
          <p className="text-muted">{subtitle}</p>
        </div>
        
        <div className="row g-4">
          {topMembers.map((member, index) => (
            <motion.div 
              key={member._id} 
              className="col-lg-3 col-md-6"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="ieee-card h-100 text-center p-4 border-top border-4 border-warning">
                <div className="position-absolute top-0 start-50 translate-middle bg-warning rounded-circle p-2 shadow">
                  <Award size={20} className="text-white" />
                </div>
                
                <div className="mb-3 position-relative d-inline-block">
                  {member.avatar ? (
                    <img 
                      src={member.avatar} 
                      className="rounded-circle border border-3 border-warning shadow-sm" 
                      alt={member.name}
                      style={{ width: "80px", height: "80px", objectFit: "cover" }}
                    />
                  ) : (
                    <div 
                      className="rounded-circle bg-gradient-to-br from-warning to-orange d-flex align-items-center justify-content-center mx-auto shadow-sm"
                      style={{ width: "80px", height: "80px" }}
                    >
                      <h3 className="text-white mb-0">{member.name.charAt(0).toUpperCase()}</h3>
                    </div>
                  )}
                </div>
                
                <h5 className="mb-1">{member.name}</h5>
                <p className="text-muted small mb-2">{member.email}</p>
                
                <div className="d-flex justify-content-center gap-2 mb-3">
                  <span className="badge bg-warning text-dark px-3 py-2">
                    <Star size={12} className="me-1" /> {(member.points || 0)} pts
                  </span>
                  <span className={`badge ${member.role === 'admin' ? 'bg-danger' : 'bg-primary'} px-3`}>
                    {member.role === 'admin' ? '👑 Admin' : 'Member'}
                  </span>
                </div>
                
                <div className="small text-muted">
                  <Medal size={14} className="me-1 text-warning" />
                  Top Contributor
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default MemberSpotlight;