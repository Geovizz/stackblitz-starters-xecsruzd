'use client';

import { useRef, useState, useEffect } from 'react';

type Game = { id: string; title: string; desc: string; url: string };

const GAMES: Game[] = [
  {
    id: 'flappy',
    title: 'Flappy Block',
    desc: 'Arcade / Tap to fly',
    url: '/games/flappy/index.html',
  },
  {
    id: 'runner',
    title: 'Tiny Runner',
    desc: 'Endless runner challenge',
    url: '/games/runner/index.html',
  },
];

// зацикливаем список искусственно
const LOOP = 100;
const LOOPED = Array.from({ length: LOOP }, () => GAMES).flat();

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [likes, setLikes] = useState<Record<string, number>>({});
  const [comments, setComments] = useState<Record<string, number>>({});

  // отслеживаем скролл (чисто для отображения текущего индекса)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onScroll = () => {
      const i = Math.round(el.scrollTop / window.innerHeight);
      setIndex(i % GAMES.length);
    };

    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  const toggleLike = (id: string) => {
    setLikes((p) => ({ ...p, [id]: p[id] ? 0 : 1 }));
  };

  return (
    <div
      ref={containerRef}
      className="h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth bg-black text-white"
    >
      {LOOPED.map((g, i) => {
        const isNear = Math.abs(i % GAMES.length - index) <= 1;
        return (
          <section key={i} className="relative h-screen snap-start">
            {isNear ? (
              <>
                {/* Верхняя панель */}
                <div className="absolute top-0 left-0 right-0 z-10 flex items-center gap-3 bg-black/60 p-3">
                  <div className="h-10 w-10 rounded bg-gray-700 flex items-center justify-center text-xs">
                    ICON
                  </div>
                  <div>
                    <h1 className="text-sm font-semibold">{g.title}</h1>
                    <p className="text-xs text-gray-300">{g.desc}</p>
                  </div>
                </div>

                {/* Игра */}
                <iframe
                  src={g.url}
                  title={g.title}
                  className="w-full h-full block"
                  allow="autoplay; fullscreen"
                />

                {/* Нижняя панель */}
                <div className="absolute bottom-0 left-0 right-0 z-10 flex justify-around bg-black/80 py-2 text-center text-xs">
                  <button
                    onClick={() => toggleLike(g.id)}
                    className="flex flex-col items-center"
                  >
                    <span className="text-lg">{likes[g.id] ? '❤️' : '🤍'}</span>
                    <span>{likes[g.id] || 0}</span>
                  </button>
                  <button className="flex flex-col items-center">
                    <span className="text-lg">💬</span>
                    <span>{comments[g.id] || 0}</span>
                  </button>
                  <button className="flex flex-col items-center">
                    <span className="text-lg">⭐</span>
                    <span>0</span>
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
