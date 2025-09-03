import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/layout/Header/Header';
import CompanySelector from './components/ui/CompanySelector/CompanySelector';
import QuestionList from './components/features/QuestionList/QuestionList';
import LoadingSpinner from './components/ui/LoadingSpinner/LoadingSpinner';
import StatsCard from './components/ui/StatsCard/StatsCard';
import { useQuestions } from './hooks/useQuestions';
import { getAvailableCompanies, discoverAvailableCompanies } from './services/csvService';

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
    <div className="min-h-screen p-4 lg:p-6 bg-slate-50">
      {/* accessible skip link */}
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-white px-3 py-2 rounded-md shadow-sm">
        Skip to content
      </a>

      <div className="max-w-6xl mx-auto" id="main">
        <Header />
        
        <motion.div 
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 lg:p-8 mb-6 border border-white/30 shadow-card-lg"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">
                Practice Dashboard
              </h2>
              <p className="text-slate-600 text-sm">
                Found <span className="font-semibold text-primary-600">{companies.length}</span> companies available for practice
              </p>
            </div>
            
            {selectedCompany && questions.length > 0 && (
              <StatsCard
                completed={completedQuestions.size}
                total={questions.length}
                percentage={completionPercentage}
              />
            )}
          </div>
          
          <CompanySelector
            companies={companies}
            selectedCompany={selectedCompany}
            onCompanyChange={handleCompanyChange}
          />
        </motion.div>
        
        <AnimatePresence mode="wait">
          {selectedCompany && (
            <motion.div
              key={selectedCompany}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.28 }}
            >
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

        {/* live status for discovery (useful for screen readers) */}
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {discoveryStatus}
        </div>
      </div>
    </div>
  );
};

export default App;