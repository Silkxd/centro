import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Imovel } from '../types';
import { Target } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Configurar ícones do Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Ícone personalizado azul para imóveis abandonados
const iconeAbandonado = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface MapaInterativoProps {
  imoveis: Imovel[];
  onImovelClick?: (imovel: Imovel) => void;
}

// Componente para o botão de recentralizar
const BotaoRecentralizar: React.FC<{ imoveis: Imovel[] }> = ({ imoveis }) => {
  const map = useMap();

  const recentralizarMapa = () => {
    if (imoveis.length === 0) return;

    // Filtrar imóveis com coordenadas válidas
    const imoveisValidos = imoveis.filter(imovel => 
      imovel.latitude && imovel.longitude && 
      imovel.latitude !== 0 && imovel.longitude !== 0
    );

    if (imoveisValidos.length === 0) return;

    // Criar bounds com todas as coordenadas
    const bounds = L.latLngBounds(
      imoveisValidos.map(imovel => [imovel.latitude, imovel.longitude])
    );

    // Ajustar o mapa para mostrar todos os pontos
    map.fitBounds(bounds, { padding: [20, 20] });
  };

  return null; // O botão será renderizado fora do mapa
};

const MapaInterativo: React.FC<MapaInterativoProps> = ({ imoveis, onImovelClick }) => {
  const [mapKey, setMapKey] = useState(0);
  const mapRef = useRef<L.Map | null>(null);

  // Centro de Teresina
  const centroTeresina: [number, number] = [-5.0892, -42.8016];

  // Forçar re-render do mapa quando os imóveis mudarem
  useEffect(() => {
    setMapKey(prev => prev + 1);
  }, [imoveis]);

  const handleMarkerClick = (imovel: Imovel) => {
    if (onImovelClick) {
      onImovelClick(imovel);
    }
  };

  const recentralizarMapa = () => {
    if (!mapRef.current || imoveis.length === 0) return;

    // Filtrar imóveis com coordenadas válidas
    const imoveisValidos = imoveis.filter(imovel => 
      imovel.latitude && imovel.longitude && 
      imovel.latitude !== 0 && imovel.longitude !== 0
    );

    if (imoveisValidos.length === 0) return;

    // Criar bounds com todas as coordenadas
    const bounds = L.latLngBounds(
      imoveisValidos.map(imovel => [imovel.latitude, imovel.longitude])
    );

    // Ajustar o mapa para mostrar todos os pontos
    mapRef.current.fitBounds(bounds, { padding: [20, 20] });
  };

  const abrirStreetView = (latitude: number, longitude: number) => {
    const streetViewUrl = `https://www.google.com/maps?q=&layer=c&cbll=${latitude},${longitude}`;
    window.open(streetViewUrl, '_blank');
  };

  return (
    <div className="w-full h-full rounded-lg overflow-hidden shadow-lg relative">
      {/* Botão flutuante para recentralizar */}
      <button
        onClick={recentralizarMapa}
        className="absolute top-4 right-4 z-[1000] bg-white hover:bg-gray-50 border border-gray-300 rounded-md p-2 shadow-md transition-colors"
        title="Recentralizar mapa para mostrar todos os pontos"
      >
        <Target className="w-5 h-5 text-gray-700" />
      </button>

      <MapContainer
        key={mapKey}
        center={centroTeresina}
        zoom={14}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {imoveis.map((imovel) => {
          // Verificar se as coordenadas são válidas
          if (!imovel.latitude || !imovel.longitude || 
              imovel.latitude === 0 || imovel.longitude === 0) {
            return null;
          }

          return (
            <Marker
              key={imovel.id}
              position={[imovel.latitude, imovel.longitude]}
              icon={iconeAbandonado}
              eventHandlers={{
                click: () => handleMarkerClick(imovel)
              }}
            >
              <Popup className="custom-popup">
                <div className="p-2 min-w-[250px]">
                  <h3 className="font-bold text-lg text-blue-800 mb-2">
                    {imovel.logradouro}
                    {imovel.numero && `, ${imovel.numero}`}
                  </h3>
                  
                  <div className="space-y-1 text-sm">
                    <p><span className="font-semibold">Tipo:</span> {imovel.tipo}</p>
                    <p><span className="font-semibold">Zona:</span> {imovel.zona}</p>
                    <p><span className="font-semibold">Status:</span> 
                      <span className={`ml-1 px-2 py-1 rounded text-xs ${
                        imovel.status === 'Abandonado' ? 'bg-red-100 text-red-800' :
                        imovel.status === 'Em análise' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {imovel.status}
                      </span>
                    </p>
                    <p><span className="font-semibold">Bairro:</span> {imovel.bairro}</p>
                    {imovel.complemento && (
                      <p><span className="font-semibold">Complemento:</span> {imovel.complemento}</p>
                    )}
                    <p><span className="font-semibold">Processo SEI:</span> {imovel.processoSEI}</p>
                  </div>

                  {imovel.foto && (
                    <div className="mt-3">
                      <img 
                        src={imovel.foto} 
                        alt={`Foto do imóvel em ${imovel.logradouro}`}
                        className="w-full h-32 object-cover rounded border"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}

                  <div className="mt-3 pt-2 border-t border-gray-200">
                    <button
                      onClick={() => abrirStreetView(imovel.latitude, imovel.longitude)}
                      className="w-full bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                    >
                      Ver no Street View
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default MapaInterativo;