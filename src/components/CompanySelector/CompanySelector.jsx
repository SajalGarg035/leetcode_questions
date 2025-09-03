import React from 'react';
import './CompanySelector.css';

const CompanySelector = ({ companies, selectedCompany, onCompanyChange }) => {
  return (
    <div className="company-selector">
      <label htmlFor="company-select" className="company-selector__label">
        Choose a company to practice:
      </label>
      <select 
        id="company-select"
        className="company-selector__select"
        value={selectedCompany} 
        onChange={(e) => onCompanyChange(e.target.value)}
      >
        <option value="">Select a company...</option>
        {companies.map((company) => (
          <option key={company} value={company}>
            {company}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CompanySelector;
