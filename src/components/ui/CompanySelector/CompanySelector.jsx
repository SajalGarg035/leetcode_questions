import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDownIcon, MagnifyingGlassIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';

const CompanySelector = ({ companies, selectedCompany, onCompanyChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCompanies = companies.filter(company =>
    company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCompanySelect = (company) => {
    onCompanyChange(company);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="relative">
      <label className="block text-sm font-semibold text-slate-700 mb-3">
        Choose a company to practice
      </label>
      
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-4 py-3 bg-white border-2 border-slate-200 rounded-xl hover:border-primary-300 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all duration-200 group"
        >
          <div className="flex items-center gap-3">
            <BuildingOfficeIcon className="w-5 h-5 text-slate-400 group-hover:text-primary-500 transition-colors" />
            <span className={`${selectedCompany ? 'text-slate-800 font-medium' : 'text-slate-500'}`}>
              {selectedCompany || 'Select a company...'}
            </span>
          </div>
          <ChevronDownIcon 
            className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 overflow-hidden"
            >
              <div className="p-3 border-b border-slate-100">
                <div className="relative">
                  <MagnifyingGlassIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search companies..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
                    autoFocus
                  />
                </div>
              </div>
              
              <div className="max-h-64 overflow-y-auto">
                {filteredCompanies.length > 0 ? (
                  filteredCompanies.map((company, index) => (
                    <motion.button
                      key={company}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.02 }}
                      onClick={() => handleCompanySelect(company)}
                      className={`w-full text-left px-4 py-3 hover:bg-primary-50 transition-colors duration-150 flex items-center gap-3 ${
                        selectedCompany === company ? 'bg-primary-100 text-primary-700 font-medium' : 'text-slate-700'
                      }`}
                    >
                      <BuildingOfficeIcon className="w-4 h-4 text-slate-400" />
                      {company}
                    </motion.button>
                  ))
                ) : (
                  <div className="px-4 py-6 text-center text-slate-500">
                    <MagnifyingGlassIcon className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p>No companies found</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CompanySelector;