'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { resolveMediaUrl } from '@/lib/media';

interface CertItem {
  src: string;
  alt: string;
  title?: string;
  summary?: string;
}

interface Props {
  items: CertItem[];
}

// NOT: Bu component bilinçli olarak inline style kullanır. Proje Tailwind'i
// minimal kapsamda derler; grid/aspect/fixed gibi utility'ler her zaman
// üretilmediği için galeri stilleri inline verilerek garantilenir.
export function CertificateGallery({ items }: Props) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const open = (i: number) => setActiveIndex(i);
  const close = () => setActiveIndex(null);

  const prev = useCallback(() => {
    setActiveIndex((i) => (i === null ? null : (i - 1 + items.length) % items.length));
  }, [items.length]);

  const next = useCallback(() => {
    setActiveIndex((i) => (i === null ? null : (i + 1) % items.length));
  }, [items.length]);

  useEffect(() => {
    if (activeIndex === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [activeIndex, prev, next]);

  useEffect(() => {
    document.body.style.overflow = activeIndex !== null ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [activeIndex]);

  const active = activeIndex !== null ? items[activeIndex] : null;

  return (
    <>
      {/* Thumbnail grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
          gap: '16px',
        }}
      >
        {items.map((item, i) => (
          <button
            key={i}
            type="button"
            onClick={() => open(i)}
            aria-label={`${item.alt} — büyüt`}
            style={{
              position: 'relative',
              aspectRatio: '3 / 4',
              width: '100%',
              background: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              overflow: 'hidden',
              cursor: 'zoom-in',
              padding: 0,
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            }}
          >
            <Image
              src={resolveMediaUrl(item.src)}
              alt={item.alt}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 200px"
              style={{ objectFit: 'contain', padding: '8px' }}
            />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {active && (
        <div
          onClick={close}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0,0,0,0.85)',
            padding: '16px',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              maxWidth: '820px',
              width: '100%',
              background: '#fff',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
            }}
          >
            <button
              type="button"
              onClick={close}
              aria-label="Kapat"
              style={{
                position: 'absolute', top: '12px', right: '12px', zIndex: 10,
                width: '38px', height: '38px', display: 'flex', alignItems: 'center',
                justifyContent: 'center', borderRadius: '50%', border: 'none',
                background: 'rgba(0,0,0,0.45)', color: '#fff', cursor: 'pointer',
              }}
            >
              <X size={18} />
            </button>

            <div
              style={{
                position: 'relative', background: '#f8fafc', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                minHeight: '300px', maxHeight: '78vh',
              }}
            >
              <Image
                src={resolveMediaUrl(active.src)}
                alt={active.alt}
                width={800}
                height={1000}
                sizes="(max-width: 768px) 100vw, 800px"
                style={{
                  width: 'auto', height: 'auto', maxWidth: '100%',
                  maxHeight: '78vh', objectFit: 'contain', padding: '16px',
                }}
              />
            </div>

            {(active.title || active.summary) && (
              <div style={{ padding: '14px 24px', borderTop: '1px solid #f1f5f9' }}>
                {active.title && (
                  <p style={{ fontWeight: 600, color: '#1e293b', fontSize: '14px', margin: 0 }}>{active.title}</p>
                )}
                {active.summary && (
                  <p style={{ color: '#64748b', fontSize: '12px', margin: '2px 0 0' }}>{active.summary}</p>
                )}
              </div>
            )}

            {items.length > 1 && (
              <>
                <button
                  type="button" onClick={prev} aria-label="Önceki"
                  style={{
                    position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
                    width: '40px', height: '40px', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', borderRadius: '50%', border: 'none',
                    background: 'rgba(0,0,0,0.45)', color: '#fff', cursor: 'pointer',
                  }}
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  type="button" onClick={next} aria-label="Sonraki"
                  style={{
                    position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                    width: '40px', height: '40px', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', borderRadius: '50%', border: 'none',
                    background: 'rgba(0,0,0,0.45)', color: '#fff', cursor: 'pointer',
                  }}
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
