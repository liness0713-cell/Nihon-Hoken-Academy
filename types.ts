export enum InsuranceCategory {
  LIFE = 'Seimei (Life)',
  MEDICAL = 'Iryo (Medical)',
  CANCER = 'Gan (Cancer)',
  CAR = 'Jidosha (Car)',
  FIRE = 'Kasai (Fire)'
}

export interface InsuranceProduct {
  id: string;
  name: string;
  category: InsuranceCategory;
  description: string;
  coveragePoints: string[];
}

export interface Policy {
  id: string;
  productId: string;
  productName: string;
  category: InsuranceCategory;
  contractorName: string; // Keiyakusha
  insuredName: string;    // Hihokensha
  beneficiary: string;    // Uketorinin
  startDate: string;
  status: 'Active' | 'Lapsed' | 'Cancelled' | 'Claimed';
  premium: number;        // Hokenryo (Monthly)
  coverageAmount: string; // Hokenkin amount
  specialConditions: string; // Tokuyaku
}

export interface Claim {
  id: string;
  policyId: string;
  dateOfIncident: string; // Jiko hassei-bi
  incidentDescription: string;
  status: 'Pending' | 'Approved' | 'Denied';
  assessmentResult?: string;
  payoutAmount?: number;
}

export type ViewState = 'HOME' | 'PRODUCTS' | 'SIMULATION' | 'MY_PAGE' | 'CLAIMS_CENTER' | 'LEARN';
