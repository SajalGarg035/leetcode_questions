import React from 'react';
import './QuestionItem.css';

const QuestionItem = ({ question, index, isCompleted, onToggle }) => {
  // Debug: Log the question object to see its structure
  console.log(`Question ${index + 1}:`, question);
  console.log(`Question keys:`, Object.keys(question));
  console.log(`Question.question:`, question.question);
  console.log(`Question.title:`, question.title);
  console.log(`Question.difficulty:`, question.difficulty);
  console.log('---');

  const getDifficultyClass = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'difficulty--easy';
      case 'medium': return 'difficulty--medium';
      case 'hard': return 'difficulty--hard';
      default: return 'difficulty--unknown';
    }
  };

  const formatAcceptanceRate = (rate) => {
    if (!rate) return null;
    const percentage = Math.round(parseFloat(rate) * 100);
    return `${percentage}%`;
  };

  const formatFrequency = (freq) => {
    if (!freq) return null;
    return parseFloat(freq).toFixed(1);
  };

  const formatTopics = (topics) => {
    if (!topics) return null;
    // Remove quotes and limit length
    const cleanTopics = topics.replace(/"/g, '');
    return cleanTopics.length > 50 ? `${cleanTopics.substring(0, 50)}...` : cleanTopics;
  };

  return (
    <div className={`question-item ${isCompleted ? 'question-item--completed' : ''}`}>
      <div className="question-item__checkbox">
        <input
          type="checkbox"
          id={`question-${index}`}
          checked={isCompleted}
          onChange={onToggle}
          className="checkbox"
        />
        <label htmlFor={`question-${index}`} className="checkbox-label">
          <span className="checkmark"></span>
        </label>
      </div>
      
      <div className="question-item__content">
        <div className="question-item__header">
          <h3 className="question-item__title">
            {question.question || question.title || `Question ${index + 1}`}
          </h3>
          <span className="question-item__number">#{index + 1}</span>
        </div>
        
        <div className="question-item__meta">
          {question.difficulty && (
            <span className={`difficulty ${getDifficultyClass(question.difficulty)}`}>
              {question.difficulty}
            </span>
          )}
          
          {question.frequency && (
            <span className="frequency">
              🔥 {formatFrequency(question.frequency)}
            </span>
          )}
          
          {question.acceptanceRate && (
            <span className="acceptance-rate">
              ✅ {formatAcceptanceRate(question.acceptanceRate)}
            </span>
          )}
          
          {question.category && (
            <span className="category" title={question.category}>
              {formatTopics(question.category)}
            </span>
          )}
          
          {question.link && (
            <a 
              href={question.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="question-link"
              onClick={(e) => e.stopPropagation()}
            >
              View Problem →
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionItem;
