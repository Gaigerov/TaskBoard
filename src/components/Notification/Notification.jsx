import React, { useEffect, useState } from 'react';
import './Notification.css'; 

export const Notification = ({ message, type, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const handleClick = () => {
    setIsVisible(false);
    onClose();
  };

  if (!isVisible) return null;

  const backgroundColor = 
  type === 'error' ? 'rgb(255, 150, 160)' : 
  type === 'warning' ? 'rgb(255, 227, 142)' : 
  type === 'success' ? 'rgb(51, 228, 146)' :
  type === 'info' ? 'rgb(171, 241, 255)' :
  'rgb(179, 189, 199)'
  ;

  return (
    <div 
      className="notificationContainer" 
      style={{backgroundColor}} 
      onClick={handleClick}
    >
      {message}
    </div>
  );
};
