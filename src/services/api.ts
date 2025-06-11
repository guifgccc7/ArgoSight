
// Mock API service for demonstration
export interface VesselData {
  id: string;
  name: string;
  type: string;
  position: [number, number];
  speed: number;
  heading: number;
  status: string;
}

export interface SatelliteImage {
  id: string;
  timestamp: string;
  location: string;
  resolution: string;
  cloudCover: number;
  url: string;
}

export interface IntelligenceReport {
  id: string;
  title: string;
  summary: string;
  classification: string;
  timestamp: string;
  source: string;
}

// Mock data generators
export const generateMockVessels = (): VesselData[] => {
  return Array.from({ length: 50 }, (_, i) => ({
    id: `VESSEL_${i.toString().padStart(3, '0')}`,
    name: `Vessel ${i + 1}`,
    type: ['Cargo', 'Tanker', 'Container', 'Fishing'][Math.floor(Math.random() * 4)],
    position: [Math.random() * 360 - 180, Math.random() * 180 - 90],
    speed: Math.random() * 25,
    heading: Math.random() * 360,
    status: ['Active', 'Anchored', 'Unknown'][Math.floor(Math.random() * 3)]
  }));
};

export const generateMockSatelliteImages = (): SatelliteImage[] => {
  return Array.from({ length: 20 }, (_, i) => ({
    id: `SAT_IMG_${i.toString().padStart(3, '0')}`,
    timestamp: new Date(Date.now() - i * 3600000).toISOString(),
    location: `Location ${i + 1}`,
    resolution: ['0.3m', '1m', '10m'][Math.floor(Math.random() * 3)],
    cloudCover: Math.random() * 30,
    url: `https://example.com/satellite/${i}.jpg`
  }));
};

export const generateMockIntelligence = (): IntelligenceReport[] => {
  return Array.from({ length: 15 }, (_, i) => ({
    id: `INTEL_${i.toString().padStart(3, '0')}`,
    title: `Intelligence Report ${i + 1}`,
    summary: `Summary of intelligence report ${i + 1} containing classified information.`,
    classification: ['UNCLASSIFIED', 'CONFIDENTIAL', 'SECRET'][Math.floor(Math.random() * 3)],
    timestamp: new Date(Date.now() - i * 7200000).toISOString(),
    source: ['HUMINT', 'SIGINT', 'OSINT', 'GEOINT'][Math.floor(Math.random() * 4)]
  }));
};

// API functions
export const fetchVessels = async (): Promise<VesselData[]> => {
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
  return generateMockVessels();
};

export const fetchSatelliteImages = async (): Promise<SatelliteImage[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return generateMockSatelliteImages();
};

export const fetchIntelligenceReports = async (): Promise<IntelligenceReport[]> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  return generateMockIntelligence();
};
