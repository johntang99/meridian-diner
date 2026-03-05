'use client';

import { useState } from 'react';

interface NewsletterSignupProps {
  headline?: string;
  description?: string;
  placeholder?: string;
  buttonText?: string;
  locale?: string;
}

export default function NewsletterSignup({
  headline,
  description,
  placeholder,
  buttonText,
  locale = 'en',
}: NewsletterSignupProps) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const defaultHeadline = locale === 'en' ? 'Enjoy our stories?' : locale === 'zh' ? '喜欢我们的故事吗？' : '¿Disfrutas nuestras historias?';
  const defaultDesc = locale === 'en'
    ? 'Subscribe for seasonal menus, events, and stories from the kitchen.'
    : locale === 'zh'
    ? '订阅获取时令菜单、活动和厨房故事。'
    : 'Suscríbete para menús de temporada, eventos e historias de la cocina.';
  const defaultPlaceholder = locale === 'en' ? 'Your email address' : locale === 'zh' ? '您的邮箱地址' : 'Tu correo electrónico';
  const defaultButton = locale === 'en' ? 'Subscribe' : locale === 'zh' ? '订阅' : 'Suscribirse';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!email || !email.includes('@')) {
      setError(locale === 'en' ? 'Please enter a valid email.' : locale === 'zh' ? '请输入有效的邮箱地址。' : 'Por favor, ingrese un correo válido.');
      return;
    }
    try {
      await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
    } catch {
      // Gracefully handle missing API
    }
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="text-center">
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-body, 1rem)',
            color: 'var(--primary)',
            fontWeight: 600,
          }}
        >
          {locale === 'en' ? 'Thank you for subscribing!' : locale === 'zh' ? '感谢您的订阅！' : '¡Gracias por suscribirte!'}
        </p>
      </div>
    );
  }

  return (
    <div className="text-center">
      <p
        className="mb-2"
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'var(--text-subheading, 1.25rem)',
          letterSpacing: 'var(--tracking-heading)',
          color: 'var(--text-color-primary)',
        }}
      >
        {headline || defaultHeadline}
      </p>
      <p
        className="mb-6"
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--text-small, 0.875rem)',
          color: 'var(--text-color-secondary)',
          lineHeight: 'var(--leading-body, 1.65)',
        }}
      >
        {description || defaultDesc}
      </p>
      <form onSubmit={handleSubmit} className="flex justify-center gap-2 flex-wrap">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={placeholder || defaultPlaceholder}
          style={{
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-base, 0.5rem)',
            border: '1px solid var(--border-default)',
            backgroundColor: 'var(--color-surface)',
            fontFamily: 'var(--font-body)',
            fontSize: '0.875rem',
            color: 'var(--text-color-primary)',
            width: '280px',
            maxWidth: '100%',
          }}
        />
        <button
          type="submit"
          className="transition-opacity hover:opacity-80"
          style={{
            padding: '0.75rem 1.5rem',
            borderRadius: 'var(--radius-base, 0.5rem)',
            border: 'none',
            backgroundColor: 'var(--primary)',
            color: 'var(--text-color-inverse)',
            fontFamily: 'var(--font-body)',
            fontSize: '0.875rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          {buttonText || defaultButton}
        </button>
      </form>
      {error && (
        <p className="mt-2" style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--color-error)' }}>
          {error}
        </p>
      )}
    </div>
  );
}
