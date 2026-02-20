# IntentPass - Advanced Password Intentionality Analyzer

[![Next.js](https://img.shields.io/badge/Next.js-16.1-black?style=flat&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=flat&logo=typescript)](https://www.typescriptlang.org)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat&logo=react)](https://reactjs.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.2-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com)

A cutting-edge password analysis platform that evaluates passwords beyond traditional complexity rules by measuring **intentionality**, **structural coherence**, and **actual security strength**.


# IntentPass System Flow & Architecture

## 🔄 System Data Flow Architecture

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

### 2. Password Analysis DFA (Deterministic Finite Automaton)

```mermaid
stateDiagram-v2
    [*] --> EmptyState
    EmptyState --> ProcessingState: User types first character
    ProcessingState --> SegmentAnalysis: Password length ≥ 1
    SegmentAnalysis --> PredictabilityCheck: Segmentation complete
    PredictabilityCheck --> RandomSmashCheck: Pattern detection done
    RandomSmashCheck --> EntropyCalculation: Randomness analysis complete
    EntropyCalculation --> AmbiguityDetection: Entropy metrics calculated
    AmbiguityDetection --> ScoreAggregation: Ambiguity analysis complete
    ScoreAggregation --> IntentionalityClassification: All components analyzed
    IntentionalityClassification --> BehavioralClassification: Intent score calculated
    BehavioralClassification --> SuggestionGeneration: Classification complete
    SuggestionGeneration --> AdversarialSimulation: Suggestions ready
    AdversarialSimulation --> BenchmarkComparison: Attack resistance calculated
    BenchmarkComparison --> Visualization: All analyses complete
    Visualization --> [*]: Display results
    
    EmptyState --> EmptyState: No input
    ProcessingState --> EmptyState: User clears input
    Visualization --> ProcessingState: User modifies password
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


