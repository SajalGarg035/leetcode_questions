import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MagnifyingGlassIcon, ChevronDownIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';

const CompanySelector = ({ companies, selectedCompany, onCompanyChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCompanies = useMemo(() => {
    return companies.filter(company =>
      company.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [companies, searchTerm]);

  const handleCompanySelect = (company) => {
    onCompanyChange(company);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="relative">
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-6 py-4 bg-white border-2 border-slate-200 rounded-2xl hover:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <div className="flex items-center gap-3">
            <BuildingOfficeIcon className="w-5 h-5 text-slate-400" />
            <span className={`text-lg ${selectedCompany ? 'text-slate-900 font-medium' : 'text-slate-500'}`}>
              {selectedCompany || 'Select a company...'}
            </span>
          </div>
          <ChevronDownIcon
            className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden"
          >
            {/* Search Input */}
            <div className="p-4 border-b border-slate-100">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search companies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                  autoFocus
                />
              </div>
            </div>

            {/* Companies List */}
            <div className="max-h-64 overflow-y-auto">
              {filteredCompanies.length > 0 ? (
                <div className="p-2">
                  {filteredCompanies.map((company, index) => (
                    <motion.button
                      key={company}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.02 }}
                      onClick={() => handleCompanySelect(company)}
                      className={`w-full text-left px-4 py-3 rounded-xl hover:bg-primary-50 hover:text-primary-700 transition-colors duration-150 ${
                        selectedCompany === company
                          ? 'bg-primary-100 text-primary-800 font-medium'
                          : 'text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center">
                          <BuildingOfficeIcon className="w-4 h-4 text-slate-600" />
                        </div>
                        <span className="font-medium">{company}</span>
                        {selectedCompany === company && (
                          <div className="ml-auto w-2 h-2 bg-primary-600 rounded-full"></div>
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MagnifyingGlassIcon className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-slate-500 font-medium">No companies found</p>
                  <p className="text-sm text-slate-400 mt-1">Try a different search term</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default CompanySelector;
