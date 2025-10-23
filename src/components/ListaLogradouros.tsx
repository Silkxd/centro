import React from 'react';
import { EstatisticasGerais } from '../types';
import { MapPin, TrendingUp } from 'lucide-react';

interface ListaLogradourosProps {
  estatisticas: EstatisticasGerais;
  onLogradouroClick?: (logradouro: string) => void;
}

const ListaLogradouros: React.FC<ListaLogradourosProps> = ({ 
  estatisticas, 
  onLogradouroClick 
}) => {
  const handleLogradouroClick = (logradouro: string) => {
    if (onLogradouroClick) {
      onLogradouroClick(logradouro);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Logradouros</h3>
      </div>
      
      <div className="space-y-3">
        {estatisticas.logradourosTop.map((item, index) => (
          <div
            key={item.nome}
            className={`flex items-center justify-between p-3 rounded-lg transition-colors cursor-pointer ${
              onLogradouroClick 
                ? 'hover:bg-gray-50 hover:shadow-sm' 
                : ''
            }`}
            onClick={() => handleLogradouroClick(item.nome)}
          >
            <div className="flex items-center gap-3">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                index === 0 ? 'bg-yellow-100 text-yellow-800' :
                index === 1 ? 'bg-gray-100 text-gray-800' :
                index === 2 ? 'bg-orange-100 text-orange-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {index + 1}
              </div>
              
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="font-medium text-gray-900 text-sm">
                    {item.nome}
                  </p>
                  <p className="text-xs text-gray-500">
                    {((item.quantidade / estatisticas.totalImoveis) * 100).toFixed(1)}% do total
                  </p>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                {item.quantidade}
              </span>
            </div>
          </div>
        ))}
      </div>

      {estatisticas.logradourosTop.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <MapPin className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>Nenhum logradouro encontrado</p>
        </div>
      )}
    </div>
  );
};

export default ListaLogradouros;