// frontend/src/MenuDisplay.tsx
import { useState } from 'react'
import './MenuDisplay.css'

interface SweetItem {
  id: string
  name: string
  description: string
  price: string
  image: string
  category: 'narus' | 'burfi' | 'special'
  tags?: string[]
}

function MenuDisplay() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedItem, setSelectedItem] = useState<SweetItem | null>(null)

  // Menu data - you'll replace these with your actual images later
  const sweets: SweetItem[] = [
    {
      id: 'narkel-narus',
      name: 'Narkel Narus',
      description: 'Traditional coconut balls made with fresh grated coconut and jaggery. A classic Bengali sweet.',
      price: '$20 - $45',
      image: 'https://images.unsplash.com/photo-1587313427070-1c6a9f4e0f3a?w=400&h=400&fit=crop',
      category: 'narus',
      tags: ['Coconut', 'Traditional', 'Gluten-Free']
    },
    {
      id: 'mango-burfi',
      name: 'Mango Burfi',
      description: 'Creamy milk fudge infused with real mango puree. A perfect summer treat!',
      price: '$30 - $50',
      image: 'https://images.unsplash.com/photo-1587313427070-1c6a9f4e0f3a?w=400&h=400&fit=crop',
      category: 'burfi',
      tags: ['Mango', 'Creamy', 'Seasonal']
    },
    {
      id: 'ube-coconut',
      name: 'Ube Coconut Burfi',
      description: 'Purple yam flavored coconut burfi with a hint of cardamom. Unique and delightful!',
      price: '$30 - $45',
      image: 'https://images.unsplash.com/photo-1587313427070-1c6a9f4e0f3a?w=400&h=400&fit=crop',
      category: 'burfi',
      tags: ['Ube', 'Coconut', 'Purple']
    },
    {
      id: 'rooh-afza',
      name: 'Rooh Afza Coconut Burfi',
      description: 'Rose-flavored coconut burfi with a beautiful pink hue. A floral delight!',
      price: '$35 - $50',
      image: 'https://images.unsplash.com/photo-1587313427070-1c6a9f4e0f3a?w=400&h=400&fit=crop',
      category: 'burfi',
      tags: ['Rose', 'Floral', 'Pink']
    },
    {
      id: 'assorted-narus',
      name: 'Assorted Narus',
      description: 'A beautiful assortment of our signature Narus in various colors and flavors.',
      price: '$25 - $60',
      image: 'https://images.unsplash.com/photo-1587313427070-1c6a9f4e0f3a?w=400&h=400&fit=crop',
      category: 'special',
      tags: ['Assorted', 'Colorful', 'Gift']
    },
    {
      id: 'premium-box',
      name: 'Premium Mishti Box',
      description: 'A curated selection of our finest sweets, perfect for weddings and special occasions.',
      price: '$50 - $100',
      image: 'https://images.unsplash.com/photo-1587313427070-1c6a9f4e0f3a?w=400&h=400&fit=crop',
      category: 'special',
      tags: ['Premium', 'Wedding', 'Gift Box']
    }
  ]

  // Filter sweets by category
  const filteredSweets = selectedCategory === 'all' 
    ? sweets 
    : sweets.filter(sweet => sweet.category === selectedCategory)

  // Categories for filter buttons
  const categories = [
    { id: 'all', label: 'All Sweets' },
    { id: 'narus', label: 'Narus' },
    { id: 'burfi', label: 'Burfi' },
    { id: 'special', label: 'Special' }
  ]

  return (
    <div style={{ padding: '20px' }}>
      {/* Category Filter */}
      <div style={{ 
        display: 'flex', 
        gap: '10px', 
        justifyContent: 'center', 
        marginBottom: '30px',
        flexWrap: 'wrap'
      }}>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            style={{
              padding: '10px 24px',
              backgroundColor: selectedCategory === cat.id ? '#db2777' : '#f3f4f6',
              color: selectedCategory === cat.id ? 'white' : '#333',
              border: 'none',
              borderRadius: '25px',
              fontSize: '14px',
              fontWeight: selectedCategory === cat.id ? 'bold' : 'normal',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Sweet Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '25px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {filteredSweets.map((sweet) => (
          <div
            key={sweet.id}
            className="menu-card"
            onClick={() => setSelectedItem(sweet)}
          >
            <div 
              className="menu-card-image"
              style={{ backgroundImage: `url(${sweet.image})` }}
            />
            <div className="menu-card-content">
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'start',
                marginBottom: '8px'
              }}>
                <h3 className="menu-card-title">
                  {sweet.name}
                </h3>
                <span className="menu-card-price">
                  {sweet.price}
                </span>
              </div>
              <p className="menu-card-description">
                {sweet.description}
              </p>
              <div className="menu-card-tags">
                {sweet.tags?.map(tag => (
                  <span key={tag} className="menu-tag">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedItem && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.6)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            position: 'relative'
          }}>
            <button
              onClick={() => setSelectedItem(null)}
              style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'rgba(0,0,0,0.1)',
                border: 'none',
                fontSize: '20px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background-color 0.2s'
              }}
            >
              ✕
            </button>
            <div style={{
              height: '300px',
              background: `url(${selectedItem.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundColor: '#f3f4f6'
            }} />
            <div style={{ padding: '30px' }}>
              <h2 style={{ fontSize: '28px', color: '#333', marginBottom: '5px' }}>
                {selectedItem.name}
              </h2>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '15px'
              }}>
                <span style={{
                  backgroundColor: '#db2777',
                  color: 'white',
                  padding: '4px 16px',
                  borderRadius: '20px',
                  fontSize: '16px',
                  fontWeight: 'bold'
                }}>
                  {selectedItem.price}
                </span>
                <span style={{
                  backgroundColor: '#f3f4f6',
                  color: '#666',
                  padding: '4px 16px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  textTransform: 'capitalize'
                }}>
                  {selectedItem.category}
                </span>
              </div>
              <p style={{
                fontSize: '16px',
                color: '#666',
                lineHeight: '1.6',
                marginBottom: '15px'
              }}>
                {selectedItem.description}
              </p>
              <div style={{
                display: 'flex',
                gap: '8px',
                flexWrap: 'wrap',
                marginBottom: '20px'
              }}>
                {selectedItem.tags?.map(tag => (
                  <span key={tag} style={{
                    backgroundColor: '#fdf2f8',
                    color: '#db2777',
                    padding: '4px 14px',
                    borderRadius: '20px',
                    fontSize: '13px'
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                style={{
                  width: '100%',
                  padding: '14px',
                  backgroundColor: '#db2777',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Order This Sweet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MenuDisplay