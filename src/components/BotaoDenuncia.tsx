import React from 'react';
import { AlertTriangle } from 'lucide-react';

const BotaoDenuncia: React.FC = () => {
  const handleDenuncia = () => {
    window.open(
      'https://docs.google.com/forms/d/1a4cSGoVEEQKg6Do-FgHZrm1w_kNX1knr2yfOPj0oST0/edit?pli=1',
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <button
      onClick={handleDenuncia}
      className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center gap-2 text-lg"
    >
      <AlertTriangle className="w-6 h-6" />
      Fazer Denúncia
    </button>
  );
};

export default BotaoDenuncia;