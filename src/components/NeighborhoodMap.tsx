import React, { useState } from 'react';
import { 
  GoogleMap, 
  LoadScript, 
  Marker, 
  InfoWindow 
} from '@react-google-maps/api';
import { TreePine, Info, Compass } from 'lucide-react';
import { SitterProfile } from '../types/domain';

interface DogParkLocation {
  id: string;
  name: string;
  neighborhood: string;
  lat: number;
  lng: number;
  features: string[];
}

export const MOCK_DOG_PARKS: DogParkLocation[] = [
  {
    id: 'park-1',
    name: 'Area Cani BAM (Biblioteca degli Alberi)',
    neighborhood: 'Isola',
    lat: 45.4845,
    lng: 9.1910,
    features: ['Doppio Cancello', 'Fontanella Acqua', 'Ombra Alberata']
  },
  {
    id: 'park-2',
    name: 'Parco Baden-Powell',
    neighborhood: 'Navigli',
    lat: 45.4505,
    lng: 9.1730,
    features: ['Area Sgambamento Recintata', 'Panchine']
  },
  {
    id: 'park-3',
    name: 'Giardini Guastalla',
    neighborhood: 'Porta Romana',
    lat: 45.4590,
    lng: 9.1960,
    features: ['Zona Piccoli Cani', 'Alberi Secolari']
  },
  {
    id: 'park-4',
    name: 'Parco Lambro Area Cani',
    neighborhood: 'Lambrate',
    lat: 45.4890,
    lng: 9.2340,
    features: ['Grande Spazio Verde', 'Fontanella']
  }
];

interface NeighborhoodMapProps {
  sitters: SitterProfile[];
  selectedSitterId?: string | null;
  onSelectSitter: (sitter: SitterProfile) => void;
}

const defaultCenter = {
  lat: 45.485,
  lng: 9.189
};

const mapContainerStyle = {
  width: '100%',
  height: '100%'
};

// Stile personalizzato per la Mappa Google (toni caldi / salvia / crema)
const mapOptions: google.maps.MapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  styles: [
    {
      featureType: 'landscape',
      elementType: 'geometry',
      stylers: [{ color: '#fefcf8' }]
    },
    {
      featureType: 'poi.park',
      elementType: 'geometry',
      stylers: [{ color: '#d1fae5' }] // Salvia Green per parchi
    },
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [{ color: '#f5f5f4' }]
    },
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [{ color: '#e0f2fe' }]
    }
  ]
};

