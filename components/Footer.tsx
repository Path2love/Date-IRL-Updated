import React from 'react';

interface FooterProps {
  onCycleSub?: () => void;
  onResetApp?: () => void;
}

const Footer: React.FC<FooterProps> = ({ onCycleSub, onResetApp }) => {
  return (
    <footer className="text-center py-6 text-white/60 text-sm">
      <p>Powered by Gemini & React</p>
      <div className="flex justify-center items-center gap-2">
        {onCycleSub && (
          <button onClick={onCycleSub} className="mt-2 text-xs bg-black/20 px-2 py-1 rounded">
            Dev: Cycle Subscription
          </button>
        )}
        {onResetApp && (
          <button onClick={onResetApp} className="mt-2 text-xs bg-black/20 px-2 py-1 rounded">
            Dev: Reset & Go to Landing
          </button>
        )}
      </div>
    </footer>
  );
};

export default Footer;