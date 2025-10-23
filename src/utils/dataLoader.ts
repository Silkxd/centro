import Papa from 'papaparse';
import { Imovel, EstatisticasGerais, FiltrosDashboard } from '../types';

// Função para corrigir encoding de caracteres especiais
const corrigirEncoding = (text: string): string => {
  // Substituições comuns para caracteres mal codificados
  return text
    // Correções específicas de nomes próprios (devem vir ANTES das genéricas)
    .replace(/S�o/g, 'São')
    .replace(/Ar�a Le�o/g, 'Arêa Leão')
    .replace(/An�sio/g, 'Anísio')
    .replace(/Jos� dos Santos/g, 'José dos Santos')
    .replace(/Jos�([^a-zA-Z])/g, 'José$1') // José seguido de espaço ou pontuação
    
    // Outras correções específicas já existentes
    .replace(/N�MERO/g, 'NÚMERO')
    .replace(/N�mero/g, 'Número')
    .replace(/Pr�dio/g, 'Prédio')
    .replace(/�lvaro/g, 'Álvaro')
    .replace(/F�lix/g, 'Félix')
    .replace(/Jo�o/g, 'João')
    .replace(/Ara�jo/g, 'Araújo')
    .replace(/Simpl�cio/g, 'Simplício')
    .replace(/Gra�as/g, 'Graças')
    .replace(/Bocai�va/g, 'Bocaiúva')
    .replace(/Constru��o/g, 'Construção')
    .replace(/Edifica��o/g, 'Edificação')
    .replace(/Demoli��o/g, 'Demolição')
    .replace(/Situa��o/g, 'Situação')
    .replace(/Preven��o/g, 'Prevenção')
    .replace(/Aten��o/g, 'Atenção')
    .replace(/Informa��o/g, 'Informação')
    .replace(/Solu��o/g, 'Solução')
    .replace(/Execu��o/g, 'Execução')
    .replace(/Fiscaliza��o/g, 'Fiscalização')
    .replace(/Regulariza��o/g, 'Regularização')
    
    // Caracteres individuais mais comuns (devem vir POR ÚLTIMO)
    .replace(/�/g, 'ú')
    .replace(/�/g, 'ã')
    .replace(/�/g, 'ç')
    .replace(/�/g, 'ó')
    .replace(/�/g, 'á')
    .replace(/�/g, 'é')
    .replace(/�/g, 'í')
    .replace(/�/g, 'â')
    .replace(/�/g, 'ê')
    .replace(/�/g, 'ô')
    .replace(/�/g, 'õ')
    .replace(/�/g, 'à')
    .replace(/�/g, 'ü')
    .replace(/�/g, 'Á')
    .replace(/�/g, 'É')
    .replace(/�/g, 'Í')
    .replace(/�/g, 'Ó')
    .replace(/�/g, 'Ú')
    .replace(/�/g, 'Â')
    .replace(/�/g, 'Ê')
    .replace(/�/g, 'Ô')
    .replace(/�/g, 'Ã')
    .replace(/�/g, 'Õ')
    .replace(/�/g, 'Ç');
};

export async function carregarDadosCSV(): Promise<Imovel[]> {
  try {
    // Especificar encoding no fetch - agora buscando da pasta public
    const response = await fetch('/centro_imoveis_abandonados.csv', {
      headers: {
        'Content-Type': 'text/csv; charset=windows-1252'
      }
    });
    const csvText = await response.text();
    
    // Corrigir encoding antes de processar
    const csvTextCorrigido = corrigirEncoding(csvText);
    
    return new Promise((resolve, reject) => {
      Papa.parse(csvTextCorrigido, {
        header: true,
        delimiter: ';', // Usar ponto e vírgula como separador
        skipEmptyLines: true,
        transform: (value, field) => {
          // Converter coordenadas que usam vírgula como separador decimal
          if (field === 'LONGITUDE' || field === 'LATITUDE') {
            return parseFloat(value.replace(',', '.')) || 0;
          }
          return value;
        },
        complete: (results) => {
          const dadosCSV = results.data as any[];
          
          // Mapear dados do CSV para interface Imovel
          const imoveis: Imovel[] = dadosCSV.map((row, index) => ({
            id: row.ORD || `imovel-${index + 1}`,
            logradouro: row.LOGRADOURO || '',
            numero: row.NÚMERO || row.N_MERO || 'S/N', // Lidar com encoding
            zona: mapearZona(row.ZONA),
            tipo: mapearTipo(row.TIPO),
            status: mapearStatus(row.STATUS),
            complemento: row.COMPLEMENTO || undefined,
            bairro: row.bairro || 'Centro',
            processoSEI: row.PROCESSO || '',
            edital: row.EDITAL || undefined,
            longitude: parseFloat(String(row.LONGITUDE).replace(',', '.')) || 0,
            latitude: parseFloat(String(row.LATITUDE).replace(',', '.')) || 0,
            foto: row.FOTO || undefined,
            dataRegistro: new Date().toISOString().split('T')[0], // Data atual como fallback
            observacoes: row.RISCO || undefined
          }));
          
          resolve(imoveis);
        },
        error: (error) => {
          reject(error);
        }
      });
    });
  } catch (error) {
    console.error('Erro ao carregar dados CSV:', error);
    return [];
  }
}

