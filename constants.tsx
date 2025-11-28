
import { InsuranceCategory, InsuranceProduct } from './types';
import { Heart, Shield, Activity, Car, Home } from 'lucide-react';
import React from 'react';

export const MOCK_PRODUCTS: InsuranceProduct[] = [
  {
    id: 'prod_life_01',
    name: '安泰终身 / Eternal Peace / 安泰終身(あんたいしゅうしん)',
    category: InsuranceCategory.LIFE,
    description: '提供终身保障与解约返还金的保险 / Whole life insurance with surrender value / 一涯(いっしょう)の保障(ほしょう)と解約返戻金(かいやくへんれいきん)のある保険(ほけん)',
    coveragePoints: [
      '身故赔偿: 1000万 - 1亿日元 / Death Benefit: 10M-100M JPY / 死亡保険金(しぼうほけんきん): 1000万-1億円',
      '包含解约返还金 / Surrender Value available / 解約返戻金(かいやくへんれいきん)あり',
      '绝症特约 / Terminal Illness Rider / リビング・ニーズ特約(とくやく)'
    ]
  },
  {
    id: 'prod_med_01',
    name: '医疗卫士 Alpha / Medical Guard Alpha / 医療(いりょう)ガードα',
    category: InsuranceCategory.MEDICAL,
    description: '涵盖住院和手术的综合医疗保险 / Comprehensive coverage for hospitalization & surgery / 入院(にゅういん)と手術(しゅじゅつ)をカバーする総合医療保険(そうごういりょうほけん)',
    coveragePoints: [
      '住院: 5,000日元/天 / Hospitalization: 5,000 JPY/day / 入院(にゅういん): 1日(いちにち)5,000円(えん)',
      '手术: 最高20万日元 / Surgery: Up to 200k JPY / 手術(しゅじゅつ): 最大(さいだい)20万円(まんえん)',
      '先进医疗特约 / Advanced Medical Care Rider / 先進医療特約(せんしんいりょうとくやく)'
    ]
  },
  {
    id: 'prod_can_01',
    name: '抗癌斗士 / Cancer Fighter / がんファイター',
    category: InsuranceCategory.CANCER,
    description: '专注于癌症治疗的保险 / Specialized coverage for cancer treatment / がん治療(ちりょう)に特化(とっか)した保険(ほけん)',
    coveragePoints: [
      '诊断给付金: 100万日元 / Diagnosis Lump Sum: 1M JPY / 診断給付金(しんだんきゅうふきん): 100万円(まんえん)',
      '抗癌药治疗 / Anti-cancer drug treatment / 抗(こう)がん剤(ざい)治療(ちりょう)',
      '门诊治疗保障 / Outpatient care coverage / 通院保障(つういんほしょう)'
    ]
  },
  {
    id: 'prod_car_01',
    name: '安全驾驶 Plus / Safe Drive Plus / 安全運転(あんぜんうんてん)プラス',
    category: InsuranceCategory.CAR,
    description: '包含道路救援的自愿汽车保险 / Voluntary car insurance with road service / ロードサービス付(つ)き任意(にんい)自動車保険(じどうしゃほけん)',
    coveragePoints: [
      '人身伤害: 无限额 / Bodily Injury: Unlimited / 対人賠償(たいじんばいしょう): 無制限(むせいげん)',
      '财产损失: 无限额 / Property Damage: Unlimited / 対物賠償(たいぶつばいしょう): 無制限(むせいげん)',
      '道路救援 / Roadside Assistance / ロードサービス'
    ]
  },
];

export const CATEGORY_ICONS: Record<InsuranceCategory, React.ReactNode> = {
  [InsuranceCategory.LIFE]: <Shield className="w-6 h-6 text-blue-500" />,
  [InsuranceCategory.MEDICAL]: <Activity className="w-6 h-6 text-green-500" />,
  [InsuranceCategory.CANCER]: <Heart className="w-6 h-6 text-pink-500" />,
  [InsuranceCategory.CAR]: <Car className="w-6 h-6 text-indigo-500" />,
  [InsuranceCategory.FIRE]: <Home className="w-6 h-6 text-orange-500" />,
};
