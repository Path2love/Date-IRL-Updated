import React, { useState, useEffect } from 'react';
import Icon from './Icon';
import type { UserIntent } from '../types';

interface LoadingSpinnerProps {
    userIntent: UserIntent;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ userIntent }) => {
  const [progressStep, setProgressStep] = useState(0);

  const steps = [
    { icon: "search", message: "Analyzing your profile..." },
    { icon: "lightbulb", message: "Generating personalized ideas..." },
    { icon: "logo", message: "Finding perfect venues..." },
    { icon: "star", message: "Adding special touches..." }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgressStep(prev => (prev + 1) % steps.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  let mainMessage = "Curating your perfect experiences";

  if (userIntent === 'find_date_spot') {
    mainMessage = "Finding amazing date spots";
  } else if (userIntent === 'find_singles_spots') {
    mainMessage = "Discovering places to meet singles";
  } else if (userIntent === 'find_event') {
    mainMessage = "Searching for exciting events";
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-6 py-12">
      <div className="relative">
        <Icon name={steps[progressStep].icon} className="h-24 w-24 text-burgundy animate-pulse" />
        <div className="absolute inset-0 animate-ping opacity-20">
          <Icon name="logo" className="h-24 w-24 text-burgundy" />
        </div>
      </div>

      <div className="text-center space-y-2">
        <h3 className="text-2xl font-serif font-bold text-white [text-shadow:_0_2px_4px_rgb(0_0_0_/_0.5)]">
          {mainMessage}
        </h3>
        <p className="text-lg text-white/70">
          {steps[progressStep].message}
        </p>
      </div>

      <div className="flex gap-2">
        {steps.map((_, index) => (
          <div
            key={index}
            className={`h-2 w-2 rounded-full transition-all duration-500 ${
              index === progressStep ? 'bg-burgundy scale-125' : 'bg-white/30'
            }`}
          />
        ))}
      </div>

      <div className="w-64 h-1 bg-white/20 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-burgundy to-teal animate-pulse" style={{width: '100%'}} />
      </div>
    </div>
  );
};

export default LoadingSpinner;