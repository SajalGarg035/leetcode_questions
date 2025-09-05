import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header/Header';
import CompanySelector from './components/ui/CompanySelector/CompanySelector';
import QuestionList from './components/features/QuestionList/QuestionList';
import LoadingSpinner from './components/ui/LoadingSpinner/LoadingSpinner';
import StatsCard from './components/ui/StatsCard/StatsCard';
import { useQuestions } from './hooks/useQuestions';
import { getAvailableCompanies, discoverAvailableCompanies } from './services/csvService';
import Home from './pages/Home';
import QuestionGenerator from './pages/QuestionGenerator';
import QuestionChat from './pages/QuestionChat';
import PracticeHub from './pages/PracticeHub';
import PracticePage from './pages/PracticePage';
import CoreSubjects from './pages/CoreSubjects';

const App = () => {
  const [selectedCompany, setSelectedCompany] = useState('');
  const [companies, setCompanies] = useState([]);
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [discoveryStatus, setDiscoveryStatus] = useState('Starting...');
  
  const {
    questions,
    displayedQuestions,
    loading,
    completedQuestions,
    hasMoreQuestions,
    loadQuestions,
    loadMoreQuestions,
    toggleQuestion
  } = useQuestions();

  // Load available companies on mount
  useEffect(() => {
    const loadCompanies = async () => {
      setLoadingCompanies(true);
      setDiscoveryStatus('Loading initial companies...');
      
      try {
        // Start with fallback companies immediately
        const fallbackCompanies = getAvailableCompanies();
        setCompanies(fallbackCompanies);
        setDiscoveryStatus(`Loaded ${fallbackCompanies.length} initial companies. Discovering more...`);
        setLoadingCompanies(false);
        
        // Then try to discover all companies in the background
        setDiscoveryStatus('Scanning folder structure for all companies...');
        const discoveredCompanies = await discoverAvailableCompanies();
        
        if (discoveredCompanies.length > 0) {
          console.log(`Discovered ${discoveredCompanies.length} companies:`, discoveredCompanies);
          setCompanies(discoveredCompanies);
          setDiscoveryStatus(`Discovery complete! Found ${discoveredCompanies.length} companies.`);
        } else {
          setDiscoveryStatus(`Using fallback list of ${fallbackCompanies.length} companies.`);
        }
        
      } catch (error) {
        console.error('Failed to discover companies:', error);
        setDiscoveryStatus('Using fallback company list due to discovery error.');
      }
    };
    
    loadCompanies();
  }, []);

  const handleCompanyChange = (company) => {
    console.log(`🏢 handleCompanyChange called with: "${company}"`);
    setSelectedCompany(company);
    if (company) {
      loadQuestions(company);
    }
  };

  const completionPercentage = questions.length > 0 
    ? Math.round((completedQuestions.size / questions.length) * 100) 
    : 0;

  if (loadingCompanies) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-hero-gradient">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 max-w-md w-full text-center border border-white/30 shadow-card-lg"
        >
          <LoadingSpinner size="lg" />
          <h3 className="text-xl font-semibold text-slate-800 mt-4 mb-2">
            Discovering Companies
          </h3>
          <p className="text-slate-600 text-sm leading-relaxed" aria-live="polite">
            {discoveryStatus}
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/generator" element={<QuestionGenerator />} />
        <Route path="/chat" element={<QuestionChat />} />
        <Route path="/practice-hub" element={<PracticeHub />} />
        <Route path="/practice/:id" element={<PracticePage />} />
        <Route path="/core-subjects" element={<CoreSubjects />} />
        <Route path="/companies" element={
          <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-white px-3 py-2 rounded-md shadow-sm">
              Skip to content
            </a>

            <div className="max-w-6xl mx-auto p-4 lg:p-6" id="main">
              <Header />
              
              {/* Enhanced Header Section */}
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
              >
                <div className="bg-white/70 backdrop-blur-sm shadow-xl rounded-3xl p-8 lg:p-12 border border-white/40">
                  <div className="flex items-center justify-center gap-3 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                  </div>
                  <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
                    Company Practice Hub
                  </h1>
                  <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                    Practice with real coding questions from {companies.length} top tech companies. 
                    Build your skills with problems from Google, Meta, Amazon, Microsoft, and more.
                  </p>
                </div>
              </motion.div>
              
              {/* Stats and Selector Section */}
              <motion.div 
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 lg:p-10 mb-8 border border-white/40 shadow-xl"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold text-slate-900 mb-3">
                      Choose Your Target Company
                    </h2>
                    <p className="text-lg text-slate-600 leading-relaxed">
                      Select from <span className="font-bold text-primary-600">{companies.length} companies</span> to start practicing with their specific question patterns and difficulty levels.
                    </p>
                  </div>
                  
                  {selectedCompany && questions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="lg:min-w-[280px]"
                    >
                      <StatsCard
                        completed={completedQuestions.size}
                        total={questions.length}
                        percentage={completionPercentage}
                      />
                    </motion.div>
                  )}
                </div>
                
                <div className="space-y-4">
                  <label className="block text-lg font-semibold text-slate-800 mb-3">
                    Search and select a company
                  </label>
                  <CompanySelector
                    companies={companies}
                    selectedCompany={selectedCompany}
                    onCompanyChange={handleCompanyChange}
                  />
                  
                  {!selectedCompany && (
                    <div className="mt-6 p-6 bg-gradient-to-r from-primary-50 to-blue-50 rounded-2xl border border-primary-100">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-slate-800 mb-2">
                            💡 Pro Tip
                          </h3>
                          <p className="text-slate-600 leading-relaxed">
                            Start by selecting a company you're interested in. Each company has a curated set of questions 
                            that reflect their actual interview patterns and difficulty levels.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
              
              {/* Questions Section */}
              <AnimatePresence mode="wait">
                {selectedCompany && (
                  <motion.div
                    key={selectedCompany}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="mb-6">
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/40 shadow-lg"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-slate-900">
                              {selectedCompany} Questions
                            </h3>
                            <p className="text-slate-600">
                              {questions.length} questions • {completedQuestions.size} completed • {completionPercentage}% progress
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                    
                    <QuestionList
                      company={selectedCompany}
                      questions={questions}
                      displayedQuestions={displayedQuestions}
                      completedQuestions={completedQuestions}
                      onQuestionToggle={toggleQuestion}
                      onLoadMore={loadMoreQuestions}
                      hasMore={hasMoreQuestions}
                      loading={loading}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="sr-only" aria-live="polite" aria-atomic="true">
                {discoveryStatus}
              </div>
            </div>
          </div>
        } />
      </Routes>
    </Router>
  );
};

export default App;