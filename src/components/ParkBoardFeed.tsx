import React, { useState } from 'react';
import { 
  TreePine, 
  MessageSquare, 
  Heart, 
  PlusCircle, 
  Send,
  X
} from 'lucide-react';
import { CommunityPost } from '../types/domain';

// Mock Posts per la Bacheca del Parco
const INITIAL_POSTS: CommunityPost[] = [
  {
    id: 'post-1',
    author_name: 'Laura V.',
    author_avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    author_dog: 'Briciola (Meticcio)',
    neighborhood: 'Isola',
    content: 'Oggi alle 18:00 passeggiata di gruppo all\'Area Cani BAM! Chi si unisce per far correre i pelosetti?',
    park_name: 'Area Cani BAM',
    event_time: 'Oggi • Ore 18:00',
    tag: 'meetup',
    likes: 8,
    comments_count: 3,
    created_at_label: '15 min fa'
  },
  {
    id: 'post-2',
    author_name: 'Marco R.',
    author_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    author_dog: 'Thor (Golden Retriever)',
    neighborhood: 'Porta Romana',
    content: 'Cerco un compagno di giochi per Thor per sabato mattina al Parco Baden-Powell. È socievole e ama rincorrere le palline!',
    park_name: 'Parco Baden-Powell',
    event_time: 'Sabato 12 • Ore 10:30',
    tag: 'walk',
    likes: 12,
    comments_count: 5,
    created_at_label: '1 ora fa'
  },
  {
    id: 'post-3',
    author_name: 'Elena C.',
    author_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    author_dog: 'Luna (Corgi)',
    neighborhood: 'Brera',
    content: 'Consiglio veterinario nel quartiere per pulizia denti? Qualcuno ha provato la nuova clinica in Via Solferino?',
    park_name: 'Parco Sempione',
    event_time: 'Richiesta Info',
    tag: 'advice',
    likes: 5,
    comments_count: 7,
    created_at_label: '3 ore fa'
  }
];

export const ParkBoardFeed: React.FC = () => {
  const [posts, setPosts] = useState<CommunityPost[]>(INITIAL_POSTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newContent, setNewContent] = useState('');
  const [newPark, setNewPark] = useState('Area Cani BAM');
  const [newTime, setNewTime] = useState('Oggi • Ore 18:30');

  const handleLike = (id: string) => {
    setPosts(prev => prev.map(post => 
      post.id === id ? { ...post, likes: post.likes + 1 } : post
    ));
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      author_name: 'Tu (Vicino)',
      author_avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      author_dog: 'Mondo Cane',
      neighborhood: 'Isola',
      content: newContent,
      park_name: newPark,
      event_time: newTime,
      tag: 'meetup',
      likes: 1,
      comments_count: 0,
      created_at_label: 'Ora'
    };

    setPosts([newPost, ...posts]);
    setNewContent('');
    setIsModalOpen(false);
  };

  return (
    <div className="bg-gradient-to-br from-amber-50/60 via-stone-50 to-orange-50/40 rounded-3xl p-5 border border-amber-200/60 shadow-sm space-y-4">
      {/* HEADER WIDGET */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/20">
            <TreePine className="w-5 h-5 text-emerald-200" />
          </div>
          <div>
            <h3 className="font-extrabold text-stone-900 text-base leading-tight">
              Bacheca del Parco
            </h3>
            <p className="text-[11px] text-amber-800 font-semibold">
              Annunci & Incontri live di vicinato
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Pubblica Annuncio</span>
        </button>
      </div>

      {/* FEED ANNUNCI */}
      <div className="space-y-3">
        {posts.map((post) => (
          <article 
            key={post.id}
            className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs hover:shadow-md transition-shadow space-y-2.5"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <img 
                  src={post.author_avatar} 
                  alt={post.author_name}
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-amber-400/40"
                />
                <div>
                  <h4 className="font-bold text-stone-900 text-xs leading-tight">
                    {post.author_name}
                  </h4>
                  <p className="text-[10px] text-stone-500 font-medium">
                    {post.author_dog} • {post.neighborhood}
                  </p>
                </div>
              </div>

              <span className="text-[10px] font-semibold text-stone-400">
                {post.created_at_label}
              </span>
            </div>

            <p className="text-xs text-stone-800 leading-relaxed font-normal">
              {post.content}
            </p>

            <div className="flex items-center justify-between pt-1 border-t border-stone-100 text-[11px]">
              <span className="inline-flex items-center gap-1 text-emerald-800 font-extrabold bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200/60">
                <TreePine className="w-3 h-3 text-emerald-600" />
                {post.park_name} ({post.event_time})
              </span>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleLike(post.id)}
                  className="flex items-center gap-1 text-stone-500 hover:text-rose-600 transition-colors font-medium cursor-pointer"
                >
                  <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500/20" />
                  <span>{post.likes}</span>
                </button>

                <button 
                  onClick={() => alert(`Unisciti alla conversazione con ${post.author_name}`)}
                  className="flex items-center gap-1 text-stone-500 hover:text-amber-600 transition-colors font-medium cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-amber-500" />
                  <span>{post.comments_count}</span>
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* MODAL NUOVO ANNUNCIO */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-100 relative">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <div className="p-2.5 rounded-xl bg-amber-500 text-white">
                <PlusCircle className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-stone-900 text-lg">
                Pubblica in Bacheca Parco
              </h3>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Cosa vuoi organizzare o chiedere ai vicini?
                </label>
                <textarea
                  rows={3}
                  placeholder="Es. Passeggiata di gruppo oggi alle 18:00 all'Area Cani BAM..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full p-3 bg-stone-50 border border-stone-200 rounded-2xl text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Parco di Riferimento:
                </label>
                <input 
                  type="text" 
                  value={newPark}
                  onChange={(e) => setNewPark(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Orario / Data:
                </label>
                <input 
                  type="text" 
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-600 text-white text-xs font-extrabold shadow-md hover:bg-amber-700 flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Pubblica Ora</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
