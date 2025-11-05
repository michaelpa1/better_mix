# Better Mix - Audio Processing Platform Documentation

## Overview

Better Mix is a comprehensive AI-powered audio processing platform built with Next.js 14, TypeScript, and Tailwind CSS. The application provides professional-grade audio mastering, enhancement, and analysis services through a modern web interface.

## Core Architecture

### Technology Stack

- **Frontend Framework**: Next.js 14.2.0 with App Router
- **Language**: TypeScript 5.x for type safety
- **Styling**: Tailwind CSS 3.4.6 with custom design system
- **Icons**: Heroicons React for consistent iconography
- **Charts**: Recharts for data visualization
- **State Management**: React hooks and local component state
- **Data Persistence**: localStorage for client-side history management

### Project Structure

```
src/
├── app/                                    # Next.js App Router pages
│   ├── layout.tsx                          # Root layout with global metadata
│   ├── lib/                               # Core utilities and services
│   │   ├── api.ts                         # API client and service wrappers
│   │   └── storage.ts                     # localStorage history management
│   ├── audio-upload-dashboard/            # Main dashboard module
│   ├── processing-status/                 # Processing monitoring module  
│   ├── processing-results/                # Results display module
│   ├── processing-history/                # History management module
│   └── credit-management/                 # Credit system (deprecated)
├── components/
│   ├── ui/                               # Reusable UI components
│   │   ├── AppIcon.tsx                   # Icon wrapper component
│   │   └── AppImage.tsx                  # Image component with fallbacks
│   └── common/
│       └── Header.tsx                    # Application header with navigation
└── styles/
    ├── index.css                         # Global styles (read-only)
    └── tailwind.css                      # Tailwind directives (customizable)
```

## Application Flow

### 1. Audio Upload Dashboard (`/audio-upload-dashboard`)

**Primary Entry Point**: The main interface where users interact with the platform.

#### Components Architecture:
- **AudioUploadInteractive.tsx**: Master orchestrator component managing the 3-step wizard workflow
- **FileUploadZone.tsx**: Drag-and-drop file upload with validation (WAV, FLAC, MP3, ≤100MB)
- **ServiceSelectionPanel.tsx**: Service picker with real-time credit estimation via API
- **ProcessingConfirmationDialog.tsx**: Credit confirmation before processing
- **ProcessingStatusInteractive.tsx**: Inline processing status with cancellation
- **ProcessingResultsInteractive.tsx**: Results display with download and audio preview

#### Workflow States:
1. **Upload**: File selection and validation
2. **Configure**: Service selection and credit estimation  
3. **Processing**: Real-time status monitoring
4. **Results**: Download links and result visualization

### 2. API Integration Layer (`src/app/lib/api.ts`)

**Purpose**: Thin wrapper around external audio processing API

#### Service Endpoints:
- `getQuote(service)`: Retrieves credit estimates for services
- `postMasteringPreview(file, options)`: Audio mastering with customizable parameters
- `postEnhancePreview(file)`: Audio enhancement processing
- `postAnalysis(file)`: Audio analysis and reporting

#### Configuration:
- Base URL: `process.env.NEXT_PUBLIC_API_URL` (defaults to `http://localhost:8000`)
- Error handling with readable error messages
- FormData-based file uploads with progress support

### 3. Local Storage Management (`src/app/lib/storage.ts`)

**Purpose**: Client-side history persistence without database dependency

#### Data Structure:
```typescript
interface HistoryEntry {
  id: string;                    // Unique identifier
  ts: number;                    // Timestamp
  filename: string;              // Original file name
  size: number;                  // File size in bytes
  service: ServiceType;          // Processing service used
  estimatedCredits: number;      // Credits consumed
  resultUrl?: string;            // Download link (if available)
  analysisSummary?: any;         // Analysis results (if applicable)
}
```

#### Storage Key: `bettermix:history`
- Automatically sorted by timestamp (newest first)
- Persistent across browser sessions
- Safe error handling for storage failures

### 4. Processing History (`/processing-history`)

**Purpose**: Historical job management and result access

#### Components:
- **ProcessingHistoryInteractive.tsx**: Main history interface
- **HistoryTable.tsx**: Tabular display with sorting and filtering
- **HistoryFilters.tsx**: Service and date range filtering
- **BulkActions.tsx**: Mass operations (clear, export)
- **AnalysisModal.tsx**: Detailed result viewing

#### Features:
- Row-click navigation to result details
- Bulk history clearing with confirmation
- Service-based filtering and search

### 5. Processing Results (`/processing-results`)

**Purpose**: Individual result viewing and download management

#### Components:
- **ProcessingResultsInteractive.tsx**: Main results interface
- **AudioPlayer.tsx**: HTML5 audio playback controls
- **DownloadOptions.tsx**: Multiple format download options
- **ResultsSummary.tsx**: Processing metadata display
- **AnalysisResults.tsx**: JSON analysis pretty-printing

