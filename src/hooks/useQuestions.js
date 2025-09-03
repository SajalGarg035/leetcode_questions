import { useState, useEffect } from 'react';
import { loadQuestionsFromCSV } from '../services/csvService';

export const useQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [displayedQuestions, setDisplayedQuestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [completedQuestions, setCompletedQuestions] = useState(new Set());

  const QUESTIONS_PER_PAGE = 5;

  const loadQuestions = async (company) => {
    console.log(`🎯 useQuestions.loadQuestions called with company: "${company}"`);
    console.log(`🎯 Company type:`, typeof company);
    console.log(`🎯 Company truthy check:`, !!company);
    
    if (!company) {
      console.log(`❌ No company provided, returning early`);
      return;
    }
    
    console.log(`📞 About to call loadQuestionsFromCSV for: ${company}`);
    setLoading(true);
    try {
      const questionData = await loadQuestionsFromCSV(company);
      console.log(`✅ loadQuestionsFromCSV completed for ${company}`);
      console.log(`Received question data:`, questionData);
      console.log(`Question data length:`, questionData.length);
      
      setQuestions(questionData);
      setCurrentPage(0);
      setCompletedQuestions(new Set());
    } catch (error) {
      console.error(`💥 Error in loadQuestions for ${company}:`, error);
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreQuestions = () => {
    setCurrentPage(prevPage => prevPage + 1);
  };

  const toggleQuestion = (index) => {
    const newCompleted = new Set(completedQuestions);
    if (newCompleted.has(index)) {
      newCompleted.delete(index);
    } else {
      newCompleted.add(index);
    }
    setCompletedQuestions(newCompleted);
  };

  useEffect(() => {
    const startIndex = 0;
    const endIndex = (currentPage + 1) * QUESTIONS_PER_PAGE;
    const slicedQuestions = questions.slice(startIndex, endIndex);
    
    console.log(`useEffect - questions.length: ${questions.length}`);
    console.log(`useEffect - currentPage: ${currentPage}`);
    console.log(`useEffect - endIndex: ${endIndex}`);
    console.log(`useEffect - sliced questions:`, slicedQuestions);
    
    setDisplayedQuestions(slicedQuestions);
  }, [questions, currentPage]);

  const hasMoreQuestions = (currentPage + 1) * QUESTIONS_PER_PAGE < questions.length;

  return {
    questions,
    displayedQuestions,
    loading,
    completedQuestions,
    hasMoreQuestions,
    loadQuestions,
    loadMoreQuestions,
    toggleQuestion
  };
};
