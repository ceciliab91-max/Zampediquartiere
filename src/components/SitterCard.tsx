import React, { useState } from 'react';
import { Heart, Star, TreePine } from 'lucide-react';
import { SitterProfile } from '../types/domain';

interface SitterCardProps {
  sitter: SitterProfile;
  onRequestMeetAndGreet: (sitter: SitterProfile) => void;
}

export const SitterCard: React.FC<SitterCardProps> = ({ sitter, onRequestMeetAndGreet }) => {
  const [isSaved, setIsSaved] = useState(false);
  const mainDog = sitter.hosted_dogs_photos?.[0] || { name: 'Leo', breed: 'Golden Retriever', photo_url: '' };
  const isGarden = sitter.has_garden || sitter.housing_type === 'house_with_garden';

  return (
    <article 
      onClick={() => onRequestMeetAndGreet(sitter)}
      className="group cursor-pointer flex flex-col justify-between"
      aria-label={`Scheda sitter ${sitter.full_name} del quartiere ${sitter.neighborhood}`}
    >
      <div>
        {/* FOTO GRANDE 1:1 STILE AIRBNB LISTING */}
        <div className="aspect-square w-full rounded-2xl overflow-hidden relative bg-neutral-100 border border-neutral-200/60 shadow-2xs">
          <img 
            src={sitter.cover_photo_url || sitter.avatar_url || 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=600&q=80'} 
            alt={`${sitter.full_name} con ${mainDog.name}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />

          {/* CUORICINO "SALVA" IN ALTO A DESTRA */}
          <button 
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsSaved(!isSaved);
            }}
            className="absolute top-3 right-3 p-2 rounded-full bg-black/20 backdrop-blur-md text-white hover:bg-white hover:text-neutral-900 transition-all shadow-xs cursor-pointer"
            aria-label="Salva nei preferiti"
          >
            <Heart 
              className={`w-4 h-4 transition-colors ${
                isSaved ? 'fill-rose-500 text-rose-500' : 'text-white'
              }`} 
            />
          </button>

          {/* BADGE SUPER VICINO IN ALTO A SINISTRA (MINIMAL AIRBNB STYLE) */}
          {sitter.rating >= 4.9 && (
            <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-neutral-900 text-[11px] font-bold shadow-2xs border border-neutral-200/80">
              Super Vicino
            </span>
          )}
        </div>

        {/* RIGA TITOLO & RATING */}
        <div className="flex items-baseline justify-between gap-2 mt-3">
          <h3 className="font-bold text-neutral-900 text-base leading-tight group-hover:text-emerald-800 transition-colors truncate">
            {sitter.full_name} {mainDog.name ? `& ${mainDog.name}` : ''}
          </h3>
          <div className="flex items-center gap-1 text-xs font-bold text-neutral-900 flex-shrink-0">
            <Star className="w-3.5 h-3.5 fill-neutral-900 text-neutral-900" />
            <span>{sitter.rating.toFixed(2)}</span>
            <span className="text-neutral-400 font-normal">({sitter.reviews_count})</span>
          </div>
        </div>

        {/* INFO DI QUARTIERE & ALLOGGIO */}
        <p className="text-xs text-neutral-500 mt-1 font-medium">
          {sitter.distance_label.split('•')[0]} · {sitter.neighborhood}
        </p>

        <p className="text-xs text-neutral-500 font-normal mt-0.5 line-clamp-1">
          {isGarden ? '🏡 Casa con giardino recintato' : '🏢 Appartamento con balcone'}
        </p>
      </div>

      {/* PREZZO / FORMULA & CTA */}
      <div className="mt-3 pt-2.5 border-t border-neutral-100 flex items-center justify-between">
        <div>
          {sitter.compensation_type === 'exchange' ? (
            <span className="text-xs font-extrabold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/80">
              🤝 Scambio favori (Gratis)
            </span>
          ) : (
            <span className="text-sm font-bold text-neutral-900">
              €{sitter.daily_rate || sitter.hourly_rate || 15} <span className="text-xs font-normal text-neutral-500">/ giorno</span>
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRequestMeetAndGreet(sitter);
          }}
          className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:text-emerald-950 underline underline-offset-2 cursor-pointer"
        >
          <TreePine className="w-3.5 h-3.5 text-emerald-700" />
          <span>Incontra al parco</span>
        </button>
      </div>
    </article>
  );
};