// Funções auxiliares para mapear valores
function mapearZona(zona: string): 'Norte' | 'Sul' | 'Leste' | 'Oeste' {
  if (!zona) return 'Norte';
  const zonaNormalizada = zona.toLowerCase();
  if (zonaNormalizada.includes('sul')) return 'Sul';
  if (zonaNormalizada.includes('leste')) return 'Leste';
  if (zonaNormalizada.includes('oeste')) return 'Oeste';
  return 'Norte';
}

function mapearTipo(tipo: string): 'Casa' | 'Construção' | 'Prédio' | 'Terreno' {
  if (!tipo) return 'Casa';
  const tipoNormalizado = tipo.toLowerCase();
  if (tipoNormalizado.includes('prédio') || tipoNormalizado.includes('predio')) return 'Prédio';
  if (tipoNormalizado.includes('terreno')) return 'Terreno';
  if (tipoNormalizado.includes('construção') || tipoNormalizado.includes('construcao')) return 'Construção';
  return 'Casa';
}

function mapearStatus(status: string): 'Abandonado' | 'Em análise' | 'Regularizado' {
  if (!status) return 'Abandonado';
  const statusNormalizado = status.toLowerCase();
  if (statusNormalizado.includes('regularizado')) return 'Regularizado';
  if (statusNormalizado.includes('análise') || statusNormalizado.includes('analise')) return 'Em análise';
  return 'Abandonado';
}

export function aplicarFiltros(imoveis: Imovel[], filtros: FiltrosDashboard): Imovel[] {
  return imoveis.filter(imovel => {
    // Filtro por Processo SEI
    if (filtros.processoSEI && filtros.processoSEI !== 'Todos' && 
        !imovel.processoSEI.toLowerCase().includes(filtros.processoSEI.toLowerCase())) {
      return false;
    }

    // Filtro por Edital
    if (filtros.edital && filtros.edital !== 'Todos' && 
        imovel.edital && !imovel.edital.toLowerCase().includes(filtros.edital.toLowerCase())) {
      return false;
    }

    // Filtro por Endereço
    if (filtros.endereco && filtros.endereco !== 'Todos') {
      if (imovel.logradouro !== filtros.endereco) {
        return false;
      }
    }

    // Filtro por Tipo
    if (filtros.tipo && filtros.tipo.length > 0 && !filtros.tipo.includes(imovel.tipo)) {
      return false;
    }

    // Filtro por Zona
    if (filtros.zona && filtros.zona.length > 0 && !filtros.zona.includes(imovel.zona)) {
      return false;
    }

    // Filtro por Status
    if (filtros.status && filtros.status.length > 0 && !filtros.status.includes(imovel.status)) {
      return false;
    }

    return true;
  });
}

export function calcularEstatisticas(imoveis: Imovel[]): EstatisticasGerais {
  const porTipo: Record<string, number> = {};
  const porZona: Record<string, number> = {};
  const porStatus: Record<string, number> = {};
  const logradourosCount: Record<string, number> = {};

  imoveis.forEach(imovel => {
    // Contagem por tipo
    porTipo[imovel.tipo] = (porTipo[imovel.tipo] || 0) + 1;
    
    // Contagem por zona
    porZona[imovel.zona] = (porZona[imovel.zona] || 0) + 1;
    
    // Contagem por status
    porStatus[imovel.status] = (porStatus[imovel.status] || 0) + 1;
    
    // Contagem por logradouro
    logradourosCount[imovel.logradouro] = (logradourosCount[imovel.logradouro] || 0) + 1;
  });

  // Converter logradouros para array e ordenar por quantidade
  const logradourosTop = Object.entries(logradourosCount)
    .map(([nome, quantidade]) => ({ nome, quantidade }))
    .sort((a, b) => b.quantidade - a.quantidade)
    .slice(0, 10); // Top 10

  return {
    totalImoveis: imoveis.length,
    porTipo,
    porZona,
    porStatus,
    logradourosTop
  };
}

export function exportarDados(imoveis: Imovel[], formato: 'csv' | 'json'): void {
  let conteudo: string;
  let nomeArquivo: string;
  let tipoMime: string;

  if (formato === 'csv') {
    conteudo = Papa.unparse(imoveis);
    nomeArquivo = 'imoveis-abandonados-export.csv';
    tipoMime = 'text/csv';
  } else {
    conteudo = JSON.stringify(imoveis, null, 2);
    nomeArquivo = 'imoveis-abandonados-export.json';
    tipoMime = 'application/json';
  }

  const blob = new Blob([conteudo], { type: tipoMime });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = nomeArquivo;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}