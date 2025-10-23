import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { EstatisticasGerais } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface GraficosEstatisticasProps {
  estatisticas: EstatisticasGerais;
}

const GraficosEstatisticas: React.FC<GraficosEstatisticasProps> = ({ estatisticas }) => {
  // Dados para gráfico de barras por tipo
  const dadosTipo = {
    labels: Object.keys(estatisticas.porTipo),
    datasets: [
      {
        label: 'Quantidade de Imóveis',
        data: Object.values(estatisticas.porTipo),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(147, 51, 234, 0.8)',
          'rgba(249, 115, 22, 0.8)',
          'rgba(34, 197, 94, 0.8)',
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(147, 51, 234, 1)',
          'rgba(249, 115, 22, 1)',
          'rgba(34, 197, 94, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Dados para gráfico de rosca por status
  const dadosStatus = {
    labels: Object.keys(estatisticas.porStatus),
    datasets: [
      {
        data: Object.values(estatisticas.porStatus),
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(34, 197, 94, 0.8)',
        ],
        borderColor: [
          'rgba(239, 68, 68, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(34, 197, 94, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  // Dados para gráfico de barras por zona
  const dadosZona = {
    labels: Object.keys(estatisticas.porZona),
    datasets: [
      {
        label: 'Quantidade de Imóveis',
        data: Object.values(estatisticas.porZona),
        backgroundColor: 'rgba(99, 102, 241, 0.8)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 1,
      },
    ],
  };

  const opcoesGrafico = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  const opcoesRosca = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {/* Gráfico por Tipo */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Imóveis por Tipo
        </h3>
        <div className="h-64">
          <Bar data={dadosTipo} options={opcoesGrafico} />
        </div>
      </div>

      {/* Gráfico por Status */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Imóveis por Status
        </h3>
        <div className="h-64">
          <Doughnut data={dadosStatus} options={opcoesRosca} />
        </div>
      </div>

      {/* Gráfico por Zona */}
      <div className="bg-white p-6 rounded-lg shadow-md lg:col-span-2 xl:col-span-1">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Imóveis por Zona
        </h3>
        <div className="h-64">
          <Bar data={dadosZona} options={opcoesGrafico} />
        </div>
      </div>
    </div>
  );
};

export default GraficosEstatisticas;