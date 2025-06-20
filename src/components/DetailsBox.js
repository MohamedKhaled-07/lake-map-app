import React from 'react';
import './DetailsBox.css';

const DetailsBox = ({ 
  showDetails, 
  toggleDetails, 
  selectedParameters, 
  selectedLake, 
  areaData, 
  currentIndex, 
  indexDescriptions 
}) => {
  const renderAreaData = (param) => {
    if (!param.year || !param.index || !selectedLake) return null;
    
    if (!areaData || !areaData[selectedLake] || !areaData[selectedLake][param.index] || !areaData[selectedLake][param.index][param.year]) {
      return null;
    }
    const data = areaData[selectedLake][param.index][param.year];
    
    if (param.index === 'NDTI') {
      return (
        <>
          <p>Clear Water: {data.clear} km²</p>
          <p>Turbid Water: {data.turbidity} km²</p>
        </>
      );
    }
    
    return <p>Area: {data} km²</p>;
  };

  return (
    <div className="details-container">
      <button 
        className={`details-toggle-button ${showDetails ? 'north' : 'south'}`}
        onClick={toggleDetails}
        title={showDetails ? "إخفاء التفاصيل" : "إظهار التفاصيل"}
      >
        {showDetails ? '▼' : '▲'}
      </button>
      <div className={`details-box ${showDetails ? 'visible' : ''}`}>
        <div className="details-content">
          {selectedParameters.map((param, index) => (
            <React.Fragment key={index}>
              <div className="parameter-details">
                <h3>{param.index || 'Not selected'} {param.year ? `(${param.year})` : ''}</h3>
                {param.year && param.index && selectedLake && (
                  <div className="area-data">
                    {renderAreaData(param)}
                  </div>
                )}
              </div>
              {index < selectedParameters.length - 1 && <div className="vertical-divider" />}
            </React.Fragment>
          ))}
        </div>
        <div className="horizontal-divider" />
        <div className="details-bottom-section">
          {currentIndex && (
            <div className="index-description">
              <h4>{currentIndex} Description</h4>
              <p>{indexDescriptions[currentIndex]?.description}</p>
              <p className="formula">
                <strong>Formula:</strong> {indexDescriptions[currentIndex]?.formula}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailsBox; 