import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  Upload, 
  User, 
  Play, 
  CheckCircle2, 
  AlertTriangle, 
  LogOut, 
  BookOpen, 
  ChevronRight, 
  ChevronLeft,
  Send,
  Mail,
  FileText,
  Clock,
  Lock,
  Menu,
  X
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Types ---

interface Question {
  id: string;
  text: string;
  options: string[];
}

interface ExamConfig {
  title: string;
  description: string;
  questions: Question[];
  solutionKey: string[];
  examinerEmail: string;
  timeLimit: number; // in minutes
}

interface ExamResult {
  score: number;
  totalQuestions: number;
  terminationReason: string;
}

// --- Components ---

const Navbar = ({ onHowItWorks, onSecurity, onSupport }: { onHowItWorks: () => void, onSecurity: () => void, onSupport: () => void }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleMenuClick = (action: () => void) => {
    action();
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 h-16 glass flex items-center px-4 md:px-6 justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-indigo-600 rounded-lg md:rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
            <Shield size={20} className="md:hidden" />
            <Shield size={24} className="hidden md:block" />
          </div>
          <span className="text-lg md:text-xl font-bold tracking-tight text-slate-800">SecureExam<span className="text-indigo-600">Pro</span></span>
        </div>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <button onClick={onHowItWorks} className="hover:text-indigo-600 transition-colors cursor-pointer">How it works</button>
          <button onClick={onSecurity} className="hover:text-indigo-600 transition-colors cursor-pointer">Security</button>
          <button onClick={onSupport} className="hover:text-indigo-600 transition-colors cursor-pointer">Support</button>
          <button className="px-5 py-2 bg-slate-900 text-white rounded-full hover:bg-slate-800 transition-all shadow-md">
            Get Started
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button onClick={toggleMenu} className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-0 top-16 z-40 bg-white border-b border-slate-100 shadow-xl md:hidden flex flex-col p-4 gap-4"
          >
            <button onClick={() => handleMenuClick(onHowItWorks)} className="flex items-center gap-3 p-3 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-colors text-left font-medium">
              <BookOpen size={20} /> How it works
            </button>
            <button onClick={() => handleMenuClick(onSecurity)} className="flex items-center gap-3 p-3 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-colors text-left font-medium">
              <Shield size={20} /> Security
            </button>
            <button onClick={() => handleMenuClick(onSupport)} className="flex items-center gap-3 p-3 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-colors text-left font-medium">
              <Mail size={20} /> Support
            </button>
            <button className="w-full p-4 bg-slate-900 text-white rounded-xl font-bold shadow-lg mt-2">
              Get Started
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const HowItWorksModal = ({ onClose }: { onClose: () => void }) => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm"
    onClick={onClose}
  >
    <motion.div 
      initial={{ scale: 0.9, y: 20 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0.9, y: 20 }}
      className="bg-white rounded-[2.5rem] shadow-2xl max-w-2xl w-full overflow-hidden"
      onClick={e => e.stopPropagation()}
    >
      <div className="p-10">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-slate-900">How it Works</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <LogOut size={24} className="text-slate-400 rotate-180" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center shrink-0 font-bold text-lg">1</div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">Examiner Setup</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                The examiner uploads the question paper and solution key in JSON format. They also provide an email address to receive real-time results.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center shrink-0 font-bold text-lg">2</div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">Student Authentication</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Students enter their full name to access the exam. The platform verifies if an exam is active before allowing entry.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center shrink-0 font-bold text-lg">3</div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">Secure Examination</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                The exam runs in a locked environment. Any attempt to switch tabs, refresh the page, or lose window focus triggers an immediate termination.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center shrink-0 font-bold text-lg">4</div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">Automated Grading</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Upon submission or termination, the system automatically grades the responses and sends a comprehensive report to the examiner.
              </p>
            </div>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="w-full mt-10 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all"
        >
          Got it, thanks!
        </button>
      </div>
    </motion.div>
  </motion.div>
);

const SecurityModal = ({ onClose }: { onClose: () => void }) => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm"
    onClick={onClose}
  >
    <motion.div 
      initial={{ scale: 0.9, y: 20 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0.9, y: 20 }}
      className="bg-white rounded-[2.5rem] shadow-2xl max-w-2xl w-full overflow-hidden"
      onClick={e => e.stopPropagation()}
    >
      <div className="p-10">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-slate-900">Security Features</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <LogOut size={24} className="text-slate-400 rotate-180" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <Shield className="text-indigo-600 mb-3" size={24} />
            <h3 className="font-bold text-slate-900 mb-1 text-sm">Anti-Cheat Engine</h3>
            <p className="text-[10px] text-slate-500 leading-tight">Real-time monitoring of tab switching, window focus, and browser activity.</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <Lock className="text-indigo-600 mb-3" size={24} />
            <h3 className="font-bold text-slate-900 mb-1 text-sm">Data Encryption</h3>
            <p className="text-[10px] text-slate-500 leading-tight">All responses and solution keys are handled with industry-standard encryption protocols.</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <AlertTriangle className="text-indigo-600 mb-3" size={24} />
            <h3 className="font-bold text-slate-900 mb-1 text-sm">Instant Termination</h3>
            <p className="text-[10px] text-slate-500 leading-tight">Automatic exam submission upon any detected security protocol violation.</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <CheckCircle2 className="text-indigo-600 mb-3" size={24} />
            <h3 className="font-bold text-slate-900 mb-1 text-sm">Verified Results</h3>
            <p className="text-[10px] text-slate-500 leading-tight">Tamper-proof reporting sent directly to the examiner's verified email.</p>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="w-full mt-10 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all"
        >
          Close
        </button>
      </div>
    </motion.div>
  </motion.div>
);

