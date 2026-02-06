import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  ChevronLeft, ChevronRight, Calendar as CalendarIcon, 
  MapPin, Clock, Users, ExternalLink
} from "lucide-react";

const EventCalendar = ({ events = [], onEventSelect, selectedDate }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("month"); // month, week, day

  // Get days in month
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get first day of month
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  // Format date
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Get events for specific date
  const getEventsForDate = (date) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    
    const days = [];
    
    // Add empty cells for days before first day of month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      days.push(date);
    }
    
    return days;
  };

  // Navigate months
  const goToPreviousMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const calendarDays = generateCalendarDays();

  return (
    <div className="ieee-card p-4">
      {/* Calendar Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center gap-2">
          <button 
            className="btn btn-outline-secondary btn-sm"
            onClick={goToPreviousMonth}
          >
            <ChevronLeft size={16} />
          </button>
          <h5 className="mb-0 fw-bold">{formatDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1))}</h5>
          <button 
            className="btn btn-outline-secondary btn-sm"
            onClick={goToNextMonth}
          >
            <ChevronRight size={16} />
          </button>
          <button 
            className="btn btn-outline-primary btn-sm ms-2"
            onClick={goToToday}
          >
            Today
          </button>
        </div>
        
        <div className="d-flex gap-2">
          <button 
            className={`btn btn-sm ${view === 'month' ? 'btn-ieee' : 'btn-outline-secondary'}`}
            onClick={() => setView('month')}
          >
            Month
          </button>
          <button 
            className={`btn btn-sm ${view === 'week' ? 'btn-ieee' : 'btn-outline-secondary'}`}
            onClick={() => setView('week')}
          >
            Week
          </button>
          <button 
            className={`btn btn-sm ${view === 'day' ? 'btn-ieee' : 'btn-outline-secondary'}`}
            onClick={() => setView('day')}
          >
            Day
          </button>
        </div>
      </div>

      {/* Days of Week Header */}
      <div className="row g-0 mb-2">
        {daysOfWeek.map(day => (
          <div key={day} className="col text-center">
            <small className="text-muted fw-bold">{day}</small>
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="row g-1">
        {calendarDays.map((day, index) => (
          <div key={index} className="col">
            {day ? (
              <motion.div
                whileHover={{ scale: 1.02 }}
                className={`p-2 border rounded text-center cursor-pointer ${
                  day.toDateString() === new Date().toDateString() 
                    ? 'bg-ieee-gradient text-white' 
                    : day.toDateString() === selectedDate?.toDateString()
                    ? 'bg-primary text-white'
                    : 'bg-light'
                }`}
                onClick={() => onEventSelect && onEventSelect(getEventsForDate(day))}
              >
                <div className="fw-bold">{day.getDate()}</div>
                <div className="small">
                  {getEventsForDate(day).length > 0 && (
                    <div className="d-flex flex-wrap gap-1 mt-1">
                      {getEventsForDate(day).slice(0, 2).map((event, idx) => (
                        <div 
                          key={idx} 
                          className="rounded-circle bg-warning" 
                          style={{ width: '6px', height: '6px' }}
                          title={event.title}
                        />
                      ))}
                      {getEventsForDate(day).length > 2 && (
                        <small className="text-muted">+{getEventsForDate(day).length - 2}</small>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <div className="p-2"></div>
            )}
          </div>
        ))}
      </div>

      {/* Upcoming Events Preview */}
      {events.length > 0 && (
        <div className="mt-4">
          <h6 className="fw-bold mb-3">Upcoming Events</h6>
          <div className="d-flex flex-wrap gap-2">
            {events.slice(0, 5).map((event, index) => (
              <motion.div
                key={event._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card border rounded-3"
                style={{ width: '200px' }}
              >
                <div className="card-body p-3">
                  <h6 className="card-title mb-1">{event.title}</h6>
                  <p className="card-text small text-muted mb-2">
                    <Clock size={12} className="me-1" />
                    {new Date(event.date).toLocaleString()}
                  </p>
                  <p className="card-text small text-muted mb-0">
                    <MapPin size={12} className="me-1" />
                    {event.location}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EventCalendar;
