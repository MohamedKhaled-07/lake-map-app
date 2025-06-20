import React, { useState } from 'react';
import Map from './components/Map';
import SearchPanel from './components/SearchPanel';
import './App.css';

function App() {
  const [selectedParameters, setSelectedParameters] = useState([{ year: '', index: '' }]);
  const [showResults, setShowResults] = useState(false);
  const [displayedParameters, setDisplayedParameters] = useState([]);
  const [selectedLake, setSelectedLakeState] = useState('Select The Lake');

  const handleParameterChange = (index, type, value) => {
    setSelectedParameters(prev => {
      const newParams = [...prev];
      if (!newParams[index]) {
        newParams[index] = { year: '', index: '' };
      }
      newParams[index] = { ...newParams[index], [type]: value };
      return newParams;
    });
  };

  const handleShowResults = () => {
    const validParams = selectedParameters.filter(param => param.year && param.index);
    if (validParams.length > 0) {
      setDisplayedParameters(validParams);
      setShowResults(true);
    }
  };

  const handleRemoveComparison = (index) => {
    setSelectedParameters(prev => {
      const newParams = [...prev];
      newParams.splice(index, 1);
      return newParams;
    });
    setDisplayedParameters(prev => {
      const newParams = [...prev];
      newParams.splice(index, 1);
      return newParams;
    });
  };

  const handleSetSelectedLake = (lake) => {
    setSelectedLakeState(lake);
    setSelectedParameters([{ year: '', index: '' }]);
    setShowResults(false);
    setDisplayedParameters([]);
  };

  return (
    <div className="app-container">
      <div className="controls-container">
        <h2 style={{ margin: '0 0 20px 0', fontSize: '1.4rem' }}>Map Controls</h2>
        <SearchPanel
          selectedParameters={selectedParameters}
          onParameterChange={handleParameterChange}
          onShowResults={handleShowResults}
          onRemoveComparison={handleRemoveComparison}
          selectedLake={selectedLake}
          setSelectedLake={handleSetSelectedLake}
        />
      </div>

      <Map
        selectedParameters={displayedParameters}
        onParameterChange={handleParameterChange}
        showResults={showResults}
        selectedLake={selectedLake}
      />
    </div>
  );
}

export default App;
