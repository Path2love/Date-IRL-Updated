import React from 'react';

interface FooterProps {
  onCycleSub?: () => void;
}

const Footer: React.FC<FooterProps> = ({ onCycleSub }) => {
  return (
    <footer className="text-center py-6 text-white/60 text-sm">
      <p>Powered by Gemini & React</p>
      {onCycleSub && (
        <button onClick={onCycleSub} className="mt-2 text-xs bg-black/20 px-2 py-1 rounded">
          Dev: Cycle Subscription
        </button>
      )}
    </footer>
  );
};

export default Footer;
