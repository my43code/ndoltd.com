'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

const defaultSlides = [
  {
    id: 1,
    title: 'Launch-ready digital experiences',
    subtitle: 'Polished interfaces, clear messaging, and smooth user journeys.',
    image: '/images/project1.webp',
    badge: 'Design',
  },
  {
    id: 2,
    title: 'Reliable systems for growing teams',
    subtitle: 'Fast content delivery and flexible admin workflows behind the scenes.',
    image: '/images/team.webp',
    badge: 'Development',
  },
  {
    id: 3,
    title: 'Local support with global standards',
    subtitle: 'Thoughtful implementation for businesses in PNG and beyond.',
    image: '/images/project1.JPG',
    badge: 'Support',
  },
];

export default function SlidingShow({ items = [] }) {
  const slides = items.length > 0
    ? items.map((item, index) => ({
        id: item.id || item._id || index + 1,
        title: item.title || 'Recent story',
        subtitle: item.subtitle || item.summary || 'Fresh insight from our team.',
        image: item.image || '/images/project1.webp',
        badge: item.badge || 'Story',
      }))
    : defaultSlides;

  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 4000);

    return () => window.clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-emerald-400/20 bg-slate-900/95 p-3 shadow-[0_24px_80px_rgba(2,6,23,0.35)]">
      <div className="relative h-[320px] overflow-hidden rounded-[1.5rem] sm:h-[420px]">
        {slides.map((slide, index) => {
          const isActive = index === activeSlide;
          const isPrevious = index === (activeSlide + slides.length - 1) % slides.length;

          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-all duration-700 ${
                isActive
                  ? 'translate-x-0 opacity-100'
                  : isPrevious
                    ? '-translate-x-full opacity-0'
                    : 'translate-x-full opacity-0'
              }`}
            >
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                priority={index === 0}
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                <span className="inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-emerald-200 backdrop-blur">
                  {slide.badge}
                </span>
                <h3 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">
                  {slide.title}
                </h3>
                <p className="mt-2 max-w-xl text-sm leading-7 text-slate-200 sm:text-base">
                  {slide.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => setActiveSlide(index)}
              aria-label={`Show slide ${index + 1}`}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                index === activeSlide ? 'w-8 bg-emerald-400' : 'w-2.5 bg-slate-600 hover:bg-slate-400'
              }`}
            />
          ))}
        </div>
        <p className="text-sm text-slate-400">Auto-rotating showcase</p>
      </div>
    </div>
  );
}
