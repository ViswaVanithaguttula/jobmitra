import React from 'react';
import './SelectDropdown.css';

const SelectDropdown = ({ label, id, options = [], value, onChange, className = '', required = false, placeholder = 'Select an option', ...props }) => {
  return (
    <div className={`select-group ${className}`}>
      {label && <label htmlFor={id} className="select-label">{label}</label>}
      <select
        id={id}
        className="select-field"
        value={value}
        onChange={onChange}
        required={required}
        {...props}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((opt, index) => (
          <option key={index} value={opt.value || opt}>{opt.label || opt}</option>
        ))}
      </select>
    </div>
  );
};

export default SelectDropdown;
