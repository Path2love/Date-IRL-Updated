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
import Onboarding from './components/Onboarding';
import WelcomeScreen from './components/WelcomeScreen';
import Footer from './components/Footer';

const App: React.FC = () => {
  const [profile, setProfile] = useState<ProfileState | null>(null);
  const [email, setEmail] = useState<string>('');
  const [view, setView] = useState<'loading' | 'welcome' | 'onboarding' | 'main'>('loading');
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
  
  useEffect(() => {
    try {
      const onboardingFlag = localStorage.getItem('onboardingComplete');
      if (onboardingFlag === 'true') {
        const savedProfile = localStorage.getItem('userProfile');
        const savedEmail = localStorage.getItem('userEmail');
        
        if (savedProfile) {
          setProfile(JSON.parse(savedProfile));
        } else {
          setProfile(INITIAL_PROFILE);
        }
        if (savedEmail) {
            setEmail(savedEmail);
        }
        
        setSubscriptionStatus('free'); // Default to free plan after onboarding
        setView('main');
      } else {
        setView('welcome');
      }
    } catch (e) {
      console.error("Could not load from local storage", e);
      setView('welcome');
    }
  }, []);

  const handleStartOnboarding = () => {
    setView('onboarding');
  };

  const handleOnboardingComplete = (finalProfile: ProfileState, userEmail: string) => {
    try {
      localStorage.setItem('userProfile', JSON.stringify(finalProfile));
      localStorage.setItem('userEmail', userEmail);
      localStorage.setItem('onboardingComplete', 'true');
    } catch (e) {
      console.error("Could not save to local storage", e);
    } finally {
      setProfile(finalProfile);
      setEmail(userEmail);
      setSubscriptionStatus('free');
      setView('main');
      handleSearch(finalProfile, 'find_date_spot');
    }
  };

  const handleSearch = useCallback(async (newProfile: ProfileState, intent: UserIntent) => {
    if (subscriptionStatus === 'free' && searchCount >= 5) {
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
      const ideas = await generateDateIdeas(newProfile, intent);
      
      // Set initial ideas without images so the user sees content quickly
      setDateIdeas(ideas);
      setIsLoading(false); // Turn off the main spinner

      // Sequentially generate images and update the UI
      for (let i = 0; i < ideas.length; i++) {
        const idea = ideas[i];
        try {
          const imagePrompt = `${idea.photo_prompt}, ${idea.category}, ${idea.tags.join(', ')}`;
          const imageUrl = await generateImage(imagePrompt);

          setDateIdeas(currentIdeas => {
            const updatedIdeas = [...currentIdeas];
            if (updatedIdeas[i]) {
                updatedIdeas[i] = { ...updatedIdeas[i], imageUrl };
            }
            return updatedIdeas;
          });

        } catch (imgErr) {
          console.error(`Failed to generate image for "${idea.title}":`, imgErr);
          // Keep the idea without an image, the placeholder will show
        }
        // Add a small delay between requests to be respectful of the API rate limits.
        await new Promise(resolve => setTimeout(resolve, 200));
      }

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred. Please try again.');
      setIsLoading(false);
    }
  }, [subscriptionStatus, searchCount]);

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

  const handleSubscribe = (plan: 'premium') => {
    // This function now only handles upgrading to premium
    if (plan === 'premium') {
        setSubscriptionStatus('premium');
        setSearchCount(0); // Reset search count on new subscription
    }
    setIsSignupModalOpen(false);
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
  
  const handleSignupClick = () => setIsSignupModalOpen(true);

  const handleResetApp = useCallback(() => {
    if (window.confirm("Are you sure you want to reset the app? This will clear your profile and return you to the landing page.")) {
        try {
            localStorage.removeItem('onboardingComplete');
            localStorage.removeItem('userProfile');
            localStorage.removeItem('userEmail');
            window.location.reload();
        } catch (e) {
            console.error("Could not clear local storage", e);
            alert("Could not reset app state. Please clear your browser's local storage manually.");
        }
    }
  }, []);

  if (view === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner userIntent="find_date_spot" />
      </div>
    );
  }

  if (view === 'welcome') {
    return <WelcomeScreen onStart={handleStartOnboarding} />;
  }
  
  if (view === 'onboarding') {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen text-gray-800 dark:text-gray-200">
      <Header onSignupClick={handleSignupClick} subscriptionStatus={subscriptionStatus} />
      
      {isSignupModalOpen && (
          <SignupModal 
              onClose={() => setIsSignupModalOpen(false)} 
              onSubscribe={handleSubscribe} 
          />
      )}

      {view === 'main' && profile && (
        <main className="container mx-auto px-4 py-8">
            <Filters 
                onSearch={handleSearch} 
                initialProfile={profile} 
                isLoading={isLoading} 
                userIntent={userIntent}
                onUserIntentChange={setUserIntent}
                subscriptionStatus={subscriptionStatus}
                searchCount={searchCount}
                onUpgradeClick={handleSignupClick}
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
                    onClick={() => handleSearch(profile, userIntent)}
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
      )}
      <Footer onCycleSub={handleCycleSub} onResetApp={handleResetApp} />
    </div>
  );
};

export default App;