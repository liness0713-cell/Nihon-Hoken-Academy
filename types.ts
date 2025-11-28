
export enum InsuranceCategory {
  LIFE = '终身保险 / Life / 生命保険(せいめいほけん)',
  MEDICAL = '医疗保险 / Medical / 医療保険(いりょうほけん)',
  CANCER = '癌症保险 / Cancer / がん保険(がんほけん)',
  CAR = '汽车保险 / Car / 自動車保険(じどうしゃほけん)',
  FIRE = '火灾保险 / Fire / 火災保険(かさいほけん)'
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
