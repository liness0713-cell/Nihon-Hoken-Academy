
import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Sparkles, 
  Volume2, 
  Search, 
  BookOpen, 
  ChevronRight, 
  Menu,
  ArrowLeft,
  GraduationCap,
  Calculator,
  User,
  AlertTriangle,
  FileText,
  CheckCircle,
  XCircle,
  Plus,
  Plane,
  Dog,
  Bike,
  Flag,
  Zap,
  School,
  Landmark,
  Briefcase,
  HeartHandshake,
  Calendar,
  CreditCard,
  Users,
  FileCheck,
  HelpCircle,
  Clock
} from 'lucide-react';
import * as GeminiService from './services/geminiService';
import { InsuranceLesson, TrilingualContent, InsuranceProduct, Policy, SimulationResult, ClaimResult, InsuranceCategory } from './types';
import { MOCK_PRODUCTS, CATEGORY_ICONS } from './constants';

// --- Ruby Text Component ---
const RubySegment: React.FC<{ text: string }> = ({ text }) => {
  // Regex: Kanji followed by (Kana)
  const rubyRegex = /([\u4e00-\u9faf\u3005]+)\s*\(([ \u3040-\u309f\u30a0-\u30ff]+)\)/g;
  
  const parts = [];
  let lastIndex = 0;
  let match;
  
  while ((match = rubyRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    parts.push(
      <ruby key={match.index} className="mx-0.5 font-medium">
         {match[1]}
         <rt className="text-[0.6em] text-indigo-400 select-none font-normal border-b border-indigo-50/0">{match[2]}</rt>
      </ruby>
    );
    lastIndex = rubyRegex.lastIndex;
  }
  
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }
  
  return <>{parts.length > 0 ? parts : text}</>;
};

// --- Audio Button ---
const AudioButton: React.FC<{ text: string; lang: 'cn' | 'en' | 'jp' }> = ({ text, lang }) => {
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePlay = async () => {
    if (playing || loading) return;
    setLoading(true);
    try {
      // Clean text for TTS (remove ruby parens)
      const cleanText = text.replace(/\([^\)]+\)/g, '');
      const buffer = await GeminiService.generateSpeech(cleanText, lang);
      if (buffer) {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);
        source.onended = () => setPlaying(false);
        source.start(0);
        setPlaying(true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handlePlay}
      disabled={loading || playing}
      className={`p-1.5 rounded-full transition-all flex items-center justify-center ${
        playing ? 'bg-indigo-100 text-indigo-600' : 
        loading ? 'bg-slate-100 text-slate-400' : 'bg-slate-50 text-slate-400 hover:bg-indigo-50 hover:text-indigo-500'
      }`}
      title="Read Aloud"
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-slate-300 border-t-indigo-500 rounded-full animate-spin" />
      ) : (
        <Volume2 className={`w-4 h-4 ${playing ? 'animate-pulse' : ''}`} />
      )}
    </button>
  );
};

