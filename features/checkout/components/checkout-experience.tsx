"use client";

import type { FormEvent, ReactNode } from "react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/Icon";
import { WorkspaceScene } from "@/components/scene/WorkspaceScene";
import { computeQuote, durationOptions } from "@/lib/pricing";
import { useWorkspace } from "@/lib/workspace-store";
import {
  formatDate,
  initialForm,
  validateDeliveryForm,
  type FormErrors,
  type FormValues,
} from "../checkout-validation";

export function CheckoutExperience() {
  const { state, setDuration, reset, hydrated } = useWorkspace();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [confirmed, setConfirmed] = useState(false);
  const confirmationHeadingRef = useRef<HTMLHeadingElement>(null);
  const quote = computeQuote(state, state.duration);

  useEffect(() => {
    if (confirmed) confirmationHeadingRef.current?.focus();
  }, [confirmed]);

  function updateField(field: keyof FormValues, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateDeliveryForm(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) setConfirmed(true);
  }

  if (!hydrated) {
    return <CheckoutHydrationFallback />;
  }

  if (confirmed) {
    return (
      <main className="checkout-page checkout-confirmed">
        <div className="confirmation-card">
          <div className="confirmation-icon"><Icon name="check" size={28} /></div>
          <p className="eyebrow">You&apos;re all set</p>
          <h1 ref={confirmationHeadingRef} tabIndex={-1}>Your space is<br /><em>on its way.</em></h1>
          <p className="confirmation-copy">
            We&apos;ll send a little more magic to <strong>{form.email}</strong> before your setup arrives in {form.city}.
          </p>
          <div className="order-detail-card">
            <div><span>Order number</span><strong>NO-0427</strong></div>
            <div><span>Estimated arrival</span><strong>{formatDate(form.startDate)}</strong></div>
            <div><span>Rental total</span><strong>${quote.total.toFixed(2)}</strong></div>
          </div>
          <div className="confirmation-actions">
            <Link href="/" className="rent-button" onClick={reset}>Design another <Icon name="arrow-right" size={18} /></Link>
            <Link href="/" className="text-button">Back to home</Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="checkout-page">
      <div className="checkout-shell shell">
        <div className="checkout-topline">
          <Link href="/" className="back-link"><Icon name="arrow-left" size={16} /> Back to builder</Link>
          <span><Icon name="box" size={15} /> Your setup, boxed with care</span>
        </div>

        <div className="checkout-layout">
          <section className="checkout-summary">
            <div className="checkout-heading">
              <p className="eyebrow">Almost yours</p>
              <h1>Let&apos;s get this<br /><em>room moving.</em></h1>
              <p>Pick a rental rhythm and tell us where to send your new favorite place to work.</p>
            </div>
            <div className="checkout-scene">
              <WorkspaceScene compact />
            </div>

            <div className="order-section">
              <div className="order-section-title"><h2>Your pieces</h2><Link href="/">Edit setup <Icon name="arrow-right" size={14} /></Link></div>
              <div className="line-items">
                {quote.lineItems.map((item) => (
                  <div className="line-item" key={item.id}>
                    <div className="line-item-marker">{item.detail === "Desk" ? "D" : item.detail === "Chair" ? "C" : "+"}</div>
                    <div><strong>{item.name}</strong><span>{item.detail}{item.quantity > 1 ? ` · qty ${item.quantity}` : ""}</span></div>
                    <span>${item.monthlyPrice}<small>/mo</small></span>
                  </div>
                ))}
              </div>
            </div>

            <div className="duration-section">
              <div className="order-section-title"><div><h2>How long are you staying?</h2><span>Longer stays, softer pricing.</span></div></div>
              <div className="duration-options" role="group" aria-label="Rental duration">
                {durationOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    className={`duration-option ${state.duration === option.id ? "is-selected" : ""}`}
                    onClick={() => setDuration(option.id)}
                    aria-pressed={state.duration === option.id}
                  >
                    <strong>{option.label}</strong>
                    <span>{option.hint}</span>
                    {state.duration === option.id && <i><Icon name="check" size={12} /></i>}
                  </button>
                ))}
              </div>
            </div>

            <div className="quote-card">
              <div><span>Setup rental</span><strong>${quote.subtotal.toFixed(2)}</strong></div>
              {quote.discount > 0 && <div className="quote-discount"><span>Long-stay saving</span><strong>−${quote.discount.toFixed(2)}</strong></div>}
              <div><span>Delivery &amp; collection</span><strong>{quote.deliveryFee === 0 ? "Included" : `$${quote.deliveryFee.toFixed(2)}`}</strong></div>
              <div className="quote-total"><span>Total for {quote.duration.label.toLowerCase()}</span><strong>${quote.total.toFixed(2)}</strong></div>
            </div>
          </section>

          <section className="delivery-card">
            <div className="delivery-heading">
              <span className="delivery-step">05</span>
              <div><p className="eyebrow">The final detail</p><h2>Where should we send it?</h2><p>We only use this to make your arrival lovely.</p></div>
            </div>
            <form onSubmit={handleSubmit} noValidate>
              <FormField id="name" label="Your name" error={errors.name}>
                <input id="name" value={form.name} onChange={(event) => updateField("name", event.target.value)} placeholder="e.g. Alex Morgan" autoComplete="name" aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "name-error" : undefined} />
              </FormField>
              <FormField id="email" label="Email address" error={errors.email}>
                <input id="email" type="email" value={form.email} onChange={(event) => updateField("email", event.target.value)} placeholder="you@example.com" autoComplete="email" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "email-error" : undefined} />
              </FormField>
              <div className="form-grid">
                <FormField id="city" label="City" error={errors.city}>
                  <input id="city" value={form.city} onChange={(event) => updateField("city", event.target.value)} placeholder="Lisbon" autoComplete="address-level2" aria-invalid={Boolean(errors.city)} aria-describedby={errors.city ? "city-error" : undefined} />
                </FormField>
                <FormField id="startDate" label="Start date" error={errors.startDate}>
                  <input id="startDate" type="date" value={form.startDate} onChange={(event) => updateField("startDate", event.target.value)} aria-invalid={Boolean(errors.startDate)} aria-describedby={errors.startDate ? "startDate-error" : undefined} />
                </FormField>
              </div>
              <FormField id="address" label="Delivery address" error={errors.address}>
                <textarea id="address" value={form.address} onChange={(event) => updateField("address", event.target.value)} placeholder="Street, number, apartment..." rows={3} autoComplete="street-address" aria-invalid={Boolean(errors.address)} aria-describedby={errors.address ? "address-error" : undefined} />
              </FormField>
              <div className="delivery-perks">
                <span><Icon name="truck" size={16} /> Doorstep delivery</span>
                <span><Icon name="reset" size={16} /> Easy returns</span>
                <span><Icon name="clock" size={16} /> Flexible dates</span>
              </div>
              <button type="submit" className="submit-rent-button">Confirm my setup <Icon name="arrow-right" size={18} /></button>
              <p className="form-footnote">This is a preview — no payment is collected.</p>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}

function CheckoutHydrationFallback() {
  return (
    <main className="checkout-page checkout-page--loading" aria-busy="true">
      <div className="checkout-shell shell">
        <div className="checkout-topline">
          <span className="back-link"><Icon name="arrow-left" size={16} /> Back to builder</span>
          <span><Icon name="box" size={15} /> Restoring your setup</span>
        </div>
        <div className="checkout-layout">
          <section className="checkout-summary">
            <div className="checkout-heading"><p className="eyebrow">Almost yours</p><h1>Restoring your<br /><em>room.</em></h1></div>
          </section>
          <section className="delivery-card builder-hydration-panel"><p className="eyebrow">Saved setup</p><h2>Getting things ready</h2></section>
        </div>
      </div>
    </main>
  );
}

function FormField({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className={`form-field ${error ? "has-error" : ""}`}>
      <span>{label}</span>
      {children}
      {error && <small id={`${id}-error`} role="alert">{error}</small>}
    </label>
  );
}
