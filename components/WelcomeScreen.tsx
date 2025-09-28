import React from 'react';
import Icon from './Icon';

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

const Feature: React.FC<{ icon: string; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
  <div className="text-center p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-lg h-full">
    <Icon name={icon} className="h-12 w-12 mx-auto mb-4 text-burgundy" />
    <h3 className="text-xl font-bold font-serif text-white mb-2">{title}</h3>
    <p className="text-white/80 text-sm">{children}</p>
  </div>
);

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onGetStarted }) => {
  return (
    <main className="container mx-auto px-4 py-16 flex flex-col items-center justify-center text-center animate-fade-in">
      <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 [text-shadow:_0_4px_8px_rgb(0_0_0_/_0.6)]">
        Intelligent Dating,
        <br />
        Unforgettable Experiences.
      </h1>
      <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-12">
        Date IRL uses AI to understand you, curating personalized date nights that lead to real connections. Stop swiping, start connecting.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16 w-full">
        <Feature icon="logo" title="Hyper-Personalized">
          Our AI goes beyond surface-level interests to find experiences that fit your unique personality, style, and relationship goals.
        </Feature>
        <Feature icon="social" title="Meet The Right People">
          Looking for your person? We find the bars, cafes, and events where your vibe attracts your tribe.
        </Feature>
        <Feature icon="safety" title="Plan with Confidence">
          Each idea comes with a complete plan, from icebreakers to safety tips, so you can focus on the moment.
        </Feature>
      </div>

      <button
        onClick={onGetStarted}
        className="bg-burgundy text-accent font-bold text-xl py-4 px-12 rounded-full hover:brightness-110 transition-all duration-300 shadow-2xl hover:shadow-burgundy/50 transform hover:scale-105"
      >
        Find My Perfect Date
      </button>
    </main>
  );
};

export default WelcomeScreen;