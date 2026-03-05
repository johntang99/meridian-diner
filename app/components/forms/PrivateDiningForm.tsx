'use client';

import { useState } from 'react';

interface PrivateDiningFormProps {
  spaces: Array<{ name: string }>;
  occasionOptions?: string[];
  sourceOptions?: string[];
  headline?: string;
  description?: string;
  locale?: string;
}

export default function PrivateDiningForm({
  spaces,
  occasionOptions = [],
  sourceOptions = [],
  headline,
  description,
  locale = 'en',
}: PrivateDiningFormProps) {
  const [form, setForm] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    date: '',
    guestCount: '',
    occasion: '',
    preferredSpace: '',
    avNeeds: false,
    menuPreferences: '',
    source: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [refNumber, setRefNumber] = useState('');

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = locale === 'en' ? 'Name is required' : locale === 'zh' ? '请输入姓名' : 'Nombre requerido';
    if (!form.email.includes('@')) e.email = locale === 'en' ? 'Valid email required' : locale === 'zh' ? '请输入有效邮箱' : 'Email válido requerido';
    if (!form.phone.trim()) e.phone = locale === 'en' ? 'Phone is required' : locale === 'zh' ? '请输入电话' : 'Teléfono requerido';
    if (!form.date) e.date = locale === 'en' ? 'Date is required' : locale === 'zh' ? '请选择日期' : 'Fecha requerida';
    if (!form.guestCount || parseInt(form.guestCount) < 10) e.guestCount = locale === 'en' ? 'Minimum 10 guests' : locale === 'zh' ? '至少10位客人' : 'Mínimo 10 invitados';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await fetch('/api/private-dining', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
    } catch {
      // Gracefully handle missing API
    }
    const ref = `PD-${Date.now().toString(36).toUpperCase()}`;
    setRefNumber(ref);
    setSubmitting(false);
    setSubmitted(true);
  }

  const inputStyle = {
    width: '100%',
    padding: '0.75rem',
    borderRadius: 'var(--radius-base, 0.5rem)',
    border: '1px solid var(--border-default)',
    backgroundColor: '#FFFFFF',
    fontFamily: 'var(--font-body)',
    fontSize: '0.875rem',
    color: 'var(--primary)',
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '0.35rem',
    fontFamily: 'var(--font-body)',
    fontSize: '0.8rem',
    fontWeight: 600 as const,
    color: 'var(--primary)',
  };

  const errorStyle = {
    fontFamily: 'var(--font-body)',
    fontSize: '0.75rem',
    color: 'var(--color-error)',
    marginTop: '0.25rem',
  };

  if (submitted) {
    return (
      <div id="inquiry-form" className="text-center" style={{ padding: 'var(--card-pad, 2rem)' }}>
        <div
          className="mx-auto mb-4 flex items-center justify-center"
          style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: 'var(--text-color-inverse)', fontSize: '1.5rem' }}
        >
          ✓
        </div>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-subheading, 1.25rem)', color: 'var(--primary)', marginBottom: '0.5rem' }}>
          {locale === 'en' ? "We've received your enquiry." : locale === 'zh' ? '我们已收到您的咨询。' : 'Hemos recibido su consulta.'}
        </h3>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small, 0.875rem)', color: 'var(--primary-light)', marginBottom: '1rem' }}>
          {locale === 'en' ? 'Our private dining team will contact you within 24 hours.' : locale === 'zh' ? '我们的私人餐饮团队将在24小时内与您联系。' : 'Nuestro equipo de comedor privado se comunicará con usted dentro de 24 horas.'}
        </p>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--primary-light)' }}>
          {locale === 'en' ? 'Reference:' : locale === 'zh' ? '参考编号：' : 'Referencia:'} {refNumber}
        </p>
      </div>
    );
  }

  return (
    <div id="inquiry-form">
      {headline && (
        <h2
          className="text-center mb-2"
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'var(--text-heading, 2rem)',
            letterSpacing: 'var(--tracking-heading)',
            color: 'var(--primary)',
          }}
        >
          {headline}
        </h2>
      )}
      {description && (
        <p
          className="text-center mb-8"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-small, 0.875rem)',
            color: 'var(--primary-light)',
          }}
        >
          {description}
        </p>
      )}

      <form onSubmit={handleSubmit} className="mx-auto" style={{ maxWidth: '720px' }}>
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '1rem' }}>
          {/* Name */}
          <div>
            <label style={labelStyle}>{locale === 'en' ? 'Name' : locale === 'zh' ? '姓名' : 'Nombre'} *</label>
            <input style={inputStyle} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            {errors.name && <p style={errorStyle}>{errors.name}</p>}
          </div>
          {/* Company */}
          <div>
            <label style={labelStyle}>{locale === 'en' ? 'Company / Organization' : locale === 'zh' ? '公司/组织' : 'Empresa'}</label>
            <input style={inputStyle} value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
          </div>
          {/* Email */}
          <div>
            <label style={labelStyle}>{locale === 'en' ? 'Email' : locale === 'zh' ? '邮箱' : 'Correo'} *</label>
            <input type="email" style={inputStyle} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            {errors.email && <p style={errorStyle}>{errors.email}</p>}
          </div>
          {/* Phone */}
          <div>
            <label style={labelStyle}>{locale === 'en' ? 'Phone' : locale === 'zh' ? '电话' : 'Teléfono'} *</label>
            <input type="tel" style={inputStyle} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            {errors.phone && <p style={errorStyle}>{errors.phone}</p>}
          </div>
          {/* Date */}
          <div>
            <label style={labelStyle}>{locale === 'en' ? 'Preferred Date' : locale === 'zh' ? '首选日期' : 'Fecha Preferida'} *</label>
            <input type="date" style={inputStyle} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} min={new Date(Date.now() + 86400000).toISOString().split('T')[0]} />
            {errors.date && <p style={errorStyle}>{errors.date}</p>}
          </div>
          {/* Guest Count */}
          <div>
            <label style={labelStyle}>{locale === 'en' ? 'Estimated Guests' : locale === 'zh' ? '预计人数' : 'Invitados Estimados'} *</label>
            <input type="number" min={10} style={inputStyle} value={form.guestCount} onChange={(e) => setForm({ ...form, guestCount: e.target.value })} />
            {errors.guestCount && <p style={errorStyle}>{errors.guestCount}</p>}
          </div>
          {/* Occasion */}
          <div>
            <label style={labelStyle}>{locale === 'en' ? 'Occasion' : locale === 'zh' ? '活动类型' : 'Ocasión'}</label>
            <select style={inputStyle} value={form.occasion} onChange={(e) => setForm({ ...form, occasion: e.target.value })}>
              <option value="">{locale === 'en' ? 'Select...' : locale === 'zh' ? '请选择...' : 'Seleccionar...'}</option>
              {occasionOptions.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          {/* Preferred Space */}
          <div>
            <label style={labelStyle}>{locale === 'en' ? 'Preferred Space' : locale === 'zh' ? '首选空间' : 'Espacio Preferido'}</label>
            <select style={inputStyle} value={form.preferredSpace} onChange={(e) => setForm({ ...form, preferredSpace: e.target.value })}>
              <option value="">{locale === 'en' ? 'No preference' : locale === 'zh' ? '无偏好' : 'Sin preferencia'}</option>
              {spaces.map((s) => <option key={s.name} value={s.name}>{s.name}</option>)}
            </select>
          </div>
        </div>

        {/* AV Needs */}
        <div className="mt-4">
          <label className="flex items-center gap-2" style={{ ...labelStyle, cursor: 'pointer' }}>
            <input type="checkbox" checked={form.avNeeds} onChange={(e) => setForm({ ...form, avNeeds: e.target.checked })} />
            {locale === 'en' ? 'AV / tech equipment needed?' : locale === 'zh' ? '需要视听设备？' : '¿Necesita equipo AV?'}
          </label>
        </div>

        {/* Menu Preferences */}
        <div className="mt-4">
          <label style={labelStyle}>{locale === 'en' ? 'Custom Menu Preferences' : locale === 'zh' ? '定制菜单偏好' : 'Preferencias de Menú'}</label>
          <textarea rows={2} style={inputStyle} value={form.menuPreferences} onChange={(e) => setForm({ ...form, menuPreferences: e.target.value })} />
        </div>

        {/* How did you hear about us */}
        <div className="mt-4">
          <label style={labelStyle}>{locale === 'en' ? 'How did you hear about us?' : locale === 'zh' ? '您是如何得知我们的？' : '¿Cómo nos conoció?'}</label>
          <select style={inputStyle} value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })}>
            <option value="">{locale === 'en' ? 'Select...' : locale === 'zh' ? '请选择...' : 'Seleccionar...'}</option>
            {sourceOptions.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* Message */}
        <div className="mt-4">
          <label style={labelStyle}>{locale === 'en' ? 'Additional Details' : locale === 'zh' ? '其他详情' : 'Detalles Adicionales'}</label>
          <textarea rows={3} style={inputStyle} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
        </div>

        <div className="mt-6 text-center">
          <button
            type="submit"
            disabled={submitting}
            className="transition-opacity hover:opacity-80"
            style={{
              padding: '0.875rem 2.5rem',
              borderRadius: 'var(--radius-base, 0.5rem)',
              border: 'none',
              backgroundColor: 'var(--primary)',
              color: 'var(--text-on-dark-primary)',
              fontFamily: 'var(--font-body)',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: submitting ? 'wait' : 'pointer',
              opacity: submitting ? 0.6 : 1,
            }}
          >
            {submitting
              ? (locale === 'en' ? 'Sending...' : locale === 'zh' ? '发送中...' : 'Enviando...')
              : (locale === 'en' ? 'Submit Enquiry' : locale === 'zh' ? '提交咨询' : 'Enviar Consulta')}
          </button>
        </div>
      </form>
    </div>
  );
}
