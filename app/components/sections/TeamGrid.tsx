import Image from 'next/image';
import { resolveMediaUrl } from '@/lib/media-url';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  shortBio?: string;
  photo?: string;
  credentials?: string[];
  social?: Record<string, string>;
}

interface TeamGridProps {
  variant?: '3-col' | '4-col' | 'featured-first';
  members: TeamMember[];
}

export default function TeamGrid({ variant = '3-col', members }: TeamGridProps) {
  const cols =
    variant === '4-col'
      ? 'md:grid-cols-2 lg:grid-cols-4'
      : 'md:grid-cols-2 lg:grid-cols-3';

  return (
    <div className={`grid grid-cols-1 ${cols}`} style={{ gap: 'var(--grid-gap, 1.5rem)' }}>
      {members.map((member) => (
        <ChefProfileCard key={member.id} member={member} />
      ))}
    </div>
  );
}

function ChefProfileCard({ member }: { member: TeamMember }) {
  const resolvedPhoto = resolveMediaUrl(member.photo);

  return (
    <div
      className="group overflow-hidden"
      style={{
        borderRadius: 'var(--radius-base, 0.75rem)',
      }}
    >
      {/* Portrait photo */}
      <div className="relative aspect-[3/4] overflow-hidden">
        {resolvedPhoto ? (
          <Image
            src={resolvedPhoto}
            alt={member.name}
            fill
            className="object-cover transition-transform group-hover:scale-[1.02]"
            style={{ transitionDuration: 'var(--duration-base)' }}
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: 'var(--backdrop-secondary)' }}>
            <span style={{ fontSize: '3rem', color: 'var(--text-color-muted)', opacity: 0.3 }}>
              &#x1f464;
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ paddingTop: '1rem', paddingBottom: 'var(--card-pad, 1.5rem)' }}>
        <h3
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'var(--text-subheading, 1.125rem)',
            letterSpacing: 'var(--tracking-heading)',
            color: 'var(--heading-on-light, #111827)',
            marginBottom: '0.25rem',
          }}
        >
          {member.name}
        </h3>
        <p
          style={{
            fontFamily: 'var(--font-ui, var(--font-body))',
            fontSize: 'var(--text-small, 0.75rem)',
            letterSpacing: 'var(--tracking-label, 0.05em)',
            textTransform: 'uppercase',
            color: 'var(--primary)',
            fontWeight: 600,
            marginBottom: '0.5rem',
          }}
        >
          {member.role}
        </p>

        {member.shortBio && (
          <p
            className="line-clamp-2"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-small, 0.875rem)',
            color: 'var(--body-on-light, #4B5563)',
              lineHeight: 'var(--leading-body, 1.65)',
              marginBottom: '0.5rem',
            }}
          >
            {member.shortBio}
          </p>
        )}

        {member.credentials && member.credentials.length > 0 && (
          <p
            className="line-clamp-1"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.75rem',
              color: 'var(--muted-on-light, #6B7280)',
              fontStyle: 'italic',
            }}
          >
            {member.credentials.join(', ')}
          </p>
        )}
      </div>
    </div>
  );
}
