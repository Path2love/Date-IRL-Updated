import React from 'react';
import type { DateIdea, FeedbackState } from '../types';
import DateCard from './DateCard';
import Icon from './Icon';

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
        <div className="text-center p-8 md:p-12 bg-white dark:bg-stone-800 rounded-lg shadow-lg border-2 border-brand-blue/50">
            <Icon name="search" className="h-16 w-16 mx-auto mb-4 text-burgundy/50" />
            <h3 className="text-3xl font-serif font-bold mb-2 text-gray-800 dark:text-white">No Matches Found... Yet!</h3>
            <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto">
                Our AI couldn't find the perfect spot with your current settings. Try broadening your search radius or adjusting your archetypes for more curated results.
            </p>
        </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 animate-fade-in">
      {dateIdeas.map((idea, index) => {
        const isSaved = savedIdeas.some(savedIdea => savedIdea.title === idea.title && savedIdea.address === idea.address);
        return <DateCard key={`${idea.title}-${index}`} idea={idea} onSave={onSave} isSaved={isSaved} onFeedback={onFeedback} feedbackState={feedback[idea.title]} />;
      })}
    </div>
  );
};

export default DateCardGrid;