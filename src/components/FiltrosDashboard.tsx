import React, { useState, useMemo } from 'react';
import { FiltrosDashboard as FiltrosType, Imovel } from '../types';
import { Filter, X, Search } from 'lucide-react';

interface FiltrosDashboardProps {
  filtros: FiltrosType;
  onFiltrosChange: (filtros: FiltrosType) => void;
  imoveis: Imovel[];
}

const FiltrosDashboard: React.FC<FiltrosDashboardProps> = ({ 
  filtros, 
  onFiltrosChange, 
  imoveis
}) => {
  const [buscaLogradouro, setBuscaLogradouro] = useState('');
  
  // Função para obter dataset filtrado (sem aplicar todos os filtros)
  const getDatasetFiltrado = (excluirFiltro?: keyof FiltrosType) => {
    return imoveis.filter(imovel => {
      // Aplicar filtros exceto o que está sendo excluído
      if (excluirFiltro !== 'processoSEI' && filtros.processoSEI && filtros.processoSEI !== 'Todos') {
        if (imovel.processoSEI !== filtros.processoSEI) return false;
      }
      if (excluirFiltro !== 'edital' && filtros.edital && filtros.edital !== 'Todos') {
        if (imovel.edital !== filtros.edital) return false;
      }
      if (excluirFiltro !== 'endereco' && filtros.endereco && filtros.endereco !== 'Todos') {
        if (imovel.logradouro !== filtros.endereco) return false;
      }
      if (excluirFiltro !== 'tipo' && filtros.tipo && filtros.tipo !== 'Todos') {
        if (imovel.tipo !== filtros.tipo) return false;
      }
      return true;
    });
  };

  // Opções disponíveis para cada filtro baseado nos outros filtros ativos
  const processosDisponiveis = useMemo(() => {
    const datasetFiltrado = getDatasetFiltrado('processoSEI');
    const processos = [...new Set(datasetFiltrado.map(imovel => imovel.processoSEI))];
    return processos.filter(Boolean).sort();
  }, [imoveis, filtros.edital, filtros.endereco, filtros.tipo]);

  const editaisDisponiveis = useMemo(() => {
    const datasetFiltrado = getDatasetFiltrado('edital');
    const editais = [...new Set(datasetFiltrado.map(imovel => imovel.edital))];
    return editais.filter(Boolean).sort();
  }, [imoveis, filtros.processoSEI, filtros.endereco, filtros.tipo]);

  const logradourosDisponiveis = useMemo(() => {
    const datasetFiltrado = getDatasetFiltrado('endereco');
    const logradouros = [...new Set(datasetFiltrado.map(imovel => imovel.logradouro))];
    
    return logradouros.filter(Boolean).sort();
  }, [imoveis, filtros.processoSEI, filtros.edital, filtros.tipo]);

  // Logradouros filtrados pela busca textual
  const logradourosFiltrados = useMemo(() => {
    if (!buscaLogradouro.trim()) {
      return logradourosDisponiveis;
    }
    
    return logradourosDisponiveis.filter(logradouro => 
      logradouro.toLowerCase().includes(buscaLogradouro.toLowerCase())
    );
  }, [logradourosDisponiveis, buscaLogradouro]);

  const tiposDisponiveis = useMemo(() => {
    const datasetFiltrado = getDatasetFiltrado('tipo');
    const tipos = [...new Set(datasetFiltrado.map(imovel => imovel.tipo))];
    return tipos.filter(Boolean).sort();
  }, [imoveis, filtros.processoSEI, filtros.edital, filtros.endereco]);

  const handleProcessoSEIChange = (value: string) => {
    onFiltrosChange({
      ...filtros,
      processoSEI: value === 'Todos' ? undefined : value
    });
  };

  const handleEditalChange = (value: string) => {
    onFiltrosChange({
      ...filtros,
      edital: value === 'Todos' ? undefined : value
    });
  };

  const handleEnderecoChange = (value: string) => {
    onFiltrosChange({
      ...filtros,
      endereco: value === 'Todos' ? undefined : value
    });
  };

  const handleTipoChange = (value: string) => {
    onFiltrosChange({
      ...filtros,
      tipo: value === 'Todos' ? undefined : value
    });
  };

  const limparFiltros = () => {
    onFiltrosChange({});
    setBuscaLogradouro('');
  };

  const temFiltrosAtivos = Object.values(filtros).some(valor => 
    valor !== undefined && valor !== ''
  );

  return (
    <div className="space-y-4">
      {/* Botão para limpar filtros */}
      <div className="flex justify-end">
        {temFiltrosAtivos && (
          <button
            onClick={limparFiltros}
            className="flex items-center gap-1 px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
          >
            <X className="w-4 h-4" />
            Limpar Filtros
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Filtro Processo SEI */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Processo SEI
          </label>
          <select
            value={filtros.processoSEI || 'Todos'}
            onChange={(e) => handleProcessoSEIChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="Todos">Todos ({processosDisponiveis.length})</option>
            {processosDisponiveis.map(processo => (
              <option key={processo} value={processo}>
                {processo}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro Edital */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Edital
          </label>
          <select
            value={filtros.edital || 'Todos'}
            onChange={(e) => handleEditalChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="Todos">Todos ({editaisDisponiveis.length})</option>
            {editaisDisponiveis.map(edital => (
              <option key={edital} value={edital}>
                {edital}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro Logradouro com busca */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Logradouro
          </label>
          <div className="space-y-2">
            {/* Campo de busca */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar logradouro..."
                value={buscaLogradouro}
                onChange={(e) => setBuscaLogradouro(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            {/* Dropdown filtrado */}
            <select
              value={filtros.endereco || 'Todos'}
              onChange={(e) => handleEnderecoChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Todos">Todos ({logradourosFiltrados.length})</option>
              {logradourosFiltrados.map(logradouro => (
                <option key={logradouro} value={logradouro}>
                  {logradouro}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filtro Tipo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo
          </label>
          <select
            value={filtros.tipo || 'Todos'}
            onChange={(e) => handleTipoChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="Todos">Todos ({tiposDisponiveis.length})</option>
            {tiposDisponiveis.map(tipo => (
              <option key={tipo} value={tipo}>
                {tipo}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default FiltrosDashboard;