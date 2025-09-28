import React from 'react';
import type { DateIdea, FeedbackState } from '../types';
import DateCard from './DateCard';

interface DateCardGridProps {
  dateIdeas: DateIdea[];
  onSave: (idea: DateIdea) => void;
  savedIdeas: DateIdea[];
  onFeedback: (ideaTitle: string, feedback: 'like' | 'dislike') => void;
  feedback: FeedbackState;
}

const DateCardGrid: React.FC<DateCardGridProps> = ({ dateIdeas, onSave, savedIdeas, onFeedback, feedback }) => {
  if (dateIdeas.length === 0) {
    return (
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold mb-2">No Ideas Found</h3>
            <p className="text-gray-600 dark:text-gray-300">Try adjusting your profile for a better result.</p>
        </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 animate-fade-in">
      {dateIdeas.map((idea, index) => {
        const isSaved = savedIdeas.some(savedIdea => savedIdea.title === idea.title && savedIdea.address === idea.address);
        return <DateCard key={`${idea.title}-${index}`} idea={idea} index={index} onSave={onSave} isSaved={isSaved} onFeedback={onFeedback} feedbackState={feedback[idea.title]} />;
      })}
    </div>
  );
};

export default DateCardGrid;