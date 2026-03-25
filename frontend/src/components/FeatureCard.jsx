import React from 'react';
import './FeatureCard.css';

const FeatureCard = ({ icon, title, description }) => {
  const IconComponent = icon;
  return (
    <div className="feature-card card flex-center flex-column text-center">
      <div className="feature-icon-wrapper">
        <IconComponent className="feature-icon" size={32} />
      </div>
      <h3 className="feature-title">{title}</h3>
      <p className="feature-desc">{description}</p>
    </div>
  );
};

export default FeatureCard;
