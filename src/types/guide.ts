export type TextSizeOption = 'normal' | 'large' | 'xlarge';

export interface GuideStep {
  stepNumber: number;
  title: string;
  description: string;
  caution?: string;
}

export interface SituationCategory {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  badge: string;
  urgency: 'critical' | 'high' | 'standard';
  criticalAlert?: string;
  isCrushSyndromeSpecial?: boolean;
  steps: GuideStep[];
  donts?: string[];
  citizenRole?: string[];
  medicalRole?: string[];
}

export interface GuideMetadata {
  medicalReviewer: string;
  reviewStatus: string;
  sources: string[];
  lastUpdated: string;
  version: string;
  offlineNote: string;
}
