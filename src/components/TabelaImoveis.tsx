import React, { useState, useMemo } from 'react';
import { Imovel } from '../types';
import { ChevronLeft, ChevronRight, Eye, MapPin, Calendar } from 'lucide-react';

interface TabelaImoveisProps {
  imoveis: Imovel[];
  onImovelClick?: (imovel: Imovel) => void;
}

const TabelaImoveis: React.FC<TabelaImoveisProps> = ({ imoveis, onImovelClick }) => {
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [itensPorPagina] = useState(10);
  const [ordenacao, setOrdenacao] = useState<{
    campo: keyof Imovel;
    direcao: 'asc' | 'desc';
  }>({ campo: 'logradouro', direcao: 'asc' });

  // Ordenar imóveis
  const imoveisOrdenados = useMemo(() => {
    return [...imoveis].sort((a, b) => {
      const valorA = a[ordenacao.campo];
      const valorB = b[ordenacao.campo];
      
      if (valorA < valorB) return ordenacao.direcao === 'asc' ? -1 : 1;
      if (valorA > valorB) return ordenacao.direcao === 'asc' ? 1 : -1;
      return 0;
    });
  }, [imoveis, ordenacao]);

  // Calcular paginação
  const totalPaginas = Math.ceil(imoveisOrdenados.length / itensPorPagina);
  const indiceInicio = (paginaAtual - 1) * itensPorPagina;
  const indiceFim = indiceInicio + itensPorPagina;
  const imoveisPaginados = imoveisOrdenados.slice(indiceInicio, indiceFim);

  const handleOrdenacao = (campo: keyof Imovel) => {
    setOrdenacao(prev => ({
      campo,
      direcao: prev.campo === campo && prev.direcao === 'asc' ? 'desc' : 'asc'
    }));
    setPaginaAtual(1);
  };

  const handlePaginaAnterior = () => {
    setPaginaAtual(prev => Math.max(prev - 1, 1));
  };

  const handleProximaPagina = () => {
    setPaginaAtual(prev => Math.min(prev + 1, totalPaginas));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Abandonado':
        return 'bg-red-100 text-red-800';
      case 'Em análise':
        return 'bg-yellow-100 text-yellow-800';
      case 'Regularizado':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'Casa':
        return 'bg-blue-100 text-blue-800';
      case 'Prédio':
        return 'bg-purple-100 text-purple-800';
      case 'Construção':
        return 'bg-orange-100 text-orange-800';
      case 'Terreno':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          Tabela de Imóveis ({imoveis.length} registros)
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleOrdenacao('logradouro')}
              >
                Logradouro
                {ordenacao.campo === 'logradouro' && (
                  <span className="ml-1">
                    {ordenacao.direcao === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleOrdenacao('numero')}
              >
                Número
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleOrdenacao('zona')}
              >
                Zona
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleOrdenacao('tipo')}
              >
                Tipo
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleOrdenacao('status')}
              >
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Complemento
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleOrdenacao('processoSEI')}
              >
                Processo SEI
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {imoveisPaginados.map((imovel) => (
              <tr key={imovel.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {imovel.logradouro}
                      </div>
                      <div className="text-sm text-gray-500">
                        {imovel.bairro}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {imovel.numero || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {imovel.zona}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTipoColor(imovel.tipo)}`}>
                    {imovel.tipo}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(imovel.status)}`}>
                    {imovel.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                  {imovel.complemento || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                  {imovel.processoSEI}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => onImovelClick?.(imovel)}
                    className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                  >
                    <Eye className="w-4 h-4" />
                    Ver
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div className="flex-1 flex justify-between sm:hidden">
          <button
            onClick={handlePaginaAnterior}
            disabled={paginaAtual === 1}
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>
          <button
            onClick={handleProximaPagina}
            disabled={paginaAtual === totalPaginas}
            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Próxima
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Mostrando{' '}
              <span className="font-medium">{indiceInicio + 1}</span>
              {' '}até{' '}
              <span className="font-medium">
                {Math.min(indiceFim, imoveis.length)}
              </span>
              {' '}de{' '}
              <span className="font-medium">{imoveis.length}</span>
              {' '}resultados
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                onClick={handlePaginaAnterior}
                disabled={paginaAtual === 1}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              
              <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                Página {paginaAtual} de {totalPaginas}
              </span>
              
              <button
                onClick={handleProximaPagina}
                disabled={paginaAtual === totalPaginas}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TabelaImoveis;