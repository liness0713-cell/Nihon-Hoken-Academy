import { InsuranceCategory, InsuranceProduct } from './types';
import { Heart, Shield, Activity, Car, Home } from 'lucide-react';
import React from 'react';

export const MOCK_PRODUCTS: InsuranceProduct[] = [
  {
    id: 'prod_life_01',
    name: 'Eternal Peace (Shushin Hoken)',
    category: InsuranceCategory.LIFE,
    description: 'Whole life insurance providing lifetime coverage with surrender value.',
    coveragePoints: ['Death Benefit: 10M - 100M JPY', 'Surrender Value available', 'Terminal Illness Rider']
  },
  {
    id: 'prod_med_01',
    name: 'Medical Guard Alpha (Iryo Hoken)',
    category: InsuranceCategory.MEDICAL,
    description: 'Comprehensive medical insurance covering hospitalization and surgery.',
    coveragePoints: ['Hospitalization: 5,000 JPY/day', 'Surgery: Up to 200,000 JPY', 'Advanced Medical Care Rider']
  },
  {
    id: 'prod_can_01',
    name: 'Cancer Fighter (Gan Hoken)',
    category: InsuranceCategory.CANCER,
    description: 'Specialized coverage focusing solely on cancer treatment and support.',
    coveragePoints: ['Diagnosis Lump Sum: 1M JPY', 'Anti-cancer drug treatment', 'Outpatient care coverage']
  },
  {
    id: 'prod_car_01',
    name: 'Safe Drive Plus (Jidosha Hoken)',
    category: InsuranceCategory.CAR,
    description: 'Voluntary car insurance with road service.',
    coveragePoints: ['Bodily Injury: Unlimited', 'Property Damage: Unlimited', 'Roadside Assistance']
  },
];

export const CATEGORY_ICONS: Record<InsuranceCategory, React.ReactNode> = {
  [InsuranceCategory.LIFE]: <Shield className="w-6 h-6 text-blue-500" />,
  [InsuranceCategory.MEDICAL]: <Activity className="w-6 h-6 text-green-500" />,
  [InsuranceCategory.CANCER]: <Heart className="w-6 h-6 text-pink-500" />,
  [InsuranceCategory.CAR]: <Car className="w-6 h-6 text-indigo-500" />,
  [InsuranceCategory.FIRE]: <Home className="w-6 h-6 text-orange-500" />,
};
