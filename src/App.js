import React, { useState, useEffect } from 'react';
import Header from './components/Header/Header';
import CompanySelector from './components/CompanySelector/CompanySelector';
import QuestionList from './components/QuestionList/QuestionList';
import { useQuestions } from './hooks/useQuestions';
import { getAvailableCompanies, discoverAvailableCompanies } from './services/csvService';
import './App.css';

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
    console.log(`🏢 Company type:`, typeof company);
    console.log(`🏢 Setting selectedCompany to:`, company);
    
    setSelectedCompany(company);
    if (company) {
      console.log(`🏢 Company exists, calling loadQuestions...`);
      loadQuestions(company);
    } else {
      console.log(`🏢 No company selected, not loading questions`);
    }
  };

  if (loadingCompanies) {
    return (
      <div className="app">
        <div className="container">
          <Header />
          <div className="loading-companies">
            <div className="spinner"></div>
            <p>Discovering companies...</p>
            <p className="discovery-status">{discoveryStatus}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="container">
        <Header />
        <div className="companies-info">
          <p>Found {companies.length} companies available for practice</p>
          <p className="discovery-status">{discoveryStatus}</p>
        </div>
        <CompanySelector
          companies={companies}
          selectedCompany={selectedCompany}
          onCompanyChange={handleCompanyChange}
        />
        
        {selectedCompany && (
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
        )}
      </div>
    </div>
  );
};

export default App;
