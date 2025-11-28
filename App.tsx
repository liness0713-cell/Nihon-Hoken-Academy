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

// --- Sub-components defined in same file for single-file restriction compliance mostly, separated logically ---

// 1. Navigation Bar
const Navbar: React.FC<{ currentView: ViewState; setView: (v: ViewState) => void }> = ({ currentView, setView }) => (
  <nav className="bg-slate-900 text-white shadow-lg sticky top-0 z-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-16">
        <div className="flex items-center cursor-pointer" onClick={() => setView('HOME')}>
          <ShieldCheck className="h-8 w-8 text-blue-400 mr-2" />
          <span className="font-bold text-xl tracking-wide">Nihon Hoken Academy</span>
        </div>
        <div className="hidden md:block">
          <div className="ml-10 flex items-baseline space-x-4">
            <NavButton label="商品一覧 (Products)" active={currentView === 'PRODUCTS'} onClick={() => setView('PRODUCTS')} />
            <NavButton label="学習 (Learn)" active={currentView === 'LEARN'} onClick={() => setView('LEARN')} />
            <NavButton label="試算 (Simulation)" active={currentView === 'SIMULATION'} onClick={() => setView('SIMULATION')} />
            <NavButton label="マイページ (My Page)" active={currentView === 'MY_PAGE'} onClick={() => setView('MY_PAGE')} />
            <NavButton label="事故・請求 (Claims)" active={currentView === 'CLAIMS_CENTER'} onClick={() => setView('CLAIMS_CENTER')} />
          </div>
        </div>
      </div>
    </div>
  </nav>
);

