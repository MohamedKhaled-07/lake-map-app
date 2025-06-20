import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './Map.css';
import MapControls from './MapControls';
import DetailsBox from './DetailsBox';
import LegendToggleArrow from './LegendToggleArrow';

const Map = ({ selectedParameters, onParameterChange, showResults, selectedLake }) => {
  // eslint-disable-next-line no-unused-vars
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const overlayRef = useRef(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showLegend, setShowLegend] = useState(false);
  const [isFirstParameter, setIsFirstParameter] = useState(false);
  const [hasShownWelcome, setHasShownWelcome] = useState(false);
  const [showValidResults, setShowValidResults] = useState(false);
  const [hasShownResults, setHasShownResults] = useState(false);

  // Default bounds for both lakes
  const lakeBounds = {
    // Burullus Lake bounds
    Burullus: [
      [31.15, 30.30],  // Southwest corner (bottom-left)
      [31.65, 31.35]   // Northeast corner (top-right)
    ],
    
    // Edku Lake bounds
    Edku: [
      [30.90, 29.85],  // Southwest corner (bottom-left)
      [31.42, 30.55]   // Northeast corner (top-right)
    ]
  };

  // Special bounds for NDTI index in Burullus region
  const ndtiBurullusBounds = [
    [31.170, 30.22], // south, west
    [31.600, 31.13]  // north, east
  ];

  // Special bounds for NDTI index in Edku region
  const ndtiEdkuBounds = [
    [31.22804, 30.16827],  // Southwest corner (bottom-left)
    [31.27157, 30.26174]   // Northeast corner (top-right)
  ];

  const indexDescriptions = {
    NDVI: {
      description: "Measures vegetation density and health by comparing near-infrared and red light. Higher values indicate healthier vegetation.",
      formula: "(NIR - Red) / (NIR + Red)"
    },
    NDWI: {
      description: "Detects surface water bodies by analyzing the difference between green and near-infrared light.",
      formula: "(Green - NIR) / (Green + NIR)"
    },
    NDBI: {
      description: "Identifies built-up urban areas by contrasting short-wave infrared with near-infrared reflectance.",
      formula: "(SWIR - NIR) / (SWIR + NIR)"
    },
    NDTI: {
      description: "Estimates water turbidity levels, with higher values indicating more turbid or polluted water.",
      formula: "(Red - Green) / (Red + Green)"
    }
  };

  const areaData = {
    Burullus: {
      NDVI: {
        1995: 1083.053,
        2005: 1210.366,
        2015: 1227.323,
        2025: 1303.315
      },
      NDWI: {
        1995: 283.826,
        2005: 228.647,
        2015: 219.994,
        2025: 232.203
      },
      NDBI: {
        1995: 402.499,
        2005: 313.534,
        2015: 326.832,
        2025: 275.996
      },
      NDTI: {
        1995: { clear: 102.461, turbidity: 181.555 },
        2005: { clear: 102.132, turbidity: 126.692 },
        2015: { clear: 73.513, turbidity: 146.449 },
        2025: { clear: 69.327, turbidity: 163.139 }
      }
    },
    Edku: {
      NDVI: {
        1995: 846.197,
        2005: 847.122,
        2015: 976.915,
        2025: 920.802
      },
      NDWI: {
        1995: 19.378,
        2005: 16.522,
        2015: 10.68,
        2025: 36.510
      },
      NDBI: {
        1995: 128.426,
        2005: 75.524,
        2015: 101.628,
        2025: 135.295
      },
      NDTI: {
        1995: { clear: 9.997, turbidity: 9.333 },
        2005: { clear: 8.545, turbidity: 7.996 },
        2015: { clear: 3.210, turbidity: 7.416 },
        2025: { clear: 22.900, turbidity: 15.334 }
      }
    }
  };

  // Initialize map and set up base layer
  useEffect(() => {
    if (!mapRef.current) return;

    if (!mapInstance.current) {
      mapInstance.current = L.map(mapRef.current, {
        center: [31.2, 30.2], // Center point between both lakes
        zoom: 10,
        minZoom: 4,
        maxZoom: 18,
        zoomControl: true,
        attributionControl: true,
      });

      // Add base map layer with blur effect
      const baseLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
        maxZoom: 18,
        minZoom: 4,
        opacity: 1,
      }).addTo(mapInstance.current);

      // Apply blur effect to base layer only
      const baseLayerElement = baseLayer.getContainer();
      if (baseLayerElement) {
        baseLayerElement.style.filter = 'blur(12%)';
      }

      mapInstance.current.invalidateSize();
    }

    // Fit bounds to selected lake using updated coordinates
    if (mapInstance.current && (selectedLake === 'Burullus' || selectedLake === 'Edku')) {
      mapInstance.current.fitBounds(lakeBounds[selectedLake]);
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [selectedLake]);

  // Clear overlays if any select is set to default
  useEffect(() => {
    if (!mapInstance.current) return;
    const anyDefault =
      !selectedLake || selectedLake === "" || selectedLake === "Select The Lake" ||
      selectedParameters.some(
        param =>
          !param.year || param.year === "" || param.year === "Select Year" ||
          !param.index || param.index === "" || param.index === "Select Index"
      );
    if (anyDefault) {
      mapInstance.current.eachLayer((layer) => {
        if (layer instanceof L.ImageOverlay) {
          mapInstance.current.removeLayer(layer);
        }
      });
    }
  }, [selectedLake, selectedParameters]);

  // Handle image overlays and parameter updates
  useEffect(() => {
    if (!mapInstance.current) return;

    // Remove previous overlay if exists
    if (overlayRef.current) {
      mapInstance.current.removeLayer(overlayRef.current);
      overlayRef.current = null;
    }

    // Only add overlays if Show Results is pressed with valid selections
    if (showResults && allSelectionsValid) {
      selectedParameters.forEach((param) => {
        if (param.year && param.index) {
          const imageUrl = `/maps/${selectedLake}_${param.year}_${param.index}.png`;
          // Use specific bounds for NDTI index based on selected lake
          let bounds;
          if (param.index === 'NDTI') {
            bounds = selectedLake === 'Burullus' ? ndtiBurullusBounds : (selectedLake === 'Edku' ? ndtiEdkuBounds : null);
          } else {
            bounds = lakeBounds[selectedLake];
          }
          if (bounds) {
            // Add image overlay without blur effect
            const overlay = L.imageOverlay(imageUrl, bounds, {
              opacity: 1.0,
            }).addTo(mapInstance.current);
            overlay.getElement().onerror = () => {
              console.error('Failed to load image:', imageUrl);
              overlay.setUrl('https://via.placeholder.com/500x500.jpg');
            };
            overlayRef.current = overlay;
          }
        }
      });
      if (selectedLake === 'Burullus' || selectedLake === 'Edku') {
        mapInstance.current.fitBounds(lakeBounds[selectedLake]);
      }
    }
    // إذا لم يكن هناك اختيارات صالحة، لا تضف أي طبقة جديدة
    mapInstance.current.invalidateSize();
  }, [selectedParameters, showResults, selectedLake]);

  // Update isFirstParameter when selectedParameters changes
  useEffect(() => {
    if (selectedParameters.length === 1 && !hasShownWelcome) {
      setIsFirstParameter(true);
      setHasShownWelcome(true);
    } else {
      setIsFirstParameter(false);
    }
  }, [selectedParameters, hasShownWelcome]);

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  // Helper to check if ALL selections are default
  const allSelectionsDefault =
    selectedLake === 'Select The Lake' &&
    selectedParameters.length > 0 &&
    selectedParameters.every(
      param =>
        (!param.year || param.year === 'Select Year') &&
        (!param.index || param.index === 'Select Index')
    );

  // Helper to check if all selections are valid (none are default)
  const allSelectionsValid =
    selectedLake !== 'Select The Lake' &&
    selectedParameters.length > 0 &&
    selectedParameters.every(
      param => param.year && param.index && param.year !== 'Select Year' && param.index !== 'Select Index'
    );

  // Show details box only when user clicks the toggle button after Show Results
  useEffect(() => {
    if (showResults && allSelectionsValid) {
      setShowValidResults(true);
      setHasShownResults(true);
      setShowDetails(false); // Keep details box hidden initially
    } else {
      setShowValidResults(false);
      setHasShownResults(false);
      setShowDetails(false);
    }
  }, [showResults, allSelectionsValid]);

  const legendData = {
    NDVI: [
      { color: '#FF0000', label: 'مسطحات مائية' },      // red
      { color: '#FFD700', label: 'أراضٍ/مناطق سكنية' }, // yellow
      { color: '#8DB600', label: 'غطاء نباتي ضعيف' },   // light apple
      { color: '#4B8B3B', label: 'غطاء نباتي كثيف' }    // leaf green
    ],
    NDWI: [
      { color: '#E27B58', label: 'أراضٍ زراعية' },      // mars red
      { color: '#F7B538', label: 'نباتات رطبة' },       // mang
      { color: '#CCCCCC', label: 'أراضٍ حضرية' },       // gray 20%
      { color: '#1F4B99', label: 'مسطحات مائية' }       // Cretan blue
    ],
    NDTI: [
      { color: '#1F4B99', label: 'مياه صافية' },        // Cretan blue
      { color: '#FFD700', label: 'مياه متوسطة العكارة' }, // Solar yellow
      { color: '#8B4513', label: 'مياه عكرة' }          // cherry wood brown
    ],
    NDBI: [
      { color: '#8B4513', label: 'أراضٍ عمرانية' },     // cherry wood brown
      { color: '#1F4B99', label: 'مسطحات مائية' },      // Cretan blue
      { color: '#FFD700', label: 'أراضٍ فارغة' },       // solar yellow
      { color: '#4B8B3B', label: 'أراضٍ زراعية' }       // leaf green
    ]
  };

  // Get the first selected parameter's index for the legend
  const currentIndex = selectedParameters && selectedParameters.length > 0 ? selectedParameters[0].index : null;

  const handleRemoveParameter = (index) => {
    onParameterChange(index, 'year', '');
    onParameterChange(index, 'index', '');
  };

  const toggleLegend = () => {
    setShowLegend(!showLegend);
  };

  return (
    <div className="map-wrapper">
      <div ref={mapRef} className="map-container" />

      <MapControls 
        selectedParameters={selectedParameters}
        onParameterChange={onParameterChange}
        handleRemoveParameter={handleRemoveParameter}
      />

      {showValidResults && (
        <DetailsBox 
          showDetails={showDetails}
          toggleDetails={toggleDetails}
          selectedParameters={selectedParameters}
          selectedLake={selectedLake}
          areaData={areaData}
          currentIndex={currentIndex}
          indexDescriptions={indexDescriptions}
        />
      )}

      <div className={`legend-container ${!showLegend ? 'hidden' : ''}`}>
        <LegendToggleArrow 
          showLegend={showLegend} 
          toggleLegend={toggleLegend} 
        />

        {showValidResults && currentIndex && (
        <div className="legend">
          <h3>{currentIndex}</h3>
          {legendData[currentIndex]?.map((item, idx) => (
            <div key={idx} className="legend-item">
              <div className="color-box" style={{ backgroundColor: item.color }}></div>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  );
};

export default Map;