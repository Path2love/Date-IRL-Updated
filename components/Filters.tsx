import React, { useState, useEffect } from 'react';
import type { ProfileState, Archetype, CommunicationStyle, LoveGoal, Budget, Availability, TimeOfDay, Vibe, UserIntent, SubscriptionStatus } from '../types';
import { VIBES, ARCHETYPES, COMMUNICATION_STYLES, LOVE_GOALS, GENDERS, ORIENTATIONS, BUDGETS, AVAILABILITY_DAYS, AVAILABILITY_TIMES } from '../constants';
import Icon from './Icon';

interface FiltersProps {
  onSearch: (profile: ProfileState, intent: UserIntent) => void;
  initialProfile: ProfileState;
  isLoading: boolean;
  userIntent: UserIntent;
  onUserIntentChange: (intent: UserIntent) => void;
  subscriptionStatus: SubscriptionStatus;
  searchCount: number;
  onUpgradeClick: () => void;
}

const SectionHeader: React.FC<{ title: string, subtitle?: string}> = ({ title, subtitle }) => (
    <div className="pt-8 pb-4 border-t border-gray-200 dark:border-stone-700 first:pt-0 first:border-t-0">
        <h3 className="text-2xl font-serif text-burgundy dark:text-accent">{title}</h3>
        {subtitle && <p className="text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>}
    </div>
);

const PremiumLock: React.FC<{ onClick: () => void }> = ({ onClick }) => (
    <button
        type="button"
        onClick={onClick}
        className="relative w-full p-6 text-center bg-gray-100 dark:bg-stone-800 rounded-lg overflow-hidden my-4 hover:bg-gray-200 dark:hover:bg-stone-700 transition-colors"
    >
        <Icon name="lock" className="h-8 w-8 mx-auto text-gray-400 dark:text-gray-500 mb-2"/>
        <h4 className="font-bold text-gray-700 dark:text-gray-300">Unlock Advanced Filters</h4>
        <p className="text-sm text-gray-500 dark:text-gray-400">Upgrade to Premium to personalize with Archetypes, Styles, and Goals.</p>
    </button>
);


const Filters: React.FC<FiltersProps> = ({ onSearch, initialProfile, isLoading, userIntent, onUserIntentChange, subscriptionStatus, searchCount, onUpgradeClick }) => {
  const [profile, setProfile] = useState<ProfileState>(initialProfile);
  const isPremium = subscriptionStatus === 'premium';

  useEffect(() => {
    setProfile(initialProfile);
  }, [initialProfile]);

  const handleIdentityChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setProfile(p => ({ ...p, identity: { ...p.identity, [id]: id === 'age' ? (value ? parseInt(value) : '') : value } }));
  };
  
  const handlePreferenceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
     if (id === 'city' || id === 'country' || id === 'postalCode') {
        setProfile(p => ({ ...p, preferences: { ...p.preferences, location: {...p.preferences.location, [id]: value} } }));
    } else {
        setProfile(p => ({ ...p, preferences: { ...p.preferences, [id]: id === 'radius' ? parseInt(value) : value } }));
    }
  };

  const handleToggle = (category: 'personality' | 'style' | 'safety' | 'preferences', key: string, value: any, multi: boolean = true) => {
    setProfile(p => {
        const newProfile = JSON.parse(JSON.stringify(p)); 

        if (category === 'personality' || category === 'style' || category === 'safety') {
            const cat = newProfile[category];
            const currentVal = cat[key];

            if (Array.isArray(currentVal) && multi) {
                const isPresent = currentVal.includes(value);

                const newArray = isPresent
                    ? currentVal.filter((item: any) => item !== value)
                    : [...currentVal, value];

                if (category === 'personality' && key === 'archetypes' && newArray.length > 3) {
                  // Prevent selecting more than 3 archetypes.
                  return p;
                }

                cat[key] = newArray;

            } else if (typeof currentVal === 'boolean') {
                 cat[key] = !currentVal;
            } else {
                 cat[key] = value === currentVal ? '' : value;
            }
        } else if (category === 'preferences') {
            if (key === 'availability') {
                const { type, val } = value;
                const currentArray = newProfile.preferences.availability[type];
                const newArray = currentArray.includes(val)
                    ? currentArray.filter((item: any) => item !== val)
                    : [...currentArray, val];
                newProfile.preferences.availability[type] = newArray;
            } else {
                 (newProfile.preferences as any)[key] = value === newProfile.preferences.budget ? '' : value;
            }
        }
        return newProfile;
    });
};


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(profile, userIntent);
  };
  
  const hasReachedFreeLimit = subscriptionStatus === 'free' && searchCount >= 5;
  const isSubmitDisabled = isLoading || hasReachedFreeLimit;

  const loadingText = userIntent === 'find_date_spot' ? 'Finding Amazing Dates...' : userIntent === 'find_singles_spots' ? 'Finding Great Spots to Meet...' : 'Finding Epic Events...';
  
  let buttonText;
  if (userIntent === 'find_date_spot') buttonText = 'Find Amazing Dates';
  else if (userIntent === 'find_singles_spots') buttonText = 'Find Places to Meet';
  else buttonText = 'Find Cool Events';

  if (isLoading) {
    buttonText = loadingText;
  } else if (hasReachedFreeLimit) {
    buttonText = "Upgrade to Search More";
  }
  
  const ModeButton: React.FC<{ intent: UserIntent, label: string, isPremium?: boolean }> = ({ intent, label, isPremium = false }) => {
    const isLocked = isPremium && subscriptionStatus !== 'premium';
    const buttonClasses = `px-6 py-3 rounded-full font-bold text-lg transition-all duration-300 flex items-center gap-2 ${
      userIntent === intent && !isLocked
        ? 'bg-burgundy text-white shadow-lg' 
        : isLocked
        ? 'bg-gray-200 dark:bg-stone-700 text-gray-400 dark:text-stone-500 cursor-pointer hover:bg-gray-300 dark:hover:bg-stone-600'
        : 'bg-gray-100 dark:bg-stone-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-stone-700'
    }`;
    
    return (
      <button
        type="button"
        onClick={isLocked ? onUpgradeClick : () => onUserIntentChange(intent)}
        className={buttonClasses}
        title={isLocked ? "Upgrade to Premium to unlock this feature" : ""}
      >
        {isPremium && <Icon name="event" className="h-5 w-5" />}
        {label}
        {isLocked && <Icon name="lock" className="h-5 w-5" />}
      </button>
    );
  };


  return (
    <div className="p-4 md:p-8 bg-white dark:bg-stone-900 border-2 border-brand-blue rounded-2xl shadow-2xl">
      <div className="text-center mb-8 p-4 bg-gray-50 dark:bg-stone-800/50 rounded-xl">
          <p className="font-semibold text-gray-800 dark:text-gray-200 mb-3">What are you looking for today?</p>
          <div className="flex justify-center items-center flex-wrap gap-4">
             <ModeButton intent="find_date_spot" label="Find a Date Spot" />
             <ModeButton intent="find_singles_spots" label="Find Spots to Meet Singles" />
             <ModeButton intent="find_event" label="Find an Event" isPremium={true} />
          </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Identity Section */}
        <section>
          <SectionHeader title="Your Identity" />
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <input type="number" id="age" value={profile.identity.age} onChange={handleIdentityChange} min="18" max="99" placeholder="Age" className="p-3 bg-gray-100 dark:bg-stone-800 border border-gray-300 dark:border-stone-700 rounded-lg focus:ring-burgundy focus:border-burgundy transition font-semibold text-gray-800 dark:text-white placeholder-gray-500" required/>
             <select id="gender" value={profile.identity.gender} onChange={handleIdentityChange} className="p-3 bg-gray-100 dark:bg-stone-800 border border-gray-300 dark:border-stone-700 rounded-lg focus:ring-burgundy focus:border-burgundy transition font-semibold text-gray-800 dark:text-white">
                <option value="">Select Gender</option>
                {GENDERS.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
             <select id="orientation" value={profile.identity.orientation} onChange={handleIdentityChange} className="p-3 bg-gray-100 dark:bg-stone-800 border border-gray-300 dark:border-stone-700 rounded-lg focus:ring-burgundy focus:border-burgundy transition font-semibold text-gray-800 dark:text-white">
                <option value="">Select Orientation</option>
                {ORIENTATIONS.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        </section>

        {/* Personality Section */}
        <div className={!isPremium ? 'opacity-50 pointer-events-none' : ''}>
          <section>
            <SectionHeader title="Your Archetypes" subtitle="Select up to 3 that best describe you."/>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {ARCHETYPES.map(a => (
                  <button type="button" key={a.name} onClick={() => handleToggle('personality', 'archetypes', a.name, true)}
                      className={`p-4 rounded-lg border-2 transition-all text-center flex flex-col items-center gap-2 ${profile.personality.archetypes.includes(a.name) ? 'border-teal shadow-lg bg-teal/10' : 'border-gray-300 dark:border-stone-700 bg-white dark:bg-stone-800 hover:border-teal/50'}`}>
                      <Icon name={a.icon} className="h-8 w-8 text-teal"/>
                      <span className="font-bold text-sm text-gray-800 dark:text-gray-200">{a.name}</span>
                  </button>
              ))}
            </div>
          </section>
        </div>
        {!isPremium && <PremiumLock onClick={onUpgradeClick} />}


        <section>
          <SectionHeader title="Choose a Vibe for Tonight" />
          <div className="flex flex-wrap gap-2">
            {VIBES.map((v) => (
              <button key={v} type="button" onClick={() => handleToggle('personality', 'vibe', v, false)}
                className={`py-2 px-4 rounded-full text-sm font-semibold transition-all duration-300 border-2 ${profile.personality.vibe === v ? 'bg-burgundy text-white shadow-md border-transparent' : 'bg-gray-100 text-gray-800 dark:bg-stone-800 dark:text-gray-200 border-gray-300 dark:border-stone-700 hover:border-burgundy'}`}>
                {v}
              </button>
            ))}
          </div>
        </section>
        
        {/* Style Section */}
        <div className={!isPremium ? 'opacity-50 pointer-events-none' : ''}>
          <section>
            <SectionHeader title="Communication Style" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {COMMUNICATION_STYLES.map(s => (
                  <button type="button" key={s} onClick={() => handleToggle('style', 'communication', s)}
                      className={`p-3 rounded-lg border-2 font-semibold ${profile.style.communication.includes(s) ? 'bg-teal text-white border-transparent' : 'bg-gray-100 dark:bg-stone-800 hover:border-teal text-gray-800 dark:text-gray-200 border-gray-300 dark:border-stone-700'}`}>{s}</button>
              ))}
            </div>
            
            <SectionHeader title="Love & Relationship Goals" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {LOVE_GOALS.map(g => (
                  <button type="button" key={g} onClick={() => handleToggle('style', 'goals', g)}
                      className={`p-3 rounded-lg border-2 font-semibold ${profile.style.goals.includes(g) ? 'bg-teal text-white border-transparent' : 'bg-gray-100 dark:bg-stone-800 hover:border-teal text-gray-800 dark:text-gray-200 border-gray-300 dark:border-stone-700'}`}>{g}</button>
              ))}
            </div>
          </section>
        </div>
        {!isPremium && <PremiumLock onClick={onUpgradeClick} />}

        
        {/* Preferences Section */}
        <section>
            <SectionHeader title="Location & Preferences" />
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                  <input type="text" id="city" value={profile.preferences.location.city} onChange={handlePreferenceChange} placeholder="City (e.g., San Francisco)" className="w-full p-3 bg-gray-100 dark:bg-stone-800 border border-gray-300 dark:border-stone-700 rounded-lg focus:ring-burgundy focus:border-burgundy transition font-semibold text-gray-800 dark:text-white placeholder-gray-500" required/>
                  <input type="text" id="country" value={profile.preferences.location.country} onChange={handlePreferenceChange} placeholder="Country (e.g., USA)" className="w-full p-3 bg-gray-100 dark:bg-stone-800 border border-gray-300 dark:border-stone-700 rounded-lg focus:ring-burgundy focus:border-burgundy transition font-semibold text-gray-800 dark:text-white placeholder-gray-500" required/>
                  <input type="text" id="postalCode" value={profile.preferences.location.postalCode} onChange={handlePreferenceChange} placeholder="Postal / Zip Code" className="w-full p-3 bg-gray-100 dark:bg-stone-800 border border-gray-300 dark:border-stone-700 rounded-lg focus:ring-burgundy focus:border-burgundy transition font-semibold text-gray-800 dark:text-white placeholder-gray-500" />
              </div>
              <div>
                  <label htmlFor="radius" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Travel Radius <span className="font-bold text-burgundy">{profile.preferences.radius} miles</span></label>
                  <input type="range" id="radius" min="1" max="50" step="1" value={profile.preferences.radius} onChange={handlePreferenceChange} className="w-full h-2 bg-gray-300 dark:bg-stone-700 rounded-lg appearance-none cursor-pointer accent-burgundy" />
              </div>
              <div>
                   <h4 className="font-semibold mb-3 text-gray-700 dark:text-gray-300">Budget</h4>
                   <div className="flex flex-wrap gap-2">
                      {BUDGETS.map(b => (
                           <button type="button" key={b} onClick={() => handleToggle('preferences', 'budget', b, false)}
                           className={`p-3 rounded-lg border-2 font-semibold ${profile.preferences.budget === b ? 'bg-burgundy text-white border-transparent' : 'bg-gray-100 dark:bg-stone-800 hover:border-burgundy text-gray-800 dark:text-gray-200 border-gray-300 dark:border-stone-700'}`}>{b}</button>
                      ))}
                   </div>
              </div>
               <div>
                   <h4 className="font-semibold mb-3 text-gray-700 dark:text-gray-300">Availability</h4>
                   <div className="flex gap-8 text-gray-800 dark:text-gray-200">
                      <div>
                          <h5 className="font-bold mb-2">Days</h5>
                           {AVAILABILITY_DAYS.map(d => (
                               <label key={d} className="flex items-center gap-2 mb-1">
                                  <input type="checkbox" checked={profile.preferences.availability.days.includes(d)} onChange={() => handleToggle('preferences', 'availability', { type: 'days', val: d })} className="h-4 w-4 rounded text-teal focus:ring-teal"/>
                                  {d}
                               </label>
                           ))}
                      </div>
                       <div>
                          <h5 className="font-bold mb-2">Times</h5>
                           {AVAILABILITY_TIMES.map(t => (
                               <label key={t} className="flex items-center gap-2 mb-1">
                                  <input type="checkbox" checked={profile.preferences.availability.times.includes(t)} onChange={() => handleToggle('preferences', 'availability', { type: 'times', val: t })} className="h-4 w-4 rounded text-teal focus:ring-teal"/>
                                  {t}
                               </label>
                           ))}
                      </div>
                   </div>
              </div>
            </div>
        </section>

        {/* Safety Section */}
        <section>
            <SectionHeader title="Safety & Comfort" />
            <div className="space-y-4">
              <label className="flex items-center justify-between p-4 bg-gray-100 dark:bg-stone-800 rounded-lg cursor-pointer">
                  <div>
                      <span className="font-bold text-gray-800 dark:text-gray-200">ID Verification Preferred</span>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Suggests dates where ID verification might be a feature.</p>
                  </div>
                  <input type="checkbox" checked={profile.safety.id_verification} onChange={() => handleToggle('safety', 'id_verification', !profile.safety.id_verification)} className="sr-only peer"/>
                  <div className="relative w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal/50 dark:peer-focus:ring-teal/80 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-teal"></div>
              </label>
               <label className="flex items-center justify-between p-4 bg-gray-100 dark:bg-stone-800 rounded-lg cursor-pointer">
                  <div>
                      <span className="font-bold text-gray-800 dark:text-gray-200">Share Location with Contact</span>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Enables features to easily share your live location.</p>
                  </div>
                  <input type="checkbox" checked={profile.safety.share_location} onChange={() => handleToggle('safety', 'share_location', !profile.safety.share_location)} className="sr-only peer"/>
                  <div className="relative w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal/50 dark:peer-focus:ring-teal/80 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-teal"></div>
              </label>
               <label className="flex items-center justify-between p-4 bg-gray-100 dark:bg-stone-800 rounded-lg cursor-pointer">
                  <div>
                      <span className="font-bold text-gray-800 dark:text-gray-200">Public First-Date Only</span>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Prioritizes dates in open, public spaces.</p>
                  </div>
                  <input type="checkbox" checked={profile.safety.public_first} onChange={() => handleToggle('safety', 'public_first', !profile.safety.public_first)} className="sr-only peer"/>
                  <div className="relative w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal/50 dark:peer-focus:ring-teal/80 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-teal"></div>
              </label>
            </div>
        </section>

        <div className="pt-6 border-t border-gray-200 dark:border-stone-700">
           <button
            type="submit"
            disabled={isSubmitDisabled}
            className="w-full flex justify-center items-center gap-3 p-4 bg-burgundy text-white font-bold rounded-lg hover:bg-opacity-90 transition-all duration-300 disabled:bg-burgundy/50 disabled:cursor-not-allowed shadow-lg border-2 border-black/10 text-xl"
          >
            {buttonText}
            {!isLoading && <Icon name="search" className="h-6 w-6"/>}
          </button>
           {subscriptionStatus === 'free' && !hasReachedFreeLimit &&
                <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
                    You have {5 - searchCount} free searches left.
                </p>
            }
        </div>
      </form>
    </div>
  );
};

export default Filters;