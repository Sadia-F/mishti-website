import { useState } from 'react'
import AdminDashboard from './AdminDashboard'
import MenuDisplay from './MenuDisplay'
import './App.css'

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
      <a className="brand-mark" href="#top" onClick={() => setPage('form')} aria-label="Mishti and Mimi home"><span>Mishti</span><i>&amp;</i><span>Mimi</span></a>
      <a className="brand-name" href="#top" onClick={() => setPage('form')}>Mishti <i>&amp;</i> Mimi</a>
      <p className="brand-tagline">Little sweets, made with love</p>
      <nav aria-label="Main navigation" className="main-nav">
        {(['form', 'menu', 'dashboard'] as Page[]).map(item => <button key={item} className={page === item ? 'active' : ''} onClick={() => setPage(item)}>{item === 'form' ? 'Order request' : item === 'menu' ? 'Our menu' : 'Dashboard'}</button>)}
      </nav>
    </header>

    {page === 'menu' ? <main className="content"><MenuDisplay onOrder={() => setPage('form')} /></main> : page === 'dashboard' ? <main className="content"><AdminDashboard /></main> : <>
      <section className="hero" id="top">
        <div className="hero-sparkles" aria-hidden="true"><span>✦</span><span>✿</span><span>♥</span><span>✧</span></div>
        <div className="hero-copy"><span className="eyebrow"><i>✿</i> made by women who love sweets <i>✿</i></span><h1>A little sweetness<br/><em>for your celebration!</em></h1><p>Handmade Bengali mishti for all of life’s sweet moments, made with love in Long Island &amp; Queens.</p><a href="#order" className="hero-cta">Let’s make it sweet <span>→</span></a><div className="hero-handle">@mishtimini <span>✷</span> Queens &amp; Long Island, NY</div></div>
        <HeroSweets />
      </section>
      <section className="highlight-row" aria-label="Explore Mishti and Mimi">
        <button className="highlight" onClick={() => setPage('menu')}><span className="highlight-art highlight-pink">✿</span><span>the menu</span></button>
        <a className="highlight" href="#order"><span className="highlight-art highlight-yellow">♡</span><span>celebrate</span></a>
        <a className="highlight" href="#about"><span className="highlight-art highlight-purple">✦</span><span>our story</span></a>
        <a className="highlight" href="#terms"><span className="highlight-art highlight-orange">☻</span><span>questions</span></a>
        <a className="highlight" href="https://www.instagram.com/mishtimini/" target="_blank" rel="noreferrer"><span className="highlight-art highlight-mint">↗</span><span>instagram</span></a>
      </section>
      <main className="content" id="order">
        <div className="intro" id="about"><span className="eyebrow">✿ &nbsp; let’s make something sweet &nbsp; ✿</span><h2>Sweeten your <em>celebration</em></h2><p>Tell us a little about your special day. We’ll be in touch within 24–48 hours to confirm availability, answer questions, and share a personalized quote.</p></div>
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

          <section className="terms-card" id="terms"><span className="eyebrow">A little note before we begin</span><h3>Terms &amp; conditions</h3><div className="terms-copy"><p>Submitting this form is the first step toward bringing your sweet idea to life—but it’s not a confirmed order just yet! Once you hit submit, I’ll take a look at all your tasty details and reach out within 24–48 hours to chat about availability, answer any questions, and send over a personalized quote.</p><p>Your order becomes official only after we’ve finalized everything together and the payment has been made. All orders depend on our mishti-making schedule, so certain dates or custom designs may require a little extra lead time. We’ll contact you using the email or phone number you provide, but you’re always welcome to reach out directly through our <a href="https://www.instagram.com/mishtimini/" target="_blank" rel="noreferrer">Instagram</a> or <a href="mailto:mishtimini@gmail.com">email</a> if you need us sooner.</p><p>Prices may vary depending on your flavors, quantities, and custom touches, and we’ll sort out pickup or delivery details during confirmation. If you need to make changes, please let me know at least 7 days before your event, and just a heads-up—cancellations after payment may come with a fee.</p></div><label className="terms-agree"><input type="checkbox" name="agreeToTerms" checked={form.agreeToTerms} onChange={update} required/><span>I agree to the terms &amp; conditions <b>*</b></span></label></section>

          <div className="submit-row"><button className="submit-button" type="submit" disabled={submitting}>{submitting ? 'Sending your request…' : 'Send order request'}<span>↗</span></button><p>This is an inquiry only. No payment is collected here.</p>{message && <div role="status" className={`form-message ${success ? 'success' : 'error'}`}>{message}</div>}</div>
        </form>
      </main>
    </>}
    <footer className="site-footer"><a className="footer-brand" href="#top" onClick={() => setPage('form')}>Mishti &amp; Mimi</a><p>Handmade with love in Long Island &amp; Queens, NY</p><div><a href="https://www.instagram.com/mishtimini/" target="_blank" rel="noreferrer">Instagram ↗</a><a href="mailto:mishtimini@gmail.com">Email us ↗</a><a href="tel:+15166033637">(516) 603-3637</a></div><small>© 2026 Mishti &amp; Mimi</small></footer>
  </div>
}

