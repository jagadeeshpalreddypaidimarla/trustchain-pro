export type Verdict = 'SCAM' | 'FAKE' | 'SUSPICIOUS' | 'LIKELY_REAL' | 'VERIFIED' | 'UNCERTAIN';

export type AnalysisResult = {
  success: boolean;
  analysis_id?: string;
  verdict: Verdict;
  confidence_score: number;
  red_flags: Array<{
    flag: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    type: string;
  }>;
  explanation: string;
  recommended_action: string;
  processing_time_ms: number;
  content_hash: string;
};

export type AnalysisInput = {
  type: 'text' | 'image' | 'url' | 'voice';
  content: string;
  language?: string;
};