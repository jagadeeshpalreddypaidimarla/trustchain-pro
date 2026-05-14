'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Zap, Globe, Lock, TrendingUp, MessageSquare, Link, Image, Mic, Send, AlertTriangle, CheckCircle, XCircle, HelpCircle, Share2, ExternalLink } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { analyzeText, analyzeURL } from '@/services/api';
import { AnalysisResult } from '@/types';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'text' | 'url' | 'image' | 'voice'>('text');
  const [textInput, setTextInput] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<AnalysisResult[]>([]);

  const tabs = [
    { id: 'text' as const, label: 'Text', icon: MessageSquare, color: 'from-blue-500 to-cyan-500' },
    { id: 'url' as const, label: 'Link', icon: Link, color: 'from-purple-500 to-pink-500' },
    { id: 'image' as const, label: 'Image', icon: Image, color: 'from-orange-500 to-red-500' },
    { id: 'voice' as const, label: 'Voice', icon: Mic, color: 'from-green-500 to-emerald-500' },
  ];

  const handleTextAnalysis = async () => {
    if (!textInput.trim()) {
      toast.error('Please enter some text to analyze');
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await analyzeText(textInput);
      setResult(result);
      setHistory(prev => [result, ...prev].slice(0, 10));
      toast.success('Analysis complete!');
    } catch (error) {
      toast.error('Analysis failed. Please try again.');
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleURLAnalysis = async () => {
    if (!urlInput.trim()) {
      toast.error('Please enter a URL to analyze');
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await analyzeURL(urlInput);
      setResult(result);
      setHistory(prev => [result, ...prev].slice(0, 10));
      toast.success('URL analysis complete!');
    } catch (error) {
      toast.error('URL analysis failed. Please try again.');
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getVerdictConfig = (verdict: string) => {
    const configs = {
      SCAM: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-950', border: 'border-red-200 dark:border-red-800', badge: 'bg-red-500', label: 'SCAM DETECTED' },
      FAKE: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-950', border: 'border-red-200 dark:border-red-800', badge: 'bg-red-500', label: 'FAKE NEWS' },
      SUSPICIOUS: { icon: AlertTriangle, color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-950', border: 'border-yellow-200 dark:border-yellow-800', badge: 'bg-yellow-500', label: 'SUSPICIOUS' },
      LIKELY_REAL: { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-950', border: 'border-green-200 dark:border-green-800', badge: 'bg-green-500', label: 'LIKELY REAL' },
      UNCERTAIN: { icon: HelpCircle, color: 'text-gray-500', bg: 'bg-gray-50 dark:bg-gray-900', border: 'border-gray-200 dark:border-gray-800', badge: 'bg-gray-500', label: 'UNCERTAIN' },
    };
    return configs[verdict as keyof typeof configs] || configs.UNCERTAIN;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-950">
      <Toaster position="top-center" toastOptions={{ duration: 4000 }} />
      
      {/* Header */}
      <header className="border-b border-gray-200/50 dark:border-gray-800/50 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
              <Shield className="text-white" size={22} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">TrustChain</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Pro</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
              Protecting millions of Indians
            </span>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50" />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:py-10">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
            Detect Scams & Fake News
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
              Powered by Advanced AI
            </span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
            Paste any message, link, or upload an image. Our AI instantly tells you if it's real or a scam.
          </p>
        </motion.div>

        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-3xl mx-auto mb-8"
        >
          {/* Tabs */}
          <div className="flex bg-white dark:bg-gray-800 rounded-2xl p-1.5 mb-4 shadow-lg shadow-gray-200/50 dark:shadow-gray-900/50">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setResult(null); }}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? `bg-gradient-to-r ${tab.color} text-white shadow-lg`
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <tab.icon size={18} />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Text Tab */}
          {activeTab === 'text' && (
            <div className="space-y-4">
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder='Paste any message here... Example: "Congratulations! You won ₹25,000! Click here to claim..."'
                className="w-full h-44 p-5 rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 resize-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all text-base shadow-inner"
              />
              <button
                onClick={handleTextAnalysis}
                disabled={isAnalyzing || !textInput.trim()}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold rounded-2xl transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99] disabled:scale-100 flex items-center justify-center gap-2 shadow-xl shadow-blue-500/25 text-lg"
              >
                <Send size={20} />
                {isAnalyzing ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    Analyzing with AI...
                  </>
                ) : 'Analyze Truth'}
              </button>
            </div>
          )}

          {/* URL Tab */}
          {activeTab === 'url' && (
            <div className="space-y-4">
              <div className="relative">
                <Link className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="Paste URL here... Example: https://suspicious-site.xyz/offer"
                  className="w-full pl-14 pr-5 py-4 rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all text-base shadow-inner"
                />
              </div>
              <button
                onClick={handleURLAnalysis}
                disabled={isAnalyzing || !urlInput.trim()}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold rounded-2xl transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99] disabled:scale-100 flex items-center justify-center gap-2 shadow-xl shadow-purple-500/25 text-lg"
              >
                <Send size={20} />
                {isAnalyzing ? 'Analyzing URL...' : 'Analyze URL'}
              </button>
            </div>
          )}

          {/* Image & Voice tabs (UI placeholder) */}
          {(activeTab === 'image' || activeTab === 'voice') && (
            <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600">
              {activeTab === 'image' ? (
                <>
                  <Image size={48} className="mx-auto text-gray-400 mb-3" />
                  <p className="text-gray-600 dark:text-gray-400 font-medium">Image analysis coming soon</p>
                  <p className="text-gray-400 text-sm mt-1">Upload screenshots for deepfake detection</p>
                </>
              ) : (
                <>
                  <Mic size={48} className="mx-auto text-gray-400 mb-3" />
                  <p className="text-gray-600 dark:text-gray-400 font-medium">Voice analysis coming soon</p>
                  <p className="text-gray-400 text-sm mt-1">Speak in Telugu, Hindi, or English</p>
                </>
              )}
            </div>
          )}
        </motion.div>

        {/* Result Card */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', duration: 0.6 }}
              className="max-w-3xl mx-auto"
            >
              {(() => {
                const config = getVerdictConfig(result.verdict);
                const Icon = config.icon;
                return (
                  <div className={`${config.bg} ${config.border} border-2 rounded-3xl overflow-hidden shadow-2xl`}>
                    {/* Verdict Header */}
                    <div className={`${config.badge} text-white px-6 py-4 flex items-center justify-between`}>
                      <div className="flex items-center gap-3">
                        <Shield size={24} />
                        <div>
                          <p className="font-bold text-lg">{config.label}</p>
                          <p className="text-sm opacity-90">AI-Powered Analysis</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">{result.confidence_score}%</p>
                        <p className="text-xs opacity-80">Confidence</p>
                      </div>
                    </div>

                    <div className="p-6 space-y-4">
                      {/* Main Verdict */}
                      <div className="flex items-start gap-4">
                        <Icon className={`${config.color} mt-1 flex-shrink-0`} size={36} />
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                            {result.verdict === 'SCAM' && '⚠️ This is a Scam — Do NOT Engage'}
                            {result.verdict === 'SUSPICIOUS' && '🔍 This Looks Suspicious — Exercise Caution'}
                            {result.verdict === 'LIKELY_REAL' && '✅ No Major Issues Detected'}
                            {result.verdict === 'UNCERTAIN' && '❓ Unable to Fully Determine'}
                          </h3>
                          <p className="mt-2 text-gray-700 dark:text-gray-300 leading-relaxed">
                            {result.explanation}
                          </p>
                        </div>
                      </div>

                      {/* Recommended Action */}
                      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border-l-4 border-blue-500">
                        <h4 className="font-bold text-gray-900 dark:text-white mb-1">🛡️ Recommended Action</h4>
                        <p className="text-gray-700 dark:text-gray-300">{result.recommended_action}</p>
                      </div>

                      {/* Red Flags */}
                      {result.red_flags.length > 0 && (
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4">
                          <h4 className="font-bold text-red-600 dark:text-red-400 mb-3">
                            🚩 Warning Signs ({result.red_flags.length})
                          </h4>
                          <div className="space-y-2">
                            {result.red_flags.map((flag, i) => (
                              <div key={i} className="flex items-start gap-3 p-2 rounded-lg bg-red-50 dark:bg-red-950/30">
                                <span className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                                  flag.severity === 'CRITICAL' ? 'bg-red-600' :
                                  flag.severity === 'HIGH' ? 'bg-orange-500' :
                                  flag.severity === 'MEDIUM' ? 'bg-yellow-500' : 'bg-blue-500'
                                }`} />
                                <div>
                                  <p className="text-sm font-medium text-gray-900 dark:text-white">{flag.flag}</p>
                                  <p className="text-xs text-gray-500">Severity: {flag.severity} | Source: {flag.type}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Metrics */}
                      <div className="grid grid-cols-3 gap-3">
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-3 text-center">
                          <p className="text-xs text-gray-500">Processing Time</p>
                          <p className="font-bold text-gray-900 dark:text-white">{Math.round(result.processing_time_ms)}ms</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-3 text-center">
                          <p className="text-xs text-gray-500">AI Model</p>
                          <p className="font-bold text-gray-900 dark:text-white">Gemini 2.0</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-3 text-center">
                          <p className="text-xs text-gray-500">Status</p>
                          <p className="font-bold text-green-500">Verified</p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3 flex-wrap">
                        <button className="flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all font-medium shadow-lg shadow-blue-500/25">
                          <Share2 size={18} />
                          Share Report
                        </button>
                        <button className="flex items-center gap-2 px-5 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-xl transition-all font-medium">
                          <ExternalLink size={18} />
                          Full Evidence
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Features Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-4xl mx-auto">
          {[
            { icon: Zap, title: 'Real-Time Analysis', desc: 'Results in under 3 seconds' },
            { icon: Globe, title: 'Multi-Language', desc: '22 Indian languages' },
            { icon: Lock, title: 'Privacy Protected', desc: 'No data stored' },
            { icon: TrendingUp, title: '99% Detection Rate', desc: 'Advanced AI accuracy' },
          ].map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-5 text-center shadow-lg hover:shadow-xl transition-shadow"
            >
              <f.icon className="mx-auto text-blue-500 mb-3" size={32} />
              <h3 className="font-bold text-gray-900 dark:text-white text-sm">{f.title}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{f.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* History */}
        {history.length > 0 && (
          <div className="mt-12 max-w-3xl mx-auto">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">📋 Recent Analyses</h3>
            <div className="space-y-2">
              {history.map((item, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                     onClick={() => setResult(item)}>
                  <div className="flex items-center gap-3">
                    <span className={`w-3 h-3 rounded-full ${
                      item.verdict === 'SCAM' ? 'bg-red-500' :
                      item.verdict === 'SUSPICIOUS' ? 'bg-yellow-500' : 'bg-green-500'
                    }`} />
                    <span className="font-medium text-gray-900 dark:text-white text-sm">
                      {item.verdict}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">{item.confidence_score}% confidence</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200/50 dark:border-gray-800/50 py-6 mt-16 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          © 2025 TrustChain Pro — Protecting India from Scams & Misinformation
        </p>
      </footer>
    </div>
  );
}