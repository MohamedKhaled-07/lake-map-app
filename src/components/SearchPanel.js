import React, { useState } from 'react';
import { years, indices } from '../data/indicesData';

const SearchPanel = ({
  selectedParameters,
  onParameterChange,
  onShowResults,
  onRemoveComparison,
  selectedLake,
  setSelectedLake
}) => {
  const [comparisonCount, setComparisonCount] = useState(1);

  const addComparison = () => {
    if (comparisonCount < 4) {
      setComparisonCount(prev => prev + 1);
    }
  };

  const removeComparison = () => {
    if (comparisonCount > 1) {
      const lastIndex = comparisonCount - 1;
      onRemoveComparison(lastIndex);
      setComparisonCount(prev => prev - 1);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {Array.from({ length: comparisonCount }).map((_, index) => (
        <div key={index} style={{ 
          padding: '15px', 
          backgroundColor: 'rgba(255, 255, 255, 0.9)', 
          borderRadius: '8px',
          border: '1px solid rgba(0, 0, 0, 0.1)'
        }}>
          {index === 0 && (
          <h3 style={{ 
            margin: '0 0 15px 0', 
            fontSize: '1.2rem', 
            color: '#333',
            textAlign: 'center'
          }}>
            Welcome, Choose the Lake, year and the index you need!
          </h3>
          )}
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '1.1rem', color: '#333' }}>
                Select Lake:
              </label>
              <select
                value={selectedLake}
                onChange={(e) => setSelectedLake(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '8px', 
                  borderRadius: '4px', 
                  border: '1px solid #ddd',
                  backgroundColor: '#fff',
                  color: '#333'
                }}
              >
                <option value="Select The Lake">Select your lake</option>
                <option value="Burullus">Burullus</option>
                <option value="Edku">Edku</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '1.1rem', color: '#333' }}>
                Year:
              </label>
              <select
                value={selectedParameters[index]?.year || ''}
                onChange={(e) => onParameterChange(index, 'year', e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '8px', 
                  borderRadius: '4px', 
                  border: '1px solid #ddd',
                  backgroundColor: '#fff',
                  color: '#333'
                }}
              >
                <option value="">Select The Year</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '1.1rem', color: '#333' }}>
                Index:
              </label>
              <select
                value={selectedParameters[index]?.index || ''}
                onChange={(e) => onParameterChange(index, 'index', e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '8px', 
                  borderRadius: '4px', 
                  border: '1px solid #ddd',
                  backgroundColor: '#fff',
                  color: '#333'
                }}
              >
                <option value="">Select The Index</option>
                {indices.map(index => (
                  <option key={index} value={index}>{index}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      ))}

      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <button
          onClick={addComparison}
          disabled={comparisonCount >= 4}
          style={{
            padding: '8px 15px',
            backgroundColor: comparisonCount >= 4 ? '#ccc' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: comparisonCount >= 4 ? 'not-allowed' : 'pointer',
            fontSize: '1rem'
          }}
        >
          Add Comparison
        </button>
        
        <button
          onClick={removeComparison}
          disabled={comparisonCount <= 1}
          style={{
            padding: '8px 15px',
            backgroundColor: comparisonCount <= 1 ? '#ccc' : '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: comparisonCount <= 1 ? 'not-allowed' : 'pointer',
            fontSize: '1rem'
          }}
        >
          Remove Comparison
        </button>
      </div>

      <button
        onClick={onShowResults}
        style={{
          marginTop: '20px',
          padding: '12px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '1.1rem',
          fontWeight: '500',
          transition: 'background-color 0.2s'
        }}
      >
        Show Results
      </button>
    </div>
  );
};

export default SearchPanel;
