// Get settings from localStorage (client-side only)
function getStoredSettings() {
  if (typeof window === 'undefined') {
    return {
      baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
      mode: 'Dev' as 'Dev' | 'Prod' | 'Mock'
    };
  }
  
  const baseUrl = localStorage.getItem('bettermix:baseUrl') || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const mode = (localStorage.getItem('bettermix:mode') || 'Dev') as 'Dev' | 'Prod' | 'Mock';
  
  return { baseUrl, mode };
}

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

interface MasteringOptions {
  musical_style?: string;
  loudness?: string;
  sample_rate?: string;
}

// Helper function to create FormData and handle fetch
async function makeApiRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const { baseUrl, mode } = getStoredSettings();
  
  // If mode is Mock, delegate to mock API
  if (mode === 'Mock') {
    const { makeApiRequest: mockMakeApiRequest } = await import('./apiMock');
    return mockMakeApiRequest<T>(endpoint, options);
  }
  
  const url = `${baseUrl}${endpoint}`;
  
  // Add mode header for Dev and Prod
  const headers: Record<string, string> = {
    ...((options?.headers as Record<string, string>) || {}),
  };
  
  if (mode === 'Dev' || mode === 'Prod') {
    headers['X-BetterMix-Mode'] = mode.toLowerCase();
  }
  
  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `API request failed: ${response.status} ${response.statusText}`;
      
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson?.message || errorJson?.error || errorMessage;
      } catch {
        if (errorText) {
          errorMessage = errorText;
        }
      }
      
      throw new Error(errorMessage);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    
    throw new Error('Expected JSON response from API');
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`Network error: ${String(error)}`);
  }
}

export async function getQuote(service: ServiceType): Promise<number> {
  const response = await makeApiRequest<QuoteResponse>(`/quote?service=${service}`);
  return response.estimated_credits;
}

export async function postMasteringPreview(
  file: File, 
  opts?: MasteringOptions
): Promise<ProcessingResponse> {
  const formData = new FormData();
  formData.append('file', file);
  
  if (opts?.musical_style) {
    formData.append('musical_style', opts.musical_style);
  }
  if (opts?.loudness) {
    formData.append('loudness', opts.loudness);
  }
  if (opts?.sample_rate) {
    formData.append('sample_rate', opts.sample_rate);
  }

  return makeApiRequest<ProcessingResponse>('/mastering-preview', {
    method: 'POST',
    body: formData,
  });
}

export async function postEnhancePreview(file: File): Promise<ProcessingResponse> {
  const formData = new FormData();
  formData.append('file', file);

  return makeApiRequest<ProcessingResponse>('/enhance-preview', {
    method: 'POST',
    body: formData,
  });
}

export async function postAnalysis(file: File): Promise<ProcessingResponse> {
  const formData = new FormData();
  formData.append('file', file);

  return makeApiRequest<ProcessingResponse>('/analysis', {
    method: 'POST',
    body: formData,
  });
}

// Helper function to get current mode (for UI components)
export function getCurrentMode(): 'Dev' | 'Prod' | 'Mock' {
  return getStoredSettings().mode;
}