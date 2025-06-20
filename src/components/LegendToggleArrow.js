import React from 'react';
import './LegendToggleArrow.css';

const LegendToggleArrow = ({ showLegend, toggleLegend }) => {
  return (
    <button 
      className="legend-toggle-button"
      onClick={toggleLegend}
      title={showLegend ? "إخفاء المفتاح" : "إظهار المفتاح"}
    >
      {showLegend ? '▶' : '◀'}
    </button>
  );
};

export default LegendToggleArrow; 