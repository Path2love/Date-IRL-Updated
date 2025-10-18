import React, { useState } from 'react';
import type { ProfileState, Archetype, Vibe } from '../types';
import { INITIAL_PROFILE } from '../constants';
import { GENDERS, ORIENTATIONS, ARCHETYPES, VIBES } from '../constants';
import Icon from './Icon';

interface OnboardingProps {
  onComplete: (profile: ProfileState) => void;
}

const ProgressBar: React.FC<{ step: number; totalSteps: number }> = ({ step, totalSteps }) => (
  <div className="w-full bg-gray-200 dark:bg-stone-700 rounded-full h-2.5 mb-8">
    <div
      className="bg-burgundy h-2.5 rounded-full transition-all duration-500"
      style={{ width: `${(step / totalSteps) * 100}%` }}
    ></div>
  </div>
);

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [profile, setProfile] = useState<ProfileState>(INITIAL_PROFILE);
  const totalSteps = 4;

  const handleNext = () => {
    // Add validation before proceeding
    if (currentStep === 2) {
      if (!profile.identity.age) {
        alert('Please enter your age.');
        return;
      }
    }
    if (currentStep === 3) {
        if (!profile.preferences.location.city || !profile.preferences.location.country) {
            alert('Please enter your city and country.');
            return;
        }
    }
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleFinish = () => {
    onComplete(profile);
  };
  
  const handleIdentityChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setProfile(p => ({ ...p, identity: { ...p.identity, [id]: id === 'age' ? (value ? parseInt(value) : '') : value } }));
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setProfile(p => ({ ...p, preferences: { ...p.preferences, location: {...p.preferences.location, [id]: value} } }));
  }

  const handleToggleArchetype = (archetype: Archetype) => {
    setProfile(p => {
        const archetypes = p.personality.archetypes;
        const newArchetypes = archetypes.includes(archetype)
            ? archetypes.filter(a => a !== archetype)
            : [...archetypes, archetype];
        
        if (newArchetypes.length > 3) return p; // Limit to 3

        return { ...p, personality: { ...p.personality, archetypes: newArchetypes } };
    });
  };

    const handleSetVibe = (vibe: Vibe) => {
        setProfile(p => ({...p, personality: {...p.personality, vibe: p.personality.vibe === vibe ? '' : vibe }}))
    }


  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white dark:bg-stone-800 rounded-2xl shadow-2xl p-8 border-2 border-stone-200 dark:border-stone-700">
        <ProgressBar step={currentStep} totalSteps={totalSteps} />

        {currentStep === 1 && (
          <div className="text-center animate-fade-in">
            <Icon name="logo" className="h-16 w-16 mx-auto mb-4 text-burgundy" />
            <h1 className="text-4xl font-serif font-bold text-gray-800 dark:text-white mb-4">Welcome to Date IRL</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">Let's create a profile to help us find the perfect, personalized experiences for you.</p>
          </div>
        )}

        {currentStep === 2 && (
          <div className="animate-fade-in">
            <h2 className="text-3xl font-serif font-bold text-center mb-6 text-gray-800 dark:text-white">Tell us about you</h2>
            <div className="space-y-6">
                <input type="number" id="age" value={profile.identity.age} onChange={handleIdentityChange} min="18" max="99" placeholder="Age" className="w-full p-4 bg-gray-100 dark:bg-stone-700 border border-gray-300 dark:border-stone-600 rounded-lg focus:ring-burgundy focus:border-burgundy transition font-semibold" required/>
                <select id="gender" value={profile.identity.gender} onChange={handleIdentityChange} className="w-full p-4 bg-gray-100 dark:bg-stone-700 border border-gray-300 dark:border-stone-600 rounded-lg focus:ring-burgundy focus:border-burgundy transition font-semibold">
                    <option value="">Select Gender</option>
                    {GENDERS.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
                <select id="orientation" value={profile.identity.orientation} onChange={handleIdentityChange} className="w-full p-4 bg-gray-100 dark:bg-stone-700 border border-gray-300 dark:border-stone-600 rounded-lg focus:ring-burgundy focus:border-burgundy transition font-semibold">
                    <option value="">Select Orientation</option>
                    {ORIENTATIONS.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="animate-fade-in">
            <h2 className="text-3xl font-serif font-bold text-center mb-6 text-gray-800 dark:text-white">Where are you located?</h2>
             <div className="space-y-6">
                <input type="text" id="city" value={profile.preferences.location.city} onChange={handleLocationChange} placeholder="City (e.g., San Francisco)" className="w-full p-4 bg-gray-100 dark:bg-stone-700 border border-gray-300 dark:border-stone-600 rounded-lg focus:ring-burgundy focus:border-burgundy transition font-semibold" required/>
                <input type="text" id="country" value={profile.preferences.location.country} onChange={handleLocationChange} placeholder="Country (e.g., USA)" className="w-full p-4 bg-gray-100 dark:bg-stone-700 border border-gray-300 dark:border-stone-600 rounded-lg focus:ring-burgundy focus:border-burgundy transition font-semibold" required/>
                <input type="text" id="postalCode" value={profile.preferences.location.postalCode} onChange={handleLocationChange} placeholder="Postal / Zip Code (Optional)" className="w-full p-4 bg-gray-100 dark:bg-stone-700 border border-gray-300 dark:border-stone-600 rounded-lg focus:ring-burgundy focus:border-burgundy transition font-semibold" />
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="animate-fade-in">
            <h2 className="text-3xl font-serif font-bold text-center mb-2 text-gray-800 dark:text-white">What's your personality?</h2>
            <p className="text-center text-gray-500 dark:text-gray-400 mb-6">Select up to 3 archetypes that best describe you.</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
              {ARCHETYPES.map(a => (
                  <button type="button" key={a.name} onClick={() => handleToggleArchetype(a.name)}
                      className={`p-4 rounded-lg border-2 transition-all text-center flex flex-col items-center gap-2 ${profile.personality.archetypes.includes(a.name) ? 'border-teal shadow-lg bg-teal/10' : 'border-gray-300 dark:border-stone-600 bg-white dark:bg-stone-900 hover:border-teal/50'}`}>
                      <Icon name={a.icon} className="h-8 w-8 text-teal"/>
                      <span className="font-bold text-sm">{a.name}</span>
                  </button>
              ))}
            </div>
             <h2 className="text-2xl font-serif font-bold text-center mb-4 text-gray-800 dark:text-white">Choose a vibe for tonight</h2>
             <div className="flex flex-wrap gap-2 justify-center">
                {VIBES.map((v) => (
                <button key={v} type="button" onClick={() => handleSetVibe(v)}
                    className={`py-2 px-4 rounded-full text-sm font-semibold transition-all duration-300 border-2 ${profile.personality.vibe === v ? 'bg-burgundy text-white shadow-md border-transparent' : 'bg-gray-100 dark:bg-stone-700 border-gray-300 dark:border-stone-600 hover:border-burgundy'}`}>
                    {v}
                </button>
                ))}
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-between items-center">
          {currentStep > 1 ? (
            <button onClick={handleBack} className="py-3 px-6 bg-gray-200 dark:bg-stone-600 text-gray-800 dark:text-white font-bold rounded-lg hover:bg-gray-300 transition-colors">
              Back
            </button>
          ) : <div />}
          
          <button 
            onClick={currentStep < totalSteps ? handleNext : handleFinish} 
            className={`py-3 px-6 text-white font-bold rounded-lg hover:bg-opacity-90 transition-colors ${currentStep < totalSteps ? 'bg-burgundy' : 'bg-teal'}`}
          >
            {currentStep < totalSteps ? 'Next' : "Let's Find Some Dates!"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;