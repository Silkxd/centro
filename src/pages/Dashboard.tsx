import React, { useState, useEffect, useMemo } from 'react';
import { Imovel, FiltrosDashboard, EstatisticasGerais } from '../types';
import { carregarDadosCSV, aplicarFiltros, calcularEstatisticas } from '../utils/dataLoader';
import MapaInterativo from '../components/MapaInterativo';
import FiltrosDashboardComponent from '../components/FiltrosDashboard';
import ListaLogradouros from '../components/ListaLogradouros';
import TabelaImoveis from '../components/TabelaImoveis';
import BotaoDenuncia from '../components/BotaoDenuncia';
import { MapPin, Table, Filter, ChevronDown, ChevronUp, Download, TrendingUp, X } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [imoveis, setImoveis] = useState<Imovel[]>([]);
  const [filtros, setFiltros] = useState<FiltrosDashboard>({
    processoSEI: '',
    edital: '',
    endereco: ''
  });
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [abaSelecionada, setAbaSelecionada] = useState<'mapa' | 'tabela' | 'logradouros'>('mapa');
  const [filtrosExpandidos, setFiltrosExpandidos] = useState(false);

  // Carregar dados ao montar o componente
  useEffect(() => {
    const carregarDados = async () => {
      try {
        setCarregando(true);
        const dados = await carregarDadosCSV();
        setImoveis(dados);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        setErro('Erro ao carregar os dados dos imóveis');
      } finally {
        setCarregando(false);
      }
    };

    carregarDados();
  }, []);

  // Aplicar filtros aos dados
  const imoveisFiltrados = useMemo(() => {
    return aplicarFiltros(imoveis, filtros);
  }, [imoveis, filtros]);

  // Calcular estatísticas
  const estatisticas: EstatisticasGerais = useMemo(() => {
    return calcularEstatisticas(imoveisFiltrados);
  }, [imoveisFiltrados]);

  const handleFiltroChange = (novosFiltros: FiltrosDashboard) => {
    setFiltros(novosFiltros);
  };

  const handleImovelClick = (imovel: Imovel) => {
    // Focar no imóvel no mapa
    setAbaSelecionada('mapa');
    // Aqui poderia implementar lógica para centralizar o mapa no imóvel
    console.log('Imóvel selecionado:', imovel);
  };

  const handleLogradouroClick = (logradouro: string) => {
    // Filtrar por logradouro
    setFiltros(prev => ({ ...prev, endereco: logradouro }));
    setAbaSelecionada('mapa');
  };

  const handleDownloadDados = () => {
    // Criar CSV dos dados filtrados
    const headers = ['ID', 'Logradouro', 'Numero', 'Zona', 'Tipo', 'Status', 'Complemento', 'Bairro', 'ProcessoSEI', 'Edital', 'Longitude', 'Latitude', 'Foto', 'DataRegistro', 'Observacoes'];
    const csvContent = [
      headers.join(','),
      ...imoveisFiltrados.map(imovel => [
        imovel.id,
        `"${imovel.logradouro}"`,
        imovel.numero || '',
        imovel.zona,
        imovel.tipo,
        imovel.status,
        `"${imovel.complemento || ''}"`,
        `"${imovel.bairro}"`,
        imovel.processoSEI || '',
        imovel.edital || '',
        imovel.longitude,
        imovel.latitude,
        imovel.foto || '',
        imovel.dataRegistro || '',
        `"${imovel.observacoes || ''}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `imoveis_abandonados_filtrados_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (carregando) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dados dos imóveis...</p>
        </div>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">⚠️</div>
          <p className="text-red-600">{erro}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Fundo com transparência */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(/fundopi.svg)',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundAttachment: 'fixed',
          opacity: 0.2
        }}
      ></div>
      
      {/* Conteúdo principal */}
      <div className="relative z-10">
        {/* Header */}
        <header className="bg-white shadow-sm border-b relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard - Imóveis Abandonados</h1>
                <p className="text-sm text-gray-600">
                  Centro de Teresina - PI
                </p>
              </div>
            </div>
            {/* Logo no canto superior direito */}
            <div className="absolute top-4 right-4">
              <img 
                src="/logopi.svg" 
                alt="Logo PI" 
                className="h-12 w-auto opacity-90"
              />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Badges de Filtros Ativos - Sempre Visível */}
        {Object.values(filtros).some(valor => 
          valor !== undefined && valor !== '' && 
          (Array.isArray(valor) ? valor.length > 0 : true)
        ) && (
          <div className="mb-4 flex flex-wrap gap-2">
            {filtros.processoSEI && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                Processo SEI: {filtros.processoSEI}
                <button
                  onClick={() => handleFiltroChange({ ...filtros, processoSEI: undefined })}
                  className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filtros.edital && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                Edital: {filtros.edital}
                <button
                  onClick={() => handleFiltroChange({ ...filtros, edital: undefined })}
                  className="ml-1 hover:bg-green-200 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filtros.endereco && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                Endereço: {filtros.endereco}
                <button
                  onClick={() => handleFiltroChange({ ...filtros, endereco: undefined })}
                  className="ml-1 hover:bg-purple-200 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filtros.tipo && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full">
                Tipo: {filtros.tipo}
                <button
                  onClick={() => handleFiltroChange({ ...filtros, tipo: undefined })}
                  className="ml-1 hover:bg-orange-200 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button
              onClick={() => handleFiltroChange({})}
              className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full hover:bg-red-200 transition-colors"
            >
              <X className="w-3 h-3" />
              Limpar Todos
            </button>
          </div>
        )}

        {/* Filtros - Com botão para recolher/expandir */}
        <div className="mb-6 bg-white rounded-lg shadow-md">
          <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Filtros</h3>
            </div>
            <button
              onClick={() => setFiltrosExpandidos(!filtrosExpandidos)}
              className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            >
              {filtrosExpandidos ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  Recolher
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  Expandir
                </>
              )}
            </button>
          </div>
          {filtrosExpandidos && (
            <div className="p-4">
              <FiltrosDashboardComponent
                filtros={filtros}
                onFiltrosChange={handleFiltroChange}
                imoveis={imoveis}
              />
            </div>
          )}
        </div>

        {/* Layout Principal - 2 Colunas: Cards | Conteúdo Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Cards de Estatísticas na Lateral Esquerda */}
          <div className="lg:col-span-1 space-y-4">
            {/* Card Total de Imóveis */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {imoveisFiltrados.length}
                </div>
                <div className="text-sm text-gray-600">
                  Total de Imóveis
                </div>
              </div>
            </div>

            {/* Card Casa */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {estatisticas.porTipo['Casa'] || 0}
                </div>
                <div className="text-sm text-gray-600">
                  Casa
                </div>
              </div>
            </div>

            {/* Card Terreno */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {estatisticas.porTipo['Terreno'] || 0}
                </div>
                <div className="text-sm text-gray-600">
                  Terreno
                </div>
              </div>
            </div>

            {/* Botão de Denúncia */}
            <div className="mt-4">
              <BotaoDenuncia />
            </div>
          </div>

          {/* Conteúdo Principal - Mapa e Abas (Centro) */}
          <div className="lg:col-span-4">
            {/* Abas de Navegação */}
            <div className="bg-white rounded-t-lg shadow-md">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex justify-between">
                  <div className="flex">
                    <button
                      onClick={() => setAbaSelecionada('mapa')}
                      className={`py-3 px-6 border-b-2 font-medium text-sm flex items-center gap-2 ${
                        abaSelecionada === 'mapa'
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <MapPin className="w-4 h-4" />
                      Mapa
                    </button>
                    <button
                      onClick={() => setAbaSelecionada('tabela')}
                      className={`py-3 px-6 border-b-2 font-medium text-sm flex items-center gap-2 ${
                        abaSelecionada === 'tabela'
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <Table className="w-4 h-4" />
                      Tabela
                    </button>
                    <button
                      onClick={() => setAbaSelecionada('logradouros')}
                      className={`py-3 px-6 border-b-2 font-medium text-sm flex items-center gap-2 ${
                        abaSelecionada === 'logradouros'
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <TrendingUp className="w-4 h-4" />
                      Logradouros
                    </button>
                  </div>
                  <div className="flex items-center">
                    <button
                      onClick={handleDownloadDados}
                      className="py-3 px-6 text-sm flex items-center gap-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      title="Baixar dados filtrados"
                    >
                      <Download className="w-4 h-4" />
                      Baixar Dados
                    </button>
                  </div>
                </nav>
              </div>

              {/* Conteúdo das Abas */}
              <div className="p-6">
                {abaSelecionada === 'mapa' && (
                  <div className="h-[600px]">
                    <MapaInterativo
                      imoveis={imoveisFiltrados}
                      onImovelClick={handleImovelClick}
                    />
                  </div>
                )}

                {abaSelecionada === 'tabela' && (
                  <div>
                    <TabelaImoveis
                      imoveis={imoveisFiltrados}
                      onImovelClick={handleImovelClick}
                    />
                  </div>
                )}

                {abaSelecionada === 'logradouros' && (
                  <div>
                    <ListaLogradouros
                      estatisticas={estatisticas}
                      onLogradouroClick={handleLogradouroClick}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="text-center text-sm text-gray-600">
            <p>
                         </p>
            <p className="mt-1">
              
            </p>
          </div>
        </div>
      </footer>
      </div>
    </div>
  );
};

export default Dashboard;