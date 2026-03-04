import Link from 'next/link';

export default function NotFound() {
  return (
    <main
      className="flex flex-col items-center justify-center px-6 text-center"
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--backdrop-primary)',
      }}
    >
      <p
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '8rem',
          fontWeight: 'var(--weight-display, 400)' as any,
          color: 'var(--primary)',
          lineHeight: 1,
          marginBottom: '1rem',
        }}
      >
        404
      </p>
      <h1
        className="mb-2"
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'var(--text-heading, 2rem)',
          letterSpacing: 'var(--tracking-heading)',
          color: 'var(--text-color-primary)',
        }}
      >
        Table Not Found
      </h1>
      <p
        className="mb-8"
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--text-body, 1rem)',
          color: 'var(--text-color-secondary)',
          maxWidth: '400px',
        }}
      >
        The page you&apos;re looking for may have moved or doesn&apos;t exist.
      </p>

      <div className="flex flex-wrap justify-center gap-3">
        <Link
          href="/en/menu/dinner"
          className="transition-opacity hover:opacity-80"
          style={{
            padding: '0.75rem 1.5rem',
            borderRadius: 'var(--btn-radius)',
            border: '1px solid var(--border-default)',
            backgroundColor: 'transparent',
            color: 'var(--text-color-primary)',
            fontFamily: 'var(--font-body)',
            fontSize: '0.875rem',
            fontWeight: 600,
          }}
        >
          View Our Menu
        </Link>
        <Link
          href="/en/reservations"
          className="transition-opacity hover:opacity-80"
          style={{
            padding: '0.75rem 1.5rem',
            borderRadius: 'var(--btn-radius)',
            backgroundColor: 'var(--primary)',
            color: 'var(--text-color-inverse)',
            fontFamily: 'var(--font-body)',
            fontSize: '0.875rem',
            fontWeight: 600,
          }}
        >
          Make a Reservation
        </Link>
        <Link
          href="/"
          className="transition-opacity hover:opacity-80"
          style={{
            padding: '0.75rem 1.5rem',
            borderRadius: 'var(--btn-radius)',
            border: '1px solid var(--border-default)',
            backgroundColor: 'transparent',
            color: 'var(--text-color-primary)',
            fontFamily: 'var(--font-body)',
            fontSize: '0.875rem',
            fontWeight: 600,
          }}
        >
          Return Home
        </Link>
      </div>

      <p
        className="mt-12"
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '0.8rem',
          letterSpacing: 'var(--tracking-heading)',
          color: 'var(--text-color-muted)',
        }}
      >
        The Meridian
      </p>
    </main>
  );
}
