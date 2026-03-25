import React from 'react';
import './InputField.css';

const InputField = ({ label, type = 'text', id, placeholder, value, onChange, className = '', required = false, ...props }) => {
  return (
    <div className={`input-group ${className}`}>
      {label && <label htmlFor={id} className="input-label">{label}</label>}
      <input
        type={type}
        id={id}
        className="input-field"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        {...props}
      />
    </div>
  );
};

export default InputField;
