import React from 'react';
import './ServiceCard.css'; // Вынесем стили отдельно

const ServiceCard = ({ title, description, backgroundImage }) => {
  return (
    <div 
      className="service-card" 
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
};

export default ServiceCard;
