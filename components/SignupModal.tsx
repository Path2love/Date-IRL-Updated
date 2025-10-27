import React, { useState } from 'react';
import Icon from './Icon';

interface SignupModalProps {
  onClose?: () => void;
  onSubscribe: (plan: 'premium') => void;
}

const SignupModal: React.FC<SignupModalProps> = ({ onClose, onSubscribe }) => {
  const [showPayment, setShowPayment] = useState(false);
  const [card, setCard] = useState({ number: '', expiry: '', cvc: ''});

  const handlePremiumSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (card.number.trim() && card.expiry.trim() && card.cvc.trim()) {
      onSubscribe('premium');
    } else {
      alert("Please fill in all card details.")
    }
  };
  
  const isPremiumSubmitDisabled = !card.number.trim() || !card.expiry.trim() || !card.cvc.trim();

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-stone-800 rounded-2xl shadow-2xl w-full max-w-lg relative border-2 border-stone-200 dark:border-stone-700 animate-fade-in">
        {onClose && (
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors">
                <Icon name="error" className="h-8 w-8" />
            </button>
        )}
        
        <div className="p-8">
            <h2 className="text-3xl font-serif text-center mb-2 text-gray-800 dark:text-white">
                Upgrade to Premium
            </h2>
            <p className="text-center text-gray-500 dark:text-gray-400 mb-8">
                Choose your path to better connections.
            </p>
            
            {!showPayment ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Free Plan */}
                    <div className="p-6 border-2 border-brand-blue rounded-lg text-center flex flex-col bg-gray-50 dark:bg-stone-900/50">
                        <h3 className="text-2xl font-bold font-serif mb-2 text-teal">Free Plan</h3>
                        <p className="text-teal-800 dark:text-teal-300 font-bold text-sm mb-4">Your Current Plan</p>
                        <ul className="text-left space-y-2 text-sm text-gray-600 dark:text-gray-300 mb-4 flex-grow">
                            <li className="flex items-start gap-2"><Icon name="star" className="h-4 w-4 mt-0.5 text-teal shrink-0"/><span><strong>5 free</strong> AI-powered searches</span></li>
                            <li className="flex items-start gap-2"><Icon name="star" className="h-4 w-4 mt-0.5 text-teal shrink-0"/><span>Save your favorite ideas</span></li>
                        </ul>
                    </div>

                    {/* Premium Plan */}
                    <div className="p-6 border-2 border-brand-blue rounded-lg text-center flex flex-col shadow-lg bg-burgundy/5">
                        <h3 className="text-2xl font-bold font-serif mb-2 text-burgundy">Premium Plan</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">Unlock the full experience.</p>
                         <ul className="text-left space-y-2 text-sm text-gray-600 dark:text-gray-300 mb-6 flex-grow">
                            <li className="flex items-start gap-2"><Icon name="star" className="h-4 w-4 mt-0.5 text-burgundy shrink-0"/><span><strong>Unlimited</strong> AI-powered searches</span></li>
                            <li className="flex items-start gap-2"><Icon name="star" className="h-4 w-4 mt-0.5 text-burgundy shrink-0"/><span>Unlock <strong>all personalization filters</strong> (Archetypes, Goals, etc.)</span></li>
                             <li className="flex items-start gap-2"><Icon name="star" className="h-4 w-4 mt-0.5 text-burgundy shrink-0"/><span>Access to exclusive <strong>Curated Collections</strong> (e.g., 'Hidden Gems')</span></li>
                             <li className="flex items-start gap-2"><Icon name="star" className="h-4 w-4 mt-0.5 text-burgundy shrink-0"/><span>Priority access to new features & events</span></li>
                        </ul>
                        <p className="text-4xl font-bold mb-4 text-gray-800 dark:text-white">$9.99<span className="text-base font-normal text-gray-500 dark:text-gray-400">/mo</span></p>
                        <button onClick={() => setShowPayment(true)} className="mt-auto w-full bg-burgundy text-white font-bold py-3 px-4 rounded-lg hover:bg-opacity-90 transition-colors">
                            Go Premium
                        </button>
                    </div>
                </div>
            ) : (
                // Payment Form
                <div>
                    <h3 className="text-2xl font-serif text-center mb-4 text-burgundy">Premium Checkout</h3>
                    <form onSubmit={handlePremiumSubscribe} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">Card Number</label>
                            <input type="text" placeholder="•••• •••• •••• 4242" value={card.number} onChange={e => setCard(c => ({...c, number: e.target.value}))} className="w-full p-3 mt-1 bg-stone-100 dark:bg-stone-700 rounded-lg focus:ring-burgundy focus:border-burgundy" required/>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">Expiry Date</label>
                                <input type="text" placeholder="MM / YY" value={card.expiry} onChange={e => setCard(c => ({...c, expiry: e.target.value}))} className="w-full p-3 mt-1 bg-stone-100 dark:bg-stone-700 rounded-lg focus:ring-burgundy focus:border-burgundy" required/>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">CVC</label>
                                <input type="text" placeholder="123" value={card.cvc} onChange={e => setCard(c => ({...c, cvc: e.target.value}))} className="w-full p-3 mt-1 bg-stone-100 dark:bg-stone-700 rounded-lg focus:ring-burgundy focus:border-burgundy" required/>
                            </div>
                        </div>
                         <button type="submit" disabled={isPremiumSubmitDisabled} className="w-full bg-burgundy text-white font-bold py-3 px-4 rounded-lg hover:bg-opacity-90 transition-colors disabled:bg-burgundy/50 disabled:cursor-not-allowed">
                            Subscribe Now
                        </button>
                        <button type="button" onClick={() => setShowPayment(false)} className="w-full text-center text-sm text-gray-500 hover:text-burgundy mt-2">
                            Back to plans
                        </button>
                    </form>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default SignupModal;