const NavButton: React.FC<{ label: string; active: boolean; onClick: () => void }> = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      active ? 'bg-blue-700 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
    }`}
  >
    {label}
  </button>
);

// 2. Home View
const HomeView: React.FC<{ setView: (v: ViewState) => void }> = ({ setView }) => (
  <div className="space-y-12 pb-12">
    {/* Hero */}
    <div className="relative bg-gradient-to-r from-blue-900 to-slate-800 text-white overflow-hidden rounded-b-3xl shadow-2xl">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop')] opacity-10 bg-cover bg-center" />
      <div className="relative max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6">
          日本の保険を、<span className="text-blue-400">体験</span>しよう。
        </h1>
        <p className="max-w-2xl text-lg sm:text-xl text-slate-300 mb-8">
          A fully interactive simulator for the Japanese Insurance Market. Learn about products, simulate underwriting, manage policies, and experience the claims process with AI.
        </p>
        <div className="flex gap-4">
          <button 
            onClick={() => setView('PRODUCTS')}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-500 rounded-full font-bold shadow-lg transition-transform hover:-translate-y-1"
          >
            Start Learning
          </button>
          <button 
            onClick={() => setView('SIMULATION')}
            className="px-8 py-3 bg-white text-blue-900 hover:bg-slate-100 rounded-full font-bold shadow-lg transition-transform hover:-translate-y-1"
          >
            Get a Quote
          </button>
        </div>
      </div>
    </div>

    {/* Features Grid */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <FeatureCard 
          icon={<BookOpen className="h-8 w-8 text-indigo-500" />}
          title="Product Knowledge"
          desc="Explore various categories like Seimei (Life), Iryo (Medical), and Gan (Cancer) insurance."
        />
        <FeatureCard 
          icon={<UserCheck className="h-8 w-8 text-green-500" />}
          title="Policy Admin (Hozen)"
          desc="Manage your virtual portfolio. Experience address changes, beneficiary updates, and policy loans."
        />
        <FeatureCard 
          icon={<AlertTriangle className="h-8 w-8 text-orange-500" />}
          title="Claims (Satei)"
          desc="Submit accident reports and watch the AI adjuster determine your payout based on policy terms."
        />
      </div>
    </div>
  </div>
);

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; desc: string }> = ({ icon, title, desc }) => (
  <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow border border-slate-100">
    <div className="mb-4 bg-slate-50 w-14 h-14 rounded-full flex items-center justify-center">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
    <p className="text-slate-600">{desc}</p>
  </div>
);

// 3. Products View
const ProductsView: React.FC = () => (
  <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
    <div className="mb-8">
      <h2 className="text-3xl font-bold text-slate-900">Insurance Products (商品一覧)</h2>
      <p className="text-slate-600 mt-2">Browse available insurance types in the Japanese market.</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {MOCK_PRODUCTS.map((prod) => (
        <div key={prod.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:border-blue-300 transition-all">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              {CATEGORY_ICONS[prod.category]}
              <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{prod.category}</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">{prod.name}</h3>
            <p className="text-slate-600 mb-4 h-12 line-clamp-2">{prod.description}</p>
            <div className="space-y-2 mb-6">
              {prod.coveragePoints.map((pt, idx) => (
                <div key={idx} className="flex items-start text-sm text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>{pt}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// 4. Learning Center (Gemini Powered)
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

  const commonTopics = ["Teiki Hoken (Term Life)", "Kaiyaku Henreikin (Surrender Value)", "Senshin Iryo (Advanced Medical)", "Koujo (Deduction)"];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Insurance Knowledge Base</h2>
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200">
        <div className="flex gap-4 mb-6">
          <input 
            type="text" 
            placeholder="Ask about a Japanese insurance term (e.g., 'Shushin Hoken')" 
            className="flex-1 px-4 py-3 bg-white rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button 
            onClick={handleSearch}
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Search className="w-5 h-5" />}
            Ask AI
          </button>
        </div>
        
        <div className="mb-6 flex flex-wrap gap-2">
            {commonTopics.map(t => (
              <button 
                key={t}
                onClick={() => setTopic(t)}
                className="px-3 py-1 bg-slate-100 text-slate-600 text-xs rounded-full hover:bg-slate-200"
              >
                {t}
              </button>
            ))}
        </div>

        {explanation && (
          <div className="mt-8 p-6 bg-slate-50 rounded-xl border border-slate-200 prose prose-blue max-w-none">
             <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600"/>
                AI Explanation
             </h3>
             <div className="whitespace-pre-line text-slate-700 leading-relaxed">
               {explanation}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

// 5. Simulation & Underwriting
const SimulationView: React.FC<{ addPolicy: (p: Policy) => void; setView: (v: ViewState) => void }> = ({ addPolicy, setView }) => {
  const [formData, setFormData] = useState({ age: 30, gender: 'Male', category: InsuranceCategory.MEDICAL, needs: 'Focus on surgery and cancer coverage' });
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
      contractorName: 'Yamada Taro (You)',
      insuredName: 'Yamada Taro (You)',
      beneficiary: 'Yamada Hanako',
      startDate: new Date().toISOString().split('T')[0],
      status: 'Active',
      premium: proposal.premium,
      coverageAmount: proposal.coverageDetails.substring(0, 50) + '...', // Simplified
      specialConditions: proposal.coverageDetails
    };
    addPolicy(newPolicy);
    setView('MY_PAGE');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-900 mb-6">Get a Quote (試算)</h2>
        <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
            <select 
              className="w-full bg-white border-slate-300 rounded-lg p-2 border focus:ring-blue-500"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value as InsuranceCategory})}
            >
              {Object.values(InsuranceCategory).map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Age</label>
              <input 
                type="number" 
                className="w-full bg-white border-slate-300 rounded-lg p-2 border" 
                value={formData.age}
                onChange={(e) => setFormData({...formData, age: parseInt(e.target.value)})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
              <select 
                className="w-full bg-white border-slate-300 rounded-lg p-2 border"
                value={formData.gender}
                onChange={(e) => setFormData({...formData, gender: e.target.value})}
              >
                <option>Male</option>
                <option>Female</option>
              </select>
            </div>
          </div>
          <div>
             <label className="block text-sm font-medium text-slate-700 mb-1">Specific Needs / Concerns</label>
             <textarea 
               className="w-full bg-white border-slate-300 rounded-lg p-2 border h-24"
               value={formData.needs}
               onChange={(e) => setFormData({...formData, needs: e.target.value})}
               placeholder="e.g., I am worried about cancer running in my family."
             />
          </div>
          <button 
            onClick={handleSimulate}
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 flex justify-center items-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : <FileText className="w-5 h-5" />}
            Generate Plan with AI
          </button>
        </div>
      </div>

      <div className="flex flex-col h-full">
         <h2 className="text-3xl font-bold text-slate-900 mb-6 lg:invisible">Results</h2>
         {proposal ? (
           <div className="bg-white p-6 rounded-2xl shadow-xl border-t-4 border-blue-500 flex-1 flex flex-col animate-fade-in">
             <div className="mb-4">
               <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded uppercase tracking-wide">Proposed Plan</span>
               <h3 className="text-2xl font-bold text-slate-900 mt-1">{proposal.planName}</h3>
               <p className="text-3xl font-bold text-slate-900 mt-4">¥{proposal.premium.toLocaleString()} <span className="text-sm font-normal text-slate-500">/ month</span></p>
             </div>
             
             <div className="space-y-4 mb-8 flex-1">
               <div className="p-4 bg-slate-50 rounded-lg">
                 <h4 className="font-semibold text-slate-800 mb-2">Coverage Highlights</h4>
                 <p className="text-sm text-slate-600 whitespace-pre-wrap">{proposal.coverageDetails}</p>
               </div>
               <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                 <h4 className="font-semibold text-yellow-800 mb-2">AI Advisor</h4>
                 <p className="text-sm text-yellow-700 italic">"{proposal.advice}"</p>
               </div>
             </div>

             <button 
               onClick={handleApply}
               className="w-full py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 shadow-lg transform transition hover:-translate-y-1"
             >
               Apply for this Policy (Contract)
             </button>
           </div>
         ) : (
           <div className="h-full bg-slate-100 rounded-2xl border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 p-8 text-center">
             Run the simulation to see a tailored insurance proposal here.
           </div>
         )}
      </div>
    </div>
  );
};

// 6. My Page (Admin)
const MyPageView: React.FC<{ policies: Policy[] }> = ({ policies }) => (
  <div className="max-w-6xl mx-auto px-4 py-8">
     <div className="flex justify-between items-end mb-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">My Page (契約者専用ページ)</h2>
        <p className="text-slate-600 mt-1">Manage your active contracts and procedures.</p>
      </div>
      <div className="text-right">
        <p className="text-sm text-slate-500">Total Monthly Premium</p>
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
        <h3 className="text-lg font-medium text-slate-900">No Active Policies</h3>
        <p className="text-slate-500">Go to Simulation to create a new contract.</p>
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
                     <h3 className="text-lg font-bold text-slate-900">{policy.productName}</h3>
                     <p className="text-xs text-slate-500">ID: {policy.id}</p>
                   </div>
                 </div>
                 <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                   policy.status === 'Active' ? 'bg-green-100 text-green-800' : 
                   policy.status === 'Claimed' ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-800'
                 }`}>
                   {policy.status}
                 </span>
               </div>
               
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mt-4">
                 <div>
                   <p className="text-slate-500">Insured</p>
                   <p className="font-medium">{policy.insuredName}</p>
                 </div>
                 <div>
                   <p className="text-slate-500">Beneficiary</p>
                   <p className="font-medium">{policy.beneficiary}</p>
                 </div>
                 <div>
                   <p className="text-slate-500">Monthly Premium</p>
                   <p className="font-medium">¥{policy.premium.toLocaleString()}</p>
                 </div>
                 <div>
                    <p className="text-slate-500">Start Date</p>
                    <p className="font-medium">{policy.startDate}</p>
                 </div>
               </div>
               
               <div className="mt-4 pt-4 border-t border-slate-100">
                 <p className="text-xs text-slate-500 mb-1">Coverage Details</p>
                 <p className="text-sm text-slate-700">{policy.specialConditions}</p>
               </div>
             </div>
             
             <div className="bg-slate-50 p-6 flex flex-col justify-center gap-2 border-l border-slate-100 min-w-[200px]">
                <button className="w-full py-2 px-4 bg-white border border-slate-300 text-slate-700 rounded text-sm hover:bg-slate-50 font-medium">
                  Address Change
                </button>
                <button className="w-full py-2 px-4 bg-white border border-slate-300 text-slate-700 rounded text-sm hover:bg-slate-50 font-medium">
                  Beneficiary Change
                </button>
                <button className="w-full py-2 px-4 bg-white border border-slate-300 text-slate-700 rounded text-sm hover:bg-slate-50 font-medium text-red-600 hover:text-red-700 hover:border-red-200">
                   Surrender (Kaiyaku)
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
         <h2 className="text-3xl font-bold text-slate-900 mb-6">File a Claim (事故報告)</h2>
         <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200">
            {activePolicies.length === 0 ? (
              <div className="text-center py-8 text-slate-500">You need an active policy to file a claim.</div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Select Policy</label>
                  <select 
                    className="w-full bg-white border-slate-300 rounded-lg p-2 border"
                    value={selectedPolicyId}
                    onChange={(e) => setSelectedPolicyId(e.target.value)}
                  >
                    <option value="">-- Select a Policy --</option>
                    {activePolicies.map(p => (
                      <option key={p.id} value={p.id}>{p.productName} ({p.id})</option>
                    ))}
                  </select>
                </div>
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Incident Description (Jiko Jokyo)</label>
                   <p className="text-xs text-slate-500 mb-2">Describe what happened, when, and where. Include medical details if applicable.</p>
                   <textarea 
                     className="w-full bg-white border-slate-300 rounded-lg p-2 border h-32"
                     placeholder="Example: I was hospitalized for 5 days due to appendicitis surgery starting from last Monday..."
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
                  Submit to Assessment Dept
                </button>
              </div>
            )}
         </div>
       </div>

       {/* History */}
       <div className="flex flex-col h-full">
         <h2 className="text-3xl font-bold text-slate-900 mb-6">Claims History</h2>
         <div className="space-y-4 flex-1 overflow-y-auto pr-2">
            {claims.length === 0 ? (
               <div className="text-slate-400 text-center mt-10">No claims submitted yet.</div>
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
                  <p className="text-sm text-slate-800 font-medium mb-2">Incident: {claim.incidentDescription}</p>
                  
                  {claim.assessmentResult && (
                    <div className="mt-3 bg-slate-50 p-3 rounded text-sm">
                      <p className="font-bold text-slate-700 mb-1">Assessment Result:</p>
                      <p className="text-slate-600 mb-2">{claim.assessmentResult}</p>
                      {claim.status === 'Approved' && (
                        <div className="flex items-center gap-2 text-green-600 font-bold border-t border-slate-200 pt-2">
                          <CheckCircle2 className="w-5 h-5" />
                          Payout: ¥{claim.payoutAmount?.toLocaleString()}
                        </div>
                      )}
                      {claim.status === 'Denied' && (
                        <div className="flex items-center gap-2 text-red-600 font-bold border-t border-slate-200 pt-2">
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
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Navbar currentView={view} setView={setView} />
      
      <main className="animate-fade-in">
        {view === 'HOME' && <HomeView setView={setView} />}
        {view === 'PRODUCTS' && <ProductsView />}
        {view === 'LEARN' && <LearnView />}
        {view === 'SIMULATION' && <SimulationView addPolicy={addPolicy} setView={setView} />}
        {view === 'MY_PAGE' && <MyPageView policies={policies} />}
        {view === 'CLAIMS_CENTER' && <ClaimsView policies={policies} addClaim={addClaim} claims={claims} />}
      </main>

      <footer className="bg-slate-900 text-slate-400 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="mb-2">Nihon Hoken Academy - Educational Purpose Only</p>
          <p className="text-sm text-slate-600">Powered by Gemini AI. Not real financial advice.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;