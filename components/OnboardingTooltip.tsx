import React, { useState, useEffect } from 'react';
import Icon from './Icon';

interface OnboardingTooltipProps {
  isVisible: boolean;
  onDismiss: () => void;
}

const OnboardingTooltip: React.FC<OnboardingTooltipProps> = ({ isVisible, onDismiss }) => {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "Welcome to Date IRL!",
      message: "Let's get you set up to find amazing experiences. This will take just a minute.",
      icon: "logo"
    },
    {
      title: "Fill Out Your Profile",
      message: "Start with the basics: age, location, and budget. The more details you provide, the better your matches!",
      icon: "info"
    },
    {
      title: "Choose Your Vibe",
      message: "Select what you're in the mood for tonight. Feeling adventurous? Cozy? Let us know!",
      icon: "star"
    },
    {
      title: "Hit Search!",
      message: "Click the button at the bottom when ready. We'll generate 6 personalized recommendations just for you.",
      icon: "search"
    }
  ];

  useEffect(() => {
    if (!isVisible) {
      setStep(0);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  const currentStep = steps[step];
  const isLastStep = step === steps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      onDismiss();
    } else {
      setStep(s => s + 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white dark:bg-stone-800 rounded-2xl shadow-2xl max-w-md w-full p-8 border-2 border-burgundy relative">
        <div className="flex flex-col items-center text-center">
          <Icon name={currentStep.icon} className="h-16 w-16 text-burgundy mb-4" />
          <h3 className="text-2xl font-serif font-bold text-gray-800 dark:text-white mb-3">
            {currentStep.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
            {currentStep.message}
          </p>

          <div className="flex gap-2 mb-6">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === step ? 'w-8 bg-burgundy' : 'w-2 bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>

          <div className="flex gap-3 w-full">
            <button
              onClick={onDismiss}
              className="flex-1 px-6 py-3 bg-gray-200 dark:bg-stone-700 text-gray-700 dark:text-gray-300 font-bold rounded-lg hover:bg-gray-300 dark:hover:bg-stone-600 transition-colors"
            >
              Skip
            </button>
            <button
              onClick={handleNext}
              className="flex-1 px-6 py-3 bg-burgundy text-white font-bold rounded-lg hover:bg-opacity-90 transition-colors"
            >
              {isLastStep ? 'Got It!' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingTooltip;
