import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import corePracticeService from '../services/corePracticeService';

const TOPICS = [
  { key: 'dbms', label: 'DBMS' },
  { key: 'os', label: 'Operating Systems' },
  { key: 'cn', label: 'Computer Networks' },
  { key: 'oops', label: 'OOPS' },
  { key: 'se', label: 'Software Engineering' },
  { key: 'hr', label: 'HR / Behavioral' }
];

const DIFFICULTIES = ['All', 'Easy', 'Medium', 'Hard'];

const CoreSubjects = () => {
  const [topic, setTopic] = useState('dbms');
  const [mode, setMode] = useState('study'); // study, practice, mcq
  const [difficulty, setDifficulty] = useState('All');
  const [mostAskedOnly, setMostAskedOnly] = useState(false);
  const [companyTag, setCompanyTag] = useState('All');
  const [questions, setQuestions] = useState([]);
  const [expandedIds, setExpandedIds] = useState({});
  const [loading, setLoading] = useState(false);
  const [mcqAnswers, setMcqAnswers] = useState({}); // { id: selectedOptionIndex }

  useEffect(() => {
    loadQuestions();
  }, [topic, difficulty, mostAskedOnly, companyTag]);

  const loadQuestions = async () => {
    setLoading(true);
    try {
      const filters = {
        topic,
        difficulty: difficulty === 'All' ? null : difficulty.toLowerCase(),
        mostAsked: mostAskedOnly,
        company: companyTag === 'All' ? null : companyTag
      };
      const res = await corePracticeService.getCoreQuestions(filters);
      setQuestions(res.data || []);
      setExpandedIds({});
      setMcqAnswers({});
    } catch (err) {
      console.error('Failed to load core questions', err);
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id) => {
    setExpandedIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleMCQSelect = (id, idx, question) => {
    setMcqAnswers(prev => ({ ...prev, [id]: idx }));
  };

  const filtered = questions; // server/mock pre-filters already applied

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-10">
      <div className="max-w-6xl mx-auto px-4">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Core Subjects Practice</h1>
            <p className="text-sm text-slate-600 mt-1">Study core CS topics aggregated from GfG, TutorialsPoint, Javatpoint, InterviewBit and more.</p>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-sm text-primary-600 hover:underline flex items-center gap-1">
              Back Home <ArrowRightIcon className="w-4 h-4 rotate-180" />
            </Link>
          </div>
        </header>

        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6 flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
          <div className="flex gap-3 flex-wrap">
            {TOPICS.map(t => (
              <button
                key={t.key}
                onClick={() => setTopic(t.key)}
                className={`px-3 py-2 rounded-full text-sm font-medium ${topic === t.key ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <label className="text-sm text-slate-600">Mode</label>
              <select value={mode} onChange={(e) => setMode(e.target.value)} className="px-3 py-2 border rounded-lg">
                <option value="study">Study Mode</option>
                <option value="practice">Practice Mode</option>
                <option value="mcq">MCQ Mode</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm text-slate-600">Difficulty</label>
              <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="px-3 py-2 border rounded-lg">
                {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm text-slate-600">Most Asked</label>
              <input type="checkbox" checked={mostAskedOnly} onChange={(e) => setMostAskedOnly(e.target.checked)} />
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm text-slate-600">Company</label>
              <select value={companyTag} onChange={(e) => setCompanyTag(e.target.value)} className="px-3 py-2 border rounded-lg">
                <option>All</option>
                <option>Amazon</option>
                <option>TCS</option>
                <option>Infosys</option>
                <option>Google</option>
                <option>Microsoft</option>
              </select>
            </div>
          </div>
        </div>

        <section>
          {loading ? (
            <div className="text-center py-20 text-slate-600">Loading questions...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-slate-600">No questions found. Try different filters.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((q) => (
                <article key={q.id} className="bg-white rounded-2xl p-5 shadow group">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-semibold text-slate-900">{q.question}</h3>
                    <div className="text-xs text-slate-500">{q.difficulty || 'Medium'}</div>
                  </div>

                  <div className="flex items-center gap-2 mt-3 flex-wrap">
                    {q.companyTags && q.companyTags.slice(0,3).map((c, i) => (
                      <span key={i} className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs">{c}</span>
                    ))}
                    <a href={q.sourceUrl} target="_blank" rel="noreferrer" className="ml-auto text-xs text-primary-600 hover:underline">Source</a>
                  </div>

                  <div className="mt-4">
                    {mode === 'mcq' && q.isMCQ ? (
                      <div className="space-y-2">
                        {q.options.map((opt, idx) => {
                          const selected = mcqAnswers[q.id] === idx;
                          const correct = q.correctOption === opt;
                          const showResult = selected;
                          const resultClass = showResult ? (correct ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300') : 'bg-slate-50';
                          return (
                            <button
                              key={idx}
                              onClick={() => handleMCQSelect(q.id, idx, q)}
                              className={`w-full text-left p-3 rounded-lg border ${resultClass} transition`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="text-sm">{opt}</div>
                                {showResult && (
                                  <div className={`text-xs font-medium ${correct ? 'text-green-700' : 'text-red-700'}`}>
                                    {correct ? 'Correct' : 'Incorrect'}
                                  </div>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <>
                        {mode === 'practice' && !expandedIds[q.id] ? (
                          <button onClick={() => toggleExpand(q.id)} className="mt-2 text-sm text-primary-600 hover:underline">Show Answer</button>
                        ) : (
                          <div className="mt-3 text-sm text-slate-700 whitespace-pre-line">
                            {q.answer}
                            <div className="mt-3 text-xs text-slate-500">Source: <a href={q.sourceUrl} target="_blank" rel="noreferrer" className="text-primary-600 hover:underline">{q.sourceName}</a></div>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default CoreSubjects;
               
