import React from 'react';
import Icon from './Icon';

interface WelcomeScreenProps {
  onStart: () => void;
}

const Feature: React.FC<{ icon: string; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
  <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 h-full">
    <div className="flex items-center gap-4 mb-3">
      <div className="bg-burgundy p-3 rounded-full">
        <Icon name={icon} className="h-6 w-6 text-white" />
      </div>
      <h3 className="text-xl font-bold text-white">{title}</h3>
    </div>
    <p className="text-white/80">{children}</p>
  </div>
);

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen w-full text-white flex items-center justify-center p-4">
      <div className="container mx-auto max-w-4xl text-center">
        <header className="mb-12">
            <div className="flex justify-center items-center gap-4 mb-6">
                <Icon name="logo" className="h-16 w-16 text-accent" />
                <span className="text-5xl font-serif font-bold text-white [text-shadow:_0_2px_4px_rgb(0_0_0_/_0.5)]">Date IRL</span>
            </div>
          <h1 className="text-5xl md:text-6xl font-serif font-bold mb-4 [text-shadow:_0_2px_4px_rgb(0_0_0_/_0.5)]">
            Go on better dates. Meet new people.
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto [text-shadow:_0_1px_3px_rgb(0_0_0_/_0.5)]">
            Date IRL is your AI concierge for curated date nights and discovering the best local spots to meet like-minded singles.
          </p>
        </header>

        <main className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            <Feature icon="user" title="Hyper-Personalized">
              Tell us your archetypes, vibe, and goals. Our AI finds dates that truly match you and your partner's personalities.
            </Feature>
            <Feature icon="lightbulb" title="Beyond the Usual">
              From cozy bookstore cafes to adventurous outdoor activities, discover hidden gems and unique experiences in your city.
            </Feature>
            <Feature icon="flow" title="A Complete Plan">
              Get real addresses, ratings, and practical tips. We even provide a unique icebreaker and a step-by-step plan for your date.
            </Feature>
            <Feature icon="social" title="More Ways to Connect">
              Ready to mingle? We'll find the best bars, cafes, and events buzzing with singles who share your vibe.
            </Feature>
          </div>
        </main>

        <footer>
          <button
            onClick={onStart}
            className="bg-burgundy text-white font-bold py-4 px-10 rounded-full text-xl hover:bg-opacity-90 transition-all duration-300 shadow-lg border-2 border-black/20 transform hover:scale-105"
          >
            Get Started
          </button>
        </footer>
      </div>
    </div>
  );
};

export default WelcomeScreen;