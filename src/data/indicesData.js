export const years = [1995, 2005, 2015, 2025];

export const indices = ['NDVI', 'NDBI', 'NDWI', 'NDTI'];

export const indexDescriptions = {
  NDVI: {
    name: 'Normalized Difference Vegetation Index',
    description: 'Measures vegetation health and density. Higher values indicate healthier vegetation.',
    coverage: '75%'
  },
  NDBI: {
    name: 'Normalized Difference Built-up Index',
    description: 'Identifies built-up areas and urban development. Higher values indicate more urbanized areas.',
    coverage: '65%'
  },
  NDWI: {
    name: 'Normalized Difference Water Index',
    description: 'Detects water bodies and moisture content. Higher values indicate presence of water.',
    coverage: '80%'
  },
  NDTI: {
    name: 'Normalized Difference Turbidity Index',
    description: 'Measures water turbidity and clarity. Higher values indicate more turbid water.',
    coverage: '70%'
  }
}; 