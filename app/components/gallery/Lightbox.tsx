'use client';

import { useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';

export interface LightboxItem {
  url: string;
  alt: string;
  caption?: string;
}

interface LightboxProps {
  items: LightboxItem[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export default function Lightbox({ items, currentIndex, onClose, onNavigate }: LightboxProps) {
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const item = items[currentIndex];
  const total = items.length;

  const goPrev = useCallback(() => {
    onNavigate(currentIndex === 0 ? total - 1 : currentIndex - 1);
  }, [currentIndex, total, onNavigate]);

  const goNext = useCallback(() => {
    onNavigate(currentIndex === total - 1 ? 0 : currentIndex + 1);
  }, [currentIndex, total, onNavigate]);

  // Lock body scroll
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft') goPrev();
      else if (e.key === 'ArrowRight') goNext();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose, goPrev, goNext]);

  // Touch swipe
  function handleTouchStart(e: React.TouchEvent) {
    touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (!touchStartRef.current) return;
    const dx = e.changedTouches[0].clientX - touchStartRef.current.x;
    const dy = e.changedTouches[0].clientY - touchStartRef.current.y;
    touchStartRef.current = null;
    if (Math.abs(dx) < 50 || Math.abs(dy) > Math.abs(dx)) return;
    if (dx < 0) goNext();
    else goPrev();
  }

  // Close on overlay click (not on image)
  function handleOverlayClick(e: React.MouseEvent) {
    if (e.target === overlayRef.current) onClose();
  }

  if (!item) return null;

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="fixed inset-0 flex flex-col items-center justify-center"
      style={{
        zIndex: 100,
        backgroundColor: 'rgba(0,0,0,0.95)',
      }}
    >
      {/* Counter */}
      <div
        className="absolute top-4 left-1/2"
        style={{
          transform: 'translateX(-50%)',
          fontFamily: 'var(--font-body)',
          fontSize: '0.8rem',
          color: 'var(--text-on-dark-secondary, rgba(255,255,255,0.8))',
        }}
      >
        {currentIndex + 1} / {total}
      </div>

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 flex items-center justify-center"
        style={{
          width: '44px',
          height: '44px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--text-on-dark-primary, #fff)',
          fontSize: '1.5rem',
          zIndex: 101,
        }}
        aria-label="Close lightbox"
      >
        ✕
      </button>

      {/* Left arrow */}
      {total > 1 && (
        <button
          onClick={goPrev}
          className="absolute left-4 top-1/2 flex items-center justify-center"
          style={{
            transform: 'translateY(-50%)',
            width: '44px',
            height: '44px',
            background: 'rgba(255,255,255,0.1)',
            border: 'none',
            borderRadius: '50%',
            cursor: 'pointer',
            color: 'var(--text-on-dark-primary, #fff)',
            fontSize: '1.25rem',
            zIndex: 101,
          }}
          aria-label="Previous image"
        >
          ‹
        </button>
      )}

      {/* Right arrow */}
      {total > 1 && (
        <button
          onClick={goNext}
          className="absolute right-4 top-1/2 flex items-center justify-center"
          style={{
            transform: 'translateY(-50%)',
            width: '44px',
            height: '44px',
            background: 'rgba(255,255,255,0.1)',
            border: 'none',
            borderRadius: '50%',
            cursor: 'pointer',
            color: 'var(--text-on-dark-primary, #fff)',
            fontSize: '1.25rem',
            zIndex: 101,
          }}
          aria-label="Next image"
        >
          ›
        </button>
      )}

      {/* Image */}
      <div
        className="relative"
        style={{
          maxWidth: 'min(90vw, 1200px)',
          maxHeight: '85vh',
          width: '100%',
          height: '85vh',
        }}
      >
        {item.url ? (
          <Image
            key={item.url + currentIndex}
            src={item.url}
            alt={item.alt}
            fill
            className="object-contain animate-fadeIn"
            sizes="90vw"
            priority
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ backgroundColor: 'var(--backdrop-secondary)' }}
          >
            <span style={{ color: 'var(--text-on-dark-secondary, rgba(255,255,255,0.75))', fontFamily: 'var(--font-body)', fontSize: '0.875rem' }}>
              No image available
            </span>
          </div>
        )}
      </div>

      {/* Caption */}
      {item.caption && (
        <p
          className="text-center mt-4 px-6"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-small, 0.875rem)',
            color: 'var(--text-on-dark-secondary, rgba(255,255,255,0.85))',
            maxWidth: '600px',
          }}
        >
          {item.caption}
        </p>
      )}
    </div>
  );
}
