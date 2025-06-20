import React from 'react';
import './MapControls.css';

const MapControls = ({ selectedParameters, onParameterChange, handleRemoveParameter }) => {
  if (!selectedParameters || selectedParameters.length === 0) {
    return null;
  }

  return (
    <div className="map-controls">
      <div className="parameter-selection">
        {selectedParameters.map((param, index) => (
          <div key={index} className="parameter-box">
            <select
              value={param.year}
              onChange={(e) => onParameterChange(index, 'year', e.target.value)}
            >
              <option value="">Select Year</option>
              <option value="1995">1995</option>
              <option value="2005">2005</option>
              <option value="2015">2015</option>
              <option value="2025">2025</option>
            </select>
            <select
              value={param.index}
              onChange={(e) => onParameterChange(index, 'index', e.target.value)}
            >
              <option value="">Select Index</option>
              <option value="NDVI">NDVI</option>
              <option value="NDWI">NDWI</option>
              <option value="NDBI">NDBI</option>
              <option value="NDTI">NDTI</option>
            </select>
            <button onClick={() => handleRemoveParameter(index)}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MapControls; 