export const NeighborhoodMap: React.FC<NeighborhoodMapProps> = ({ 
  sitters, 
  selectedSitterId,
  onSelectSitter 
}) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
  
  const [activeInfoWindow, setActiveInfoWindow] = useState<{
    type: 'sitter' | 'park';
    data: SitterProfile | DogParkLocation;
  } | null>(null);

  // SE LA CHIAVE GOOGLE MAPS È PRESENTE
  if (apiKey) {
    return (
      <div className="w-full h-full min-h-[450px] rounded-3xl overflow-hidden shadow-sm border border-stone-200 relative">
        <LoadScript googleMapsApiKey={apiKey}>
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={defaultCenter}
            zoom={14}
            options={mapOptions}
          >
            {/* MARKER 🟠 SITTERS VICINI (ARANCIONE) */}
            {sitters.map((sitter) => (
              <Marker
                key={`sitter-${sitter.id}`}
                position={{ lat: sitter.lat || 45.485, lng: sitter.lng || 9.189 }}
                icon={{
                  url: 'https://maps.google.com/mapfiles/ms/icons/orange-dot.png',
                  scaledSize: new window.google.maps.Size(40, 40)
                }}
                onClick={() => {
                  onSelectSitter(sitter);
                  setActiveInfoWindow({ type: 'sitter', data: sitter });
                }}
              />
            ))}

            {/* MARKER 🟢 PARCHI / AREE CANI (VERDE SALVIA) */}
            {MOCK_DOG_PARKS.map((park) => (
              <Marker
                key={`park-${park.id}`}
                position={{ lat: park.lat, lng: park.lng }}
                icon={{
                  url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
                  scaledSize: new window.google.maps.Size(36, 36)
                }}
                onClick={() => setActiveInfoWindow({ type: 'park', data: park })}
              />
            ))}

            {/* INFO WINDOW Dettaglio Marker Selezionato */}
            {activeInfoWindow && (
              <InfoWindow
                position={{
                  lat: activeInfoWindow.data.lat || 45.485,
                  lng: activeInfoWindow.data.lng || 9.189
                }}
                onCloseClick={() => setActiveInfoWindow(null)}
              >
                <div className="p-2 max-w-xs text-stone-900 font-sans">
                  {activeInfoWindow.type === 'sitter' ? (
                    (() => {
                      const sitter = activeInfoWindow.data as SitterProfile;
                      return (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <img src={sitter.avatar_url} alt={sitter.full_name} className="w-8 h-8 rounded-full object-cover" />
                            <div>
                              <h4 className="font-extrabold text-xs">{sitter.full_name}</h4>
                              <p className="text-[10px] text-stone-500">{sitter.neighborhood} • {sitter.distance_label}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => onSelectSitter(sitter)}
                            className="w-full py-1.5 bg-amber-600 text-white rounded-lg text-[11px] font-extrabold"
                          >
                            Incontra al parco
                          </button>
                        </div>
                      );
                    })()
                  ) : (
                    (() => {
                      const park = activeInfoWindow.data as DogParkLocation;
                      return (
                        <div>
                          <h4 className="font-extrabold text-xs text-emerald-800 flex items-center gap-1">
                            <TreePine className="w-3.5 h-3.5" />
                            {park.name}
                          </h4>
                          <p className="text-[10px] text-stone-600 mt-1">{park.features.join(' • ')}</p>
                        </div>
                      );
                    })()
                  )}
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </LoadScript>
      </div>
    );
  }

  // FALLBACK VISIVO INTERATTIVO SE LA CHIAVE GOOGLE MAPS NON È PRESENTI
  return (
    <div className="w-full h-full min-h-[500px] rounded-3xl overflow-hidden border border-amber-200/80 shadow-md relative bg-[#f7f5ed] flex flex-col justify-between">
      
      {/* CANVAS MAPPA VETTORIALE CUSTOM WARM & SAGE */}
      <div className="absolute inset-0">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="street-grid" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#e7e4d8" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#street-grid)" />
          
          {/* Strade simulate principali */}
          <path d="M 0 160 Q 350 200 800 120" fill="none" stroke="#f5eedc" strokeWidth="16" />
          <path d="M 0 160 Q 350 200 800 120" fill="none" stroke="#e2d9c4" strokeWidth="8" />

          <path d="M 240 0 Q 300 450 360 700" fill="none" stroke="#f5eedc" strokeWidth="14" />
          <path d="M 240 0 Q 300 450 360 700" fill="none" stroke="#e2d9c4" strokeWidth="6" />

          {/* PARCHI / AREE CANI VERDI */}
          <rect x="60" y="60" width="220" height="150" rx="30" fill="#d1fae5" stroke="#a7f3d0" strokeWidth="2" />
          <rect x="420" y="260" width="280" height="180" rx="40" fill="#d1fae5" stroke="#a7f3d0" strokeWidth="2" />
        </svg>

        {/* ETICHETTE PARCHI VERDI */}
        {MOCK_DOG_PARKS.map((park, idx) => {
          const parkPositions = [
            { top: '18%', left: '16%' },
            { top: '62%', left: '58%' },
            { top: '78%', left: '22%' },
            { top: '25%', left: '70%' },
          ];
          const pos = parkPositions[idx % parkPositions.length];
          return (
            <div 
              key={park.id}
              style={{ top: pos.top, left: pos.left }}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5 px-3 py-1.5 bg-emerald-800 text-emerald-100 rounded-full border border-emerald-600 shadow-md text-xs font-extrabold z-10"
            >
              <TreePine className="w-4 h-4 text-emerald-300 flex-shrink-0" />
              <span>🟢 {park.name}</span>
            </div>
          );
        })}

        {/* MARKER 🟠 SITTERS (ORANGE / TERRACOTTA) */}
        {sitters.map((sitter, idx) => {
          const sitterPositions = [
            { top: '30%', left: '38%' },
            { top: '48%', left: '76%' },
            { top: '68%', left: '32%' },
            { top: '80%', left: '65%' },
            { top: '35%', left: '82%' }
          ];
          const pos = sitterPositions[idx % sitterPositions.length];
          const isSelected = selectedSitterId === sitter.id;

          return (
            <button
              key={sitter.id}
              onClick={() => onSelectSitter(sitter)}
              style={{ top: pos.top, left: pos.left }}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 group focus:outline-none cursor-pointer z-20 ${
                isSelected ? 'scale-125 z-30' : 'hover:scale-110'
              }`}
            >
              <div className={`flex items-center gap-2 p-1.5 rounded-full shadow-xl border backdrop-blur-md transition-all ${
                isSelected 
                  ? 'bg-amber-600 text-white border-amber-300 ring-4 ring-amber-600/30 font-black' 
                  : 'bg-stone-900 text-stone-100 border-amber-500/60 hover:border-amber-400'
              }`}>
                <img 
                  src={sitter.avatar_url} 
                  alt={sitter.full_name}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-white"
                />
                <div className="pr-2 text-left hidden sm:block">
                  <p className="text-xs font-extrabold leading-tight">{sitter.full_name.split(' ')[0]}</p>
                  <p className="text-[10px] opacity-90 font-semibold">{sitter.distance_label.split('•')[0]}</p>
                </div>
              </div>
              <div className={`w-3 h-3 rotate-45 mx-auto -mt-1 shadow-md ${isSelected ? 'bg-amber-600' : 'bg-stone-900'}`} />
            </button>
          );
        })}
      </div>

      {/* OVERLAY NOTICE DISCRETO VITE_GOOGLE_MAPS_API_KEY */}
      <div className="relative z-20 p-4 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-2 bg-stone-900/90 text-stone-100 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-stone-700/80 text-xs font-extrabold shadow-md">
          <Compass className="w-4 h-4 text-amber-400 animate-spin" />
          <span>Mappa Iperlocale Quartiere • {sitters[0]?.neighborhood || 'Milano'}</span>
        </div>

        <div className="bg-amber-100/90 text-amber-950 px-3 py-1.5 rounded-xl border border-amber-300 text-[11px] font-bold flex items-center gap-1 shadow-2xs">
          <Info className="w-3.5 h-3.5 text-amber-700 flex-shrink-0" />
          <span className="hidden sm:inline">Mappa vettoriale attiva (VITE_GOOGLE_MAPS_API_KEY pronta)</span>
          <span className="sm:hidden">Mappa Iperlocale</span>
        </div>
      </div>
    </div>
  );
};
