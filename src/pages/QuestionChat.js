import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  UserIcon,
  SparklesIcon,
  CodeBracketIcon,
  LightBulbIcon,
  ClipboardDocumentIcon
} from '@heroicons/react/24/outline';
import geminiService from '../services/geminiService';

const QuestionChat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: "Hi! I'm your coding assistant. Ask me any questions about algorithms, data structures, or programming concepts. I can also generate solutions and explanations for specific problems!",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateSolution = async (question) => {
    setLoading(true);
    try {
      const solutionPrompt = `Generate a comprehensive solution for the following coding question:

"${question}"

Please provide:
1. Problem Analysis
2. Approach/Algorithm
3. Code Solution (in Python and Java)
4. Time & Space Complexity
5. Step-by-step explanation
6. Alternative approaches if any

Format the response clearly with sections.`;

      const solution = await geminiService.generateChatResponse(solutionPrompt);
      
      const newMessage = {
        id: Date.now(),
        type: 'bot',
        content: solution,
        timestamp: new Date(),
        isCodeSolution: true
      };
      
      setMessages(prev => [...prev, newMessage]);
    } catch (error) {
      const errorMessage = {
        id: Date.now(),
        type: 'bot',
        content: "Sorry, I couldn't generate a solution at the moment. Please try again.",
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || loading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);

    try {
      const chatPrompt = `You are a helpful coding mentor and assistant. Answer the following question about programming, algorithms, data structures, or coding concepts:

"${inputMessage}"

Provide a clear, helpful response that explains concepts well. If it's about a specific coding problem, offer guidance on approach and methodology. Be encouraging and educational.`;

      const response = await geminiService.generateChatResponse(chatPrompt);
      
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: response,
        timestamp: new Date(),
        originalQuestion: inputMessage
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: "Sorry, I'm having trouble responding right now. Please try again in a moment.",
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (content) => {
    try {
      await navigator.clipboard.writeText(content);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const suggestedQuestions = [
    "How do I approach dynamic programming problems?",
    "What's the difference between BFS and DFS?",
    "How to optimize time complexity in array problems?",
    "Explain the sliding window technique",
    "When should I use recursion vs iteration?"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.header 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="bg-white/70 backdrop-blur-sm shadow-xl rounded-3xl p-6 lg:p-8 border border-white/40">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center">
                  <ChatBubbleLeftRightIcon className="w-6 h-6 text-white" />
                </div>
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-3">
                Coding Assistant Chat
              </h1>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Ask questions about algorithms, get explanations, and generate solutions for coding problems
              </p>
            </div>
          </motion.header>

          {/* Chat Container */}
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl border border-white/40 shadow-xl overflow-hidden">
            {/* Messages Area */}
            <div className="h-96 overflow-y-auto p-6 space-y-4">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${
                      message.type === 'user' 
                        ? 'bg-primary-600 text-white' 
                        : message.isError 
                        ? 'bg-red-100 text-red-700'
                        : 'bg-slate-100 text-slate-800'
                    } rounded-2xl p-4 shadow-sm`}>
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          message.type === 'user' 
                            ? 'bg-white/20' 
                            : 'bg-primary-100'
                        }`}>
                          {message.type === 'user' ? (
                            <UserIcon className="w-4 h-4" />
                          ) : (
                            <SparklesIcon className="w-4 h-4 text-primary-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className={`text-sm whitespace-pre-wrap ${
                            message.isCodeSolution ? 'font-mono' : ''
                          }`}>
                            {message.content}
                          </div>
                          <div className="text-xs opacity-70 mt-2">
                            {message.timestamp.toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                      
                      {/* Action buttons for bot messages */}
                      {message.type === 'bot' && !message.isError && (
                        <div className="flex gap-2 mt-3 pt-3 border-t border-slate-200">
                          <button
                            onClick={() => copyToClipboard(message.content)}
                            className="text-xs px-3 py-1 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors flex items-center gap-1"
                          >
                            <ClipboardDocumentIcon className="w-3 h-3" />
                            Copy
                          </button>
                          
                          {message.originalQuestion && !message.isCodeSolution && (
                            <button
                              onClick={() => generateSolution(message.originalQuestion)}
                              disabled={loading}
                              className="text-xs px-3 py-1 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors flex items-center gap-1 disabled:opacity-50"
                            >
                              <CodeBracketIcon className="w-3 h-3" />
                              Generate Solution
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-slate-100 text-slate-800 rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                        <SparklesIcon className="w-4 h-4 text-primary-600" />
                      </div>
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Questions */}
            {messages.length === 1 && (
              <div className="px-6 pb-4">
                <p className="text-sm text-slate-600 mb-3">Try asking:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestedQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => setInputMessage(question)}
                      className="text-xs px-3 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="border-t border-white/30 p-6">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask me anything about coding, algorithms, or get help with problems..."
                  className="flex-1 px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                  disabled={loading}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={loading || !inputMessage.trim()}
                  className="px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
                >
                  <PaperAirplaneIcon className="w-4 h-4" />
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionChat;
