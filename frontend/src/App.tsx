import { useState } from 'react'
import AdminDashboard from './AdminDashboard'
import MenuDisplay from './MenuDisplay'
import './App.css'
import heroImage from './assets/hero.png'

type Page = 'form' | 'menu' | 'dashboard'
const initialForm = {
  customerName: '', email: '', phone: '', eventDate: '', pickupDate: '',
  fulfillment: '', occasion: '', occasionOther: '', productType: '', productOther: '',
  paymentMethod: '', paymentOther: '', additionalInfo: '', colorCustomization: false, agreeToTerms: false,
}

const packages = [
  ['16', '16 Narkel Narus', '$20'], ['32', '32 Narkel Narus', '$45'],
  ['15-mango', '15 Mango Burfi', '$30'], ['30-mango', '30 Mango Burfi', '$50'],
  ['15-ube', '15 Ube Coconut Burfi', '$30'], ['30-ube', '30 Ube Coconut Burfi', '$45'],
  ['15-roohafza', '15 Rooh Afza Coconut Burfi', '$35'], ['30-roohafza', '30 Rooh Afza Coconut Burfi', '$50'],
  ['custom', 'Custom amount', 'Personalized quote'],
]

function App() {
  const [page, setPage] = useState<Page>('form')
  const [form, setForm] = useState(initialForm)
  const [quantity, setQuantity] = useState('')
  const [customAmount, setCustomAmount] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState(false)

  const update = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setForm(current => ({ ...current, [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value }))
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true); setMessage(''); setSuccess(false)
    const order = {
      ...form,
      productType: form.productType === 'other' ? `other: ${form.productOther}` : form.productType,
      occasion: form.occasion === 'Other' ? `Other: ${form.occasionOther}` : form.occasion,
      fulfillment: form.fulfillment,
      paymentMethod: form.paymentMethod === 'other' ? `other: ${form.paymentOther}` : form.paymentMethod,
      quantity, customAmount: quantity === 'custom' ? Number(customAmount) : null,
    }
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://mishti-api.onrender.com'}/api/orders`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(order),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.detail || 'Please try again in a moment.')
      setSuccess(true)
      setMessage(`Your request is in!${data.orderId ? ` Request #${data.orderId}.` : ''} We’ll reach out within 24–48 hours to discuss availability and your quote.`)
      setForm(initialForm); setQuantity(''); setCustomAmount('')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'We couldn’t submit your request. Please try again or contact us directly.')
    } finally { setSubmitting(false) }
  }

  return <div className="site-shell">
    <header className="site-header">
      <div className="brand-mark" aria-hidden="true">M<span>&</span>M</div>
      <a className="brand-name" href="#top" onClick={() => setPage('form')}>Mishti <i>&</i> Mimi</a>
      <p className="brand-tagline">Little sweets, made with love</p>
      <nav aria-label="Main navigation" className="main-nav">
        {(['form', 'menu', 'dashboard'] as Page[]).map(item => <button key={item} className={page === item ? 'active' : ''} onClick={() => setPage(item)}>{item === 'form' ? 'Order request' : item === 'menu' ? 'Our menu' : 'Dashboard'}</button>)}
      </nav>
    </header>

    {page === 'menu' ? <main className="content"><MenuDisplay /></main> : page === 'dashboard' ? <main className="content"><AdminDashboard /></main> : <>
      <section className="hero" id="top">
        <img src={heroImage} alt="A selection of colorful handmade Mishti & Mimi sweets" />
        <div className="hero-copy"><span className="eyebrow">Made by women who love sweets</span><h1>A little sweetness<br/><em>for your celebration.</em></h1><p>Handmade Bengali mishti for life’s sweetest moments, made in Long Island and Queens.</p><a href="#order" className="hero-cta">Plan your order <span>↓</span></a></div>
      </section>
      <main className="content" id="order">
        <div className="intro"><span className="eyebrow">Let’s make something sweet</span><h2>Order request</h2><p>Tell us a little about your celebration. We’ll be in touch within 24–48 hours to confirm availability, answer questions, and share a personalized quote.</p></div>
        <div className="notice"><span className="notice-icon">✿</span><p><strong>A request is the first step, not a confirmed order.</strong> Your order is official once we’ve finalized the details together and payment is complete. All orders depend on our mishti-making schedule.</p></div>
        <form onSubmit={submit} className="order-form">
          <section className="form-section"><SectionTitle number="01" title="Your details"/><div className="field-grid">
            <Field label="Name (first & last)" required><input name="customerName" value={form.customerName} onChange={update} autoComplete="name" required placeholder="Your name"/></Field>
            <Field label="Email address" required><input type="email" name="email" value={form.email} onChange={update} autoComplete="email" required placeholder="you@example.com"/></Field>
            <Field label="Contact number" required><input type="tel" name="phone" value={form.phone} onChange={update} autoComplete="tel" required placeholder="(516) 555-0123"/></Field>
          </div></section>

          <section className="form-section"><SectionTitle number="02" title="Your celebration"/><div className="field-grid">
            <Field label="Date of event" required><input type="date" name="eventDate" value={form.eventDate} min={new Date().toISOString().slice(0,10)} onChange={update} required/></Field>
            <Field label="Date of pickup or delivery" required><input type="date" name="pickupDate" value={form.pickupDate} min={form.eventDate || new Date().toISOString().slice(0,10)} onChange={update} required/></Field>
            <Field label="How would you like to receive your order?" required hint="Currently serving Queens and Long Island."><select name="fulfillment" value={form.fulfillment} onChange={update} required><option value="">Choose one</option><option>Pickup</option><option>Delivery</option></select></Field>
            <Field label="Occasion" required><select name="occasion" value={form.occasion} onChange={update} required><option value="">Choose an occasion</option>{['Birthday','Wedding','Bridal Shower','Mehndi/Holud/Haldi','Baby Shower','Anniversary','Graduation','Other'].map(x => <option key={x}>{x}</option>)}</select></Field>
            {form.occasion === 'Other' && <Field label="Tell us about the occasion" required><input name="occasionOther" value={form.occasionOther} onChange={update} required placeholder="Your occasion"/></Field>}
          </div></section>

          <section className="form-section"><SectionTitle number="03" title="The mishti"/><div className="field-grid">
            <Field label="What type of mishti would you like?" required hint="For other types, tell us what you have in mind. We’ll follow up about logistics."><select name="productType" value={form.productType} onChange={update} required><option value="">Choose a mishti</option><option value="narkel">Narkel (Coconut) Narus</option><option value="mango">Mango Burfi</option><option value="ube">Ube Coconut Burfi</option><option value="roohafza">Rooh Afza Coconut Burfi</option><option value="other">Other</option></select></Field>
            {form.productType === 'other' && <Field label="What kind of mishti?" required><input name="productOther" value={form.productOther} onChange={update} required placeholder="Describe the mishti"/></Field>}
          </div>
          <fieldset className="package-field"><legend>How many would you like? <b>*</b></legend><div className="package-grid">{packages.map(([id, label, price]) => <label className={`package-option ${quantity === id ? 'chosen' : ''}`} key={id}><input type="radio" name="quantity" value={id} checked={quantity === id} onChange={e => setQuantity(e.target.value)} required/><span className="radio-dot"/><span className="package-name">{label}</span><span className="package-price">{price}</span></label>)}</div></fieldset>
          {quantity === 'custom' && <Field label="Desired amount" required><input type="number" min="1" step="1" value={customAmount} onChange={e => setCustomAmount(e.target.value)} required placeholder="Number of pieces"/></Field>}
          <label className="check-card"><input type="checkbox" name="colorCustomization" checked={form.colorCustomization} onChange={update}/><span><strong>Interested in custom colors?</strong><small>Narkel Narus can be made in different colors for a small additional fee. Select this and we’ll share the options.</small></span></label>
          </section>

          <section className="form-section"><SectionTitle number="04" title="A few more details"/><div className="field-grid">
            <Field label="Preferred payment method" required><select name="paymentMethod" value={form.paymentMethod} onChange={update} required><option value="">Choose one</option><option value="zelle">Zelle</option><option value="venmo">Venmo</option><option value="other">Other</option></select></Field>
            {form.paymentMethod === 'other' && <Field label="Preferred payment method" required><input name="paymentOther" value={form.paymentOther} onChange={update} required placeholder="Tell us which method"/></Field>}
            <Field label="Additional information" hint="Share any special requests, flavors, or design ideas."><textarea name="additionalInfo" value={form.additionalInfo} onChange={update} rows={4} placeholder="We’d love to hear your ideas…"/></Field>
          </div></section>

          <section className="terms-card"><span className="eyebrow">Please read before submitting</span><h3>Terms &amp; conditions</h3><div className="terms-copy"><p>Submitting this form is the first step toward bringing your sweet idea to life—but it’s not a confirmed order just yet! Once you hit submit, I’ll take a look at all your tasty details and reach out within 24–48 hours to chat about availability, answer any questions, and send over a personalized quote.</p><p>Your order becomes official only after we’ve finalized everything together and the payment has been made. All orders depend on our mishti-making schedule, so certain dates or custom designs may require a little extra lead time. We’ll contact you using the email or phone number you provide, but you’re always welcome to reach out directly through our <a href="https://www.instagram.com/mishtimini/" target="_blank" rel="noreferrer">Instagram</a> or <a href="mailto:mishtimini@gmail.com">email</a> if you need us sooner.</p><p>Prices may vary depending on your flavors, quantities, and custom touches, and we’ll sort out pickup or delivery details during confirmation. If you need to make changes, please let me know at least 7 days before your event, and just a heads-up—cancellations after payment may come with a fee.</p></div><label className="terms-agree"><input type="checkbox" name="agreeToTerms" checked={form.agreeToTerms} onChange={update} required/><span>I agree to the terms &amp; conditions <b>*</b></span></label></section>

          <div className="submit-row"><button className="submit-button" type="submit" disabled={submitting}>{submitting ? 'Sending your request…' : 'Send order request'}<span>↗</span></button><p>This is an inquiry only. No payment is collected here.</p>{message && <div role="status" className={`form-message ${success ? 'success' : 'error'}`}>{message}</div>}</div>
        </form>
      </main>
    </>}
    <footer className="site-footer"><a className="footer-brand" href="#top" onClick={() => setPage('form')}>Mishti &amp; Mimi</a><p>Handmade with love in Long Island &amp; Queens, NY</p><div><a href="https://www.instagram.com/mishtimini/" target="_blank" rel="noreferrer">Instagram ↗</a><a href="mailto:mishtimini@gmail.com">Email us ↗</a><a href="tel:+15166033637">(516) 603-3637</a></div><small>© 2026 Mishti &amp; Mimi</small></footer>
  </div>
}

function SectionTitle({ number, title }: {number: string; title: string}) { return <div className="section-title"><span>{number}</span><h3>{title}</h3></div> }
function Field({ label, required, hint, children }: {label: string; required?: boolean; hint?: string; children: React.ReactNode}) { return <label className="field"><span className="field-label">{label}{required && <b> *</b>}</span>{children}{hint && <small>{hint}</small>}</label> }

export default App