const SupportModal = ({ onClose }: { onClose: () => void }) => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm"
    onClick={onClose}
  >
    <motion.div 
      initial={{ scale: 0.9, y: 20 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0.9, y: 20 }}
      className="bg-white rounded-[2.5rem] shadow-2xl max-w-lg w-full overflow-hidden"
      onClick={e => e.stopPropagation()}
    >
      <div className="p-10">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-slate-900">Support Center</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <LogOut size={24} className="text-slate-400 rotate-180" />
          </button>
        </div>

        <div className="space-y-4">
          <p className="text-xs text-slate-500">Need help with SecureExam Pro? Our team is here to assist you.</p>
          
          <div className="space-y-3">
            <a href="mailto:support@secureexam.pro" className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 hover:bg-slate-100 transition-colors group">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-indigo-600 shadow-sm group-hover:scale-110 transition-transform">
                <Mail size={20} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Email Support</h4>
                <p className="text-[10px] text-slate-500">support@secureexam.pro</p>
              </div>
            </a>

            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-indigo-600 shadow-sm">
                <BookOpen size={20} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Documentation</h4>
                <p className="text-[10px] text-slate-500">Read our detailed user guides.</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-indigo-50 rounded-xl">
            <h4 className="font-bold text-indigo-900 mb-1 text-sm">Common Issues</h4>
            <ul className="text-[10px] text-indigo-700 space-y-1 list-disc list-inside">
              <li>Webcam/Mic permissions</li>
              <li>Browser compatibility</li>
              <li>Network stability during exams</li>
            </ul>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="w-full mt-10 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all"
        >
          Close
        </button>
      </div>
    </motion.div>
  </motion.div>
);

