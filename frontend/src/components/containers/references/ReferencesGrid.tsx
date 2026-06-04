'use client';

import { useState } from 'react';
import { Link } from '@/i18n/routing';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { resolveMediaUrl } from '@/lib/media';
import type { Reference } from '@ensotek/core/types';

type Cat = { id: string; name: string };

// Tailwind minimal derlendiği için filtre/grid stilleri inline verilir.
export function ReferencesGrid({
  references,
  categories,
}: {
  references: Reference[];
  categories: Cat[];
}) {
  const t = useTranslations('references');
  const [active, setActive] = useState<string>('all');

  const usedCats = categories.filter((c) =>
    references.some((r) => r.sub_category_id === c.id),
  );
  const featuredCount = references.filter((r) => r.is_featured).length;

  const filtered =
    active === 'all'
      ? references
      : active === 'featured'
        ? references.filter((r) => r.is_featured)
        : references.filter((r) => r.sub_category_id === active);

  const Tab = ({ id, label, count }: { id: string; label: string; count: number }) => {
    const on = active === id;
    return (
      <button
        type="button"
        onClick={() => setActive(id)}
        style={{
          padding: '8px 18px',
          borderRadius: '999px',
          border: `1px solid ${on ? '#0056b3' : '#e2e8f0'}`,
          background: on ? '#0056b3' : '#fff',
          color: on ? '#fff' : '#334155',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 500,
          transition: 'all .2s',
        }}
      >
        {label} <span style={{ opacity: 0.65 }}>({count})</span>
      </button>
    );
  };

  return (
    <>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px',
          justifyContent: 'center',
          marginBottom: '50px',
        }}
      >
        <Tab id="all" label={t('allReferences')} count={references.length} />
        {featuredCount > 0 && (
          <Tab id="featured" label={t('featured')} count={featuredCount} />
        )}
        {usedCats.map((c) => (
          <Tab
            key={c.id}
            id={c.id}
            label={c.name}
            count={references.filter((r) => r.sub_category_id === c.id).length}
          />
        ))}
      </div>

      <div className="row">
        {filtered.map((ref) => (
          <div key={ref.id} className="col-lg-3 col-md-4 col-sm-6 mb-30">
            <ReferenceCard reference={ref} />
          </div>
        ))}
      </div>
    </>
  );
}

function ReferenceCard({ reference }: { reference: Reference }) {
  return (
    <Link
      href={`/references/${reference.slug}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: '#fff',
        border: '1px solid #eef2f7',
        borderRadius: '14px',
        overflow: 'hidden',
        boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
        textDecoration: 'none',
      }}
    >
      <div
        style={{
          position: 'relative',
          aspectRatio: '1 / 1',
          background: '#fff',
          borderBottom: '1px solid #f1f5f9',
        }}
      >
        {reference.featured_image ? (
          <Image
            src={resolveMediaUrl(reference.featured_image)}
            alt={reference.title}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 250px"
            style={{ objectFit: 'contain', padding: '16px' }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#cbd5e1',
              fontSize: '32px',
              fontWeight: 700,
            }}
          >
            {reference.title?.charAt(0) || 'E'}
          </div>
        )}
      </div>
      <div style={{ padding: '12px 14px', textAlign: 'center' }}>
        <span style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>
          {reference.title}
        </span>
      </div>
    </Link>
  );
}
