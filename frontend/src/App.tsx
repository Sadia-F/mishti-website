// frontend/src/App.tsx
import { useState } from 'react'
import AdminDashboard from './AdminDashboard'
import MenuDisplay from './MenuDisplay'

function App() {
  // State for form data
  const [selectedQuantity, setSelectedQuantity] = useState('')
  const [customAmount, setCustomAmount] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')
  const [showDashboard, setShowDashboard] = useState<'form' | 'menu' | 'dashboard'>('form')
  
  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    phone: '',
    eventDate: '',
    pickupDate: '',
    productType: '',
    paymentMethod: '',
    additionalInfo: '',
    colorCustomization: false,
    agreeToTerms: false
  })

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage('')

    // Prepare data to send
    const orderData = {
      ...formData,
      quantity: selectedQuantity,
      customAmount: selectedQuantity === 'custom' ? parseInt(customAmount) : null,
    }

    try {
      const response = await fetch('https://mishti-api.onrender.com/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      })

      const data = await response.json()

      if (response.ok) {
        setSubmitMessage('✅ Order submitted successfully! We\'ll contact you within 24-48 hours.')
        // Reset form
        setFormData({
          customerName: '',
          email: '',
          phone: '',
          eventDate: '',
          pickupDate: '',
          productType: '',
          paymentMethod: '',
          additionalInfo: '',
          colorCustomization: false,
          agreeToTerms: false
        })
        setSelectedQuantity('')
        setCustomAmount('')
      } else {
        setSubmitMessage('❌ Error: ' + (data.detail || 'Something went wrong'))
      }
    } catch (error) {
      setSubmitMessage('❌ Error: Could not connect to server. Make sure the backend is running.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: '30px',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Header with Navigation */}
      <div style={{ textAlign: 'center', borderBottom: '2px solid #f3e8ff', paddingBottom: '20px' }}>
        <h1 style={{ color: '#db2777', fontSize: '36px' }}>🌸 Mishti & Mimi</h1>
        <p style={{ color: '#666', fontSize: '16px' }}>Small Family Business • Made with Love ❤️</p>
        
        {/* Navigation Buttons */}
        <div style={{ marginTop: '15px', display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => setShowDashboard('form')}
            style={{
              padding: '8px 20px',
              backgroundColor: showDashboard === 'form' ? '#db2777' : '#e5e7eb',
              color: showDashboard === 'form' ? 'white' : '#333',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: showDashboard === 'form' ? 'bold' : 'normal'
            }}
          >
            🍬 Order Form
          </button>
          <button
            onClick={() => setShowDashboard('menu')}
            style={{
              padding: '8px 20px',
              backgroundColor: showDashboard === 'menu' ? '#db2777' : '#e5e7eb',
              color: showDashboard === 'menu' ? 'white' : '#333',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: showDashboard === 'menu' ? 'bold' : 'normal'
            }}
          >
            📸 Menu
          </button>
          <button
            onClick={() => setShowDashboard('dashboard')}
            style={{
              padding: '8px 20px',
              backgroundColor: showDashboard === 'dashboard' ? '#db2777' : '#e5e7eb',
              color: showDashboard === 'dashboard' ? 'white' : '#333',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: showDashboard === 'dashboard' ? 'bold' : 'normal'
            }}
          >
            📋 Dashboard
          </button>
        </div>
      </div>

      {/* Conditionally render content */}
      {showDashboard === 'menu' ? (
        <MenuDisplay />
      ) : showDashboard === 'dashboard' ? (
        <AdminDashboard />
      ) : (
        /* Order Form */
        <form onSubmit={handleSubmit}>
          <div style={{ marginTop: '30px' }}>
            <h2 style={{ fontSize: '22px', color: '#333' }}>Place Your Order</h2>
            <p style={{ color: '#666', fontSize: '14px' }}>
              Please fill out this form and we'll contact you within 24-48 hours to confirm availability and provide a quote.
            </p>

            {/* Customer Name */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', color: '#333' }}>
                Name (First & Last) *
              </label>
              <input 
                type="text" 
                name="customerName"
                value={formData.customerName}
                onChange={handleInputChange}
                placeholder="Your name" 
                required
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  border: '1px solid #ddd', 
                  borderRadius: '6px',
                  fontSize: '16px',
                  boxSizing: 'border-box'
                }} 
              />
            </div>

            {/* Email */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', color: '#333' }}>
                Email Address *
              </label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your@email.com" 
                required
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  border: '1px solid #ddd', 
                  borderRadius: '6px',
                  fontSize: '16px',
                  boxSizing: 'border-box'
                }} 
              />
            </div>

            {/* Phone */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', color: '#333' }}>
                Contact Number *
              </label>
              <input 
                type="tel" 
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="(516) 603-3637" 
                required
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  border: '1px solid #ddd', 
                  borderRadius: '6px',
                  fontSize: '16px',
                  boxSizing: 'border-box'
                }} 
              />
            </div>

            {/* Event Date */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', color: '#333' }}>
                Date of Event *
              </label>
              <input 
                type="date" 
                name="eventDate"
                value={formData.eventDate}
                onChange={handleInputChange}
                required
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  border: '1px solid #ddd', 
                  borderRadius: '6px',
                  fontSize: '16px',
                  boxSizing: 'border-box',
                  color: '#333'
                }} 
              />
            </div>

            {/* Pickup Date */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', color: '#333' }}>
                Date of Pickup *
              </label>
              <input 
                type="date" 
                name="pickupDate"
                value={formData.pickupDate}
                onChange={handleInputChange}
                required
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  border: '1px solid #ddd', 
                  borderRadius: '6px',
                  fontSize: '16px',
                  boxSizing: 'border-box',
                  color: '#333'
                }} 
              />
            </div>

            {/* Product Type */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', color: '#333' }}>
                What type of mishti would you like? *
              </label>
              <select 
                name="productType"
                value={formData.productType}
                onChange={handleInputChange}
                required
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  border: '1px solid #ddd', 
                  borderRadius: '6px',
                  fontSize: '16px',
                  boxSizing: 'border-box',
                  backgroundColor: 'white'
                }}
              >
                <option value="">Select a type...</option>
                <option value="narkel">Narkel (Coconut) Narus</option>
                <option value="mango">Mango Burfi</option>
                <option value="ube">Ube Coconut Burfi</option>
                <option value="roohafza">Rooh Afza Coconut Burfi</option>
              </select>
            </div>

            {/* Quantity Options */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '10px', color: '#333' }}>
                How many mishti would you like to order? *
              </label>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: '10px',
                backgroundColor: '#faf5ff',
                padding: '15px',
                borderRadius: '8px'
              }}>
                <label style={{ display: 'flex', alignItems: 'center', fontSize: '14px' }}>
                  <input 
                    type="radio" 
                    name="quantity" 
                    value="16" 
                    style={{ marginRight: '8px' }}
                    onChange={(e) => setSelectedQuantity(e.target.value)}
                    required
                  />
                  16 Narkel Narus - $20
                </label>
                <label style={{ display: 'flex', alignItems: 'center', fontSize: '14px' }}>
                  <input 
                    type="radio" 
                    name="quantity" 
                    value="32" 
                    style={{ marginRight: '8px' }}
                    onChange={(e) => setSelectedQuantity(e.target.value)}
                  />
                  32 Narkel Narus - $45
                </label>
                <label style={{ display: 'flex', alignItems: 'center', fontSize: '14px' }}>
                  <input 
                    type="radio" 
                    name="quantity" 
                    value="15-mango" 
                    style={{ marginRight: '8px' }}
                    onChange={(e) => setSelectedQuantity(e.target.value)}
                  />
                  15 Mango Burfi - $30
                </label>
                <label style={{ display: 'flex', alignItems: 'center', fontSize: '14px' }}>
                  <input 
                    type="radio" 
                    name="quantity" 
                    value="30-mango" 
                    style={{ marginRight: '8px' }}
                    onChange={(e) => setSelectedQuantity(e.target.value)}
                  />
                  30 Mango Burfi - $50
                </label>
                <label style={{ display: 'flex', alignItems: 'center', fontSize: '14px' }}>
                  <input 
                    type="radio" 
                    name="quantity" 
                    value="15-ube" 
                    style={{ marginRight: '8px' }}
                    onChange={(e) => setSelectedQuantity(e.target.value)}
                  />
                  15 Ube Coconut Burfi - $30
                </label>
                <label style={{ display: 'flex', alignItems: 'center', fontSize: '14px' }}>
                  <input 
                    type="radio" 
                    name="quantity" 
                    value="30-ube" 
                    style={{ marginRight: '8px' }}
                    onChange={(e) => setSelectedQuantity(e.target.value)}
                  />
                  30 Ube Coconut Burfi - $45
                </label>
                <label style={{ display: 'flex', alignItems: 'center', fontSize: '14px' }}>
                  <input 
                    type="radio" 
                    name="quantity" 
                    value="15-roohafza" 
                    style={{ marginRight: '8px' }}
                    onChange={(e) => setSelectedQuantity(e.target.value)}
                  />
                  15 Rooh Afza Coconut Burfi - $35
                </label>
                <label style={{ display: 'flex', alignItems: 'center', fontSize: '14px' }}>
                  <input 
                    type="radio" 
                    name="quantity" 
                    value="30-roohafza" 
                    style={{ marginRight: '8px' }}
                    onChange={(e) => setSelectedQuantity(e.target.value)}
                  />
                  30 Rooh Afza Coconut Burfi - $50
                </label>
                <label style={{ display: 'flex', alignItems: 'center', fontSize: '14px' }}>
                  <input 
                    type="radio" 
                    name="quantity" 
                    value="custom" 
                    style={{ marginRight: '8px' }}
                    onChange={(e) => setSelectedQuantity(e.target.value)}
                  />
                  Custom Amount
                </label>
              </div>
            </div>

            {/* Custom Amount Input - ONLY SHOWS when "custom" is selected */}
            {selectedQuantity === 'custom' && (
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', color: '#333' }}>
                  If you selected "Custom Amount", please enter your desired amount
                </label>
                <input 
                  type="number" 
                  placeholder="Enter custom amount"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  style={{ 
                    width: '100%', 
                    padding: '10px', 
                    border: '1px solid #ddd', 
                    borderRadius: '6px',
                    fontSize: '16px',
                    boxSizing: 'border-box'
                  }} 
                />
              </div>
            )}

            {/* Payment Method */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', color: '#333' }}>
                Preferred Payment Method *
              </label>
              <select 
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleInputChange}
                required
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  border: '1px solid #ddd', 
                  borderRadius: '6px',
                  fontSize: '16px',
                  boxSizing: 'border-box',
                  backgroundColor: 'white'
                }}
              >
                <option value="">Select a payment method...</option>
                <option value="zelle">Zelle</option>
                <option value="venmo">Venmo</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Additional Information */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', color: '#333' }}>
                Additional Information
              </label>
              <textarea 
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleInputChange}
                placeholder="Any special requests, flavor preferences, or notes..."
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  border: '1px solid #ddd', 
                  borderRadius: '6px',
                  fontSize: '16px',
                  minHeight: '100px',
                  boxSizing: 'border-box',
                  fontFamily: 'Arial, sans-serif'
                }}
              />
            </div>

            {/* Color Customization Checkbox */}
            <div style={{ 
              marginBottom: '20px', 
              padding: '15px', 
              backgroundColor: '#fdf2f8', 
              borderRadius: '8px',
              border: '1px solid #fbcfe8'
            }}>
              <label style={{ display: 'flex', alignItems: 'center', fontSize: '15px', color: '#333' }}>
                <input 
                  type="checkbox" 
                  name="colorCustomization"
                  checked={formData.colorCustomization}
                  onChange={handleInputChange}
                  style={{ marginRight: '10px', width: '18px', height: '18px' }} 
                />
                I'd like to customize the colors! (Small additional fee applies)
              </label>
              <p style={{ marginTop: '8px', fontSize: '13px', color: '#666', marginLeft: '28px' }}>
                Our Narkel Narus can be made into different colors at a small additional fee!
              </p>
            </div>

            {/* Terms & Conditions */}
            <div style={{ 
              marginBottom: '20px', 
              padding: '15px', 
              backgroundColor: '#f8fafc', 
              borderRadius: '8px',
              border: '1px solid #e2e8f0'
            }}>
              <h3 style={{ fontSize: '16px', color: '#333', marginBottom: '8px' }}>📋 Terms & Conditions</h3>
              <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.6' }}>
                Submitting this form is the first step toward bringing your sweet idea to life—but it's not a confirmed order just yet! 
                Once you hit submit, I'll take a look at all your tasty details and reach out within 24-48 hours to chat about availability, 
                answer any questions, and send over a personalized quote.
              </p>
              <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.6', marginTop: '10px' }}>
                Your order becomes official only after we've finalized everything together and the payment has been made.
              </p>
              <label style={{ display: 'flex', alignItems: 'center', marginTop: '12px', fontWeight: 'bold', color: '#333' }}>
                <input 
                  type="checkbox" 
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  required
                  style={{ marginRight: '10px', width: '18px', height: '18px' }} 
                />
                I agree to the terms and conditions *
              </label>
            </div>

            {/* Submit Button */}
            <div style={{ marginTop: '30px' }}>
              <button
                type="submit"
                disabled={isSubmitting}
                style={{ 
                  width: '100%', 
                  padding: '15px', 
                  backgroundColor: isSubmitting ? '#9ca3af' : '#db2777', 
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  transition: 'background-color 0.3s'
                }}
                onMouseEnter={(e) => {
                  if (!isSubmitting) {
                    e.currentTarget.style.backgroundColor = '#be185d'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSubmitting) {
                    e.currentTarget.style.backgroundColor = '#db2777'
                  }
                }}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Order Request'}
              </button>
              {submitMessage && (
                <div style={{ 
                  marginTop: '15px', 
                  padding: '12px', 
                  backgroundColor: submitMessage.includes('✅') ? '#d1fae5' : '#fecaca',
                  color: submitMessage.includes('✅') ? '#065f46' : '#991b1b',
                  borderRadius: '6px',
                  textAlign: 'center'
                }}>
                  {submitMessage}
                </div>
              )}
              <p style={{ textAlign: 'center', color: '#999', fontSize: '12px', marginTop: '10px' }}>
                We'll contact you within 24-48 hours to confirm your order
              </p>
            </div>
          </div>
        </form>
      )}

      {/* Footer */}
      <div style={{ 
        marginTop: '40px', 
        textAlign: 'center', 
        color: '#999',
        borderTop: '1px solid #f3e8ff',
        paddingTop: '20px',
        fontSize: '14px'
      }}>
        <p>Questions? Contact us at (516) 603-3637</p>
        <p>© 2026 Mishti & Mimi. All rights reserved.</p>
      </div>
    </div>
  );
}

export default App;