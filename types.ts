
export type MediaType = 'IMAGE' | 'VIDEO';

export interface TrilingualContent {
  cn: string;
  en: string;
  jp: string;
}

export interface Chapter {
  id: string;
  title: TrilingualContent;
  content: TrilingualContent;
}

export interface InsuranceLesson {
  id: string;
  timestamp: number;
  topic: string;
  visualPrompt: string; 
  mediaUrl?: string; 
  mainTitle: TrilingualContent;
  chapters: Chapter[];
  relatedProductId?: string;
}

export enum InsuranceCategory {
  LIFE = 'LIFE',
  MEDICAL = 'MEDICAL',
  CANCER = 'CANCER',
  CAR = 'CAR',
  FIRE = 'FIRE',
  OTHER = 'OTHER',
}

export interface InsuranceProduct {
  id: string;
  category: InsuranceCategory;
  name: TrilingualContent;
  description: TrilingualContent;
  coveragePoints: TrilingualContent[];
  basePrice: number;
}

export interface SimulationResult {
  monthlyPremium: number;
  planName: TrilingualContent;
  analysis: TrilingualContent; // Why this plan fits
  visualPrompt: string; // For generating an image of the "Future Self"
}

export interface Policy {
  id: string;
  policyNumber: string; // New: Official looking number
  productId: string;
  productName: TrilingualContent;
  planName: TrilingualContent; 
  analysis: TrilingualContent; 
  status: 'ACTIVE' | 'EXPIRED';
  premium: number;
  startDate: string;
  expiryDate: string; // New
  period: string; // New: "10 Years", "Lifetime", etc.
  holderName: string; // New
  beneficiary: string; // New
  paymentMethod: string; // New
  nextPaymentDate: string; // New
  visualUrl?: string; 
}

export interface ClaimResult {
  // Expanded statuses: APPROVED (Paid), DENIED (Rejected), UNDER_REVIEW (Accepted/Processing), NEED_MORE_INFO (Supplement)
  status: 'APPROVED' | 'DENIED' | 'UNDER_REVIEW' | 'NEED_MORE_INFO';
  title: TrilingualContent;
  explanation: TrilingualContent;
  nextSteps: TrilingualContent;
}