// --- Trilingual Content Block ---
const TrilingualBlock: React.FC<{ 
  content: TrilingualContent; 
  title?: boolean;
}> = ({ content, title = false }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
      {/* Chinese */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between border-b border-red-100 pb-1">
          <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded">CN</span>
          <AudioButton text={content.cn} lang="cn" />
        </div>
        <p className={`${title ? 'text-lg font-bold' : 'text-sm leading-relaxed'} text-slate-700`}>
          {content.cn}
        </p>
      </div>

      {/* English */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between border-b border-blue-100 pb-1">
          <span className="text-xs font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded">EN</span>
          <AudioButton text={content.en} lang="en" />
        </div>
        <p className={`${title ? 'text-lg font-bold' : 'text-sm leading-relaxed'} text-slate-700`}>
          {content.en}
        </p>
      </div>

      {/* Japanese */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between border-b border-emerald-100 pb-1">
          <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded">JP</span>
          <AudioButton text={content.jp} lang="jp" />
        </div>
        <p className={`${title ? 'text-lg font-bold' : 'text-sm leading-relaxed'} text-slate-700 font-jp`}>
          <RubySegment text={content.jp} />
        </p>
      </div>
    </div>
  );
};

// --- Helper Functions ---
function generateRandomName(gender: string): string {
  const familyNames = ['Sato', 'Suzuki', 'Takahashi', 'Tanaka', 'Watanabe', 'Ito', 'Yamamoto'];
  const maleNames = ['Hiroshi', 'Kenji', 'Takumi', 'Ren', 'Haruto', 'Sota'];
  const femaleNames = ['Sakura', 'Yui', 'Hina', 'Aoi', 'Mei', 'Riko'];
  
  const family = familyNames[Math.floor(Math.random() * familyNames.length)];
  const given = gender === 'Female' 
    ? femaleNames[Math.floor(Math.random() * femaleNames.length)] 
    : maleNames[Math.floor(Math.random() * maleNames.length)];
    
  return `${family} ${given}`;
}

function getRandomPaymentMethod(): string {
  const methods = ['Credit Card (Visa)', 'Credit Card (Mastercard)', 'Bank Transfer', 'Convenience Store'];
  return methods[Math.floor(Math.random() * methods.length)];
}

function getPeriodForCategory(cat: InsuranceCategory): string {
  if (cat === InsuranceCategory.LIFE || cat === InsuranceCategory.MEDICAL || cat === InsuranceCategory.CANCER) return 'Lifetime (Whole Life)';
  if (cat === InsuranceCategory.CAR || cat === InsuranceCategory.FIRE) return '1 Year (Auto-renew)';
  return '1 Year';
}

// --- Sub-Features Components ---

interface SimulationViewProps {
  product: InsuranceProduct;
  onBack: () => void;
  onSubscribe: (policy: Policy) => void;
}

const SimulationView: React.FC<SimulationViewProps> = ({ product, onBack, onSubscribe }) => {
  const [age, setAge] = useState(30);
  const [gender, setGender] = useState('Male');
  const [concerns, setConcerns] = useState('');
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleSimulate = async () => {
    setLoading(true);
    try {
      const res = await GeminiService.generateSimulation(product.name.en, age, gender, concerns);
      setResult(res);
      // Async image
      const img = await GeminiService.generateVisualAid(res.visualPrompt);
      setImageUrl(img);
    } catch (e) {
      alert("Simulation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleContract = () => {
    if (!result) return;
    
    // Generate Random Policy Details
    const startDate = new Date();
    const expiryDate = new Date(startDate);
    expiryDate.setFullYear(startDate.getFullYear() + 1);
    const nextPay = new Date(startDate);
    nextPay.setMonth(startDate.getMonth() + 1);

    const period = getPeriodForCategory(product.category);
    
    const newPolicy: Policy = {
      id: `POL-${Math.floor(Math.random() * 100000).toString().padStart(6, '0')}`,
      policyNumber: `${product.category.substring(0,3)}-${Date.now().toString().slice(-6)}-${Math.floor(Math.random()*99)}`,
      productId: product.id,
      productName: product.name,
      planName: result.planName,
      analysis: result.analysis,
      status: 'ACTIVE',
      premium: result.monthlyPremium,
      startDate: startDate.toISOString().split('T')[0],
      expiryDate: period.includes('Life') ? 'Indefinite' : expiryDate.toISOString().split('T')[0],
      period: period,
      holderName: generateRandomName(gender),
      beneficiary: 'Legal Heir', // Default
      paymentMethod: getRandomPaymentMethod(),
      nextPaymentDate: nextPay.toISOString().split('T')[0],
      visualUrl: imageUrl || undefined
    };
    onSubscribe(newPolicy);
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto p-6 md:p-12 pb-24">
        <button onClick={onBack} className="text-slate-400 hover:text-slate-700 mb-6 flex items-center gap-1 text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Products
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-8 border-b border-slate-100">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Quote Simulator</h2>
            <p className="text-slate-500">Calculate premium for {product.name.en}</p>
          </div>

          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="space-y-6">
               <div>
                 <label className="block text-sm font-medium text-slate-700 mb-2">Age</label>
                 <input 
                   type="number" 
                   value={age} 
                   onChange={e => setAge(parseInt(e.target.value))}
                   className="w-full p-3 border rounded-lg bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none"
                 />
               </div>
               <div>
                 <label className="block text-sm font-medium text-slate-700 mb-2">Gender</label>
                 <select 
                   value={gender} 
                   onChange={e => setGender(e.target.value)}
                   className="w-full p-3 border rounded-lg bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none"
                 >
                   <option>Male</option>
                   <option>Female</option>
                 </select>
               </div>
               <div>
                 <label className="block text-sm font-medium text-slate-700 mb-2">Needs & Concerns</label>
                 <textarea 
                   value={concerns} 
                   onChange={e => setConcerns(e.target.value)}
                   className="w-full p-3 border rounded-lg bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none resize-none h-24"
                   placeholder="e.g. I travel often, I have a history of back pain, I want cheap coverage..."
                 />
               </div>
               <button 
                 onClick={handleSimulate}
                 disabled={loading}
                 className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-slate-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
               >
                 {loading ? <span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full"/> : <Calculator className="w-4 h-4" />}
                 {loading ? 'Analyzing...' : 'Calculate Premium'}
               </button>
             </div>

             {/* Result Area */}
             <div className="bg-slate-50 rounded-xl p-6 min-h-[300px] flex flex-col items-center justify-center relative border border-slate-100">
                
                {!loading && !result && <div className="text-slate-400 text-center">Enter your details to generate a personalized AI quote.</div>}

                {result && (
                  <div className="w-full space-y-6 animate-fadeIn">
                     {imageUrl && (
                       <div className="rounded-lg overflow-hidden shadow-sm h-32 w-full mb-4">
                         <img src={imageUrl} className="w-full h-full object-cover" />
                       </div>
                     )}
                     <div className="text-center">
                       <div className="text-3xl font-bold text-indigo-600">¥{result.monthlyPremium.toLocaleString()}</div>
                       <div className="text-sm text-slate-500">Estimated Monthly Premium</div>
                     </div>
                     
                     <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-100">
                       <h3 className="text-xs font-bold text-slate-400 uppercase mb-3">AI Plan Analysis</h3>
                       <TrilingualBlock content={result.analysis} />
                     </div>

                     <button 
                       onClick={handleContract}
                       className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                     >
                       Sign Contract & Add to MyPage
                     </button>
                  </div>
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ClaimsView: React.FC<{ policies: Policy[] }> = ({ policies }) => {
  const [incident, setIncident] = useState('');
  const [selectedPolicyId, setSelectedPolicyId] = useState<string>(policies[0]?.id || '');
  const [result, setResult] = useState<ClaimResult | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (policies.length > 0 && !selectedPolicyId) {
      setSelectedPolicyId(policies[0].id);
    }
  }, [policies]);

  const handleSubmit = async () => {
    if (!incident.trim() || !selectedPolicyId) return;
    const policy = policies.find(p => p.id === selectedPolicyId);
    if (!policy) return;

    setLoading(true);
    try {
      const res = await GeminiService.assessClaim(incident, policy);
      setResult(res);
    } catch (e) {
      alert("Error assessing claim");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: ClaimResult['status']) => {
    switch (status) {
      case 'APPROVED': return 'text-green-600 border-green-100 bg-green-50';
      case 'DENIED': return 'text-red-600 border-red-100 bg-red-50';
      case 'NEED_MORE_INFO': return 'text-blue-600 border-blue-100 bg-blue-50';
      case 'UNDER_REVIEW': return 'text-orange-600 border-orange-100 bg-orange-50';
      default: return 'text-slate-600 border-slate-100 bg-slate-50';
    }
  };

  const getStatusIcon = (status: ClaimResult['status']) => {
    switch (status) {
      case 'APPROVED': return <CheckCircle className="w-6 h-6" />;
      case 'DENIED': return <XCircle className="w-6 h-6" />;
      case 'NEED_MORE_INFO': return <FileCheck className="w-6 h-6" />;
      case 'UNDER_REVIEW': return <Clock className="w-6 h-6" />;
      default: return <HelpCircle className="w-6 h-6" />;
    }
  };

  if (policies.length === 0) {
    return (
      <div className="h-full overflow-y-auto">
        <div className="max-w-4xl mx-auto p-12 text-center">
           <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 inline-block">
              <Shield className="w-16 h-16 text-slate-200 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-slate-800 mb-2">No Active Policies</h2>
              <p className="text-slate-500 mb-6">You need to subscribe to a policy before you can file a claim.</p>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto p-6 md:p-12 pb-24">
        <h2 className="text-3xl font-bold text-slate-800 mb-8 flex items-center gap-3">
          <AlertTriangle className="text-orange-500" />
          File a Claim
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Select Policy</label>
              <select 
                value={selectedPolicyId} 
                onChange={e => setSelectedPolicyId(e.target.value)}
                className="w-full p-3 border rounded-xl bg-white focus:ring-2 focus:ring-orange-500 outline-none shadow-sm"
              >
                {policies.map(p => (
                  <option key={p.id} value={p.id}>{p.productName.en} - {p.policyNumber}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Describe Incident</label>
              <textarea 
                value={incident}
                onChange={e => setIncident(e.target.value)}
                className="w-full h-48 p-4 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-orange-500 outline-none resize-none"
                placeholder="Describe exactly what happened (date, location, damage)..."
              />
            </div>
            
            <button 
              onClick={handleSubmit}
              disabled={loading || !incident}
              className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-all disabled:opacity-50 shadow-lg shadow-slate-200"
            >
              {loading ? 'AI Adjuster Analyzing...' : 'Submit Claim for Review'}
            </button>
          </div>

          <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm min-h-[300px]">
            {!result && !loading && (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center p-8">
                <FileText className="w-12 h-12 mb-4 opacity-20" />
                <p>The AI Adjuster will assess your claim and determine if it can be Approved, Denied, or if More Info is needed.</p>
              </div>
            )}
            
            {loading && (
              <div className="h-full flex flex-col items-center justify-center">
                <div className="w-10 h-10 border-4 border-orange-100 border-t-orange-500 rounded-full animate-spin mb-4" />
                <p className="text-slate-500 animate-pulse">Cross-referencing Policy Details...</p>
              </div>
            )}

            {result && (
              <div className="space-y-6 animate-fadeIn">
                <div className={`flex items-center gap-3 text-lg font-bold border rounded-lg p-4 ${getStatusColor(result.status)}`}>
                  {getStatusIcon(result.status)}
                  <span>
                    {result.status === 'APPROVED' && 'Claim Approved'}
                    {result.status === 'DENIED' && 'Claim Denied'}
                    {result.status === 'UNDER_REVIEW' && 'Accepted for Review'}
                    {result.status === 'NEED_MORE_INFO' && 'More Info Required'}
                  </span>
                </div>

                <div className="space-y-6">
                  <div>
                     <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Decision Rationale</h4>
                     <TrilingualBlock content={result.explanation} />
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg">
                     <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Next Steps</h4>
                     <TrilingualBlock content={result.nextSteps} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const MyPageView: React.FC<{ policies: Policy[] }> = ({ policies }) => {
  if (policies.length === 0) {
    return (
      <div className="h-full overflow-y-auto">
        <div className="max-w-4xl mx-auto p-12 text-center">
           <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 inline-block">
              <Shield className="w-16 h-16 text-slate-200 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-slate-800 mb-2">No Policies Found</h2>
              <p className="text-slate-500 mb-6">Simulate a product and sign a contract to see it here.</p>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-5xl mx-auto p-6 md:p-12 pb-24">
        <h2 className="text-3xl font-bold text-slate-800 mb-8 flex items-center gap-3">
          <User className="text-indigo-600" />
          My Insurance Portfolio
        </h2>

        <div className="grid gap-6">
          {policies.map((policy) => (
            <div key={policy.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col md:flex-row">
              {/* Visual Side */}
              <div className="w-full md:w-64 bg-slate-50 shrink-0 border-r border-slate-100 flex flex-col">
                {policy.visualUrl ? (
                   <img src={policy.visualUrl} className="w-full h-40 md:h-48 object-cover" alt="Policy Visual" />
                ) : (
                   <div className="w-full h-40 md:h-48 flex items-center justify-center">
                     <Shield className="text-slate-300 w-12 h-12" />
                   </div>
                )}
                <div className="p-4 flex-1 flex flex-col justify-center text-center bg-indigo-50/50">
                   <div className="text-xs text-slate-400 uppercase tracking-wide mb-1">Monthly Premium</div>
                   <div className="text-xl font-bold text-slate-800">¥{policy.premium.toLocaleString()}</div>
                   <div className="text-[10px] text-slate-400 mt-1">Next Payment: {policy.nextPaymentDate}</div>
                </div>
              </div>
              
              {/* Details Side */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                 <div>
                    <div className="flex items-center justify-between mb-3">
                       <span className="font-mono text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded">
                         {policy.policyNumber}
                       </span>
                       <span className="px-2.5 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full border border-green-200">
                         {policy.status}
                       </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-slate-900 mb-1">{policy.productName.en}</h3>
                    <p className="text-sm text-slate-500 mb-4">{policy.productName.jp}</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-6 bg-slate-50 p-4 rounded-lg border border-slate-100">
                       <div>
                         <div className="text-xs text-slate-400 mb-1 flex items-center gap-1"><User className="w-3 h-3"/> Insured</div>
                         <div className="font-medium text-slate-700">{policy.holderName}</div>
                       </div>
                       <div>
                         <div className="text-xs text-slate-400 mb-1 flex items-center gap-1"><Clock className="w-3 h-3"/> Period</div>
                         <div className="font-medium text-slate-700">{policy.period}</div>
                       </div>
                       <div>
                         <div className="text-xs text-slate-400 mb-1 flex items-center gap-1"><HeartHandshake className="w-3 h-3"/> Beneficiary</div>
                         <div className="font-medium text-slate-700">{policy.beneficiary}</div>
                       </div>
                       <div>
                         <div className="text-xs text-slate-400 mb-1 flex items-center gap-1"><CreditCard className="w-3 h-3"/> Method</div>
                         <div className="font-medium text-slate-700 truncate">{policy.paymentMethod}</div>
                       </div>
                    </div>
                 </div>
                 
                 <div>
                   <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Plan Analysis</h4>
                   <TrilingualBlock content={policy.analysis} />
                 </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


// --- MAIN APP ---

type ViewState = 'HOME' | 'SIMULATE' | 'LESSON' | 'CLAIMS' | 'MYPAGE';

function App() {
  const [view, setView] = useState<ViewState>('HOME');
  const [selectedProduct, setSelectedProduct] = useState<InsuranceProduct | null>(null);
  const [lesson, setLesson] = useState<InsuranceLesson | null>(null);
  const [navOpen, setNavOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [myPolicies, setMyPolicies] = useState<Policy[]>([]);

  // Load policies from Local Storage on mount
  useEffect(() => {
    const stored = localStorage.getItem('nihon_hoken_policies');
    if (stored) {
      try {
        setMyPolicies(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to load policies", e);
      }
    }
  }, []);

  const savePolicy = (policy: Policy) => {
    const updated = [policy, ...myPolicies];
    setMyPolicies(updated);
    localStorage.setItem('nihon_hoken_policies', JSON.stringify(updated));
    setView('MYPAGE');
  };

  // --- Handlers ---
  const handleSimulateSelect = (p: InsuranceProduct) => {
    setSelectedProduct(p);
    setView('SIMULATE');
  };

  const handleConsult = async (query: string, product?: InsuranceProduct) => {
    setLoading(true);
    setView('LESSON');
    try {
      // Pass product context and ID to the service
      const newLesson = await GeminiService.generateInsuranceLesson(query, product?.name.en, product?.id);
      
      // Async load image
      GeminiService.generateVisualAid(newLesson.visualPrompt).then(url => {
        setLesson(prev => prev ? { ...prev, mediaUrl: url } : prev);
      });
      setLesson(newLesson);
    } catch (e) {
      alert("Error starting lesson");
    } finally {
      setLoading(false);
    }
  };

  const scrollToChapter = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (window.innerWidth < 1024) setNavOpen(false);
    }
  };
  
  // Icon lookup helper that handles OTHER safely
  const getProductIcon = (category: InsuranceCategory) => {
     if (category === InsuranceCategory.OTHER) {
        return <Plane className="w-6 h-6 text-purple-500" />;
     }
     return CATEGORY_ICONS[category];
  };
  
  // Helper specifically for icons in the product grid to differentiate
  const getSpecificIcon = (id: string, category: InsuranceCategory) => {
    if (category === InsuranceCategory.OTHER) {
      if (id.includes('travel')) return <Plane className="w-6 h-6 text-sky-500" />;
      if (id.includes('pet')) return <Dog className="w-6 h-6 text-amber-500" />;
      if (id.includes('bike')) return <Bike className="w-6 h-6 text-lime-500" />;
      if (id.includes('golf')) return <Flag className="w-6 h-6 text-green-600" />;
      if (id.includes('edu')) return <School className="w-6 h-6 text-indigo-400" />;
      if (id.includes('drone')) return <Zap className="w-6 h-6 text-yellow-500" />;
    }
    // Handle others that might reuse categories but have distinct IDs
    if (id.includes('care')) return <HeartHandshake className="w-6 h-6 text-rose-400" />;
    if (id.includes('eq')) return <Landmark className="w-6 h-6 text-stone-500" />;
    if (id.includes('income')) return <Briefcase className="w-6 h-6 text-teal-600" />;

    return CATEGORY_ICONS[category];
  };

  // --- Render Views ---

  const renderHome = () => (
    <main className="h-full overflow-y-auto p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Nihon Hoken Academy</h2>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Experience the future of insurance. Learn, simulate, and manage your policies with AI-powered trilingual support.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_PRODUCTS.map(product => (
            <div 
              key={product.id}
              className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-md hover:border-indigo-100 transition-all flex flex-col group"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-indigo-50 transition-colors">
                  {getSpecificIcon(product.id, product.category)}
                </div>
                <span className="text-xs font-semibold bg-slate-100 text-slate-500 px-2 py-1 rounded">
                  {product.category}
                </span>
              </div>
              <h3 className="font-bold text-lg text-slate-800 mb-2">{product.name.en}</h3>
              <p className="text-xs text-slate-400 mb-4">{product.name.jp}</p>
              <p className="text-sm text-slate-600 line-clamp-3 mb-6">
                {product.description.en}
              </p>
              <div className="mt-auto pt-4 border-t border-slate-50 grid grid-cols-2 gap-3">
                 <button 
                   onClick={() => handleConsult(`What is ${product.name.en}?`, product)}
                   className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors"
                 >
                   <GraduationCap className="w-3.5 h-3.5" /> Learn
                 </button>
                 <button 
                   onClick={() => handleSimulateSelect(product)}
                   className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors"
                 >
                   <Calculator className="w-3.5 h-3.5" /> Simulate
                 </button>
              </div>
            </div>
          ))}
        </div>

        <footer className="mt-16 text-center text-slate-400 text-sm pb-8 border-t border-slate-100 pt-8">
          <p className="mb-2">© 2024 Nihon Hoken Academy</p>
          <a href="https://my-portfolio-beige-five-56.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-600 font-medium inline-flex items-center gap-1">
             千葉２狗 🐶
          </a>
        </footer>
      </div>
    </main>
  );

  const renderLesson = () => (
    <div className="flex h-full relative">
      <main className={`flex-1 overflow-y-auto transition-all duration-300 ${navOpen ? 'lg:mr-80' : ''} bg-white h-full`}>
        <div className="max-w-4xl mx-auto p-6 md:p-12 pb-32">
          {loading ? (
             <div className="flex flex-col items-center justify-center h-96">
                <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-4" />
                <p className="text-slate-500 font-medium animate-pulse">Designing Lesson Plan...</p>
             </div>
          ) : lesson ? (
            <>
               <button onClick={() => setView('HOME')} className="mb-8 text-slate-400 hover:text-indigo-600 flex items-center gap-1"><ArrowLeft className="w-4 h-4"/> Back</button>
               
               {lesson.mediaUrl ? (
                   <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-lg mb-10 bg-slate-100">
                     <img src={lesson.mediaUrl} alt="Visual Aid" className="w-full h-full object-cover" />
                   </div>
                ) : (
                   <div className="w-full aspect-video rounded-2xl bg-slate-100 mb-10 animate-pulse flex items-center justify-center text-slate-300">
                     Visualizing Concept...
                   </div>
                )}

               <header className="mb-12 border-b border-slate-100 pb-8">
                  <div className="flex items-center gap-2 text-indigo-600 mb-4">
                    <GraduationCap className="w-5 h-5" />
                    <span className="text-sm font-bold uppercase tracking-wider">Lesson Mode</span>
                  </div>
                  <TrilingualBlock content={lesson.mainTitle} title />
                </header>

                <div className="space-y-16">
                  {lesson.chapters.map((chapter, idx) => (
                    <section key={chapter.id} id={chapter.id} className="scroll-mt-24 group">
                      <div className="flex items-center gap-4 mb-6">
                        <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm font-bold shadow-md shadow-indigo-200">
                          {idx + 1}
                        </span>
                        <div className="w-full">
                           <TrilingualBlock content={chapter.title} title />
                        </div>
                      </div>
                      <div className="pl-0 md:pl-12 border-l-2 border-slate-100 ml-4 md:ml-0">
                         <div className="pl-4 md:pl-8">
                           <TrilingualBlock content={chapter.content} />
                         </div>
                      </div>
                    </section>
                  ))}
                </div>

                {/* Simulate Button at the end of lesson if linked to a product */}
                {lesson.relatedProductId && (
                   <div className="mt-16 p-8 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                      <h3 className="text-xl font-bold text-slate-800 mb-4">Ready to get protected?</h3>
                      <p className="text-slate-500 mb-6">You've learned the basics. Now calculate your personalized premium.</p>
                      <button 
                        onClick={() => {
                          const product = MOCK_PRODUCTS.find(p => p.id === lesson.relatedProductId);
                          if (product) handleSimulateSelect(product);
                        }}
                        className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
                      >
                         <Calculator className="w-5 h-5" /> Simulate & Subscribe
                      </button>
                   </div>
                )}
            </>
          ) : (
            <div className="text-center text-slate-400 mt-20">Start a lesson by asking a question above.</div>
          )}
        </div>
      </main>

      {/* Side Nav for Lesson */}
      {lesson && (
        <>
          <button 
            onClick={() => setNavOpen(!navOpen)}
            className={`fixed right-6 bottom-20 lg:top-24 lg:bottom-auto z-40 p-3 bg-white shadow-lg rounded-full border border-slate-200 hover:bg-slate-50 transition-all ${navOpen ? 'text-indigo-600 shadow-indigo-100' : 'text-slate-500'}`}
          >
            {navOpen ? <ChevronRight /> : <Menu />}
          </button>
          <aside className={`absolute top-0 right-0 bottom-0 w-80 bg-slate-50 border-l border-slate-200 transform transition-transform duration-300 z-30 ${navOpen ? 'translate-x-0' : 'translate-x-full'} hidden lg:block`}>
             <div className="h-full overflow-y-auto p-6 pt-24">
               <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6 flex items-center gap-2">
                 <BookOpen className="w-4 h-4" /> Chapters
               </h3>
               <nav className="space-y-1">
                  {lesson.chapters.map((chapter, idx) => (
                    <button
                      key={chapter.id}
                      onClick={() => scrollToChapter(chapter.id)}
                      className="w-full text-left p-3 rounded-lg hover:bg-white hover:shadow-sm transition-all group border border-transparent hover:border-slate-100"
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-xs font-mono text-slate-400 mt-1">0{idx + 1}</span>
                        <div>
                          <p className="text-sm font-medium text-slate-700 group-hover:text-indigo-700 line-clamp-1">
                            {chapter.title.en}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </nav>
             </div>
          </aside>
        </>
      )}
    </div>
  );

  return (
    <div className="h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 lg:px-8 z-50 shrink-0">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('HOME')}>
          <div className="bg-indigo-600 text-white p-1.5 rounded-lg">
            <Shield className="w-5 h-5" />
          </div>
          <h1 className="text-lg font-bold text-slate-800 hidden md:block">Nihon Hoken</h1>
        </div>

        {/* Top Center Search */}
        <div className="flex-1 max-w-xl mx-4 relative hidden md:block">
           <input 
             type="text" 
             placeholder="Ask anything about insurance..."
             className="w-full bg-slate-100 border-none rounded-full py-2 pl-10 pr-4 focus:ring-2 focus:ring-indigo-500 outline-none text-sm transition-all"
             onKeyDown={e => {
               if(e.key === 'Enter') handleConsult(e.currentTarget.value);
             }}
           />
           <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setView('MYPAGE')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${view === 'MYPAGE' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <User className="w-4 h-4" /> <span className="hidden sm:inline">My Page</span>
            {myPolicies.length > 0 && <span className="w-2 h-2 bg-red-500 rounded-full absolute top-1 right-1" />}
          </button>
          <button 
            onClick={() => setView('CLAIMS')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${view === 'CLAIMS' ? 'bg-orange-50 text-orange-600' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <AlertTriangle className="w-4 h-4" /> <span className="hidden sm:inline">Claims</span>
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden relative">
        {view === 'HOME' && renderHome()}
        {view === 'SIMULATE' && selectedProduct && (
          <SimulationView 
            product={selectedProduct} 
            onBack={() => setView('HOME')} 
            onSubscribe={savePolicy} 
          />
        )}
        {view === 'CLAIMS' && <ClaimsView policies={myPolicies} />}
        {view === 'MYPAGE' && <MyPageView policies={myPolicies} />}
        {view === 'LESSON' && renderLesson()}
      </div>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden bg-white border-t border-slate-200 flex justify-around p-3 pb-safe">
        <button onClick={() => setView('HOME')} className={`p-2 rounded-xl ${view === 'HOME' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400'}`}><Shield className="w-6 h-6"/></button>
        <button onClick={() => setView('CLAIMS')} className={`p-2 rounded-xl ${view === 'CLAIMS' ? 'text-orange-600 bg-orange-50' : 'text-slate-400'}`}><AlertTriangle className="w-6 h-6"/></button>
        <button onClick={() => setView('MYPAGE')} className={`p-2 rounded-xl ${view === 'MYPAGE' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400'}`}><User className="w-6 h-6"/></button>
      </div>
    </div>
  );
}

export default App;
