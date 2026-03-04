'use client';

import Link from 'next/link';

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
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
          fontSize: '4rem',
          fontWeight: 'var(--weight-display, 400)' as any,
          color: 'var(--primary)',
          lineHeight: 1,
          marginBottom: '1rem',
        }}
      >
        Oops
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
        Something went wrong on our end.
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
        We apologize for the inconvenience. Please try again or return to the homepage.
      </p>

      <div className="flex flex-wrap justify-center gap-3">
        <button
          onClick={reset}
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
            cursor: 'pointer',
          }}
        >
          Try Again
        </button>
        <Link
          href="/"
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
          Return to Homepage
        </Link>
      </div>
    </main>
  );
}
