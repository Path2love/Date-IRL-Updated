import React, { useState, useEffect } from 'react';
import type { DateIdea, Feedback } from '../types';
import Icon from './Icon';

interface DateCardProps {
  idea: DateIdea;
  index: number;
  onSave: (idea: DateIdea) => void;
  isSaved: boolean;
  onFeedback: (ideaTitle: string, feedback: Feedback) => void;
  feedbackState?: Feedback;
}

const DetailSection: React.FC<{ title: string; icon: string; children: React.ReactNode; className?: string }> = ({ title, icon, children, className }) => (
  <div className={`mt-4 ${className}`}>
    <h4 className="font-bold text-xs uppercase text-teal dark:text-teal-400 flex items-center gap-2 mb-2 tracking-wider">
      <Icon name={icon} className="h-4 w-4" />
      {title}
    </h4>
    {children}
  </div>
);


const Badge: React.FC<{text: string; className?: string}> = ({text, className}) => (
    <span className={`text-xs font-bold py-1 px-3 rounded-full border ${className}`}>
        {text}
    </span>
);

const DateCard: React.FC<DateCardProps> = ({ idea, index, onSave, isSaved, onFeedback, feedbackState }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  useEffect(() => {
    setIsExpanded(false); // Collapse card when idea changes
  }, [idea.title]);

  const handleGetDirections = () => {
    const query = encodeURIComponent(`${idea.title}, ${idea.address}`);
    const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleShare = async () => {
    const mapsQuery = encodeURIComponent(`${idea.title}, ${idea.address}`);
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;

    const shareData = {
      title: `Date Idea: ${idea.title}`,
      text: `Check out this date idea I found on Date IRL: ${idea.description}\n\nLocation: ${idea.address}`,
      url: mapsUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        const clipboardText = `Check out this date idea: ${idea.title}\n\nDescription: ${idea.description}\nAddress: ${idea.address}\nDirections: ${mapsUrl}`;
        await navigator.clipboard.writeText(clipboardText);
        alert('Date idea copied to clipboard!');
      }
    } catch (error: any) {
        if (error.name !== 'AbortError') {
            console.error('Error sharing:', error);
            alert('Could not share the date idea.');
        }
    }
  };
  
  // Use the AI-generated photo prompt to fetch a dynamic, relevant image from Unsplash Source.
  // This provides more variety than static category images and better reflects the specific idea.
  // The 'sig' parameter with the card's index is added to ensure a unique image is requested
  // for each card, preventing the browser/CDN from serving the same cached image for similar prompts.
  const photoKeywords = idea.photo_prompt ? idea.photo_prompt.split(' ').join(',') : idea.category;
  const imageUrl = `https://source.unsplash.com/800x600/?${encodeURIComponent(photoKeywords)}&sig=${index}`;


  return (
    <div className="bg-white dark:bg-stone-800 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out hover:-translate-y-1 flex flex-col h-full group border border-black/10">
      {/* PHOTO HEADER WITH CONSISTENT GRADIENT */}
      <div className={`relative h-48 w-full rounded-t-xl overflow-hidden bg-gradient-to-br from-burgundy to-brand-blue`}>
        <img src={imageUrl} alt={idea.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110" loading="lazy"/>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent/20"></div>
        <div className="absolute bottom-0 left-0 p-4 w-full">
            <p className="text-xs font-bold uppercase text-white tracking-widest [text-shadow:_0_1px_3px_rgb(0_0_0_/_0.8)]">{idea.category}</p>
            <h3 className="font-serif text-2xl font-bold text-white [text-shadow:_0_2px_4px_rgb(0_0_0_/_0.8)]">{idea.title}</h3>
        </div>
      </div>


      <div className="p-5 flex flex-col flex-grow">
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 leading-relaxed line-clamp-3">{idea.description}</p>
        
        {/* TAGS */}
        <div className="flex flex-wrap gap-2 mb-4">
            {idea.tags.slice(0, 3).map(tag => (
                 <Badge key={tag} text={tag} className="bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300 border-stone-200 dark:border-stone-600" />
            ))}
        </div>
        
        {/* KEY STATS */}
        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4 border-y border-stone-200 dark:border-stone-700 py-3">
            <div className="flex items-center gap-1.5" title="Rating">
              <Icon name="star" className="h-5 w-5 text-yellow-500" />
              <span className="font-bold text-gray-700 dark:text-gray-200">{idea.rating.toFixed(1)}</span>
              <span className="text-xs">({idea.review_count})</span>
            </div>
            <div className="flex items-center gap-1.5" title="Budget">
                <Icon name="cash" className="h-5 w-5 text-green-500"/>
                <span className="font-bold text-gray-700 dark:text-gray-200">{idea.budget}</span>
            </div>
             <div className="flex items-center gap-1.5" title="Duration">
                <Icon name="clock" className="h-5 w-5 text-blue-500"/>
                <span className="font-bold text-gray-700 dark:text-gray-200">{idea.duration}</span>
            </div>
        </div>

        {/* WHY IT'S A MATCH */}
        <div className="bg-stone-100 dark:bg-stone-900 p-3 rounded-lg mb-4">
           <DetailSection title="Why it's a match" icon="logo">
                <p className="text-sm text-gray-800 dark:text-gray-200">{idea.why_this_is_a_match}</p>
           </DetailSection>
        </div>

        {/* EXPANDABLE SECTION */}
        {isExpanded && (
           <div className="animate-fade-in">
                <DetailSection title="Icebreaker" icon="lightbulb">
                  <p className="text-sm italic text-gray-600 dark:text-gray-400">"{idea.ice_breaker}"</p>
                </DetailSection>

                <DetailSection title="Experience Flow" icon="flow">
                    <ol className="list-decimal list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1">
                        {idea.experience_flow.map((step, i) => <li key={i}>{step}</li>)}
                    </ol>
                </DetailSection>
                
                <DetailSection title="Good to know" icon="info">
                   <div className="flex flex-wrap gap-2">
                    {idea.safety_badges.map(badge => <Badge key={badge} text={badge} className="bg-teal/10 text-teal-800 dark:text-teal-200 border-teal/20" />)}
                    {idea.know_before_you_go.slice(0,2).map(tip => <Badge key={tip} text={tip} className="bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300 border-stone-300 dark:border-stone-600"/>)}
                   </div>
                </DetailSection>
           </div>
        )}

        <div className="mt-auto pt-4 flex flex-col gap-4">
          <button onClick={() => setIsExpanded(!isExpanded)} className="w-full text-center text-sm font-bold text-teal dark:text-teal-300 hover:underline flex items-center justify-center gap-1">
            {isExpanded ? 'Show Less' : 'More Details'}
            <Icon name={isExpanded ? 'chevron-up' : 'chevron-down'} className="h-4 w-4" />
          </button>
          
          {/* ACTION BAR */}
          <div className="flex justify-between items-center gap-2 border-t border-stone-200 dark:border-stone-700 pt-4">
              <div className="flex items-center gap-1">
                 <button onClick={() => onSave(idea)} className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors" aria-label={isSaved ? 'Unsave idea' : 'Save idea'}>
                    <Icon name={isSaved ? "save-filled" : "save"} className={`h-6 w-6 ${isSaved ? 'text-burgundy' : 'text-gray-500 dark:text-gray-400'}`}/>
                 </button>
                 <button onClick={() => onFeedback(idea.title, 'like')} className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors" aria-label="Like idea">
                    <Icon name={feedbackState === 'like' ? 'like-filled' : 'like'} className={`h-6 w-6 ${feedbackState === 'like' ? 'text-green-500' : 'text-gray-400 hover:text-green-500'}`} />
                 </button>
                 <button onClick={() => onFeedback(idea.title, 'dislike')} className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors" aria-label="Dislike idea">
                     <Icon name={feedbackState === 'dislike' ? 'dislike-filled' : 'dislike'} className={`h-6 w-6 ${feedbackState === 'dislike' ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`} />
                 </button>
                 <button onClick={handleShare} className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors" aria-label="Share idea">
                    <Icon name="share" className="h-6 w-6 text-gray-500 dark:text-gray-400"/>
                 </button>
              </div>
              <button onClick={handleGetDirections} className="bg-burgundy text-white font-bold py-2 px-5 rounded-lg hover:bg-opacity-90 transition-all duration-300 shadow-md border-2 border-black/20 transform group-hover:scale-105 text-base">
                  Directions
              </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DateCard;