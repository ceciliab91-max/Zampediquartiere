import React, { useState, useMemo } from 'react';
import { 
  Search, 
  X, 
  CheckCircle2, 
  Info, 
  TreePine,
  User,
  Menu,
  SlidersHorizontal
} from 'lucide-react';
import { SitterProfile, SitterFilterState, PetSize, BookingStatus } from '../types/domain';
import { SitterCard } from '../components/SitterCard';

// Mock Data Realistici per 8 Vicini a Milano (Immagini Unsplash HD)
const MOCK_SITTERS: SitterProfile[] = [
  {
    id: 'sitter-1',
    created_at: '2026-01-15T10:00:00Z',
    updated_at: '2026-02-01T10:00:00Z',
    full_name: 'Giulia Bianchi',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    cover_photo_url: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80',
    neighborhood: 'Isola',
    street_address: 'Via Solferino',
    zip_code: '20124',
    city: 'Milano',
    bio: 'Amo le lunghe passeggiate al Parco di BAM (Biblioteca degli Alberi). Vivo a 2 minuti dall\'area cani.',
    housing_type: 'apartment_with_balcony',
    has_garden: false,
    has_balcony: true,
    has_other_pets: false,
    is_sitter: true,
    compensation_type: 'exchange',
    time_credits: 12,
    rating: 4.98,
    reviews_count: 24,
    max_dog_size: 'medium',
    distance_meters: 250,
    distance_label: 'A 250m · Isola / BAM',
    nearby_park: 'Parco BAM / Biblioteca degli Alberi',
    badges: ['Super Vicino', 'Banca Tempo'],
    services_offered: ['dog_walking', 'daycare'],
    hosted_dogs_photos: [{ name: 'Leo', breed: 'Golden Retriever', photo_url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=150&q=80' }]
  },
  {
    id: 'sitter-2',
    created_at: '2026-01-18T10:00:00Z',
    updated_at: '2026-02-10T10:00:00Z',
    full_name: 'Marco Rossi',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    cover_photo_url: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=800&q=80',
    neighborhood: 'Porta Romana',
    street_address: 'Via Bergamo',
    zip_code: '20135',
    city: 'Milano',
    bio: 'Casa indipendente con grande giardino alberato e recintato. Ideale per stallo notturno in sicurezza.',
    housing_type: 'house_with_garden',
    has_garden: true,
    has_balcony: true,
    has_other_pets: true,
    other_pets_description: '1 gatto calmo',
    is_sitter: true,
    compensation_type: 'both',
    daily_rate: 22,
    hourly_rate: 12,
    time_credits: 8,
    rating: 4.91,
    reviews_count: 36,
    max_dog_size: 'giant',
    distance_meters: 600,
    distance_label: 'A 600m · Porta Romana',
    nearby_park: 'Giardini Guastalla',
    badges: ['Con Giardino', 'Super Vicino'],
    services_offered: ['daycare', 'overnight_boarding'],
    hosted_dogs_photos: [{ name: 'Thor', breed: 'Golden Retriever', photo_url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=150&q=80' }]
  },
  {
    id: 'sitter-3',
    created_at: '2026-02-01T10:00:00Z',
    updated_at: '2026-02-12T10:00:00Z',
    full_name: 'Elena & Matteo',
    avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    cover_photo_url: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80',
    neighborhood: 'Navigli',
    street_address: 'Ripa di Porta Ticinese',
    zip_code: '20144',
    city: 'Milano',
    bio: 'Disponibili per passeggiate al Parco Baden-Powell e stallo casalingo durante i weekend.',
    housing_type: 'apartment_with_balcony',
    has_garden: false,
    has_balcony: true,
    has_other_pets: false,
    is_sitter: true,
    compensation_type: 'exchange',
    time_credits: 15,
    rating: 5.00,
    reviews_count: 19,
    max_dog_size: 'large',
    distance_meters: 900,
    distance_label: 'A 900m · Navigli',
    nearby_park: 'Parco Baden-Powell',
    badges: ['Scambio Favori'],
    services_offered: ['dog_walking', 'home_visit'],
    hosted_dogs_photos: [{ name: 'Briciola', breed: 'Meticcio', photo_url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=150&q=80' }]
  },
  {
    id: 'sitter-4',
    created_at: '2026-02-05T10:00:00Z',
    updated_at: '2026-02-15T10:00:00Z',
    full_name: 'Roberto Contini',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    cover_photo_url: 'https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?auto=format&fit=crop&w=800&q=80',
    neighborhood: 'Lambrate',
    street_address: 'Via Porpora',
    zip_code: '20131',
    city: 'Milano',
    bio: 'Educatore cinofilo in formazione. Offro passeggiate strutturate al Parco Lambro.',
    housing_type: 'house_with_yard',
    has_garden: true,
    has_balcony: false,
    has_other_pets: false,
    is_sitter: true,
    compensation_type: 'direct_pay',
    daily_rate: 25,
    hourly_rate: 15,
    time_credits: 0,
    rating: 4.94,
    reviews_count: 42,
    max_dog_size: 'giant',
    distance_meters: 1400,
    distance_label: 'A 1.4km · Lambrate',
    nearby_park: 'Parco Lambro',
    badges: ['Educatore Cinofilo'],
    services_offered: ['dog_walking', 'daycare'],
    hosted_dogs_photos: [{ name: 'Rocky', breed: 'Pastore Tedesco', photo_url: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?auto=format&fit=crop&w=150&q=80' }]
  },
  {
    id: 'sitter-5',
    created_at: '2026-02-10T10:00:00Z',
    updated_at: '2026-02-20T10:00:00Z',
    full_name: 'Chiara Moretti',
    avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
    cover_photo_url: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=800&q=80',
    neighborhood: 'Brera',
    street_address: 'Via Moscova',
    zip_code: '20121',
    city: 'Milano',
    bio: 'Studente vicina al Parco Sempione. Disponibile per uscite e tanta affettuosità.',
    housing_type: 'apartment_with_balcony',
    has_garden: false,
    has_balcony: true,
    has_other_pets: false,
    is_sitter: true,
    compensation_type: 'exchange',
    time_credits: 10,
    rating: 4.89,
    reviews_count: 15,
    max_dog_size: 'small',
    distance_meters: 800,
    distance_label: 'A 800m · Brera / Sempione',
    nearby_park: 'Parco Sempione',
    badges: ['Taglie Piccole', 'Super Vicino'],
    services_offered: ['dog_walking', 'daycare'],
    hosted_dogs_photos: [{ name: 'Maya', breed: 'Pechinese', photo_url: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=150&q=80' }]
  },
  {
    id: 'sitter-6',
    created_at: '2026-02-12T10:00:00Z',
    updated_at: '2026-02-22T10:00:00Z',
    full_name: 'Davide & Pepe',
    avatar_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
    cover_photo_url: 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&w=800&q=80',
    neighborhood: 'San Siro',
    street_address: 'Via Novara',
    zip_code: '20153',
    city: 'Milano',
    bio: 'Casa con cortile privato vicino al Parco Trenno. Pepe ama fare amicizia con tutti i cani.',
    housing_type: 'house_with_garden',
    has_garden: true,
    has_balcony: false,
    has_other_pets: true,
    is_sitter: true,
    compensation_type: 'both',
    daily_rate: 20,
    hourly_rate: 10,
    time_credits: 7,
    rating: 4.96,
    reviews_count: 28,
    max_dog_size: 'large',
    distance_meters: 1800,
    distance_label: 'A 1.8km · San Siro',
    nearby_park: 'Parco Trenno',
    badges: ['Con Giardino'],
    services_offered: ['daycare', 'overnight_boarding'],
    hosted_dogs_photos: [{ name: 'Pepe', breed: 'Beagle', photo_url: 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&w=150&q=80' }]
  },
  {
    id: 'sitter-7',
    created_at: '2026-02-15T10:00:00Z',
    updated_at: '2026-02-25T10:00:00Z',
    full_name: 'Sofia & Kiko',
    avatar_url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80',
    cover_photo_url: 'https://images.unsplash.com/photo-1561037404-61cd46aa615b?auto=format&fit=crop&w=800&q=80',
    neighborhood: 'Porta Venezia',
    street_address: 'Corso Buenos Aires',
    zip_code: '20124',
    city: 'Milano',
    bio: 'Passeggiate quotidiane nei Giardini Indro Montanelli. Kiko è un cucciolo giocoso.',
    housing_type: 'apartment_with_balcony',
    has_garden: false,
    has_balcony: true,
    has_other_pets: true,
    is_sitter: true,
    compensation_type: 'exchange',
    time_credits: 14,
    rating: 4.92,
    reviews_count: 17,
    max_dog_size: 'medium',
    distance_meters: 500,
    distance_label: 'A 500m · Porta Venezia',
    nearby_park: 'Giardini Indro Montanelli',
    badges: ['Scambio Favori', 'Super Vicino'],
    services_offered: ['dog_walking'],
    hosted_dogs_photos: [{ name: 'Kiko', breed: 'Shiba Inu', photo_url: 'https://images.unsplash.com/photo-1561037404-61cd46aa615b?auto=format&fit=crop&w=150&q=80' }]
  },
  {
    id: 'sitter-8',
    created_at: '2026-02-18T10:00:00Z',
    updated_at: '2026-02-28T10:00:00Z',
    full_name: 'Alessandro & Zoe',
    avatar_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
    cover_photo_url: 'https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&w=800&q=80',
    neighborhood: 'Bicocca',
    street_address: 'Viale Sarca',
    zip_code: '20126',
    city: 'Milano',
    bio: 'Ampio parco nord raggiungibile a piedi. Zoe ama le corse sui proni sterminati.',
    housing_type: 'apartment_with_balcony',
    has_garden: false,
    has_balcony: true,
    has_other_pets: true,
    is_sitter: true,
    compensation_type: 'both',
    daily_rate: 18,
    hourly_rate: 10,
    time_credits: 9,
    rating: 4.88,
    reviews_count: 22,
    max_dog_size: 'giant',
    distance_meters: 2100,
    distance_label: 'A 2.1km · Bicocca / Parco Nord',
    nearby_park: 'Parco Nord Milano',
    badges: ['Parco Nord'],
    services_offered: ['dog_walking', 'daycare'],
    hosted_dogs_photos: [{ name: 'Zoe', breed: 'Border Collie', photo_url: 'https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&w=150&q=80' }]
  }
];

export const ExploreSitters: React.FC = () => {
  const [filters, setFilters] = useState<SitterFilterState>({
    searchQuery: '',
    maxDogSize: 'all',
    onlyWithGarden: false,
    onlyExchange: false,
    serviceType: 'all',
    housingType: 'all'
  });

  const [selectedSitterModal, setSelectedSitterModal] = useState<SitterProfile | null>(null);
  const [meetDate, setMeetDate] = useState<string>('2026-09-15');
  const [meetTime, setMeetTime] = useState<string>('17:30');
  const [meetPark, setMeetPark] = useState<string>('Area Cani BAM / Biblioteca degli Alberi');
  const [bookingStatus, setBookingStatus] = useState<BookingStatus | null>(null);

  // Filtraggio deterministico dei sitter
  const filteredSitters = useMemo(() => {
    return MOCK_SITTERS.filter(sitter => {
      if (filters.searchQuery.trim() !== '') {
        const query = filters.searchQuery.toLowerCase();
        const matchesNeighborhood = sitter.neighborhood.toLowerCase().includes(query);
        const matchesZip = sitter.zip_code.includes(query);
        const matchesName = sitter.full_name.toLowerCase().includes(query);
        if (!matchesNeighborhood && !matchesZip && !matchesName) return false;
      }

      if (filters.maxDogSize !== 'all') {
        const sizes: PetSize[] = ['small', 'medium', 'large', 'giant'];
        const sitterMaxIdx = sizes.indexOf(sitter.max_dog_size);
        const requiredIdx = sizes.indexOf(filters.maxDogSize);
        if (sitterMaxIdx < requiredIdx) return false;
      }

      if (filters.onlyWithGarden && !sitter.has_garden && sitter.housing_type !== 'house_with_garden') {
        return false;
      }

      if (filters.onlyExchange && sitter.compensation_type === 'direct_pay') {
        return false;
      }

      return true;
    });
  }, [filters]);

  const handleRequestMeetAndGreet = (sitter: SitterProfile) => {
    setSelectedSitterModal(sitter);
    setBookingStatus('IN_ATTESA');
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* 1. NAVBAR AIRBNB STYLE */}
      <header className="bg-white border-b border-neutral-200/80 sticky top-0 z-40">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* LOGO MINIMALIST VERDE SCURO */}
          <div className="flex items-center gap-2.5 flex-shrink-0 cursor-pointer">
            <div className="w-9 h-9 rounded-xl bg-emerald-900 flex items-center justify-center text-white font-extrabold text-lg shadow-2xs">
              🐾
            </div>
            <span className="font-extrabold text-neutral-900 text-lg tracking-tight hidden sm:inline-block">
              Zampe di Quartiere
            </span>
          </div>

          {/* 2. FLOATING SEARCH PILL (AIRBNB THREE SEGMENT STYLE) */}
          <div className="flex-1 max-w-2xl mx-auto">
            <div className="rounded-full border border-neutral-200 shadow-xs hover:shadow-md transition-shadow duration-200 p-1.5 pl-4 bg-white flex items-center justify-between gap-2">
              
              {/* SEGMENT 1: DOVE */}
              <div className="flex-1 border-r border-neutral-200 pr-2">
                <input 
                  type="text"
                  placeholder="Cerca quartiere o via..."
                  value={filters.searchQuery}
                  onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
                  className="w-full text-xs font-semibold text-neutral-900 placeholder:text-neutral-500 bg-transparent focus:outline-none"
                />
              </div>

              {/* SEGMENT 2: QUANDO */}
              <div className="hidden md:block flex-1 border-r border-neutral-200 px-2 text-left">
                <p className="text-[11px] font-bold text-neutral-900">Questo weekend</p>
                <p className="text-[10px] text-neutral-400 font-normal">Date flessibili</p>
              </div>

              {/* SEGMENT 3: PER CHI */}
              <div className="hidden sm:block flex-1 px-2 text-left">
                <select
                  value={filters.maxDogSize}
                  onChange={(e) => setFilters(prev => ({ ...prev, maxDogSize: e.target.value as PetSize | 'all' }))}
                  className="w-full text-xs font-semibold text-neutral-900 bg-transparent focus:outline-none cursor-pointer"
                >
                  <option value="all">Tutte le taglie</option>
                  <option value="small">Piccola (&lt;10kg)</option>
                  <option value="medium">Media (10-25kg)</option>
                  <option value="large">Grande (25-40kg)</option>
                  <option value="giant">Gigante (&gt;40kg)</option>
                </select>
              </div>

              {/* LENTE VERDE BOSCO CIRCOLARE */}
              <button 
                type="button"
                className="w-9 h-9 rounded-full bg-emerald-800 hover:bg-emerald-900 text-white flex items-center justify-center shadow-xs transition-colors cursor-pointer flex-shrink-0"
                aria-label="Cerca"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* USER PROFILE MENU */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-900 text-xs font-extrabold border border-emerald-200">
              <span>Banca Tempo: 5h</span>
            </div>

            <button 
              type="button"
              className="rounded-full border border-neutral-200 p-2 flex items-center gap-2 hover:shadow-md transition-shadow cursor-pointer bg-white text-neutral-700"
            >
              <Menu className="w-4 h-4" />
              <User className="w-5 h-5 text-emerald-900" />
            </button>
          </div>

        </div>
      </header>

      {/* 3. FILTRI RAPIDI (CHIPS HORIZONTAL SLIDER) */}
      <section className="bg-stone-50/50 border-b border-neutral-200/60 py-3.5 px-4 sm:px-8">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-0.5">
            <button
              type="button"
              onClick={() => setFilters(prev => ({ ...prev, onlyWithGarden: !prev.onlyWithGarden }))}
              className={`rounded-full border px-4 py-2 text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                filters.onlyWithGarden 
                  ? 'bg-emerald-900 text-white border-emerald-900 shadow-2xs' 
                  : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-300'
              }`}
            >
              🏡 Con Giardino
            </button>

            <button
              type="button"
              onClick={() => setFilters(prev => ({ ...prev, onlyExchange: !prev.onlyExchange }))}
              className={`rounded-full border px-4 py-2 text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                filters.onlyExchange 
                  ? 'bg-emerald-900 text-white border-emerald-900 shadow-2xs' 
                  : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-300'
              }`}
            >
              🤝 Scambio Favori (Gratis)
            </button>

            <button
              type="button"
              onClick={() => setFilters(prev => ({ ...prev, maxDogSize: prev.maxDogSize === 'small' ? 'all' : 'small' }))}
              className={`rounded-full border px-4 py-2 text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                filters.maxDogSize === 'small' 
                  ? 'bg-emerald-900 text-white border-emerald-900 shadow-2xs' 
                  : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-300'
              }`}
            >
              🐶 Solo Cani Piccoli
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-neutral-500 font-medium flex-shrink-0">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Trovati: <strong className="text-neutral-900 font-extrabold">{filteredSitters.length} vicini</strong></span>
          </div>
        </div>
      </section>

      {/* 4. GRIGLIA CARD SITTER (AIRBNB LISTING STYLE) */}
      <main className="flex-1 max-w-[1600px] mx-auto w-full px-4 sm:px-8 py-8">
        {filteredSitters.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
            {filteredSitters.map((sitter) => (
              <SitterCard 
                key={sitter.id}
                sitter={sitter}
                onRequestMeetAndGreet={handleRequestMeetAndGreet}
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center mx-auto text-2xl">
              🐶
            </div>
            <h3 className="font-extrabold text-neutral-900 text-lg">Nessun vicino trovato con questi filtri</h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
              Prova a cambiare il quartiere cercato o a disattivare un filtro.
            </p>
            <button
              onClick={() => setFilters({ searchQuery: '', maxDogSize: 'all', onlyWithGarden: false, onlyExchange: false, serviceType: 'all', housingType: 'all' })}
              className="mt-2 inline-flex items-center px-4 py-2 rounded-full bg-emerald-800 text-white text-xs font-bold hover:bg-emerald-900 transition-colors cursor-pointer shadow-2xs"
            >
              Mostra tutti i vicini
            </button>
          </div>
        )}
      </main>

      {/* MODAL PRENOTAZIONE TRUST FLOW: MEET & GREET (AIRBNB MINIMAL STYLE) */}
      {selectedSitterModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div 
            className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-neutral-100 relative animate-in fade-in zoom-in-95 duration-200"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <button 
              onClick={() => { setSelectedSitterModal(null); setBookingStatus(null); }}
              className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600 p-1.5 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {bookingStatus === 'IN_ATTESA' && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-800">
                    <TreePine className="w-6 h-6 text-emerald-800" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase text-emerald-800 tracking-wider">Incontro Fiduciario</span>
                    <h3 id="modal-title" className="font-extrabold text-neutral-900 text-lg">
                      Meet & Greet con {selectedSitterModal.full_name}
                    </h3>
                  </div>
                </div>

                <div className="p-3.5 bg-stone-50 rounded-2xl border border-neutral-200/80 text-xs text-neutral-700 space-y-1">
                  <p className="font-bold text-neutral-900 flex items-center gap-1">
                    <Info className="w-4 h-4 text-emerald-800 flex-shrink-0" />
                    Incontro Conoscitivo al Parco Obbligatorio
                  </p>
                  <p className="text-[11px] text-neutral-600 leading-relaxed">
                    Per la sicurezza del tuo cane, vi incontrerete prima all'area cani del quartiere.
                  </p>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-neutral-800 mb-1">
                      Data Incontro:
                    </label>
                    <input 
                      type="date" 
                      value={meetDate}
                      onChange={(e) => setMeetDate(e.target.value)}
                      className="w-full p-2.5 bg-stone-50 border border-neutral-200 rounded-xl font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-neutral-800 mb-1">
                      Orario Preferito:
                    </label>
                    <input 
                      type="time" 
                      value={meetTime}
                      onChange={(e) => setMeetTime(e.target.value)}
                      className="w-full p-2.5 bg-stone-50 border border-neutral-200 rounded-xl font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-neutral-800 mb-1">
                      Parco del Quartiere {selectedSitterModal.neighborhood}:
                    </label>
                    <input 
                      type="text" 
                      value={meetPark}
                      onChange={(e) => setMeetPark(e.target.value)}
                      className="w-full p-2.5 bg-stone-50 border border-neutral-200 rounded-xl font-medium"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-neutral-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => { setSelectedSitterModal(null); setBookingStatus(null); }}
                    className="px-4 py-2.5 rounded-full border border-neutral-200 text-xs font-bold text-neutral-600 hover:bg-stone-50 cursor-pointer"
                  >
                    Annulla
                  </button>
                  <button
                    type="button"
                    onClick={() => setBookingStatus('MEET_AND_GREET')}
                    className="px-5 py-2.5 rounded-full bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-md transition-all cursor-pointer"
                  >
                    Conferma Richiesta
                  </button>
                </div>
              </div>
            )}

            {bookingStatus === 'MEET_AND_GREET' && (
              <div className="text-center py-4 space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-extrabold text-neutral-900 text-xl">Richiesta Inviata!</h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Abbiamo notificato <strong className="text-neutral-900">{selectedSitterModal.full_name}</strong> per l'incontro al parco <strong>{selectedSitterModal.nearby_park}</strong> per il <strong>{meetDate} alle ore {meetTime}</strong>.
                </p>
                <div className="p-3 bg-stone-50 rounded-xl border border-neutral-200 text-[11px] text-neutral-600">
                  Stato del Flusso: <span className="font-bold text-emerald-800">MEET_AND_GREET</span>
                </div>
                <button
                  type="button"
                  onClick={() => { setSelectedSitterModal(null); setBookingStatus(null); }}
                  className="w-full py-3 rounded-full bg-neutral-900 text-white text-xs font-bold hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  Torna all'Esplorazione
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. FOOTER AIRBNB STYLE */}
      <footer className="bg-stone-50 border-t border-neutral-200/80 mt-16 py-8">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-neutral-900">Zampe di Quartiere</span>
            <span>© 2026 · Privacy · Termini</span>
          </div>
          <div className="flex items-center gap-4 font-medium">
            <span className="hover:text-neutral-900 cursor-pointer">Banca del Tempo</span>
            <span className="hover:text-neutral-900 cursor-pointer">Manifesto di Vicinato</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
