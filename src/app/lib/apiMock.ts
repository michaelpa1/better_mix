type ServiceType = "mastering_preview" | "enhance_preview" | "analysis";

interface QuoteResponse {
  estimated_credits: number;
  service: ServiceType;
}

interface ProcessingResponse {
  id: string;
  status: 'processing' | 'completed' | 'failed';
  download_url?: string;
  results?: any;
  message?: string;
}

// Helper function to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Generate realistic mock data
const generateMockId = () => `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const generateMockDownloadUrl = () => 
  `https://mock-api.bettermix.com/downloads/${generateMockId()}.wav`;

const generateMockAnalysisResults = () => ({
  audio_properties: {
    duration: 180.5,
    sample_rate: 44100,
    channels: 2,
    bit_depth: 16,
    file_size_mb: 18.3
  },
  frequency_analysis: {
    peak_frequency: 2400,
    dominant_frequencies: [440, 880, 1320, 2200],
    frequency_balance: "Well-balanced with slight emphasis on mids"
  },
  dynamic_analysis: {
    rms_level: -18.2,
    peak_level: -3.1,
    dynamic_range: 12.8,
    loudness_lufs: -14.3
  },
  quality_metrics: {
    overall_score: 8.7,
    clarity: 9.1,
    balance: 8.3,
    dynamics: 8.9
  },
  recommendations: [
    "Consider slight high-frequency enhancement for more presence",
    "Dynamic range is excellent for the genre",
    "Overall mix quality is professional-grade"
  ]
});

// Mock API request handler
export async function makeApiRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
  // Simulate network delay
  await delay(Math.random() * 1000 + 500); // 500-1500ms delay
  
  // Parse endpoint to determine mock response
  if (endpoint.includes('/quote')) {
    const service = endpoint.split('service=')[1] as ServiceType;
    const mockCredits = {
      'mastering_preview': Math.floor(Math.random() * 20) + 10, // 10-29 credits
      'enhance_preview': Math.floor(Math.random() * 15) + 8,   // 8-22 credits
      'analysis': Math.floor(Math.random() * 5) + 3            // 3-7 credits
    };
    
    return {
      estimated_credits: mockCredits[service] || 15,
      service
    } as T;
  }
  
  if (endpoint.includes('/mastering-preview')) {
    return {
      id: generateMockId(),
      status: 'completed',
      download_url: generateMockDownloadUrl(),
      message: 'Mastering preview completed successfully'
    } as T;
  }
  
  if (endpoint.includes('/enhance-preview')) {
    return {
      id: generateMockId(),
      status: 'completed',
      download_url: generateMockDownloadUrl(),
      message: 'Enhancement preview completed successfully'
    } as T;
  }
  
  if (endpoint.includes('/analysis')) {
    return {
      id: generateMockId(),
      status: 'completed',
      results: generateMockAnalysisResults(),
      message: 'Audio analysis completed successfully'
    } as T;
  }
  
  // Default mock response
  throw new Error(`Mock API: Endpoint ${endpoint} not implemented`);
}

// Export the same functions as the main API for consistency
export async function getQuote(service: ServiceType): Promise<number> {
  const response = await makeApiRequest<QuoteResponse>(`/quote?service=${service}`);
  return response.estimated_credits;
}

export async function postMasteringPreview(file: File, opts?: any): Promise<ProcessingResponse> {
  return makeApiRequest<ProcessingResponse>('/mastering-preview', {
    method: 'POST',
    body: new FormData(), // Mock doesn't actually use the file
  });
}

export async function postEnhancePreview(file: File): Promise<ProcessingResponse> {
  return makeApiRequest<ProcessingResponse>('/enhance-preview', {
    method: 'POST',
    body: new FormData(), // Mock doesn't actually use the file
  });
}

export async function postAnalysis(file: File): Promise<ProcessingResponse> {
  return makeApiRequest<ProcessingResponse>('/analysis', {
    method: 'POST',
    body: new FormData(), // Mock doesn't actually use the file
  });
}