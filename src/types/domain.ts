/**
 * ZAMPE DI QUARTIERE - DOMAIN TYPES
 * Tipizzazione statica rigorosa TypeScript per l'intera applicazione.
 */

/** Taglia del cane accettata o del proprietario */
export type PetSize = 'small' | 'medium' | 'large' | 'giant';

/** Tipologia di servizio offerto o richiesto */
export type ServiceType = 
  | 'dog_walking'         // Passeggiata di quartiere
  | 'daycare'             // Asilo diurno a casa del sitter
  | 'overnight_boarding'  // Custodia notturna / Vacanza
  | 'home_visit';         // Visita a domicilio

/** Macchina a stati del flusso fiduciario per le prenotazioni */
export type BookingStatus = 
  | 'IN_ATTESA'        // Richiesta inviata dal proprietario
  | 'MEET_AND_GREET'   // Incontro conoscitivo preliminare obbligatorio al parco
  | 'CONFERMATO'       // Meet & Greet superato con successo, custodia confermata
  | 'COMPLETATO'       // Servizio concluso
  | 'RIFIUTATO';       // Richiesta declinata

/** Modello economico ibrido */
export type CompensationType = 
  | 'exchange'    // Scambio favori (Banca del tempo / Crediti di quartiere)
  | 'direct_pay'  // Compenso diretto tra privati in €
  | 'both';       // Disponibile a entrambe le modalità

/** Tipologia di alloggio del sitter per sicurezza e benessere del cane */
export type HousingType = 
  | 'house_with_garden'       // Casa indipendente con giardino recintato
  | 'apartment_with_balcony'  // Appartamento con balcone o terrazza
  | 'apartment_no_outdoor'    // Appartamento senza spazi esterni
  | 'house_with_yard';        // Casa con cortile condominiale recintato

/** Regole di compatibilità del cane memorizzate in JSONB */
export interface CompatibilityRules {
  compat_with_cats: boolean;
  compat_with_dogs: boolean;
  compat_with_children: boolean;
  special_needs?: string | null;
}

/** Entità Profilo Utente (Vicino di casa / Sitter / Proprietario) */
export interface Profile {
  id: string;
  created_at: string;
  updated_at: string;
  full_name: string;
  avatar_url?: string;
  cover_photo_url?: string;
  neighborhood: string;
  street_address?: string;
  zip_code: string;
  city: string;
  bio?: string;
  housing_type: HousingType;
  has_garden: boolean;
  has_balcony: boolean;
  has_other_pets: boolean;
  other_pets_description?: string;
  is_sitter: boolean;
  compensation_type: CompensationType;
  hourly_rate?: number;
  daily_rate?: number;
  time_credits: number;
  rating: number;
  reviews_count: number;
  max_dog_size: PetSize;
  lat?: number;
  lng?: number;
}

/** Entità Cane */
export interface Dog {
  id: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
  name: string;
  breed: string;
  size: PetSize;
  age_years: number;
  photo_url?: string;
  compatibility: CompatibilityRules;
  vet_contact_name?: string;
  vet_contact_phone?: string;
}

/** Recensione in evidenza per la Card */
export interface FeaturedReview {
  quote: string;
  author_name: string;
  dog_name: string;
  rating: number;
  date_label: string;
}

/** Cane ospitato abitualmente dal sitter */
export interface HostedDogPhoto {
  name: string;
  breed: string;
  photo_url: string;
}

/** Profilo Sitter Esteso per la Vista Card / Esplorazione / Mappa */
export interface SitterProfile extends Profile {
  distance_meters: number;
  distance_label: string; // es. "A 250m • Via Solferino"
  dogs?: Dog[];
  hosted_dogs_photos?: HostedDogPhoto[];
  featured_review?: FeaturedReview;
  badges: string[]; // es. "Super Vicino", "Giardino Recintato", "Primo Soccorso Pet"
  services_offered: ServiceType[];
  nearby_park: string; // es. "Parco BAM / Biblioteca degli Alberi"
}

/** Post / Annuncio della Bacheca del Parco */
export interface CommunityPost {
  id: string;
  author_name: string;
  author_avatar: string;
  author_dog?: string;
  neighborhood: string;
  content: string;
  park_name: string;
  event_time: string;
  tag: 'walk' | 'meetup' | 'emergency' | 'advice';
  likes: number;
  comments_count: number;
  created_at_label: string;
}

/** Entità Sponsor Locale per Economia Circolare di Quartiere */
export interface LocalSponsor {
  id: string;
  business_name: string;
  category: 'grooming' | 'veterinary' | 'pet_shop' | 'training';
  category_label: string;
  discount_offer: string; // es. "10% di sconto sul primo lavaggio"
  address: string;
  neighborhood: string;
  badge_text: string;
  image_url?: string;
  phone?: string;
}

/** Stato dei Filtri per la Pagina di Esplorazione */
export interface SitterFilterState {
  searchQuery: string; // Ricerca per CAP o Nome Quartiere
  maxDogSize: PetSize | 'all';
  onlyWithGarden: boolean;
  onlyExchange: boolean;
  serviceType: ServiceType | 'all';
  housingType: HousingType | 'all';
}
