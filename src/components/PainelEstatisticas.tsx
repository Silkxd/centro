import React from 'react';
import { EstatisticasGerais } from '../types';
import { Building, Home, Construction, MapPin } from 'lucide-react';

interface PainelEstatisticasProps {
  estatisticas: EstatisticasGerais;
}

const PainelEstatisticas: React.FC<PainelEstatisticasProps> = ({ estatisticas }) => {
  const getIconePorTipo = (tipo: string) => {
    switch (tipo) {
      case 'Casa':
        return <Home className="w-8 h-8 text-blue-600" />;
      case 'Prédio':
        return <Building className="w-8 h-8 text-blue-600" />;
      case 'Construção':
        return <Construction className="w-8 h-8 text-blue-600" />;
      case 'Terreno':
        return <MapPin className="w-8 h-8 text-blue-600" />;
      default:
        return <Building className="w-8 h-8 text-blue-600" />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      {/* Total de Imóveis */}
      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-600">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total de Imóveis</p>
            <p className="text-3xl font-bold text-gray-900">{estatisticas.totalImoveis}</p>
          </div>
          <div className="p-3 bg-blue-100 rounded-full">
            <Building className="w-8 h-8 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Estatísticas por Tipo */}
      {Object.entries(estatisticas.porTipo).map(([tipo, quantidade]) => (
        <div key={tipo} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-gray-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{tipo}</p>
              <p className="text-2xl font-bold text-gray-900">{quantidade}</p>
              <p className="text-xs text-gray-500">
                {((quantidade / estatisticas.totalImoveis) * 100).toFixed(1)}%
              </p>
            </div>
            <div className="p-3 bg-gray-100 rounded-full">
              {getIconePorTipo(tipo)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PainelEstatisticas;