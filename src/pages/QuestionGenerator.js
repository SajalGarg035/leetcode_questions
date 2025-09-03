import React, { useState } from 'react';
import geminiService from '../services/geminiService';

const QuestionGenerator = () => {
  const [userRequest, setUserRequest] = useState('');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userRequest.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const generatedQuestions = await geminiService.generateQuestions(userRequest);
      setQuestions(generatedQuestions);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'text-green-600 bg-green-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'hard': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getPlatformColor = (platform) => {
    const colors = {
      'leetcode': 'bg-orange-100 text-orange-800',
      'codeforces': 'bg-blue-100 text-blue-800',
      'atcoder': 'bg-purple-100 text-purple-800',
      'codechef': 'bg-yellow-100 text-yellow-800',
      'interviewbit': 'bg-green-100 text-green-800'
    };
    return colors[platform?.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            AI Question Generator
          </h1>

          {/* Request Form */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="request" className="block text-sm font-medium text-gray-700 mb-2">
                  What kind of questions would you like?
                </label>
                <textarea
                  id="request"
                  rows={3}
                  value={userRequest}
                  onChange={(e) => setUserRequest(e.target.value)}
                  placeholder="e.g., 'Generate medium level dynamic programming questions' or 'I need array questions for Google interview' or just 'Give me some questions'"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400 resize-none"
                  disabled={loading}
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={loading || !userRequest.trim()}
                  className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Generating...' : 'Generate Questions'}
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    setUserRequest('');
                    setQuestions([]);
                    setError(null);
                  }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
                  disabled={loading}
                >
                  Clear
                </button>
              </div>
            </form>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}
          </div>

          {/* Generated Questions */}
          {questions.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Generated Questions ({questions.length})
              </h2>

              {questions.map((question, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {question.title}
                      </h3>
                      <p className="text-gray-600 mb-3">
                        {question.description}
                      </p>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPlatformColor(question.platform)}`}>
                        {question.platform}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
                        {question.difficulty}
                      </span>
                    </div>
                  </div>

                  {question.example && (
                    <div className="bg-gray-50 rounded-md p-3 mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Example
                      </h4>
                      <pre className="text-sm text-gray-600 whitespace-pre-wrap font-mono">
                        {question.example}
                      </pre>
                    </div>
                  )}

                  {question.tags && question.tags.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm text-gray-500">Tags:</span>
                      {question.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionGenerator;
                      className="inline-flex items-center text-primary-600 hover:text-primary-800 font-medium"
                    >
                      Solve Problem →
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}

          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionGenerator;
