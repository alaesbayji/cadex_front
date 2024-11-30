// PlanTypeSelection.js
import React from 'react';
import './plantypeselection.scss'
const PlanTypeSelection = ({ planType, onPlanTypeChange }) => {
  return (
    <div className="plan-type-selection-container">
      <h3>Select the type of plan</h3>
      <select
        value={planType}
        onChange={(e) => onPlanTypeChange(e.target.value)}
      >
        <option value="">Select plan type</option>
        <option value="CIC">Plan CIC</option>
        <option value="MT">Amorcellement</option>
        <option value="PAC">Délimitation</option>
      </select>
    </div>
  );
};

export default PlanTypeSelection;
