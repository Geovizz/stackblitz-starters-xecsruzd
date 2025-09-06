'use client';

import { useEffect, useRef, useState } from 'react';

type Game = { id: string; title: string; desc: string; url: string; icon?: string; rating?: number };

const GAMES: Game[] = [
  { id: 'flappy', title: 'Flappy Block', desc: 'Arcade / Tap to fly', url: '/games/flappy/index.html', icon: '/icons/flappy.png', rating: 4.2 },
  { id: 'runner', title: 'Tiny Runner', desc: 'Endless runner challenge', url: '/games/runner/index.html', icon: '/icons/runner.png', rating: 4.0 },
  { id: 'merge', title: 'Merge Rot', desc: 'Merge Brain Rots', url: '/games/merge/index.html', icon: '/icons/merge.png', rating: 4.5 },
];

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [likes, setLikes] = useState<Record<string, number>>({});
  const [comments, setComments] = useState<Record<string, number>>({});

  // отслеживаем скролл
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onScroll = () => {
      const i = Math.round(el.scrollTop / window.innerHeight);
      setIndex(Math.max(0, Math.min(GAMES.length - 1, i)));
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  const toggleLike = (id: string) => {
    setLikes((p) => ({ ...p, [id]: p[id] ? 0 : 1 }));
  };

  return (
    <div ref={containerRef} className="h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth bg-black text-white">
      {GAMES.map((g, i) => {
        const isNear = Math.abs(i - index) <= 1;
        return (
          <section key={g.id} className="relative h-screen snap-start bg-gray-200">
            {isNear ? (
              <>
                {/* Верхний баннер */}
                <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-center bg-gray-400 h-12 text-black font-semibold">
                  AD BANNER
                </div>

                {/* Лого Playza */}
                <div className="absolute top-14 left-2 z-10">
                  <span className="flex items-center gap-1 rounded-full bg-purple-500 px-3 py-1 text-sm font-semibold">
                    <span>😅</span> Playza
                  </span>
                </div>

                {/* Игра */}
                <iframe src={g.url} title={g.title} className="w-full h-full block" allow="autoplay; fullscreen" />

                {/* Инфо о игре (снизу поверх игры) */}
                <div className="absolute bottom-14 left-2 flex items-center gap-2 bg-black/40 px-3 py-2 rounded-md">
                  <img src={g.icon || '/icons/default.png'} alt="icon" className="h-10 w-10 rounded-md" />
                  <div>
                    <h1 className="text-white font-semibold">{g.title}</h1>
                    <p className="text-gray-200 text-xs">{g.desc}</p>
                  </div>
                </div>

                {/* Нижняя фиолетовая панель */}
                <div className="absolute bottom-0 left-0 right-0 z-10 flex justify-around bg-purple-600 py-2 text-center text-xs">
                  <button onClick={() => toggleLike(g.id)} className="flex flex-col items-center">
                    <span className="text-lg">{likes[g.id] ? '❤️' : '🤍'}</span>
                    <span>{likes[g.id] || 23}</span>
                  </button>
                  <button className="flex flex-col items-center">
                    <span className="text-lg">💬</span>
                    <span>{comments[g.id] || 5}</span>
                  </button>
                  <button className="flex flex-col items-center">
                    <span className="text-lg">⭐</span>
                    <span>{g.rating || 0}</span>
                  </button>
                  <button
                    onClick={() => {
                      const url = `${location.origin}${location.pathname}?game=${g.id}`;
                      if ((navigator as any).share) {
                        (navigator as any).share({ title: g.title, url }).catch(() => {});
                      } else {
                        navigator.clipboard?.writeText(url);
                        alert('Link copied!');
                      }
                    }}
                    className="flex flex-col items-center"
                  >
                    <span className="text-lg">⤴</span>
                    <span>Share</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <div className="h-32 w-32 rounded-xl bg-white/10 animate-pulse" />
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
