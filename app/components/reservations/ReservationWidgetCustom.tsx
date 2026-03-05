'use client';

import { useState, useMemo } from 'react';

interface ReservationConfig {
  advance_days_min?: number;
  advance_days_max?: number;
  party_large_min?: number;
  require_phone?: boolean;
  time_slots?: string[];
  occasions?: string[];
  blackout_dates?: string[];
}

interface ReservationWidgetCustomProps {
  config: ReservationConfig;
  locale?: string;
  phone?: string;
  largePartyNote?: string;
}

type Step = 'date' | 'time' | 'details' | 'confirmed';

function formatDateDisplay(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

function toDateString(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export default function ReservationWidgetCustom({
  config,
  locale = 'en',
  phone,
  largePartyNote,
}: ReservationWidgetCustomProps) {
  const [step, setStep] = useState<Step>('date');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [partySize, setPartySize] = useState(2);
  const [selectedTime, setSelectedTime] = useState('');
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    occasion: '',
    requests: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState('');

  const timeSlots = config.time_slots || [
    '5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM',
    '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM',
    '9:00 PM', '9:30 PM',
  ];
  const occasions = config.occasions || ['Birthday', 'Anniversary', 'Business Dinner', 'Date Night', 'Other'];
  const partyLargeMin = config.party_large_min || 8;
  const blackoutSet = new Set(config.blackout_dates || []);

  // Calendar state
  const [calMonth, setCalMonth] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const minDate = useMemo(() => {
    const d = new Date(today);
    d.setDate(d.getDate() + (config.advance_days_min || 0));
    return d;
  }, [today, config.advance_days_min]);

  const maxDate = useMemo(() => {
    const d = new Date(today);
    d.setDate(d.getDate() + (config.advance_days_max || 60));
    return d;
  }, [today, config.advance_days_max]);

  function isDateSelectable(date: Date): boolean {
    if (date < minDate || date > maxDate) return false;
    if (blackoutSet.has(toDateString(date))) return false;
    // Closed on Mondays
    if (date.getDay() === 1) return false;
    return true;
  }

  // Build calendar grid
  const calendarDays = useMemo(() => {
    const firstDay = new Date(calMonth.year, calMonth.month, 1);
    const startDow = firstDay.getDay();
    const daysInMonth = new Date(calMonth.year, calMonth.month + 1, 0).getDate();

    const days: Array<{ date: Date; inMonth: boolean } | null> = [];
    // Padding for days before month start
    for (let i = 0; i < startDow; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      days.push({ date: new Date(calMonth.year, calMonth.month, d), inMonth: true });
    }
    return days;
  }, [calMonth]);

  function prevMonth() {
    setCalMonth((c) => {
      const m = c.month - 1;
      return m < 0 ? { year: c.year - 1, month: 11 } : { year: c.year, month: m };
    });
  }

  function nextMonth() {
    setCalMonth((c) => {
      const m = c.month + 1;
      return m > 11 ? { year: c.year + 1, month: 0 } : { year: c.year, month: m };
    });
  }

  function handleFindTable() {
    if (!selectedDate) return;
    setStep('time');
  }

  function handleTimeSelect(time: string) {
    setSelectedTime(time);
    setStep('details');
  }

  function validateForm(): boolean {
    const e: Record<string, string> = {};
    if (!form.firstName.trim()) e.firstName = 'First name is required';
    if (!form.lastName.trim()) e.lastName = 'Last name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Please enter a valid email';
    if (config.require_phone && !form.phone.trim()) e.phone = 'Phone number is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit() {
    if (!validateForm()) return;
    setSubmitting(true);

    // Generate confirmation code
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = 'MER-';
    for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)];

    // Simulate API call (in production, POST to /api/reservations)
    await new Promise((r) => setTimeout(r, 1200));

    setConfirmationCode(code);
    setSubmitting(false);
    setStep('confirmed');
  }

  const monthLabel = new Date(calMonth.year, calMonth.month).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  // Confirmed screen
  if (step === 'confirmed') {
    return (
      <div className="text-center" style={{ padding: 'var(--card-pad, 2rem)' }}>
        <div
          className="mx-auto mb-4 flex items-center justify-center"
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'var(--primary)',
            color: 'var(--text-color-inverse)',
            fontSize: '2rem',
          }}
        >
          ✓
        </div>
        <h3
          className="mb-2"
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'var(--text-heading, 1.5rem)',
            color: 'var(--text-color-primary)',
          }}
        >
          Reservation Confirmed
        </h3>
        <p
          className="mb-6"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '1.25rem',
            fontWeight: 700,
            color: 'var(--primary)',
            letterSpacing: '0.05em',
          }}
        >
          {confirmationCode}
        </p>
        <div
          className="mx-auto mb-6"
          style={{
            maxWidth: '320px',
            padding: '1rem',
            borderRadius: 'var(--radius-base, 0.75rem)',
            backgroundColor: 'var(--backdrop-secondary)',
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-small, 0.875rem)',
            color: 'var(--text-color-secondary)',
          }}
        >
          <p className="mb-1" style={{ fontWeight: 600, color: 'var(--text-color-primary)' }}>
            Table for {partySize}
          </p>
          <p>{selectedDate && formatDateDisplay(selectedDate)}</p>
          <p>{selectedTime}</p>
        </div>
        <p
          className="mb-6"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-small, 0.875rem)',
            color: 'var(--text-color-muted)',
          }}
        >
          A confirmation email has been sent to {form.email}
        </p>
        <button
          onClick={() => {
            setStep('date');
            setSelectedDate(null);
            setSelectedTime('');
            setPartySize(2);
            setForm({ firstName: '', lastName: '', email: '', phone: '', occasion: '', requests: '' });
          }}
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.875rem',
            fontWeight: 600,
            color: 'var(--primary)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Make Another Reservation
        </button>
      </div>
    );
  }

  return (
    <div
      className="mx-auto"
      style={{
        maxWidth: '640px',
        padding: 'var(--card-pad, 2rem)',
        borderRadius: 'var(--radius-base, 0.75rem)',
        border: '1px solid var(--border-default)',
        backgroundColor: 'var(--color-surface)',
      }}
    >
      {/* Step indicator */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {['date', 'time', 'details'].map((s, i) => {
          const stepNames = ['Date & Party', 'Time', 'Details'];
          const isActive = s === step;
          const isDone =
            (s === 'date' && (step === 'time' || step === 'details')) ||
            (s === 'time' && step === 'details');
          return (
            <div key={s} className="flex items-center gap-2">
              {i > 0 && (
                <div
                  style={{
                    width: '2rem',
                    height: '1px',
                    backgroundColor: isDone || isActive ? 'var(--primary)' : 'var(--border-default)',
                  }}
                />
              )}
              <div className="flex items-center gap-1.5">
                <div
                  className="flex items-center justify-center"
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    backgroundColor: isDone || isActive ? 'var(--primary)' : 'var(--backdrop-secondary)',
                    color: isDone || isActive ? 'var(--text-color-inverse)' : 'var(--text-color-muted)',
                  }}
                >
                  {isDone ? '✓' : i + 1}
                </div>
                <span
                  className="hidden sm:inline"
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.75rem',
                    color: isActive ? 'var(--text-color-primary)' : 'var(--text-color-muted)',
                    fontWeight: isActive ? 600 : 400,
                  }}
                >
                  {stepNames[i]}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Step 1: Date & Party Size */}
      {step === 'date' && (
        <div>
          {/* Calendar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={prevMonth}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '1.25rem',
                  color: 'var(--text-color-primary)',
                  padding: '0.25rem 0.5rem',
                }}
              >
                ‹
              </button>
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'var(--text-body, 1rem)',
                  color: 'var(--text-color-primary)',
                  fontWeight: 600,
                }}
              >
                {monthLabel}
              </span>
              <button
                onClick={nextMonth}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '1.25rem',
                  color: 'var(--text-color-primary)',
                  padding: '0.25rem 0.5rem',
                }}
              >
                ›
              </button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 mb-1">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
                <div
                  key={d}
                  className="text-center py-1"
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.7rem',
                    color: 'var(--text-color-muted)',
                    fontWeight: 600,
                  }}
                >
                  {d}
                </div>
              ))}
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7">
              {calendarDays.map((day, i) => {
                if (!day) {
                  return <div key={`empty-${i}`} />;
                }
                const selectable = isDateSelectable(day.date);
                const isSelected =
                  selectedDate && toDateString(day.date) === toDateString(selectedDate);
                const isToday = toDateString(day.date) === toDateString(today);

                return (
                  <button
                    key={toDateString(day.date)}
                    disabled={!selectable}
                    onClick={() => setSelectedDate(day.date)}
                    className="aspect-square flex items-center justify-center transition-colors"
                    style={{
                      borderRadius: 'var(--radius-base, 0.5rem)',
                      fontSize: '0.85rem',
                      fontFamily: 'var(--font-body)',
                      fontWeight: isSelected ? 600 : 400,
                      backgroundColor: isSelected
                        ? 'var(--primary)'
                        : 'transparent',
                      color: isSelected
                        ? 'var(--text-color-inverse)'
                        : selectable
                        ? 'var(--text-color-primary)'
                        : 'var(--text-color-muted)',
                      opacity: selectable ? 1 : 0.35,
                      cursor: selectable ? 'pointer' : 'default',
                      border: isToday && !isSelected ? '1px solid var(--primary)' : '1px solid transparent',
                    }}
                  >
                    {day.date.getDate()}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Party size */}
          <div className="mb-6">
            <label
              className="block mb-2"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-small, 0.875rem)',
                color: 'var(--text-color-primary)',
                fontWeight: 600,
              }}
            >
              Party Size
            </label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setPartySize(Math.max(1, partySize - 1))}
                className="flex items-center justify-center"
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: 'var(--radius-base, 0.5rem)',
                  border: '1px solid var(--border-default)',
                  backgroundColor: 'var(--color-surface)',
                  color: 'var(--text-color-primary)',
                  fontSize: '1.25rem',
                  cursor: 'pointer',
                }}
              >
                −
              </button>
              <span
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  color: 'var(--text-color-primary)',
                  minWidth: '2rem',
                  textAlign: 'center',
                }}
              >
                {partySize}
              </span>
              <button
                onClick={() => setPartySize(Math.min(10, partySize + 1))}
                className="flex items-center justify-center"
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: 'var(--radius-base, 0.5rem)',
                  border: '1px solid var(--border-default)',
                  backgroundColor: 'var(--color-surface)',
                  color: 'var(--text-color-primary)',
                  fontSize: '1.25rem',
                  cursor: 'pointer',
                }}
              >
                +
              </button>
              <span
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--text-small, 0.875rem)',
                  color: 'var(--text-color-muted)',
                }}
              >
                {partySize === 1 ? 'guest' : 'guests'}
              </span>
            </div>
            {partySize >= partyLargeMin && (
              <p
                className="mt-2"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.8rem',
                  color: 'var(--primary)',
                  fontStyle: 'italic',
                }}
              >
                {largePartyNote || `For parties of ${partyLargeMin}+, please call us at ${phone || '(212) 555-0142'}`}
              </p>
            )}
          </div>

          {/* Find a Table button */}
          <button
            onClick={handleFindTable}
            disabled={!selectedDate}
            className="w-full transition-opacity"
            style={{
              padding: '0.875rem',
              borderRadius: 'var(--radius-base, 0.5rem)',
              backgroundColor: selectedDate ? 'var(--text-color-accent)' : '#374151',
              color: selectedDate ? 'var(--text-color-inverse)' : 'var(--text-on-dark-secondary, #D1D5DB)',
              fontFamily: 'var(--font-body)',
              fontSize: '0.875rem',
              fontWeight: 600,
              letterSpacing: 'var(--tracking-label)',
              border: selectedDate
                ? '1px solid var(--text-color-accent)'
                : '1px solid rgba(209, 213, 219, 0.35)',
              cursor: selectedDate ? 'pointer' : 'default',
            }}
          >
            Find a Table
          </button>
        </div>
      )}

      {/* Step 2: Time Slots */}
      {step === 'time' && (
        <div>
          <button
            onClick={() => setStep('date')}
            className="mb-4"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
              fontSize: '0.8rem',
              color: 'var(--text-color-muted)',
            }}
          >
            ← Change date
          </button>

          <p
            className="mb-4"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-small, 0.875rem)',
              color: 'var(--text-color-secondary)',
            }}
          >
            {selectedDate && formatDateDisplay(selectedDate)} · {partySize} {partySize === 1 ? 'guest' : 'guests'}
          </p>

          <h3
            className="mb-4"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'var(--text-subheading, 1.125rem)',
              color: 'var(--text-color-primary)',
            }}
          >
            Select a Time
          </h3>

          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {timeSlots.map((time) => (
              <button
                key={time}
                onClick={() => handleTimeSelect(time)}
                className="transition-colors"
                style={{
                  padding: '0.75rem 0.5rem',
                  borderRadius: 'var(--radius-base, 0.5rem)',
                  border: '1px solid var(--border-default)',
                  backgroundColor: 'var(--color-surface)',
                  color: 'var(--text-color-primary)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--primary)';
                  e.currentTarget.style.color = 'var(--text-color-inverse)';
                  e.currentTarget.style.borderColor = 'var(--primary)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-surface)';
                  e.currentTarget.style.color = 'var(--text-color-primary)';
                  e.currentTarget.style.borderColor = 'var(--border-default)';
                }}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Guest Details */}
      {step === 'details' && (
        <div>
          <button
            onClick={() => setStep('time')}
            className="mb-4"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
              fontSize: '0.8rem',
              color: 'var(--text-color-muted)',
            }}
          >
            ← Change time
          </button>

          {/* Summary */}
          <div
            className="mb-6 px-4 py-3"
            style={{
              borderRadius: 'var(--radius-base, 0.75rem)',
              backgroundColor: 'var(--backdrop-secondary)',
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-small, 0.875rem)',
              color: 'var(--text-color-primary)',
              fontWeight: 600,
            }}
          >
            Table for {partySize} · {selectedDate && formatDateDisplay(selectedDate)} · {selectedTime}
          </div>

          {/* Form fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <FormField
              label="First Name"
              value={form.firstName}
              error={errors.firstName}
              onChange={(v) => setForm({ ...form, firstName: v })}
              required
            />
            <FormField
              label="Last Name"
              value={form.lastName}
              error={errors.lastName}
              onChange={(v) => setForm({ ...form, lastName: v })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <FormField
              label="Email"
              type="email"
              value={form.email}
              error={errors.email}
              onChange={(v) => setForm({ ...form, email: v })}
              required
            />
            <FormField
              label="Phone"
              type="tel"
              value={form.phone}
              error={errors.phone}
              onChange={(v) => setForm({ ...form, phone: v })}
              required={config.require_phone}
            />
          </div>

          <div className="mb-4">
            <label
              className="block mb-1"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.8rem',
                color: 'var(--text-color-secondary)',
                fontWeight: 500,
              }}
            >
              Occasion
            </label>
            <select
              value={form.occasion}
              onChange={(e) => setForm({ ...form, occasion: e.target.value })}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: 'var(--radius-base, 0.5rem)',
                border: '1px solid var(--border-default)',
                backgroundColor: 'var(--color-surface)',
                color: 'var(--text-color-primary)',
                fontFamily: 'var(--font-body)',
                fontSize: '0.875rem',
              }}
            >
              <option value="">Select an occasion (optional)</option>
              {occasions.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label
              className="block mb-1"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.8rem',
                color: 'var(--text-color-secondary)',
                fontWeight: 500,
              }}
            >
              Special Requests
            </label>
            <textarea
              value={form.requests}
              onChange={(e) => setForm({ ...form, requests: e.target.value })}
              rows={3}
              placeholder="Allergies, seating preferences, celebrations..."
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: 'var(--radius-base, 0.5rem)',
                border: '1px solid var(--border-default)',
                backgroundColor: 'var(--color-surface)',
                color: 'var(--text-color-primary)',
                fontFamily: 'var(--font-body)',
                fontSize: '0.875rem',
                resize: 'vertical',
              }}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full transition-opacity"
            style={{
              padding: '0.875rem',
              borderRadius: 'var(--radius-base, 0.5rem)',
              backgroundColor: 'var(--text-color-accent)',
              color: 'var(--text-color-inverse)',
              fontFamily: 'var(--font-body)',
              fontSize: '0.875rem',
              fontWeight: 600,
              letterSpacing: 'var(--tracking-label)',
              border: '1px solid var(--text-color-accent)',
              cursor: submitting ? 'wait' : 'pointer',
              opacity: submitting ? 0.7 : 1,
            }}
          >
            {submitting ? 'Confirming...' : 'Confirm Reservation'}
          </button>
        </div>
      )}
    </div>
  );
}

function FormField({
  label,
  type = 'text',
  value,
  error,
  onChange,
  required,
}: {
  label: string;
  type?: string;
  value: string;
  error?: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <div>
      <label
        className="block mb-1"
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.8rem',
          color: 'var(--text-color-secondary)',
          fontWeight: 500,
        }}
      >
        {label}{required && ' *'}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%',
          padding: '0.75rem',
          borderRadius: 'var(--radius-base, 0.5rem)',
          border: `1px solid ${error ? 'var(--primary)' : 'var(--border-default)'}`,
          backgroundColor: 'var(--color-surface)',
          color: 'var(--text-color-primary)',
          fontFamily: 'var(--font-body)',
          fontSize: '0.875rem',
        }}
      />
      {error && (
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.75rem',
            color: 'var(--primary)',
            marginTop: '0.25rem',
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
}
