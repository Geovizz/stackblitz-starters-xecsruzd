'use client';

import { useEffect, useRef, useState } from 'react';

type Game = { id: string; title: string; url: string };

const GAMES: Game[] = [
  { id: 'flappy', title: 'Flappy Block', url: '/games/flappy/index.html' },
  { id: 'runner', title: 'Tiny Runner', url: '/games/runner/index.html' },
];

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [likes, setLikes] = useState<Record<string, number>>({});

  // стартуем с ?game=id
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const id = q.get('game');
    if (!id) return;
    const initial = Math.max(
      0,
      GAMES.findIndex((g) => g.id === id)
    );
    if (initial >= 0 && containerRef.current) {
      containerRef.current.scrollTo({
        top: initial * window.innerHeight,
        behavior: 'auto',
      });
      setIndex(initial);
    }
  }, []);

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

  // лайки сохраняем в localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('likes');
      if (saved) setLikes(JSON.parse(saved));
    } catch {}
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem('likes', JSON.stringify(likes));
    } catch {}
  }, [likes]);

  const toggleLike = (id: string) => {
    setLikes((p) => ({ ...p, [id]: p[id] ? 0 : 1 }));
  };

  return (
    <div
      ref={containerRef}
      className="h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth bg-black text-white"
    >
      {GAMES.map((g, i) => {
        const isNear = Math.abs(i - index) <= 1;
        return (
          <section key={g.id} className="relative h-screen snap-start">
            {isNear ? (
              <>
                <iframe
                  src={g.url}
                  title={g.title}
                  className="w-full h-full block"
                  allow="autoplay; fullscreen"
                />
                {/* Оверлей */}
                <div className="pointer-events-none absolute inset-x-0 top-0 bg-gradient-to-b from-black/70 to-transparent p-3 sm:p-4">
                  <div className="pointer-events-auto mx-auto flex max-w-screen-sm items-center justify-between">
                    <h1 className="text-base font-semibold">{g.title}</h1>
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleLike(g.id)}
                        className={`rounded-full px-3 py-1 text-sm bg-white/10 hover:bg-white/20 border ${
                          likes[g.id] ? 'border-red-400' : 'border-white/30'
                        }`}
                      >
                        {likes[g.id] ? '♥ Liked' : '♡ Like'}
                      </button>
                      <button
                        onClick={() => {
                          const url = `${location.origin}${location.pathname}?game=${g.id}`;
                          if ((navigator as any).share) {
                            (navigator as any)
                              .share({ title: g.title, url })
                              .catch(() => {});
                          } else {
                            navigator.clipboard?.writeText(url);
                            alert('Link copied!');
                          }
                        }}
                        className="rounded-full px-3 py-1 text-sm bg-white/10 hover:bg-white/20 border border-white/30"
                      >
                        Share
                      </button>
                    </div>
                  </div>
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
