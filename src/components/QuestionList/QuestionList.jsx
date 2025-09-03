import React from 'react';
import QuestionItem from '../QuestionItem/QuestionItem';
import LoadMoreButton from '../LoadMoreButton/LoadMoreButton';
import './QuestionList.css';

const QuestionList = ({ 
  company, 
  questions, 
  displayedQuestions, 
  completedQuestions, 
  onQuestionToggle, 
  onLoadMore, 
  hasMore, 
  loading 
}) => {
  // Debug: Log the props to see what's being passed
  console.log(`QuestionList - company: ${company}`);
  console.log(`QuestionList - questions:`, questions);
  console.log(`QuestionList - questions.length: ${questions.length}`);
  console.log(`QuestionList - displayedQuestions:`, displayedQuestions);
  console.log(`QuestionList - displayedQuestions.length: ${displayedQuestions.length}`);
  console.log(`QuestionList - loading: ${loading}`);

  if (loading) {
    return (
      <div className="question-list__loading">
        <div className="spinner"></div>
        <p>Loading questions...</p>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="question-list__empty">
        <p>No questions found for {company}. Please check if the CSV file exists and has valid data.</p>
      </div>
    );
  }

  return (
    <div className="question-list">
      <div className="question-list__header">
        <h2 className="question-list__title">{company} Questions</h2>
        <div className="question-list__stats">
          <span className="stat">
            {completedQuestions.size} / {questions.length} completed
          </span>
          <span className="stat">
            Showing {displayedQuestions.length} of {questions.length}
          </span>
        </div>
      </div>
      
      <div className="question-list__items">
        {displayedQuestions.map((question, index) => (
          <QuestionItem
            key={index}
            question={question}
            index={index}
            isCompleted={completedQuestions.has(index)}
            onToggle={() => onQuestionToggle(index)}
          />
        ))}
      </div>

      {hasMore && (
        <LoadMoreButton onClick={onLoadMore} />
      )}

      {!hasMore && questions.length > 0 && (
        <div className="question-list__complete">
          🎉 All questions loaded! Keep practicing!
        </div>
      )}
    </div>
  );
};

export default QuestionList;
