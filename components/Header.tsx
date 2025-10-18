import React from 'react';
import Icon from './Icon';
import type { SubscriptionStatus } from '../types';

interface HeaderProps {
  onSignupClick: () => void;
  subscriptionStatus: SubscriptionStatus;
}

const Header: React.FC<HeaderProps> = ({ onSignupClick, subscriptionStatus }) => {
  return (
    <header className="bg-black/20 backdrop-blur-sm sticky top-0 z-50 border-b border-white/10">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Icon name="logo" className="h-8 w-8 text-accent" />
            <span className="font-serif text-2xl font-bold text-white">Date IRL</span>
          </div>
          <div className="flex items-center gap-4">
            {subscriptionStatus === 'none' ? (
              // This state is now only briefly visible before onboarding logic kicks in
              // Or if local storage fails. Keeping a fallback.
               <button onClick={onSignupClick} className="bg-burgundy text-white font-bold py-2 px-4 rounded-full hover:bg-opacity-90 transition-colors duration-300 shadow-sm border-2 border-black/10">
                  Get Started
                </button>
            ) : (
              <div className="flex items-center gap-3">
                <div className="text-right">
                   {subscriptionStatus === 'premium' ? (
                     <p className="font-bold text-sm text-gray-200">Premium Member</p>
                   ) : (
                     <button onClick={onSignupClick} className="font-bold text-sm text-gray-200 hover:text-white hover:underline transition-all duration-200">
                        Free Plan (Upgrade)
                     </button>
                   )}
                  <p className="text-xs text-gray-400">Welcome!</p>
                </div>
                <div className="p-2 bg-teal rounded-full">
                  <Icon name="user" className="h-6 w-6 text-white"/>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;