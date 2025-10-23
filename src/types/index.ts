export interface Imovel {
  id: string;
  logradouro: string;
  numero: string;
  zona: 'Norte' | 'Sul' | 'Leste' | 'Oeste';
  tipo: 'Casa' | 'Construção' | 'Prédio' | 'Terreno';
  status: 'Abandonado' | 'Em análise' | 'Regularizado';
  complemento?: string;
  bairro: string;
  processoSEI: string;
  edital?: string;
  longitude: number;
  latitude: number;
  foto?: string;
  dataRegistro: string;
  observacoes?: string;
}

export interface FiltrosDashboard {
  processoSEI?: string;
  edital?: string;
  endereco?: string;
  tipo?: string;
  zona?: string;
  status?: string;
}

export interface EstatisticasGerais {
  totalImoveis: number;
  porTipo: Record<string, number>;
  porZona: Record<string, number>;
  porStatus: Record<string, number>;
  logradourosTop: Array<{
    nome: string;
    quantidade: number;
  }>;
}

export interface LogradouroRanking {
  nome: string;
  quantidade: number;
}