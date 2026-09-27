import { useState } from 'react'
import './MenuDisplay.css'
import naruPhoto from './assets/menu/narkel-narus.png'
import mangoPhoto from './assets/menu/mango-burfi.png'
import ubePhoto from './assets/menu/ube-coconut-burfi.jpg'
import rosePhoto from './assets/menu/ube-coconut-burfi.jpg'

interface SweetItem {
  id: string
  name: string
  description: string
  price: string
  category: 'narus' | 'burfi'
  image: string
  instagramUrl: string
  tags: string[]
}

const sweets: SweetItem[] = [
  { id: 'narkel-narus', name: 'Narkel Narus', description: 'A Bengali favorite: tender coconut sweets rolled by hand and made for sharing.', price: '16 for $20 · 32 for $45', category: 'narus', image: naruPhoto, instagramUrl: 'https://www.instagram.com/mishtinmimi/', tags: ['coconut', 'traditional'] },
  { id: 'mango-burfi', name: 'Mango Burfi', description: 'Sunny, fruity mango burfi with a soft, creamy bite.', price: '15 for $30 · 30 for $50', category: 'burfi', image: mangoPhoto, instagramUrl: 'https://www.instagram.com/p/Da5xAt6EX_G/', tags: ['mango', 'a little sunshine'] },
  { id: 'ube-coconut', name: 'Ube Coconut Burfi', description: 'A pretty purple twist on coconut burfi, made for a colorful sweet table.', price: '15 for $30 · 30 for $45', category: 'burfi', image: ubePhoto, instagramUrl: 'https://www.instagram.com/p/Da5xAt6EX_G/', tags: ['ube', 'coconut'] },
  { id: 'rooh-afza', name: 'Rooh Afza Coconut Burfi', description: 'Fragrant rose and coconut come together in this rosy little treat.', price: '15 for $35 · 30 for $50', category: 'burfi', image: rosePhoto, instagramUrl: 'https://www.instagram.com/mishtinmimi/', tags: ['rose', 'coconut'] },
]

function MenuDisplay({ onOrder }: { onOrder?: () => void }) {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedItem, setSelectedItem] = useState<SweetItem | null>(null)
  const filtered = selectedCategory === 'all' ? sweets : sweets.filter(sweet => sweet.category === selectedCategory)
  const categories = [{ id: 'all', label: 'All the sweets' }, { id: 'narus', label: 'Narus' }, { id: 'burfi', label: 'Burfi' }]

  return <div className="menu-page">
    <div className="menu-heading"><span className="eyebrow">a peek at our sweet table</span><h2>Made with <em>mithaas</em> ♡</h2><p>Handmade little treats for big happy days.</p></div>
    <div className="menu-filters" aria-label="Filter sweets by type">{categories.map(category => <button key={category.id} className={selectedCategory === category.id ? 'selected' : ''} onClick={() => setSelectedCategory(category.id)}>{category.label}</button>)}</div>
    <div className="sweet-grid">{filtered.map(sweet => <button key={sweet.id} className="sweet-tile" onClick={() => setSelectedItem(sweet)} aria-label={`See ${sweet.name}`}>
      <img className="sweet-photo" src={sweet.image} alt={`${sweet.name} handmade dessert`} loading="lazy"/><span className="tile-shade"/><span className="tile-copy"><strong>{sweet.name}</strong><small>{sweet.price} · tap for details</small></span><span className="tile-heart">♡</span>
    </button>)}</div>
    <div className="menu-note"><span>✷</span><p>Planning something special? We make every order fresh and can help you find the perfect sweets for your day.</p><button onClick={onOrder}>Let’s plan it <b>→</b></button></div>
    {selectedItem && <div className="sweet-modal" role="presentation" onClick={() => setSelectedItem(null)}><section role="dialog" aria-modal="true" aria-labelledby="sweet-title" className="sweet-dialog" onClick={event => event.stopPropagation()}><button className="modal-close" onClick={() => setSelectedItem(null)} aria-label="Close details">×</button><div className="modal-art"><img src={selectedItem.image} alt={`${selectedItem.name} from Mishti & Mimi`} /></div><div className="modal-copy"><span className="eyebrow">handmade with love</span><h3 id="sweet-title">{selectedItem.name}</h3><p>{selectedItem.description}</p><strong>{selectedItem.price}</strong><div className="modal-tags">{selectedItem.tags.map(tag => <span key={tag}>#{tag}</span>)}</div><a className="instagram-source" href={selectedItem.instagramUrl} target="_blank" rel="noreferrer">See more on Instagram ↗</a><button className="modal-order" onClick={() => { setSelectedItem(null); onOrder?.() }}>Request this sweet <span>→</span></button></div></section></div>}
  </div>
}

export default MenuDisplay