const ExaminerDashboard = ({ onSetup }: { onSetup: (config: ExamConfig) => void }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [examinerEmail, setExaminerEmail] = useState('');
  const [timeLimit, setTimeLimit] = useState('30');
  const [questionsJson, setQuestionsJson] = useState('');
  const [solutionKeyJson, setSolutionKeyJson] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleSetup = async () => {
    try {
      setIsUploading(true);
      const questions = JSON.parse(questionsJson);
      const solutionKey = JSON.parse(solutionKeyJson);
      
      const config: ExamConfig = {
        title,
        description,
        questions,
        solutionKey,
        examinerEmail,
        timeLimit: parseInt(timeLimit) || 30
      };

      const res = await fetch('/api/exam/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });

      if (res.ok) {
        onSetup(config);
      }
    } catch (e) {
      alert("Invalid JSON format for questions or solution key.");
    } finally {
      setIsUploading(false);
    }
  };

  const sampleQuestions = JSON.stringify([
    { id: "1", text: "What is the capital of France?", options: ["London", "Berlin", "Paris", "Madrid"] },
    { id: "2", text: "Which planet is known as the Red Planet?", options: ["Venus", "Mars", "Jupiter", "Saturn"] }
  ], null, 2);

  const sampleKey = JSON.stringify(["Paris", "Mars"], null, 2);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto pt-20 md:pt-24 pb-12 px-4 md:px-6"
    >
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Examiner Dashboard</h1>
        <p className="text-sm md:text-base text-slate-500">Set up your secure examination by uploading questions and keys.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div className="space-y-4">
          <div className="p-4 md:p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-base md:text-lg font-semibold mb-4 flex items-center gap-2">
              <FileText size={20} className="text-indigo-600" /> General Info
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs md:text-sm font-medium text-slate-700 mb-1">Exam Title</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm"
                  placeholder="e.g. Final Physics Exam"
                />
              </div>
              <div>
                <label className="block text-xs md:text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all min-h-[80px] md:min-h-[100px] text-sm"
                  placeholder="Enter exam instructions and details..."
                />
              </div>
              <div>
                <label className="block text-xs md:text-sm font-medium text-slate-700 mb-1">Examiner Notification Email</label>
                <input 
                  type="email" 
                  value={examinerEmail}
                  onChange={(e) => setExaminerEmail(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm"
                  placeholder="results@university.edu"
                />
              </div>
              <div>
                <label className="block text-xs md:text-sm font-medium text-slate-700 mb-1">Time Limit (Minutes)</label>
                <input 
                  type="number" 
                  value={timeLimit}
                  onChange={(e) => setTimeLimit(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm"
                  placeholder="30"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 md:p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-base md:text-lg font-semibold mb-4 flex items-center gap-2">
              <Upload size={20} className="text-indigo-600" /> Question Paper (JSON)
            </h2>
            <textarea 
              value={questionsJson}
              onChange={(e) => setQuestionsJson(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 font-mono text-[10px] md:text-xs focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all min-h-[120px] md:min-h-[150px]"
              placeholder={sampleQuestions}
            />
            <button 
              onClick={() => setQuestionsJson(sampleQuestions)}
              className="mt-2 text-[10px] md:text-xs text-indigo-600 hover:underline"
            >
              Load Sample Questions
            </button>
          </div>

          <div className="p-4 md:p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-base md:text-lg font-semibold mb-4 flex items-center gap-2">
              <Lock size={20} className="text-indigo-600" /> Solution Key (JSON)
            </h2>
            <textarea 
              value={solutionKeyJson}
              onChange={(e) => setSolutionKeyJson(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 font-mono text-[10px] md:text-xs focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all min-h-[80px] md:min-h-[100px]"
              placeholder={sampleKey}
            />
            <button 
              onClick={() => setSolutionKeyJson(sampleKey)}
              className="mt-2 text-[10px] md:text-xs text-indigo-600 hover:underline"
            >
              Load Sample Key
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 md:mt-8 flex justify-end">
        <button 
          disabled={!title || !questionsJson || !solutionKeyJson || isUploading}
          onClick={handleSetup}
          className="w-full md:w-auto px-8 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
        >
          {isUploading ? "Setting up..." : "Launch Examination"} <Play size={18} />
        </button>
      </div>
    </motion.div>
  );
};

const StudentPortal = ({ onStart }: { onStart: (name: string) => void }) => {
  const [name, setName] = useState('');
  const [exam, setExam] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/exam/active')
      .then(res => res.json())
      .then(data => {
        if (!data.error) setExam(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="pt-32 text-center">Loading exam details...</div>;

  if (!exam) return (
    <div className="pt-32 text-center px-6">
      <div className="max-w-md mx-auto p-8 bg-white rounded-3xl shadow-xl border border-slate-100">
        <AlertTriangle size={48} className="mx-auto text-amber-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">No Active Exam</h2>
        <p className="text-slate-500 mb-6">Please wait for the examiner to launch the examination.</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-slate-900 text-white rounded-full"
        >
          Refresh
        </button>
      </div>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-lg mx-auto pt-24 md:pt-32 px-4 md:px-6"
    >
      <div className="p-6 md:p-10 bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-2xl shadow-indigo-100 border border-slate-50">
        <div className="text-center mb-6 md:mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-indigo-50 text-indigo-600 rounded-xl md:rounded-2xl mb-4">
            <User size={28} className="md:hidden" />
            <User size={32} className="hidden md:block" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">{exam.title}</h1>
          <p className="text-sm md:text-base text-slate-500">{exam.description}</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Enter Your Full Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-base md:text-lg"
              placeholder="John Doe"
            />
          </div>

          <div className="p-4 bg-amber-50 rounded-xl md:rounded-2xl border border-amber-100 flex gap-3">
            <Shield className="text-amber-600 shrink-0" size={20} />
            <div className="text-[10px] md:text-xs text-amber-800 leading-relaxed">
              <strong>Security Policy:</strong> By starting, you agree to remain in fullscreen. Switching tabs, refreshing, or exiting will result in immediate termination and submission of your current progress.
            </div>
          </div>

          <button 
            disabled={!name.trim()}
            onClick={() => onStart(name)}
            className="w-full py-3 md:py-4 bg-indigo-600 text-white rounded-xl md:rounded-2xl font-bold text-base md:text-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-indigo-200"
          >
            Start Examination
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const ExamInterface = ({ 
  studentName, 
  onComplete 
}: { 
  studentName: string, 
  onComplete: (result: ExamResult) => void 
}) => {
  const [exam, setExam] = useState<any>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [responses, setResponses] = useState<string[]>([]);
  const [startTime] = useState(new Date());
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const terminationRef = useRef<string | null>(null);

  const submitExam = useCallback(async (reason?: string) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    const result = {
      studentName,
      responses,
      startTime: startTime.toISOString(),
      endTime: new Date().toISOString(),
      terminationReason: reason || "Normal Submission"
    };

    try {
      const res = await fetch('/api/exam/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result)
      });
      const data = await res.json();
      onComplete(data);
    } catch (e) {
      console.error("Submission failed", e);
    }
  }, [studentName, responses, startTime, isSubmitting, onComplete]);

  // Countdown Timer
  useEffect(() => {
    if (timeLeft === null) return;
    if (timeLeft <= 0) {
      submitExam("Time Expired");
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, submitExam]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Security Logic
  useEffect(() => {
    const handleSecurityViolation = (reason: string) => {
      if (!terminationRef.current) {
        terminationRef.current = reason;
        submitExam(reason);
      }
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        handleSecurityViolation("Tab Switch / Window Hidden");
      }
    };

    const onBlur = () => {
      handleSecurityViolation("Window Focus Lost");
    };

    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
      handleSecurityViolation("Page Refresh Attempted");
    };

    window.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('blur', onBlur);
    window.addEventListener('beforeunload', onBeforeUnload);

    // Try to enter fullscreen
    document.documentElement.requestFullscreen().catch(() => {
      console.warn("Fullscreen blocked");
    });

    return () => {
      window.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('blur', onBlur);
      window.removeEventListener('beforeunload', onBeforeUnload);
    };
  }, [submitExam]);

  useEffect(() => {
    fetch('/api/exam/active')
      .then(res => res.json())
      .then(data => {
        setExam(data);
        setResponses(new Array(data.questions.length).fill(''));
        if (data.timeLimit) {
          setTimeLeft(data.timeLimit * 60);
        }
      });
  }, []);

  if (!exam) return <div className="pt-32 text-center">Loading questions...</div>;

  const currentQuestion = exam.questions[currentIdx];

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-12 px-4 md:px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 md:mb-8 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-50 rounded-lg md:rounded-xl flex items-center justify-center text-indigo-600">
              <BookOpen size={20} className="md:hidden" />
              <BookOpen size={24} className="hidden md:block" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-sm md:text-base line-clamp-1">{exam.title}</h2>
              <p className="text-[10px] md:text-xs text-slate-500">Candidate: {studentName}</p>
            </div>
          </div>
          <div className="flex items-center justify-between md:justify-end gap-4 md:gap-6 border-t md:border-t-0 pt-3 md:pt-0">
            <div className="text-left md:text-right">
              <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Progress</p>
              <p className="font-bold text-indigo-600 text-sm md:text-base">{currentIdx + 1} / {exam.questions.length}</p>
            </div>
            <div className="hidden md:block h-10 w-px bg-slate-100" />
            <div className={cn(
              "flex items-center gap-2 font-mono font-bold text-sm md:text-base",
              timeLeft !== null && timeLeft < 60 ? "text-rose-600 animate-pulse" : "text-amber-600"
            )}>
              <Clock size={16} className="md:hidden" />
              <Clock size={18} className="hidden md:block" />
              <span>{timeLeft !== null ? formatTime(timeLeft) : "LIVE"}</span>
            </div>
          </div>
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentIdx}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white p-6 md:p-10 rounded-[1.5rem] md:rounded-[2rem] shadow-xl border border-slate-100 mb-6 md:mb-8"
          >
            <span className="inline-block px-2 py-0.5 md:px-3 md:py-1 bg-indigo-50 text-indigo-600 text-[10px] md:text-xs font-bold rounded-full mb-3 md:mb-4">
              QUESTION {currentIdx + 1}
            </span>
            <h3 className="text-lg md:text-2xl font-semibold text-slate-900 mb-6 md:mb-8 leading-tight">
              {currentQuestion.text}
            </h3>

            <div className="space-y-3 md:space-y-4">
              {currentQuestion.options.map((option: string, i: number) => (
                <button
                  key={i}
                  onClick={() => {
                    const newResponses = [...responses];
                    newResponses[currentIdx] = option;
                    setResponses(newResponses);
                  }}
                  className={cn(
                    "w-full p-4 md:p-5 rounded-xl md:rounded-2xl text-left border-2 transition-all flex items-center justify-between group",
                    responses[currentIdx] === option 
                      ? "border-indigo-600 bg-indigo-50/50" 
                      : "border-slate-100 hover:border-slate-200 hover:bg-slate-50"
                  )}
                >
                  <span className={cn(
                    "font-medium text-sm md:text-base",
                    responses[currentIdx] === option ? "text-indigo-900" : "text-slate-600"
                  )}>
                    {option}
                  </span>
                  <div className={cn(
                    "w-5 h-5 md:w-6 md:h-6 rounded-full border-2 flex items-center justify-center transition-all shrink-0",
                    responses[currentIdx] === option 
                      ? "border-indigo-600 bg-indigo-600 text-white" 
                      : "border-slate-200 group-hover:border-slate-300"
                  )}>
                    {responses[currentIdx] === option && <CheckCircle2 size={12} className="md:hidden" />}
                    {responses[currentIdx] === option && <CheckCircle2 size={14} className="hidden md:block" />}
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-4">
          <button
            disabled={currentIdx === 0}
            onClick={() => setCurrentIdx(prev => prev - 1)}
            className="flex items-center gap-2 px-4 md:px-6 py-3 rounded-xl font-semibold text-slate-600 hover:bg-white transition-all disabled:opacity-0 text-sm md:text-base"
          >
            <ChevronLeft size={20} /> <span className="hidden sm:inline">Previous</span>
          </button>

          {currentIdx === exam.questions.length - 1 ? (
            <button
              onClick={() => submitExam()}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 md:px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 text-sm md:text-base"
            >
              Finish & Submit <Send size={18} />
            </button>
          ) : (
            <button
              onClick={() => setCurrentIdx(prev => prev + 1)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 md:px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg text-sm md:text-base"
            >
              Next <ChevronRight size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const ResultPage = ({ result, studentName }: { result: ExamResult, studentName: string }) => {
  const isTerminated = result.terminationReason !== "Normal Submission";

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-2xl mx-auto pt-24 md:pt-32 px-4 md:px-6 pb-20"
    >
      <div className="bg-white rounded-[2rem] md:rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100">
        <div className={cn(
          "p-8 md:p-12 text-center text-white",
          isTerminated ? "bg-rose-500" : "bg-indigo-600"
        )}>
          {isTerminated ? (
            <AlertTriangle size={48} className="md:hidden mx-auto mb-4 opacity-80" />
          ) : (
            <CheckCircle2 size={48} className="md:hidden mx-auto mb-4 opacity-80" />
          )}
          {isTerminated ? (
            <AlertTriangle size={64} className="hidden md:block mx-auto mb-6 opacity-80" />
          ) : (
            <CheckCircle2 size={64} className="hidden md:block mx-auto mb-6 opacity-80" />
          )}
          <h1 className="text-2xl md:text-4xl font-bold mb-2">
            {isTerminated ? "Exam Terminated" : "Exam Completed"}
          </h1>
          <p className="text-sm md:text-base text-white/80 font-medium">
            {isTerminated ? "Security violation detected" : "Your responses have been submitted"}
          </p>
        </div>

        <div className="p-8 md:p-12">
          <div className="grid grid-cols-2 gap-4 md:gap-8 mb-8 md:mb-10">
            <div className="p-4 md:p-6 bg-slate-50 rounded-2xl md:rounded-3xl text-center">
              <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Score</p>
              <p className="text-2xl md:text-4xl font-black text-slate-900">{result.score} / {result.totalQuestions}</p>
            </div>
            <div className="p-4 md:p-6 bg-slate-50 rounded-3xl text-center">
              <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Percentage</p>
              <p className="text-2xl md:text-4xl font-black text-slate-900">
                {Math.round((result.score / result.totalQuestions) * 100)}%
              </p>
            </div>
          </div>

          <div className="space-y-4 mb-8 md:mb-10">
            <div className="flex justify-between py-2 md:py-3 border-b border-slate-100">
              <span className="text-sm md:text-base text-slate-500 font-medium">Candidate</span>
              <span className="text-sm md:text-base text-slate-900 font-bold">{studentName}</span>
            </div>
            <div className="flex justify-between py-2 md:py-3 border-b border-slate-100">
              <span className="text-sm md:text-base text-slate-500 font-medium">Status</span>
              <span className={cn(
                "text-sm md:text-base font-bold",
                isTerminated ? "text-rose-600" : "text-emerald-600"
              )}>{result.terminationReason}</span>
            </div>
          </div>

          <div className="p-4 md:p-6 bg-indigo-50 rounded-xl md:rounded-2xl flex gap-3 md:gap-4 items-start">
            <Mail className="text-indigo-600 shrink-0" size={20} />
            <p className="text-xs md:text-sm text-indigo-900 leading-relaxed">
              A detailed report has been sent to the examiner's email address. You may now close this window.
            </p>
          </div>

          <button 
            onClick={() => window.location.reload()}
            className="w-full mt-8 md:mt-10 py-3 md:py-4 bg-slate-900 text-white rounded-xl md:rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 text-sm md:text-base"
          >
            <LogOut size={20} /> Exit Portal
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// --- Main App ---

export default function App() {
  const [view, setView] = useState<'role-select' | 'examiner' | 'student-entry' | 'exam' | 'result'>('role-select');
  const [studentName, setStudentName] = useState('');
  const [examResult, setExamResult] = useState<ExamResult | null>(null);
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [showSecurity, setShowSecurity] = useState(false);
  const [showSupport, setShowSupport] = useState(false);

  return (
    <div className="min-h-screen font-sans">
      <Navbar 
        onHowItWorks={() => setShowHowItWorks(true)} 
        onSecurity={() => setShowSecurity(true)}
        onSupport={() => setShowSupport(true)}
      />
      
      <AnimatePresence>
        {showHowItWorks && <HowItWorksModal onClose={() => setShowHowItWorks(false)} />}
        {showSecurity && <SecurityModal onClose={() => setShowSecurity(false)} />}
        {showSupport && <SupportModal onClose={() => setShowSupport(false)} />}
      </AnimatePresence>
      
      <AnimatePresence mode="wait">
        {view === 'role-select' && (
          <motion.div 
            key="role"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-4xl mx-auto pt-24 md:pt-40 px-4 md:px-6 text-center"
          >
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 md:mb-6 tracking-tight leading-tight">
              The Future of <span className="text-indigo-600">Secure Testing</span>
            </h1>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 md:mb-12">
              <p className="text-base md:text-xl text-slate-500 max-w-2xl mx-auto">
                A professional-grade examination platform with advanced anti-cheat measures and automated grading.
              </p>
            </div>
            <button 
              onClick={() => setShowHowItWorks(true)}
              className="mb-8 md:mb-12 inline-flex items-center gap-2 text-indigo-600 font-semibold hover:text-indigo-700 transition-colors text-sm md:text-base"
            >
              <BookOpen size={20} /> Learn how it works
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-3xl mx-auto">
              <button 
                onClick={() => setView('examiner')}
                className="group p-6 md:p-8 bg-white rounded-[1.5rem] md:rounded-[2.5rem] shadow-xl hover:shadow-2xl transition-all border border-slate-100 text-left"
              >
                <div className="w-12 h-12 md:w-14 md:h-14 bg-indigo-600 text-white rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform">
                  <Shield size={24} className="md:hidden" />
                  <Shield size={28} className="hidden md:block" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">Examiner Portal</h3>
                <p className="text-sm md:text-base text-slate-500">Upload questions, set keys, and manage examination sessions.</p>
              </button>

              <button 
                onClick={() => setView('student-entry')}
                className="group p-6 md:p-8 bg-white rounded-[1.5rem] md:rounded-[2.5rem] shadow-xl hover:shadow-2xl transition-all border border-slate-100 text-left"
              >
                <div className="w-12 h-12 md:w-14 md:h-14 bg-slate-900 text-white rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform">
                  <User size={24} className="md:hidden" />
                  <User size={28} className="hidden md:block" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">Student Portal</h3>
                <p className="text-sm md:text-base text-slate-500">Enter your credentials to start your assigned examination.</p>
              </button>
            </div>
          </motion.div>
        )}

        {view === 'examiner' && (
          <ExaminerDashboard onSetup={() => setView('role-select')} />
        )}

        {view === 'student-entry' && (
          <StudentPortal onStart={(name) => {
            setStudentName(name);
            setView('exam');
          }} />
        )}

        {view === 'exam' && (
          <ExamInterface 
            studentName={studentName} 
            onComplete={(result) => {
              setExamResult(result);
              setView('result');
            }} 
          />
        )}

        {view === 'result' && examResult && (
          <ResultPage result={examResult} studentName={studentName} />
        )}
      </AnimatePresence>
    </div>
  );
}
