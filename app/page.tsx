'use client';

import { useState, useRef } from 'react';

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

// делаем ровно 10 слайдов
const SLIDES = Array.from({ length: 10 }, (_, i) => GAMES[i % GAMES.length]);

export default function Home() {
  const [index, setIndex] = useState(0);
  const touchStartY = useRef<number | null>(null);
  const touchDeltaY = useRef<number>(0);
  const isAnimating = useRef(false);

  const goTo = (dir: 1 | -1) => {
    if (isAnimating.current) return;
    isAnimating.current = true;
    setIndex((prev) => {
      const next = (prev + dir + SLIDES.length) % SLIDES.length; // зациклено
      return next;
    });
    setTimeout(() => {
      isAnimating.current = false;
    }, 400); // синхронизируем с transition
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    touchDeltaY.current = 0;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    touchDeltaY.current = e.touches[0].clientY - touchStartY.current;
  };

  const handleTouchEnd = () => {
    if (Math.abs(touchDeltaY.current) > 50) {
      goTo(touchDeltaY.current > 0 ? -1 : 1);
    }
    touchStartY.current = null;
    touchDeltaY.current = 0;
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (e.deltaY > 50) goTo(1);
    else if (e.deltaY < -50) goTo(-1);
  };

  return (
    <div
      className="relative h-screen w-screen overflow-hidden bg-black text-white"
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="h-full w-full transition-transform duration-500"
        style={{ transform: `translateY(-${index * 100}vh)` }}
      >
        {SLIDES.map((g, i) => (
          <section key={i} className="relative h-screen w-screen">
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
              <button className="flex flex-col items-center">
                <span className="text-lg">❤️</span>
                <span>0</span>
              </button>
              <button className="flex flex-col items-center">
                <span className="text-lg">💬</span>
                <span>0</span>
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
          </section>
        ))}
      </div>
    </div>
  );
}
