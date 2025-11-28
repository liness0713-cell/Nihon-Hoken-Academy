
import React, { useState } from 'react';
import { ViewState, Policy, Claim, InsuranceCategory } from './types';
import { MOCK_PRODUCTS, CATEGORY_ICONS } from './constants';
import * as GeminiService from './services/geminiService';
import { 
  ShieldCheck, 
  FileText, 
  UserCheck, 
  AlertTriangle, 
  BookOpen, 
  ChevronRight, 
  TrendingUp, 
  PlusCircle, 
  Search,
  CheckCircle2,
  XCircle,
  Loader2
} from 'lucide-react';

// --- Utility Components for Ruby Text ---

const RubySegment: React.FC<{ text: string }> = ({ text }) => {
  // Regex matches Kanji (and iteration marks) followed by Kana in parentheses
  // \u4e00-\u9faf\u3005: Kanji & Iteration mark
  // \u3040-\u309f\u30a0-\u30ff: Hiragana & Katakana
  const rubyRegex = /([\u4e00-\u9faf\u3005]+)\s*\(([ \u3040-\u309f\u30a0-\u30ff]+)\)/g;
  
  const parts = [];
  let lastIndex = 0;
  let match;
  
  while ((match = rubyRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    parts.push(
      <ruby key={match.index}>
         {match[1]}
         <rt className="text-[0.6em] text-slate-500 font-normal">{match[2]}</rt>
      </ruby>
    );
    lastIndex = rubyRegex.lastIndex;
  }
  
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }
  
  return <>{parts}</>;
};

const FormattedText: React.FC<{ text: React.ReactNode; className?: string }> = ({ text, className }) => {
  if (text === null || text === undefined) return null;
  if (typeof text !== 'string') return <span className={className}>{text}</span>;
  
  // Split by <br> tags or newlines to handle line breaks
  const segments = text.split(/(?:<br\s*\/?>|\n)/g);
  
  return (
    <span className={className}>
      {segments.map((segment, i) => (
        <React.Fragment key={i}>
          {i > 0 && <br />}
          <RubySegment text={segment} />
        </React.Fragment>
      ))}
    </span>
  );
};

// --- Sub-components ---

// 1. Navigation Bar
const Navbar: React.FC<{ currentView: ViewState; setView: (v: ViewState) => void }> = ({ currentView, setView }) => (
  <nav className="bg-slate-900 text-white shadow-lg sticky top-0 z-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-20">
        <div className="flex items-center cursor-pointer" onClick={() => setView('HOME')}>
          <ShieldCheck className="h-8 w-8 text-blue-400 mr-2 flex-shrink-0" />
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-wide leading-tight">日本保险学院</span>
            <span className="text-xs text-slate-400">Nihon Hoken Academy</span>
            <span className="text-[10px] text-slate-500"><FormattedText text="日本保険(にほんほけん)アカデミー" /></span>
          </div>
        </div>
        <div className="hidden md:block">
          <div className="ml-10 flex items-baseline space-x-2">
            <NavButton 
              title="商品 / Products" 
              sub="商品(しょうひん)" 
              active={currentView === 'PRODUCTS'} 
              onClick={() => setView('PRODUCTS')} 
            />
            <NavButton 
              title="学习 / Learn" 
              sub="学習(がくしゅう)" 
              active={currentView === 'LEARN'} 
              onClick={() => setView('LEARN')} 
            />
            <NavButton 
              title="试算 / Quote" 
              sub="試算(しさん)" 
              active={currentView === 'SIMULATION'} 
              onClick={() => setView('SIMULATION')} 
            />
            <NavButton 
              title="主页 / My Page" 
              sub="マイページ" 
              active={currentView === 'MY_PAGE'} 
              onClick={() => setView('MY_PAGE')} 
            />
            <NavButton 
              title="理赔 / Claims" 
              sub="請求(せいきゅう)" 
              active={currentView === 'CLAIMS_CENTER'} 
              onClick={() => setView('CLAIMS_CENTER')} 
            />
          </div>
        </div>
      </div>
    </div>
  </nav>
);

