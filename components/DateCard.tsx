import React, { useState, useEffect } from 'react';
import type { DateIdea, Feedback } from '../types';
import Icon from './Icon';

interface DateCardProps {
  idea: DateIdea;
  onSave: (idea: DateIdea) => void;
  isSaved: boolean;
  onFeedback: (ideaTitle: string, feedback: Feedback) => void;
  feedbackState?: Feedback;
}

const Section: React.FC<{ title: string; icon: string; children: React.ReactNode; className?: string }> = ({ title, icon, children, className }) => (
  <div className={`mt-4 ${className}`}>
    <h4 className="font-bold text-sm uppercase text-teal dark:text-teal-400 flex items-center gap-2 mb-2 tracking-wider">
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


const DateCard: React.FC<DateCardProps> = ({ idea, onSave, isSaved, onFeedback, feedbackState }) => {
  const initialUrl = `https://source.unsplash.com/400x300/?${encodeURIComponent(idea.photo_prompt)}`;
  const categoryFallbackUrl = `https://source.unsplash.com/400x300/?${encodeURIComponent(idea.category)}`;
  const guaranteedPlaceholderUrl = `https://placehold.co/400x300/691d33/FFFFFF?text=${encodeURIComponent(idea.category)}`;

  const [imgSrc, setImgSrc] = useState(initialUrl);
  const [loadAttempt, setLoadAttempt] = useState(0);

  useEffect(() => {
    setImgSrc(initialUrl);
    setLoadAttempt(0);
  }, [idea.photo_prompt, initialUrl]);

  const handleImageError = () => {
    if (loadAttempt === 0) {
      setImgSrc(categoryFallbackUrl);
    } else if (loadAttempt === 1) {
      setImgSrc(guaranteedPlaceholderUrl);
    }
    setLoadAttempt(prev => prev + 1);
  };

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
        // Ignore AbortError which is thrown when the user cancels the share dialog
        if (error.name !== 'AbortError') {
            console.error('Error sharing:', error);
            alert('Could not share the date idea.');
        }
    }
  };

  return (
    <div className="bg-white dark:bg-stone-800 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out hover:-translate-y-1 flex flex-col h-full group border border-brand-blue">
      <div className="relative h-48 w-full overflow-hidden rounded-t-xl">
        <img 
            src={imgSrc} 
            alt={idea.title} 
            className="w-full h-full object-cover bg-stone-200 dark:bg-stone-700 transition-transform duration-500 ease-in-out group-hover:scale-110" 
            onError={handleImageError}
        />
        <div className="absolute top-3 right-3 flex flex-wrap gap-2 justify-end">
            {idea.tags.slice(0, 2).map(tag => (
                 <Badge key={tag} text={tag} className="bg-black/60 text-white backdrop-blur-sm border-white/20" />
            ))}
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <h3 className="font-serif text-2xl font-bold text-gray-800 dark:text-white mb-2">{idea.title}</h3>
        
        <div className="text-gray-600 dark:text-gray-300 text-sm flex items-start gap-2 mb-2">
            <Icon name="location" className="h-5 w-5 mt-0.5 shrink-0 text-gray-400"/>
            <p className="font-semibold">{idea.address}</p>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
            <div className="flex items-center gap-1 text-yellow-500">
              <Icon name="star" className="h-5 w-5" />
              <span className="font-bold">{idea.rating.toFixed(1)}</span>
              <span>({idea.review_count})</span>
            </div>
            <div className="flex items-center gap-1">
                <Icon name="cash" className="h-5 w-5 text-green-500"/>
                <span className="font-bold text-gray-700 dark:text-gray-200">{idea.budget}</span>
            </div>
        </div>

        <p className="text-gray-600 dark:text-gray-300 text-sm flex-grow mb-4">{idea.description}</p>
        
        <div className="bg-stone-100 dark:bg-stone-900 p-4 rounded-lg my-4">
           <Section title="Why it's a match" icon="logo">
                <p className="text-sm text-gray-800 dark:text-gray-200">{idea.why_this_is_a_match}</p>
           </Section>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
            <Section title="Duration" icon="clock">
                <p className="font-semibold text-sm">{idea.duration}</p>
            </Section>
            <Section title="Distance" icon="location">
                 <p className="font-semibold text-sm">{idea.distance_eta}</p>
            </Section>
        </div>

        <Section title="Icebreaker" icon="lightbulb">
          <p className="text-sm italic text-gray-600 dark:text-gray-400">"{idea.ice_breaker}"</p>
        </Section>

        <Section title="Experience Flow" icon="flow">
            <ol className="list-decimal list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1">
                {idea.experience_flow.map((step, i) => <li key={i}>{step}</li>)}
            </ol>
        </Section>
        
        <Section title="Good to know" icon="info">
           <div className="flex flex-wrap gap-2">
            {idea.safety_badges.map(badge => <Badge key={badge} text={badge} className="bg-teal/10 text-teal-800 dark:text-teal-200 border-teal/20" />)}
            {idea.know_before_you_go.slice(0,2).map(tip => <Badge key={tip} text={tip} className="bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300 border-stone-300 dark:border-stone-600"/>)}
           </div>
        </section>

        <div className="flex items-center justify-center my-4 p-2 rounded-full bg-stone-100 dark:bg-stone-700/50 gap-4">
            <button onClick={() => onFeedback(idea.title, 'like')} className="p-2 rounded-full transition-colors" aria-label="Like idea">
                <Icon name={feedbackState === 'like' ? 'like-filled' : 'like'} className={`h-7 w-7 ${feedbackState === 'like' ? 'text-green-500' : 'text-gray-400 hover:text-green-500'}`} />
            </button>
            <div className="w-px h-6 bg-stone-300 dark:bg-stone-600"></div>
            <button onClick={() => onFeedback(idea.title, 'dislike')} className="p-2 rounded-full transition-colors" aria-label="Dislike idea">
                 <Icon name={feedbackState === 'dislike' ? 'dislike-filled' : 'dislike'} className={`h-7 w-7 ${feedbackState === 'dislike' ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`} />
            </button>
        </div>
        
        <div className="mt-auto pt-4 flex justify-between items-center gap-2 border-t border-stone-200 dark:border-stone-700">
            <div>
                 <button onClick={() => onSave(idea)} className="p-2 rounded-full hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors" aria-label={isSaved ? 'Unsave idea' : 'Save idea'}>
                    <Icon name={isSaved ? "save-filled" : "save"} className={`h-6 w-6 ${isSaved ? 'text-burgundy' : 'text-gray-500'}`}/>
                 </button>
                 <button onClick={handleShare} className="p-2 rounded-full hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors" aria-label="Share idea">
                    <Icon name="share" className="h-6 w-6 text-gray-500"/>
                 </button>
            </div>
            <button onClick={handleGetDirections} className="bg-burgundy text-white font-bold py-3 px-6 rounded-lg hover:bg-opacity-90 transition-all duration-300 shadow-md border-2 border-black/20 transform group-hover:scale-105 text-base">
                Directions
            </button>
        </div>
      </div>
    </div>
  );
};

export default DateCard;