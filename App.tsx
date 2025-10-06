import React, { useState, useCallback, useEffect } from 'react';
import type { DateIdea, ProfileState, UserIntent, SubscriptionStatus, Feedback, FeedbackState } from './types';
import { INITIAL_PROFILE } from './constants';
import { generateDateIdeas, generateImage } from './services/geminiService';
import Header from './components/Header';
import Filters from './components/Filters';
import DateCardGrid from './components/DateCardGrid';
import LoadingSpinner from './components/LoadingSpinner';
import Icon from './components/Icon';
import SignupModal from './components/SignupModal';
import WelcomeScreen from './components/WelcomeScreen';
import Footer from './components/Footer';
import OnboardingTooltip from './components/OnboardingTooltip';

const App: React.FC = () => {
  const [profile, setProfile] = useState<ProfileState>(INITIAL_PROFILE);
  const [userIntent, setUserIntent] = useState<UserIntent>('find_date_spot');
  const [dateIdeas, setDateIdeas] = useState<DateIdea[]>([]);
  const [savedIdeas, setSavedIdeas] = useState<DateIdea[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus>('none');
  const [searchCount, setSearchCount] = useState(0);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackState>({});
  const [showOnboarding, setShowOnboarding] = useState(false);
  
  const handleGetStarted = () => {
    setIsSignupModalOpen(true);
  };

  const handleSearch = useCallback(async (newProfile: ProfileState) => {
    if (subscriptionStatus === 'free' && searchCount >= 5) {
      alert('You have used all your free searches! Please upgrade to continue.');
      setIsSignupModalOpen(true);
      return;
    }
    
    // Increment search count immediately on attempt for free users
    if (subscriptionStatus === 'free') {
      setSearchCount(prev => prev + 1);
    }

    setProfile(newProfile);
    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    setDateIdeas([]);

    try {
      if (!process.env.API_KEY) {
        throw new Error("API key is missing. Please set the API_KEY environment variable.");
      }
      const ideas = await generateDateIdeas(newProfile, userIntent);
      
      const ideasWithImagesPromises = ideas.map(async (idea) => {
        try {
          const imagePrompt = `${idea.photo_prompt}, ${idea.category}, ${idea.tags.join(', ')}`;
          const imageUrl = await generateImage(imagePrompt);
          return { ...idea, imageUrl };
        } catch (imgErr) {
          console.error(`Failed to generate image for "${idea.title}":`, imgErr);
          return { ...idea, imageUrl: undefined };
        }
      });
      
      const ideasWithImages = await Promise.all(ideasWithImagesPromises);
      setDateIdeas(ideasWithImages);

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [userIntent, subscriptionStatus, searchCount]);

  const handleSaveIdea = useCallback((ideaToSave: DateIdea) => {
    const isFirstSave = savedIdeas.length === 0;
    
    setSavedIdeas(prev => {
      const isAlreadySaved = prev.some(idea => idea.title === ideaToSave.title && idea.address === ideaToSave.address);
      if (isAlreadySaved) {
        return prev.filter(idea => !(idea.title === ideaToSave.title && idea.address === ideaToSave.address));
      } else {
        return [...prev, ideaToSave];
      }
    });

    if (isFirstSave) {
        setTimeout(() => {
            const savedSection = document.getElementById('saved-ideas-section');
            savedSection?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    }
  }, [savedIdeas]);

  const handleSubscribe = (plan: 'free' | 'premium') => {
    setSubscriptionStatus(plan);
    setSearchCount(0);
    setIsSignupModalOpen(false);
    setShowOnboarding(true);
  };

  const handleFeedback = useCallback((ideaTitle: string, feedbackType: Feedback) => {
    setFeedback(prev => ({
      ...prev,
      [ideaTitle]: prev[ideaTitle] === feedbackType ? undefined : feedbackType
    }));
  }, []);
  
  const handleCycleSub = () => {
      setSubscriptionStatus(prev => {
          if (prev === 'none') return 'free';
          if (prev === 'free') return 'premium';
          return 'none';
      })
  }


  const ModeButton: React.FC<{ intent: UserIntent, label: string, isPremium?: boolean }> = ({ intent, label, isPremium = false }) => {
    const isLocked = isPremium && subscriptionStatus !== 'premium';
    const buttonClasses = `px-6 py-3 rounded-full font-bold text-lg transition-all duration-300 flex items-center gap-2 ${
      userIntent === intent && !isLocked
        ? 'bg-burgundy text-white shadow-lg' 
        : isLocked
        ? 'bg-gray-200 dark:bg-stone-700 text-gray-400 dark:text-stone-500 cursor-not-allowed'
        : 'bg-gray-100 dark:bg-stone-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-stone-700'
    }`;
    
    return (
      <button
        onClick={() => !isLocked && setUserIntent(intent)}
        className={buttonClasses}
        disabled={isLocked}
        title={isLocked ? "Upgrade to Premium to unlock this feature" : ""}
      >
        {isPremium && <Icon name="event" className="h-5 w-5" />}
        {label}
        {isLocked && <Icon name="lock" className="h-5 w-5" />}
      </button>
    );
  };

  if (subscriptionStatus === 'none') {
    return (
      <div className="min-h-screen text-gray-800 dark:text-gray-200">
        <Header onSignupClick={handleGetStarted} subscriptionStatus={subscriptionStatus} />
        <WelcomeScreen onGetStarted={handleGetStarted} />
        {isSignupModalOpen && (
          <SignupModal 
            onClose={() => setIsSignupModalOpen(false)}
            onSubscribe={handleSubscribe} 
          />
        )}
        <Footer onCycleSub={handleCycleSub} />
      </div>
    );
  }

  return (
    <div className="min-h-screen text-gray-800 dark:text-gray-200">
      <Header onSignupClick={() => setIsSignupModalOpen(true)} subscriptionStatus={subscriptionStatus} />
      
      {isSignupModalOpen && (
          <SignupModal
              onClose={() => setIsSignupModalOpen(false)}
              onSubscribe={handleSubscribe}
          />
      )}

      <OnboardingTooltip
        isVisible={showOnboarding}
        onDismiss={() => setShowOnboarding(false)}
      />

      <main className="container mx-auto px-4 py-8">
        <div className="text-center my-8 p-4 bg-white dark:bg-stone-900 border-2 border-brand-blue rounded-xl shadow-lg">
            <p className="font-semibold text-gray-800 dark:text-gray-200 mb-3">What are you looking for today?</p>
            <div className="flex justify-center items-center flex-wrap gap-4">
               <ModeButton intent="find_date_spot" label="Find a Date Spot" />
               <ModeButton intent="find_singles_spots" label="Find Spots to Meet Singles" />
               <ModeButton intent="find_event" label="Find an Event" isPremium={true} />
            </div>
        </div>

        <Filters 
            onSearch={handleSearch} 
            initialProfile={INITIAL_PROFILE} 
            isLoading={isLoading} 
            userIntent={userIntent}
            subscriptionStatus={subscriptionStatus}
            searchCount={searchCount}
        />
        
        <div className="mt-12">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <LoadingSpinner userIntent={userIntent}/>
            </div>
          ) : error ? (
            <div className="text-center p-8 bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300 rounded-lg shadow-md border border-red-500/50">
              <Icon name="error" className="h-12 w-12 mx-auto mb-4 text-red-500" />
              <h3 className="text-2xl font-bold font-serif mb-2">Oops! Something went wrong.</h3>
              <p className="mb-4">{error}</p>
              <button
                onClick={() => handleSearch(profile)}
                className="bg-burgundy text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-all duration-300"
              >
                Try Again
              </button>
            </div>
          ) : hasSearched ? (
            <DateCardGrid dateIdeas={dateIdeas} onSave={handleSaveIdea} savedIdeas={savedIdeas} onFeedback={handleFeedback} feedback={feedback} />
          ) : (
             <div className="text-center p-8 md:p-16 text-white/70">
                <p>Fill out your Date Profile above and click the button to discover intentional experiences curated just for you.</p>
            </div>
          )}
        </div>

        {savedIdeas.length > 0 && (
          <div id="saved-ideas-section" className="mt-16">
            <h2 className="text-3xl font-serif text-center mb-8 text-white [text-shadow:_0_2px_4px_rgb(0_0_0_/_0.5)]">My Saved Ideas</h2>
            <DateCardGrid dateIdeas={savedIdeas} onSave={handleSaveIdea} savedIdeas={savedIdeas} onFeedback={handleFeedback} feedback={feedback}/>
          </div>
        )}
      </main>
      <Footer onCycleSub={handleCycleSub} />
    </div>
  );
};

export default App;