const NavButton: React.FC<{ title: string; sub: string; active: boolean; onClick: () => void }> = ({ title, sub, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex flex-col items-center leading-none gap-1 ${
      active ? 'bg-blue-700 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
    }`}
  >
    <span><FormattedText text={title} /></span>
    <span className="text-[10px] opacity-70"><FormattedText text={sub} /></span>
  </button>
);

// 2. Home View
const HomeView: React.FC<{ setView: (v: ViewState) => void }> = ({ setView }) => (
  <div className="space-y-12 pb-12">
    {/* Hero */}
    <div className="relative bg-gradient-to-r from-blue-900 to-slate-800 text-white overflow-hidden rounded-b-3xl shadow-2xl">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop')] opacity-10 bg-cover bg-center" />
      <div className="relative max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4 flex flex-col gap-2">
          <span>体验日本保险</span>
          <span className="text-2xl sm:text-3xl font-light text-blue-200">Experience Japanese Insurance</span>
          <span className="text-xl sm:text-2xl text-blue-400"><FormattedText text="日本(にほん)の保険(ほけん)を体験(たいけん)しよう" /></span>
        </h1>
        <div className="max-w-3xl text-base sm:text-lg text-slate-300 mb-8 leading-relaxed">
          <FormattedText text={`一个全互动的日本保险市场模拟器。学习产品，模拟核保，管理保单，并通过AI体验理赔流程。<br/>
          A fully interactive simulator. Learn, simulate underwriting, manage policies, and experience claims with AI.<br/>
          完全(かんぜん)対話型(たいわがた)のシミュレーター。商品(しょうひん)を学(まな)び、引受(ひきうけ)を試算(しさん)し、AIで請求(せいきゅう)を体験(たいけん)しましょう。`} />
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          <button 
            onClick={() => setView('PRODUCTS')}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-500 rounded-full font-bold shadow-lg transition-transform hover:-translate-y-1 flex flex-col items-center"
          >
            <span>开始学习 / Start</span>
            <span className="text-xs font-normal opacity-80"><FormattedText text="学習(がくしゅう)を始(はじ)める" /></span>
          </button>
          <button 
            onClick={() => setView('SIMULATION')}
            className="px-8 py-3 bg-white text-blue-900 hover:bg-slate-100 rounded-full font-bold shadow-lg transition-transform hover:-translate-y-1 flex flex-col items-center"
          >
            <span>获取报价 / Quote</span>
            <span className="text-xs font-normal opacity-80"><FormattedText text="見積(みつ)もりをとる" /></span>
          </button>
        </div>
      </div>
    </div>

    {/* Features Grid */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <FeatureCard 
          icon={<BookOpen className="h-8 w-8 text-indigo-500" />}
          title="产品知识 / Knowledge / 商品知識(しょうひんちしき)"
          desc="探索各类保险，如终身保险、医疗保险和癌症保险。<br>Explore categories like Seimei, Iryo, and Gan insurance.<br>生命(せいめい)、医療(いりょう)、がん保険(ほけん)などを探索(たんさく)。"
        />
        <FeatureCard 
          icon={<UserCheck className="h-8 w-8 text-green-500" />}
          title="保单管理 / Admin / 保全(ほぜん)"
          desc="管理您的虚拟投资组合。体验地址变更和受益人更新。<br>Manage your virtual portfolio. Address & beneficiary changes.<br>契約(けいやく)を管理(かんり)。住所変更(じゅうしょへんこう)などを体験(たいけん)。"
        />
        <FeatureCard 
          icon={<AlertTriangle className="h-8 w-8 text-orange-500" />}
          title="理赔核定 / Claims / 査定(さてい)"
          desc="提交事故报告，观看AI理赔员根据条款确定赔付。<br>Submit reports and watch AI adjusters determine payout.<br>事故(じこ)を報告(ほうこく)し、AIによる支払(しはら)い査定(さてい)を見(み)る。"
        />
      </div>
    </div>
  </div>
);

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; desc: string }> = ({ icon, title, desc }) => (
  <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow border border-slate-100 h-full">
    <div className="mb-4 bg-slate-50 w-14 h-14 rounded-full flex items-center justify-center">
      {icon}
    </div>
    <h3 className="text-lg font-bold text-slate-900 mb-2 leading-snug"><FormattedText text={title} /></h3>
    <p className="text-sm text-slate-600 leading-relaxed">
      <FormattedText text={desc} />
    </p>
  </div>
);

// 3. Products View
const ProductsView: React.FC = () => (
  <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-slate-900"><FormattedText text="保险产品列表 / Insurance Products / 商品一覧(しょうひんいちらん)" /></h2>
      <p className="text-slate-600 mt-2"><FormattedText text="浏览日本市场现有的保险类型。<br/>Browse available insurance types.<br/>日本市場(にほんしじょう)の保険(ほけん)タイプを閲覧(えつらん)。" /></p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {MOCK_PRODUCTS.map((prod) => (
        <div key={prod.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:border-blue-300 transition-all">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              {CATEGORY_ICONS[prod.category]}
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{prod.category.split('/')[2]}</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2 leading-snug"><FormattedText text={prod.name} /></h3>
            <div className="text-sm text-slate-600 mb-4 h-auto min-h-[3rem]">
              <FormattedText text={prod.description} />
            </div>
            <div className="space-y-3 mb-6">
              {prod.coveragePoints.map((pt, idx) => (
                <div key={idx} className="flex items-start text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span><FormattedText text={pt} /></span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// 4. Learning Center
const LearnView: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [explanation, setExplanation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!topic) return;
    setLoading(true);
    setExplanation(null);
    const result = await GeminiService.getInsuranceExplanation(topic);
    setExplanation(result);
    setLoading(false);
  };

  const commonTopics = [
    "定期保险 / Term Life / 定期保険(ていきほけん)",
    "解约返还金 / Surrender Value / 解約返戻金(かいやくへんれいきん)",
    "先进医疗 / Advanced Medical / 先進医療(せんしんいりょう)",
    "免责金额 / Deductible / 免責金額(めんせききんがく)"
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-slate-900 mb-6"><FormattedText text="保险知识库 / Knowledge Base / 保険(ほけん)知識(ちしき)" /></h2>
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200">
        <div className="flex gap-4 mb-6 flex-col sm:flex-row">
          <input 
            type="text" 
            placeholder="输入保险术语 / Enter term / 保険用語(ほけんようご)を入力(にゅうりょく)" 
            className="flex-1 px-4 py-3 bg-white rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder:text-xs"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button 
            onClick={handleSearch}
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2 whitespace-nowrap"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Search className="w-5 h-5" />}
            <span><FormattedText text="问AI / Ask / 質問(しつもん)" /></span>
          </button>
        </div>
        
        <div className="mb-6 flex flex-wrap gap-2">
            {commonTopics.map(t => (
              <button 
                key={t}
                onClick={() => setTopic(t.split(' / ')[0])}
                className="px-3 py-1.5 bg-slate-100 text-slate-600 text-xs rounded-full hover:bg-slate-200 border border-slate-200 transition-colors text-left"
              >
                <FormattedText text={t} />
              </button>
            ))}
        </div>

        {explanation && (
          <div className="mt-8 p-6 bg-slate-50 rounded-xl border border-slate-200 prose prose-blue max-w-none">
             <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600"/>
                <FormattedText text="AI 解说 / AI Explanation / AI解説(かいせつ)" />
             </h3>
             <div className="whitespace-pre-line text-slate-700 leading-relaxed text-sm">
               <FormattedText text={explanation} />
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

// 5. Simulation & Underwriting
const SimulationView: React.FC<{ addPolicy: (p: Policy) => void; setView: (v: ViewState) => void }> = ({ addPolicy, setView }) => {
  const [formData, setFormData] = useState({ age: 30, gender: '男 / Male / 男性', category: InsuranceCategory.MEDICAL, needs: '希望加强手术和癌症保障 / Focus on surgery & cancer / 手術(しゅじゅつ)とがん保障(ほしょう)を重視(じゅうし)' });
  const [loading, setLoading] = useState(false);
  const [proposal, setProposal] = useState<any>(null);

  const handleSimulate = async () => {
    setLoading(true);
    const result = await GeminiService.generateProposal(formData.age, formData.gender, formData.category, formData.needs);
    setProposal(result);
    setLoading(false);
  };

  const handleApply = () => {
    if (!proposal) return;
    const newPolicy: Policy = {
      id: `POL-${Date.now()}`,
      productId: 'custom_ai_prod',
      productName: proposal.planName,
      category: formData.category,
      contractorName: '山田 太郎 / Yamada Taro',
      insuredName: '山田 太郎 / Yamada Taro',
      beneficiary: '山田 花子 / Yamada Hanako',
      startDate: new Date().toISOString().split('T')[0],
      status: 'Active',
      premium: proposal.premium,
      coverageAmount: proposal.coverageDetails.split('\n')[0] || '详见条款 / See details / 詳細(しょうさい)参照(さんしょう)',
      specialConditions: proposal.coverageDetails
    };
    addPolicy(newPolicy);
    setView('MY_PAGE');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-6"><FormattedText text="保费试算 / Get a Quote / 試算(しさん)" /></h2>
        <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1"><FormattedText text="保险类别 / Category / 保険種類(ほけんしゅるい)" /></label>
            <select 
              className="w-full bg-white border-slate-300 rounded-lg p-2 border focus:ring-blue-500 text-sm"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value as InsuranceCategory})}
            >
              {Object.values(InsuranceCategory).map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1"><FormattedText text="年龄 / Age / 年齢(ねんれい)" /></label>
              <input 
                type="number" 
                className="w-full bg-white border-slate-300 rounded-lg p-2 border" 
                value={formData.age}
                onChange={(e) => setFormData({...formData, age: parseInt(e.target.value)})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1"><FormattedText text="性别 / Gender / 性別(せいべつ)" /></label>
              <select 
                className="w-full bg-white border-slate-300 rounded-lg p-2 border text-sm"
                value={formData.gender}
                onChange={(e) => setFormData({...formData, gender: e.target.value})}
              >
                <option>男 / Male / 男性(だんせい)</option>
                <option>女 / Female / 女性(じょせい)</option>
              </select>
            </div>
          </div>
          <div>
             <label className="block text-sm font-medium text-slate-700 mb-1"><FormattedText text="需求与顾虑 / Needs / ニーズ・懸念(けねん)" /></label>
             <textarea 
               className="w-full bg-white border-slate-300 rounded-lg p-2 border h-24 text-sm"
               value={formData.needs}
               onChange={(e) => setFormData({...formData, needs: e.target.value})}
               placeholder="e.g. 担心家族癌症史 / Worried about family cancer history / がん家系(かけい)が心配(しんぱい)"
             />
          </div>
          <button 
            onClick={handleSimulate}
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 flex justify-center items-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : <FileText className="w-5 h-5" />}
            <span className="flex flex-col items-center leading-none text-sm">
              <span>生成计划 / Generate Plan</span>
              <span className="text-[10px] font-normal opacity-80"><FormattedText text="プランを作成(さくせい)" /></span>
            </span>
          </button>
        </div>
      </div>

      <div className="flex flex-col h-full">
         <h2 className="text-2xl font-bold text-slate-900 mb-6 lg:invisible">Results</h2>
         {proposal ? (
           <div className="bg-white p-6 rounded-2xl shadow-xl border-t-4 border-blue-500 flex-1 flex flex-col animate-fade-in">
             <div className="mb-4">
               <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded uppercase tracking-wide"><FormattedText text="建议方案 / Proposal / 提案(ていあん)" /></span>
               <h3 className="text-xl font-bold text-slate-900 mt-2"><FormattedText text={proposal.planName} /></h3>
               <p className="text-3xl font-bold text-slate-900 mt-4">¥{proposal.premium.toLocaleString()} <span className="text-sm font-normal text-slate-500">/ 月 (Month/月)</span></p>
             </div>
             
             <div className="space-y-4 mb-8 flex-1 overflow-y-auto max-h-80">
               <div className="p-4 bg-slate-50 rounded-lg">
                 <h4 className="font-semibold text-slate-800 mb-2 text-sm"><FormattedText text="保障亮点 / Coverage / 保障内容(ほしょうないよう)" /></h4>
                 <p className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed"><FormattedText text={proposal.coverageDetails} /></p>
               </div>
               <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                 <h4 className="font-semibold text-yellow-800 mb-2 text-sm"><FormattedText text="AI 顾问 / Advisor / AIアドバイザー" /></h4>
                 <p className="text-sm text-yellow-700 italic leading-relaxed">"<FormattedText text={proposal.advice} />"</p>
               </div>
             </div>

             <button 
               onClick={handleApply}
               className="w-full py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 shadow-lg transform transition hover:-translate-y-1 flex flex-col items-center justify-center leading-none gap-1"
             >
               <span>申请投保 / Apply</span>
               <span className="text-xs font-normal opacity-80"><FormattedText text="申(もう)し込(こ)む" /></span>
             </button>
           </div>
         ) : (
           <div className="h-full bg-slate-100 rounded-2xl border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 p-8 text-center text-sm">
             <FormattedText text={`运行模拟以查看量身定制的保险建议。<br/>
             Run simulation to see proposal.<br/>
             シミュレーションを実行(じっこう)して提案(ていあん)を見(み)る。`} />
           </div>
         )}
      </div>
    </div>
  );
};

// 6. My Page (Admin)
const MyPageView: React.FC<{ policies: Policy[] }> = ({ policies }) => (
  <div className="max-w-6xl mx-auto px-4 py-8">
     <div className="flex flex-col sm:flex-row justify-between items-end mb-8 gap-4">
      <div>
        <h2 className="text-2xl font-bold text-slate-900"><FormattedText text="我的主页 / My Page / マイページ" /></h2>
        <p className="text-slate-600 mt-1 text-sm"><FormattedText text="管理您的有效合同和手续。<br/>Manage active contracts.<br/>契約(けいやく)と手続(てつづ)きを管理(かんり)。" /></p>
      </div>
      <div className="text-right bg-slate-100 p-4 rounded-lg">
        <p className="text-xs text-slate-500"><FormattedText text="月保费总额 / Total Monthly / 月額合計(げつがくごうけい)" /></p>
        <p className="text-2xl font-bold text-slate-900">
          ¥{policies.reduce((acc, p) => acc + (p.status === 'Active' ? p.premium : 0), 0).toLocaleString()}
        </p>
      </div>
    </div>

    {policies.length === 0 ? (
      <div className="text-center py-20 bg-white rounded-xl shadow border border-slate-200">
        <div className="inline-block p-4 bg-slate-100 rounded-full mb-4">
          <FileText className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-medium text-slate-900"><FormattedText text="暂无有效保单 / No Policies / 契約(けいやく)なし" /></h3>
        <p className="text-slate-500"><FormattedText text="去“试算”创建新合同。<br/>Go to Simulation to create one.<br/>試算(しさん)で契約(けいやく)を作成(さくせい)。" /></p>
      </div>
    ) : (
      <div className="grid gap-6">
        {policies.map(policy => (
          <div key={policy.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col md:flex-row">
             <div className="p-6 flex-1">
               <div className="flex justify-between items-start mb-4">
                 <div className="flex items-center gap-3">
                   {CATEGORY_ICONS[policy.category]}
                   <div>
                     <h3 className="text-lg font-bold text-slate-900 leading-snug"><FormattedText text={policy.productName} /></h3>
                     <p className="text-xs text-slate-500 font-mono">ID: {policy.id}</p>
                   </div>
                 </div>
                 <span className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                   policy.status === 'Active' ? 'bg-green-100 text-green-800' : 
                   policy.status === 'Claimed' ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-800'
                 }`}>
                   {policy.status}
                 </span>
               </div>
               
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs sm:text-sm mt-4">
                 <div>
                   <p className="text-slate-500 text-[10px] uppercase"><FormattedText text="被保人 / Insured / 被保険者" /></p>
                   <p className="font-medium"><FormattedText text={policy.insuredName} /></p>
                 </div>
                 <div>
                   <p className="text-slate-500 text-[10px] uppercase"><FormattedText text="受益人 / Beneficiary / 受取人" /></p>
                   <p className="font-medium"><FormattedText text={policy.beneficiary} /></p>
                 </div>
                 <div>
                   <p className="text-slate-500 text-[10px] uppercase"><FormattedText text="月保费 / Premium / 保険料" /></p>
                   <p className="font-medium">¥{policy.premium.toLocaleString()}</p>
                 </div>
                 <div>
                    <p className="text-slate-500 text-[10px] uppercase"><FormattedText text="生效日 / Start / 開始日" /></p>
                    <p className="font-medium">{policy.startDate}</p>
                 </div>
               </div>
               
               <div className="mt-4 pt-4 border-t border-slate-100">
                 <p className="text-xs text-slate-500 mb-1"><FormattedText text="保障内容 / Coverage Details / 保障内容" /></p>
                 <p className="text-sm text-slate-700 whitespace-pre-wrap"><FormattedText text={policy.specialConditions} /></p>
               </div>
             </div>
             
             <div className="bg-slate-50 p-6 flex flex-col justify-center gap-2 border-l border-slate-100 min-w-[220px]">
                <button className="w-full py-2 px-4 bg-white border border-slate-300 text-slate-700 rounded text-xs hover:bg-slate-50 font-medium text-left">
                  <FormattedText text={`地址变更 / Address Change<br/>住所変更(じゅうしょへんこう)`} />
                </button>
                <button className="w-full py-2 px-4 bg-white border border-slate-300 text-slate-700 rounded text-xs hover:bg-slate-50 font-medium text-left">
                  <FormattedText text={`受益人变更 / Beneficiary Change<br/>受取人変更(うけとりにんへんこう)`} />
                </button>
                <button className="w-full py-2 px-4 bg-white border border-slate-300 text-slate-700 rounded text-xs hover:bg-slate-50 font-medium text-red-600 hover:text-red-700 hover:border-red-200 text-left">
                   <FormattedText text={`解约 / Surrender<br/>解約(かいやく)`} />
                </button>
             </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

// 7. Claims Center (AI Adjudication)
const ClaimsView: React.FC<{ policies: Policy[]; addClaim: (c: Claim) => void; claims: Claim[] }> = ({ policies, addClaim, claims }) => {
  const [selectedPolicyId, setSelectedPolicyId] = useState('');
  const [incidentDesc, setIncidentDesc] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleSubmitClaim = async () => {
    if (!selectedPolicyId || !incidentDesc) return;
    const policy = policies.find(p => p.id === selectedPolicyId);
    if (!policy) return;

    setProcessing(true);
    const result = await GeminiService.adjudicateClaim(policy, incidentDesc);
    
    const newClaim: Claim = {
      id: `CLM-${Date.now()}`,
      policyId: policy.id,
      dateOfIncident: new Date().toISOString().split('T')[0],
      incidentDescription: incidentDesc,
      status: result.status,
      assessmentResult: result.reasoning,
      payoutAmount: result.amount
    };

    addClaim(newClaim);
    setProcessing(false);
    setIncidentDesc('');
    setSelectedPolicyId('');
  };

  const activePolicies = policies.filter(p => p.status === 'Active');

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
       {/* Submission Form */}
       <div>
         <h2 className="text-2xl font-bold text-slate-900 mb-6"><FormattedText text="申请理赔 / File Claim / 事故報告(じこほうこく)" /></h2>
         <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200">
            {activePolicies.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-sm">
                <FormattedText text="需要有效的保单才能申请理赔。<br/>Need active policy.<br/>有効(ゆうこう)な契約(けいやく)が必要(ひつよう)です。" />
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1"><FormattedText text="选择保单 / Select Policy / 契約選択(けいやくせんたく)" /></label>
                  <select 
                    className="w-full bg-white border-slate-300 rounded-lg p-2 border text-sm"
                    value={selectedPolicyId}
                    onChange={(e) => setSelectedPolicyId(e.target.value)}
                  >
                    <option value="">-- Select --</option>
                    {activePolicies.map(p => (
                      <option key={p.id} value={p.id}>{p.productName} ({p.id})</option>
                    ))}
                  </select>
                </div>
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1"><FormattedText text="事故描述 / Description / 事故状況(じこじょうきょう)" /></label>
                   <p className="text-xs text-slate-500 mb-2"><FormattedText text="描述时间、地点和经过。<br/>Describe when, where, and what happened.<br/>いつ、どこで、何(なに)があったか。" /></p>
                   <textarea 
                     className="w-full bg-white border-slate-300 rounded-lg p-2 border h-32 text-sm"
                     placeholder="e.g. Last Monday, I was hospitalized for surgery... / 上周一住院手术... / 先週(せんしゅう)の月曜(げつよう)に入院(にゅういん)..."
                     value={incidentDesc}
                     onChange={(e) => setIncidentDesc(e.target.value)}
                   />
                </div>
                <button 
                  onClick={handleSubmitClaim}
                  disabled={processing || !selectedPolicyId}
                  className="w-full py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 disabled:opacity-50 flex justify-center items-center gap-2"
                >
                  {processing ? <Loader2 className="animate-spin" /> : <AlertTriangle className="w-5 h-5" />}
                  <span className="flex flex-col items-center leading-none">
                    <span>提交给理赔部 / Submit to Assessment</span>
                    <span className="text-[10px] font-normal opacity-80"><FormattedText text="査定部(さていぶ)へ送信(そうしん)" /></span>
                  </span>
                </button>
              </div>
            )}
         </div>
       </div>

       {/* History */}
       <div className="flex flex-col h-full">
         <h2 className="text-2xl font-bold text-slate-900 mb-6"><FormattedText text="理赔记录 / History / 請求履歴(せいきゅうりれき)" /></h2>
         <div className="space-y-4 flex-1 overflow-y-auto pr-2 max-h-[600px]">
            {claims.length === 0 ? (
               <div className="text-slate-400 text-center mt-10 text-sm"><FormattedText text="暂无记录 / No claims / 履歴(りれき)なし" /></div>
            ) : (
              claims.map((claim) => (
                <div key={claim.id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs text-slate-400 font-mono">{claim.id}</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                      claim.status === 'Approved' ? 'bg-green-100 text-green-700' :
                      claim.status === 'Denied' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {claim.status}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-800 font-medium mb-2 line-clamp-2">Case: {claim.incidentDescription}</p>
                  
                  {claim.assessmentResult && (
                    <div className="mt-3 bg-slate-50 p-3 rounded text-sm">
                      <p className="font-bold text-slate-700 mb-1 text-xs"><FormattedText text="评估结果 / Result / 査定結果(さていけっか):" /></p>
                      <p className="text-slate-600 mb-2 text-xs leading-relaxed"><FormattedText text={claim.assessmentResult} /></p>
                      {claim.status === 'Approved' && (
                        <div className="flex items-center gap-2 text-green-600 font-bold border-t border-slate-200 pt-2 text-sm">
                          <CheckCircle2 className="w-5 h-5" />
                          Payout: ¥{claim.payoutAmount?.toLocaleString()}
                        </div>
                      )}
                      {claim.status === 'Denied' && (
                        <div className="flex items-center gap-2 text-red-600 font-bold border-t border-slate-200 pt-2 text-sm">
                          <XCircle className="w-5 h-5" />
                          Payout: ¥0
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
         </div>
       </div>
    </div>
  );
};


// --- Main App ---
function App() {
  const [view, setView] = useState<ViewState>('HOME');
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [claims, setClaims] = useState<Claim[]>([]);

  const addPolicy = (policy: Policy) => {
    setPolicies(prev => [...prev, policy]);
  };

  const addClaim = (claim: Claim) => {
    setClaims(prev => [claim, ...prev]);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-10">
      <Navbar currentView={view} setView={setView} />
      
      <main className="animate-fade-in">
        {view === 'HOME' && <HomeView setView={setView} />}
        {view === 'PRODUCTS' && <ProductsView />}
        {view === 'LEARN' && <LearnView />}
        {view === 'SIMULATION' && <SimulationView addPolicy={addPolicy} setView={setView} />}
        {view === 'MY_PAGE' && <MyPageView policies={policies} />}
        {view === 'CLAIMS_CENTER' && <ClaimsView policies={policies} addClaim={addClaim} claims={claims} />}
      </main>

      <footer className="bg-slate-900 text-slate-400 py-8 mt-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="mb-2 font-bold text-slate-300"><FormattedText text="日本保险学院 / Nihon Hoken Academy / 日本保険(にほんほけん)アカデミー" /></p>
          <p className="text-xs text-slate-500 mb-4">Powered by Gemini AI. Educational use only.<br/>教育目的のみ。実際の金融アドバイスではありません。</p>
          
          <div className="mt-6 pt-6 border-t border-slate-800 flex justify-center items-center gap-2 text-xs">
            <span className="text-slate-500"><FormattedText text="Friend Link / 友情链接 / リンク:" /></span>
            <a 
              href="https://my-portfolio-beige-five-56.vercel.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 transition-colors font-medium flex items-center gap-1"
            >
              千葉２狗 🐶
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
