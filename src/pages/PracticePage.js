import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeftIcon,
  PlayIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  CodeBracketIcon
} from '@heroicons/react/24/outline';
import practiceService from '../services/practiceService';

const PracticePage = () => {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [testResults, setTestResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [loading, setLoading] = useState(true);

  const languages = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' }
  ];

  const codeTemplates = {
    javascript: `function solution(nums, target) {
    // Your code here
    
}`,
    python: `def solution(nums, target):
    # Your code here
    pass`,
    java: `public class Solution {
    public int[] solution(int[] nums, int target) {
        // Your code here
        
    }
}`,
    cpp: `#include <vector>
using namespace std;

class Solution {
public:
    vector<int> solution(vector<int>& nums, int target) {
        // Your code here
        
    }
};`
  };

  useEffect(() => {
    fetchQuestion();
  }, [id]);

  useEffect(() => {
    setCode(codeTemplates[language] || '');
  }, [language]);

  const fetchQuestion = async () => {
    setLoading(true);
    try {
      const response = await practiceService.getQuestionById(id);
      setQuestion(response.data);
      // Set code template after question is loaded
      if (response.data) {
        setCode(codeTemplates[language] || '');
      }
    } catch (error) {
      console.error('Error fetching question:', error);
      setQuestion(null);
    } finally {
      setLoading(false);
    }
  };

  const runCode = async () => {
    setIsRunning(true);
    try {
      const response = await practiceService.submitSolution(id, code, language);
      setTestResults(response.testResults || []);
    } catch (error) {
      console.error('Error running code:', error);
      // Mock test results for development
      setTestResults([
        { passed: true, input: '[2,7,11,15], 9', output: '[0,1]', expected: '[0,1]' },
        { passed: true, input: '[3,2,4], 6', output: '[1,2]', expected: '[1,2]' },
        { passed: false, input: '[3,3], 6', output: 'undefined', expected: '[0,1]' }
      ]);
    } finally {
      setIsRunning(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-slate-600 bg-slate-100';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading question...</p>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Question not found</h2>
          <Link to="/practice-hub" className="text-primary-600 hover:text-primary-700">
            ← Back to Practice Hub
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link
                to="/practice-hub"
                className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
              >
                <ArrowLeftIcon className="w-5 h-5" />
                Back to Hub
              </Link>
              <div className="h-6 w-px bg-slate-300"></div>
              <h1 className="text-lg font-semibold text-slate-900">{question.title}</h1>
              <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
                {question.difficulty}
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
              >
                {languages.map(lang => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
              
              <button
                onClick={runCode}
                disabled={isRunning}
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isRunning ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <PlayIcon className="w-4 h-4" />
                )}
                {isRunning ? 'Running...' : 'Run Code'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-8rem)]">
          {/* Problem Description */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-900 mb-4">{question.title}</h2>
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                  {question.description}
                </p>
              </div>
            </div>
            
            {/* Examples */}
            {question.examples && (
              <div className="p-6 border-b border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Examples</h3>
                <div className="space-y-4">
                  {question.examples.map((example, index) => (
                    <div key={index} className="bg-slate-50 rounded-lg p-4">
                      <div className="mb-2">
                        <span className="text-sm font-medium text-slate-700">Input:</span>
                        <code className="ml-2 text-sm text-slate-900">{example.input}</code>
                      </div>
                      <div className="mb-2">
                        <span className="text-sm font-medium text-slate-700">Output:</span>
                        <code className="ml-2 text-sm text-slate-900">{example.output}</code>
                      </div>
                      {example.explanation && (
                        <div>
                          <span className="text-sm font-medium text-slate-700">Explanation:</span>
                          <span className="ml-2 text-sm text-slate-600">{example.explanation}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Constraints */}
            {question.constraints && (
              <div className="p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Constraints</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-slate-700">
                  {question.constraints.map((constraint, index) => (
                    <li key={index}>{constraint}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Code Editor */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <CodeBracketIcon className="w-5 h-5 text-slate-600" />
                <span className="text-sm font-medium text-slate-700">Code Editor</span>
              </div>
            </div>
            
            <div className="flex-1 flex flex-col">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="flex-1 p-4 font-mono text-sm resize-none focus:outline-none border-none"
                placeholder="Write your solution here..."
              />
              
              {/* Test Results */}
              {testResults.length > 0 && (
                <div className="border-t border-slate-200 p-4 max-h-64 overflow-y-auto">
                  <h4 className="text-sm font-medium text-slate-900 mb-3">Test Results</h4>
                  <div className="space-y-2">
                    {testResults.map((result, index) => (
                      <div key={index} className={`flex items-start gap-3 p-3 rounded-lg ${
                        result.passed ? 'bg-green-50' : 'bg-red-50'
                      }`}>
                        {result.passed ? (
                          <CheckCircleIcon className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        ) : (
                          <XCircleIcon className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="text-sm">
                            <span className="font-medium">Test {index + 1}:</span>
                            <span className={result.passed ? 'text-green-700' : 'text-red-700'}>
                              {result.passed ? ' Passed' : ' Failed'}
                            </span>
                          </div>
                          <div className="text-xs text-slate-600 mt-1">
                            Input: <code>{result.input}</code>
                          </div>
                          {!result.passed && (
                            <>
                              <div className="text-xs text-red-600 mt-1">
                                Your output: <code>{result.output}</code>
                              </div>
                              <div className="text-xs text-green-600 mt-1">
                                Expected: <code>{result.expected}</code>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PracticePage;
