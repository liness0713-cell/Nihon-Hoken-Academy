
import { InsuranceCategory, InsuranceProduct } from './types';
import { Heart, Shield, Activity, Car, Home, Plane, Dog, Bike } from 'lucide-react';
import React from 'react';

export const MOCK_PRODUCTS: InsuranceProduct[] = [
  {
    id: 'prod_life_01',
    category: InsuranceCategory.LIFE,
    name: {
      cn: '安泰终身保险',
      en: 'Eternal Peace Whole Life',
      jp: '安泰終身保険'
    },
    description: {
      cn: '提供终身保障与解约返还金的保险，守护您的一生。',
      en: 'Whole life insurance providing lifelong coverage and surrender value.',
      jp: '一生涯の保障と解約返戻金のある保険です。'
    },
    coveragePoints: [
      {
        cn: '身故赔偿: 1000万 - 1亿日元',
        en: 'Death Benefit: 10M - 100M JPY',
        jp: '死亡保険金: 1000万 - 1億円'
      },
      {
        cn: '包含解约返还金功能',
        en: 'Includes Cash Surrender Value',
        jp: '解約返戻金があります'
      }
    ],
    basePrice: 5000
  },
  {
    id: 'prod_med_01',
    category: InsuranceCategory.MEDICAL,
    name: {
      cn: '医疗卫士 Alpha',
      en: 'Medical Guard Alpha',
      jp: '医療ガードα'
    },
    description: {
      cn: '涵盖住院和手术的综合医疗保险，应对突发疾病。',
      en: 'Comprehensive medical insurance covering hospitalization and surgery.',
      jp: '入院と手術をカバーする総合医療保険です。'
    },
    coveragePoints: [
      {
        cn: '住院津贴: 5,000日元/天',
        en: 'Hospitalization: 5,000 JPY/day',
        jp: '入院給付金: 1日5,000円'
      },
      {
        cn: '手术给付: 最高20万日元',
        en: 'Surgery: Up to 200,000 JPY',
        jp: '手術給付金: 最大20万円'
      }
    ],
    basePrice: 2000
  },
  {
    id: 'prod_car_01',
    category: InsuranceCategory.CAR,
    name: {
      cn: '安全驾驶 Plus',
      en: 'Safe Drive Plus',
      jp: '安全運転プラス'
    },
    description: {
      cn: '包含道路救援的自愿汽车保险，出行无忧。',
      en: 'Voluntary car insurance with 24/7 roadside assistance.',
      jp: 'ロードサービス付きの任意自動車保険です。'
    },
    coveragePoints: [
      {
        cn: '人身/财产赔偿: 无限额',
        en: 'Bodily/Property Damage: Unlimited',
        jp: '対人・対物賠償: 無制限'
      },
      {
        cn: '附带道路救援服务',
        en: 'Roadside Assistance Included',
        jp: 'ロードサービスが付帯します'
      }
    ],
    basePrice: 8000
  },
  {
    id: 'prod_travel_01',
    category: InsuranceCategory.OTHER,
    name: {
      cn: '全球旅行者',
      en: 'Global Traveler',
      jp: 'グローバルトラベラー'
    },
    description: {
      cn: '涵盖海外医疗、行李丢失和航班延误的全面旅行保障。',
      en: 'Comprehensive travel protection for medical emergencies, lost luggage, and delays.',
      jp: '海外医療、手荷物紛失、航空機遅延をカバーする総合旅行保険。'
    },
    coveragePoints: [
      {
        cn: '海外医疗: 最高5000万日元',
        en: 'Overseas Medical: Max 50M JPY',
        jp: '海外医療: 最大5000万円'
      },
      {
        cn: '全天候紧急支援',
        en: '24/7 Emergency Support',
        jp: '24時間緊急サポート'
      }
    ],
    basePrice: 3000
  },
  {
    id: 'prod_pet_01',
    category: InsuranceCategory.OTHER,
    name: {
      cn: '萌宠守护',
      en: 'Paw Protect',
      jp: 'ペットの守り'
    },
    description: {
      cn: '为您心爱的宠物提供通院、住院和手术费用的70%报销。',
      en: 'Reimburses 70% of veterinary costs for visits, hospitalization, and surgery.',
      jp: '大切なペットの通院・入院・手術費用を70%補償します。'
    },
    coveragePoints: [
      {
        cn: '报销比例: 70%',
        en: 'Reimbursement Rate: 70%',
        jp: '補償割合: 70%'
      },
      {
        cn: '适用: 猫与狗',
        en: 'Covers: Cats & Dogs',
        jp: '対象: 犬・猫'
      }
    ],
    basePrice: 2500
  },
  {
    id: 'prod_bike_01',
    category: InsuranceCategory.OTHER,
    name: {
      cn: '骑行无忧',
      en: 'Cycle Safe',
      jp: 'サイクルセーフ'
    },
    description: {
      cn: '针对自行车事故的人身伤害及第三方责任赔偿。',
      en: 'Personal injury and third-party liability coverage for bicycle accidents.',
      jp: '自転車事故による自身の怪我と相手への賠償を補償。'
    },
    coveragePoints: [
      {
        cn: '个人责任: 最高1亿日元',
        en: 'Liability: Max 100M JPY',
        jp: '個人賠償責任: 最大1億円'
      },
      {
        cn: '示谈交涉服务',
        en: 'Settlement Negotiation Service',
        jp: '示談代行サービス付き'
      }
    ],
    basePrice: 500
  },
  // --- NEW PRODUCTS ---
  {
    id: 'prod_golf_01',
    category: InsuranceCategory.OTHER,
    name: {
      cn: '高尔夫尊享',
      en: 'Golfer\'s Premium',
      jp: 'ゴルファー保険'
    },
    description: {
      cn: '涵盖一杆进洞庆祝费、球具损坏及第三者责任的专属保险。',
      en: 'Covers hole-in-one celebrations, equipment damage, and third-party liability.',
      jp: 'ホールインワン費用、用品破損、賠償責任をカバーします。'
    },
    coveragePoints: [
      {
        cn: '一杆进洞: 最高50万日元',
        en: 'Hole-in-One: Max 500k JPY',
        jp: 'ホールインワン: 最大50万円'
      },
      {
        cn: '球具赔偿',
        en: 'Equipment Coverage',
        jp: '用品補償'
      }
    ],
    basePrice: 1000
  },
  {
    id: 'prod_eq_01',
    category: InsuranceCategory.FIRE,
    name: {
      cn: '地震安心保',
      en: 'Quake Secure',
      jp: '地震保険'
    },
    description: {
      cn: '专门针对地震、海啸及火山爆发造成的财产损失提供保障。',
      en: 'Protects against property damage caused by earthquakes, tsunamis, and eruptions.',
      jp: '地震・津波・噴火による損害を補償します。'
    },
    coveragePoints: [
      {
        cn: '房屋/家财保障',
        en: 'Building/Contents Coverage',
        jp: '建物・家財補償'
      },
      {
        cn: '政府再保险支持',
        en: 'Govt Reinsurance Backed',
        jp: '政府の再保険支援あり'
      }
    ],
    basePrice: 4000
  },
  {
    id: 'prod_care_01',
    category: InsuranceCategory.MEDICAL,
    name: {
      cn: '长寿护理',
      en: 'Silver Care Support',
      jp: '介護サポート'
    },
    description: {
      cn: '为需要长期护理的老年生活提供经济支持，减轻家庭负担。',
      en: 'Financial support for long-term nursing care needs in retirement.',
      jp: '要介護状態になった際の費用をサポートし、家族の負担を軽減。'
    },
    coveragePoints: [
      {
        cn: '护理年金',
        en: 'Nursing Annuity',
        jp: '介護年金'
      },
      {
        cn: '一次性给付金',
        en: 'Lump Sum Benefit',
        jp: '一時金給付'
      }
    ],
    basePrice: 6000
  },
  {
    id: 'prod_income_01',
    category: InsuranceCategory.LIFE,
    name: {
      cn: '收入保障',
      en: 'Income Protection',
      jp: '就業不能保険'
    },
    description: {
      cn: '当您因病或伤无法工作时，每月提供替代收入，维持生活质量。',
      en: 'Provides monthly replacement income if you cannot work due to illness or injury.',
      jp: '病気やケガで働けなくなった毎月の収入をサポートします。'
    },
    coveragePoints: [
      {
        cn: '月给付: 15万日元',
        en: 'Monthly Benefit: 150k JPY',
        jp: '月額給付: 15万円'
      },
      {
        cn: '居家疗养覆盖',
        en: 'Home Care Covered',
        jp: '在宅療養もカバー'
      }
    ],
    basePrice: 3500
  },
  {
    id: 'prod_edu_01',
    category: InsuranceCategory.LIFE,
    name: {
      cn: '未来学资',
      en: 'Future Scholar',
      jp: '学資保険'
    },
    description: {
      cn: '为孩子的教育累积资金，并在父母发生意外时豁免保费。',
      en: 'Savings for your child\'s education with premium waiver if parents pass away.',
      jp: '教育資金の積立と、親に万一があった際の保険料免除。'
    },
    coveragePoints: [
      {
        cn: '满期金: 300万日元',
        en: 'Maturity Benefit: 3M JPY',
        jp: '満期金: 300万円'
      },
      {
        cn: '育英年金',
        en: 'Scholarship Annuity',
        jp: '育英年金'
      }
    ],
    basePrice: 10000
  },
  {
    id: 'prod_drone_01',
    category: InsuranceCategory.OTHER,
    name: {
      cn: '无人机责任险',
      en: 'Drone Liability',
      jp: 'ドローン保険'
    },
    description: {
      cn: '保障无人机飞行过程中对第三方造成的人身或财产损害。',
      en: 'Covers liability for bodily injury or property damage caused by drone operations.',
      jp: 'ドローン操縦中の対人・対物事故を補償します。'
    },
    coveragePoints: [
      {
        cn: '赔偿限额: 1亿日元',
        en: 'Liability Limit: 100M JPY',
        jp: '賠償限度額: 1億円'
      },
      {
        cn: '机体损坏可选',
        en: 'Hull Damage Optional',
        jp: '機体損害オプション'
      }
    ],
    basePrice: 1200
  }
];

export const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  [InsuranceCategory.LIFE]: <Shield className="w-6 h-6 text-blue-500" />,
  [InsuranceCategory.MEDICAL]: <Activity className="w-6 h-6 text-green-500" />,
  [InsuranceCategory.CANCER]: <Heart className="w-6 h-6 text-pink-500" />,
  [InsuranceCategory.CAR]: <Car className="w-6 h-6 text-indigo-500" />,
  [InsuranceCategory.FIRE]: <Home className="w-6 h-6 text-orange-500" />,
  'OTHER': <Sparkles className="w-6 h-6 text-purple-500" />
};

// Helper for 'OTHER' mapping in icon lookup
function Sparkles(props: any) {
  return <Plane {...props} />; // Using Plane as generic "Other" base, updated in usage logic if needed
}
