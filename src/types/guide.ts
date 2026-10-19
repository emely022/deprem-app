export interface FirstAidStep {
  stepNumber: number;
  title: string;
  description: string;
}

export interface FirstAidArticle {
  id: string;
  title: string;
  shortDescription: string;
  icon: string;
  badge?: string;
  criticalWarning?: string;
  steps: FirstAidStep[];
  tips?: string[];
  category: 'rubble' | 'crush' | 'bleeding' | 'fracture' | 'hypothermia' | 'behavior' | 'checklist';
}

export interface EmergencyNumber {
  id: string;
  name: string;
  number: string;
  description: string;
  icon: string;
}

export interface ChecklistItem {
  id: string;
  title: string;
  category: 'water_food' | 'health' | 'tools' | 'documents';
  description: string;
  essential: boolean;
}