#### Route Handling:
- Query parameter or state-based result loading
- Reuses components from main dashboard
- Direct URL access for result sharing

### 6. Legacy Modules (Deprecated)

#### Credit Management (`/credit-management`)
- **Status**: Deprecated and hidden from navigation
- **Reason**: Replaced by simple quote-based credit display
- **Components**: PaymentFlow, UsageAnalytics, CreditPackages (unused)

#### Processing Status (`/processing-status`)
- **Status**: Replaced by inline status in main dashboard
- **Migration**: Functionality moved to ProcessingStatusInteractive component

## Component Communication Patterns

### State Management Flow

```
AudioUploadInteractive (Master State)
├── selectedFile: File | null
├── selectedService: ServiceType | null  
├── estimatedCredits: number
├── processingResult: ProcessingResult | null
└── currentStep: WizardStep

Child Components (Props Down, Callbacks Up)
├── FileUploadZone → onSelect(file)
├── ServiceSelectionPanel → onServiceSelect(service), onEstimatedCreditsChange(credits)
├── ProcessingConfirmationDialog → onConfirm(), onClose()
└── ProcessingResultsInteractive → onBackToStart()
```

### API Integration Pattern

1. **Service Selection** → `getQuote(service)` → Credit estimation
2. **Processing Trigger** → Service-specific API call → Result handling
3. **Result Storage** → `addHistory(entry)` → Local persistence
4. **History Access** → `listHistory()` → Display management

## User Experience Flow

### Happy Path Journey

1. **Landing**: User arrives at `/audio-upload-dashboard`
2. **File Upload**: Drag-and-drop audio file with instant validation
3. **Service Selection**: Choose processing type, see real-time credit estimate
4. **Confirmation**: Review credit cost, confirm processing
5. **Processing**: Monitor progress with cancel option
6. **Results**: Download processed audio, view analysis, save to history
7. **Navigation**: Access past results via history page

### Error Handling

- **File Validation**: Size/format errors shown immediately
- **API Errors**: User-friendly error messages with retry options
- **Network Issues**: Graceful degradation with offline indicators
- **Processing Failures**: Clear error reporting with support contact

## Development Patterns

### TypeScript Integration

- Strict type checking enabled
- Interface definitions for all API responses
- Props interfaces for all React components
- Enum-based service type definitions

### Tailwind CSS Usage

- Custom design system with semantic color tokens
- Responsive design patterns (mobile-first)
- Component-based class organization
- Consistent spacing and typography scales

### File Organization

- Feature-based module structure
- Component co-location with related files
- Shared utilities in `/lib` directory
- Consistent naming conventions (PascalCase components, camelCase files)

## Environment Configuration

### Required Environment Variables

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000  # Backend API endpoint

# Development Settings  
PORT=4028                                   # Development server port
```

### Build Configuration

- **Development**: `npm run dev` (port 4028)
- **Production**: `npm run build && npm run start`
- **Type Checking**: `npm run type-check`
- **Linting**: `npm run lint`

## Integration Points

### External API Contract

The application expects a REST API with these endpoints:
- `GET /quote?service={service}` → Credit estimation
- `POST /mastering-preview` → Audio mastering
- `POST /enhance-preview` → Audio enhancement  
- `POST /analysis` → Audio analysis

### Response Format

```typescript
interface ProcessingResponse {
  id: string;                    // Job identifier
  status: 'processing' | 'completed' | 'failed';
  download_url?: string;         // Result download link
  results?: any;                 # Analysis data (for analysis service)
  message?: string;              # Error message (if failed)
}
```

## Deployment Architecture

### Frontend Hosting
- Static site generation compatible
- CDN-optimized asset delivery
- Environment variable configuration

### API Integration
- CORS-enabled backend required
- File upload support (multipart/form-data)
- Error response standardization

## Future Development

### Planned Enhancements
- Real-time processing updates via WebSocket
- Batch processing support
- Advanced audio visualization
- User authentication integration
- Cloud storage for results

### Technical Debt
- Migration from localStorage to proper database
- Component library extraction
- API client abstraction layer
- Comprehensive test coverage

---

## Quick Start for Developers

1. **Clone and Install**:
   ```bash
   git clone [repository]
   cd better-mix
   npm install
   ```

2. **Environment Setup**:
   ```bash
   cp .env.local.example .env.local
   # Configure NEXT_PUBLIC_API_URL
   ```

3. **Development**:
   ```bash
   npm run dev
   # Open http://localhost:4028
   ```

4. **Key Entry Points**:
   - Main Dashboard: `src/app/audio-upload-dashboard/components/AudioUploadInteractive.tsx`
   - API Client: `src/app/lib/api.ts`
   - Storage System: `src/app/lib/storage.ts`

This architecture provides a robust, scalable foundation for AI-powered audio processing with clear separation of concerns and excellent user experience.