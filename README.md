# IntentPass - Advanced Password Intentionality Analyzer

[![Next.js](https://img.shields.io/badge/Next.js-16.1-black?style=flat&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=flat&logo=typescript)](https://www.typescriptlang.org)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat&logo=react)](https://reactjs.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.2-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com)

A cutting-edge password analysis platform that evaluates passwords beyond traditional complexity rules by measuring **intentionality**, **structural coherence**, and **actual security strength**.



##  Key Features

###  Multi-Dimensional Password Analysis
- **Intentionality Index**: Measures whether a password shows deliberate design vs random generation
- **Structural Coherence**: Evaluates logical segmentation and organization
- **Entropy Quality**: Advanced entropy calculation with character distribution analysis
- **Pattern Detection**: Identifies predictable sequences, keyboard walks, and weak substrings
- **Ambiguity Analysis**: Detects confusable characters that may cause entry errors

###  Behavioral Classification
Automatically categorizes passwords into five behavioral types:
- **Predictable**: Contains detectable sequences/patterns
- **Random**: High entropy, appears randomly generated
- **Passphrase**: Word-based passwords separated by spaces
- **Compliance Hack**: Meets rules but lacks intentionality
- **Balanced**: Well-designed with intention and security

###  Real-Time Security Intelligence
- **Breach Exposure Check**: Integrates with Have I Been Pwned API (client-side, privacy-safe)
- **Adversarial Simulation**: Analyzes resistance to 5 attack types (dictionary, brute force, keyboard walk, frequency analysis, Markov chain)
- **Policy Mode**: Toggle between Consumer (8 chars) and Enterprise (14 chars, NIST/CIS compliant) requirements

### Advanced Visualizations
- **6-Axis Radar Chart**: Multi-dimensional intentionality visualization
- **Entropy Distribution Map**: Segment-by-segment entropy breakdown
- **Keyboard Heatmap**: Interactive QWERTY usage visualization
- **Evolution Tracker**: Compare password versions over time
- **Benchmark Comparison**: Compare IntentPass vs Rule-Based vs zxcvbn-like systems

###  Gamification & Feedback
- **Tier System**: Bronze/Silver/Gold/Platinum badges based on intentionality score
- **AI-Powered Suggestions**: Context-specific improvement recommendations
- **Real-time Diagnostics**: Strengths and warnings as you type


##  Architecture Overview

```
app/
├── page.tsx              # Main application page
├── layout.tsx            # Root layout with metadata
└── globals.css           # Global styles and theme

components/
├── ui/                   # Reusable UI components (shadcn/ui)
├── PasswordInput.tsx     # Secure password entry component
├── ScoreDisplay.tsx      # Visual score presentation
├── RadarChart.tsx        # Multi-dimensional visualization
├── KeyboardHeatmap.tsx   # Interactive keyboard usage
├── EntropyMap.tsx        # Entropy distribution visualization
├── BreachStatus.tsx      # HIBP integration component
├── TierBadge.tsx         # Gamified tier display
├── BehavioralClassification.tsx  # Password type classifier
├── SuggestionsPanel.tsx  # AI improvement recommendations
├── AdversarialAnalysis.tsx       # Attack resistance analysis
├── BenchmarkComparison.tsx       # System comparison matrix
├── PolicyToggle.tsx      # Consumer/Enterprise mode switch
└── theme-provider.tsx    # Dark/light theme support

lib/
├── analyzer/             # Core analysis engine
│   ├── scorer.ts         # Main analysis orchestrator
│   ├── segmentAnalyzer.ts     # Password segmentation
│   ├── predictabilityAnalyzer.ts  # Pattern detection
│   ├── randomSmashAnalyzer.ts     # Randomness detection
│   ├── entropyAnalyzer.ts         # Entropy calculation
│   ├── ambiguityAnalyzer.ts       # Confusable character detection
│   ├── breachChecker.ts           # HIBP integration
│   ├── classifier.ts              # Behavioral classification
│   ├── suggestions.ts             # AI recommendations
│   ├── adversarial.ts             # Attack simulation
│   ├── benchmark.ts               # System comparison
│   ├── types.ts                   # TypeScript interfaces
│   └── constants.ts               # Configuration constants
│
└── context/
    └── PolicyContext.tsx          # Policy mode management

hooks/
├── use-mobile.ts         # Mobile detection hook
└── use-toast.ts          # Toast notification hook
```

# IntentPass System Flow & Architecture

##  System Data Flow Architecture

### 1. Main Application Flow

```mermaid
graph TD
    A[User Input] --> B[PasswordInput Component]
    B --> C{Password Length Check}
    C -->|Empty| D[Show Empty State]
    C -->|Has Content| E[analyzePassword Function]
    E --> F[Segment Analysis]
    F --> G[Predictability Analysis]
    G --> H[Random Smash Analysis]
    H --> I[Ambiguity Analysis]
    I --> J[Entropy Analysis]
    J --> K[Component Score Calculation]
    K --> L[Overall Score Generation]
    L --> M[Intentionality Index Calculation]
    M --> N[Classification Engine]
    N --> O[Suggestion Generator]
    O --> P[Adversarial Analysis]
    P --> Q[Benchmark Comparison]
    Q --> R[UI Component Rendering]
    R --> S[Real-time Display]
```

### 2. Password Analysis DFD (Data Flow Diagram - Level 0)

```mermaid
graph TD
    subgraph "External Entities"
        UE[User]
        AP[API Services - HIBP]
    end
    
    subgraph "Process 0: Password Analysis System"
        A[Input Validation]
        B[Segment Analysis]
        C[Predictability Analysis]
        D[Random Smash Analysis]
        E[Entropy Analysis]
        F[Ambiguity Analysis]
        G[Score Calculation]
        H[Classification]
        I[Suggestions Generation]
        J[Adversarial Analysis]
        K[Visualization Prep]
    end
    
    UE -->|Password Input| A
    A -->|Validated Password| B
    A -->|Validated Password| C
    A -->|Validated Password| D
    A -->|Validated Password| E
    A -->|Validated Password| F
    B -->|Segment Data| G
    C -->|Pattern Data| G
    D -->|Randomness Data| G
    E -->|Entropy Data| G
    F -->|Ambiguity Data| G
    G -->|Scores| H
    H -->|Classification| I
    H -->|Classification| J
    I -->|Suggestions| K
    J -->|Adversarial Data| K
    AP -->|Breach Data| J
    K -->|Processed Data| UE
```

### 2.1. Password Analysis DFD (Level 1 - Input Processing)

```mermaid
graph LR
    UE[User Entity] -->|Raw Password| A[Validate Input]
    A -->|Valid Password| B[Segment Analysis]
    A -->|Invalid Input| C[Error Response]
    B -->|Segment Data| D[Store Segmentation Results]
    D -->|Segmentation Output| E[Calculate Component Scores]
```

### 2.2. Password Analysis DFD (Level 1 - Core Analysis)

```mermaid
graph LR
    A[Segment Analysis] -->|Segments| B[Predictability Analysis]
    A -->|Segments| C[Random Smash Analysis]
    A -->|Segments| D[Entropy Analysis]
    A -->|Segments| E[Ambiguity Analysis]
    
    B -->|Predictability Data| F[Score Aggregation]
    C -->|Randomness Data| F
    D -->|Entropy Data| F
    E -->|Ambiguity Data| F
    
    F -->|Component Scores| G[Intentionality Calculation]
    G -->|Intentionality Index| H[Classification]
```

### 2.3. Password Analysis DFD (Level 1 - Output Processing)

```mermaid
graph RL
    A[Classification Results] --> B[Suggestions Generation]
    C[Adversarial Analysis] --> B
    D[Benchmark Comparison] --> B
    B -->|Enhanced Results| E[Visualization Data Prep]
    F[Raw Analysis Data] --> E
    E -->|Formatted Data| G[UI Components]
    G -->|Visual Output| H[User Display]
```

### 3. Component Analysis Pipeline

```mermaid
graph LR
    A[Password Input] --> B[SegmentAnalyzer]
    A --> C[PredictabilityAnalyzer]
    A --> D[RandomSmashAnalyzer]
    A --> E[EntropyAnalyzer]
    A --> F[AmbiguityAnalyzer]
    
    B --> G[Component Scorer]
    C --> G
    D --> G
    E --> G
    F --> G
    
    G --> H[Overall Score]
    G --> I[Intentionality Index]
    H --> J[Classification Engine]
    I --> J
    J --> K[Behavioral Types]
    K --> L[Suggestion Engine]
    L --> M[UI Components]
```
## Getting Started

### Prerequisites
- Node.js 18+ or pnpm
- Modern web browser

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd intent-pass-password-engine

# Install dependencies
npm install

# Start development server
npm dev
```

The application will be available at `http://localhost:3000`

### Build for Production

```bash
# Build the application
npm build

# Start production server
npm start
```
Security Analysis Pipeline

```mermaid
graph TB
    A[Password Input] --> B[Breach Exposure Check]
    A --> C[Pattern Analysis]
    A --> D[Entropy Assessment]
    A --> E[Ambiguity Detection]
    
    B --> F[Security Risk Level]
    C --> G[Predictability Score]
    D --> H[Entropy Quality]
    E --> I[Usability Risk]
    
    F --> J[Overall Security Rating]
    G --> J
    H --> J
    I --> J
    
    J --> K[Attack Resistance Analysis]
    K --> L[Dictionary Attack]
    K --> M[Brute Force]
    K --> N[Keyboard Walk]
    K --> O[Frequency Analysis]
    K --> P[Markov Chain]
    
    L --> Q[Resistance Percentage]
    M --> Q
    N --> Q
    O --> Q
    P --> Q
```