function SectionTitle({ number, title }: {number: string; title: string}) { return <div className="section-title"><span>{number}</span><h3>{title}</h3></div> }
function Field({ label, required, hint, children }: {label: string; required?: boolean; hint?: string; children: React.ReactNode}) { return <label className="field"><span className="field-label">{label}{required && <b> *</b>}</span>{children}{hint && <small>{hint}</small>}</label> }

function HeroSweets() {
  return <div className="hero-art" aria-hidden="true"><svg viewBox="0 0 520 450" role="presentation">
    <defs><radialGradient id="plate" cx="48%" cy="40%"><stop stopColor="#fff"/><stop offset=".8" stopColor="#fff9f7"/><stop offset="1" stopColor="#ef9ab3"/></radialGradient><linearGradient id="truffle" x2=".9" y2="1"><stop stopColor="#fff5dc"/><stop offset="1" stopColor="#d6a27c"/></linearGradient><linearGradient id="ube" x2="1" y2="1"><stop stopColor="#d8a6f1"/><stop offset="1" stopColor="#8854c4"/></linearGradient><linearGradient id="mango" x2="0" y2="1"><stop stopColor="#ffd277"/><stop offset="1" stopColor="#ec8c35"/></linearGradient><filter id="shadow" x="-.2" y="-.2" width="1.5" height="1.5"><feDropShadow dx="0" dy="12" stdDeviation="9" floodColor="#923656" floodOpacity=".2"/></filter></defs>
    <ellipse cx="265" cy="277" rx="213" ry="141" fill="#d83f77" opacity=".17"/><ellipse cx="260" cy="254" rx="213" ry="141" fill="url(#plate)" stroke="#fff" strokeWidth="9" filter="url(#shadow)"/><ellipse cx="260" cy="248" rx="185" ry="114" fill="none" stroke="#ef9db5" strokeWidth="2" strokeDasharray="3 8"/>
    <g stroke="#a55a39" strokeWidth="2"><circle cx="157" cy="205" r="35" fill="url(#truffle)"/><circle cx="213" cy="173" r="33" fill="url(#truffle)"/><circle cx="274" cy="190" r="35" fill="#f8d7ac"/><circle cx="333" cy="171" r="32" fill="url(#mango)"/><circle cx="377" cy="221" r="35" fill="url(#ube)"/><circle cx="128" cy="259" r="32" fill="url(#mango)"/><circle cx="182" cy="280" r="36" fill="url(#ube)"/><circle cx="251" cy="271" r="36" fill="#ef7394"/><circle cx="321" cy="278" r="36" fill="url(#truffle)"/><circle cx="365" cy="275" r="26" fill="#f7c86b"/></g>
    <g fill="none" stroke="#fff8ec" strokeWidth="2.4" strokeLinecap="round"><path d="M138 204l9-13m4 37 14-17m-1-17-16 3M198 170l8-13m13 32-8-15m51 20 16-18m-19 42-2-18M322 169l9-13m-10 40 14-17m35 39 14-20m-28 3 19-8M117 259l13-18m-5 39 18-14m-17-7 17 8m35 14 16-21m-8 47 10-22m-6-19 12 10m51 10 12-20m-9 44 17-18m-22-20 13 7m58-16 15-18m-13 45 12-17m-19-16 17 5"/></g>
    <g fill="#f6d04e"><path d="M230 218l6 8 10 1-7 7 2 10-9-5-9 5 2-10-7-7 10-1z"/><path d="M302 224l4 6 7 1-5 5 1 7-7-3-6 3 1-7-5-5 7-1z"/></g>
    <g fill="#ef4d83"><path d="M221 305c-18-12-18-27-6-30 6-1 10 3 12 7 5-9 18-9 20 0 2 8-9 18-26 23z"/><path d="M285 148c-14-9-14-21-5-23 5-1 8 2 10 6 4-7 14-7 16 0s-7 14-21 17z"/></g>
    <g fill="#65ab68"><path d="M90 175q30-43 57-39-15 30-57 39zm315 40q24-34 48-30-13 25-48 30z"/><path d="M101 162q7 20 27 25m277 5q8 16 22 20" fill="none" stroke="#65ab68" strokeWidth="3"/></g>
    <g fill="#fff" stroke="#ed5b89" strokeWidth="3"><circle cx="116" cy="107" r="25"/><circle cx="415" cy="116" r="22"/></g><g fill="#ec5685"><path d="M116 91c-8 9-4 17 0 19 4-2 8-10 0-19zm-15 16c13-3 18 3 17 8-6 3-13 2-17-8zm26 0c-13-3-18 3-17 8 6 3 13 2 17-8zm-11 23c-8-12-4-19 0-20 4 1 8 8 0 20z"/><path d="M415 102c-8 9-4 16 0 18 4-2 8-9 0-18zm-14 15c12-3 16 3 15 8-5 3-11 2-15-8zm24 0c-12-3-16 3-15 8 5 3 11 2 15-8z"/></g>
    <g fill="#e97797"><circle cx="78" cy="304" r="4"/><circle cx="432" cy="309" r="5"/><circle cx="188" cy="112" r="4"/><circle cx="361" cy="103" r="5"/><circle cx="70" cy="232" r="3"/><circle cx="452" cy="248" r="3"/></g>
  </svg><span className="art-sticker sticker-one">handmade<br/>with ♥</span><span className="art-sticker sticker-two">so sweet!</span></div>
}

export default App
