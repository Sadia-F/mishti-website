import { useState } from 'react'
import './MenuDisplay.css'

interface SweetItem {
  id: string
  name: string
  description: string
  price: string
  category: 'narus' | 'burfi'
  color: string
  tags: string[]
}

const sweets: SweetItem[] = [
  { id: 'narkel-narus', name: 'Narkel Narus', description: 'A Bengali favorite: tender coconut sweets rolled by hand and made for sharing.', price: '16 for $20 · 32 for $45', category: 'narus', color: '#e8ae69', tags: ['coconut', 'traditional'] },
  { id: 'mango-burfi', name: 'Mango Burfi', description: 'Sunny, fruity mango burfi with a soft, creamy bite.', price: '15 for $30 · 30 for $50', category: 'burfi', color: '#ffc84e', tags: ['mango', 'a little sunshine'] },
  { id: 'ube-coconut', name: 'Ube Coconut Burfi', description: 'A pretty purple twist on coconut burfi, made for a colorful sweet table.', price: '15 for $30 · 30 for $45', category: 'burfi', color: '#ae7ad7', tags: ['ube', 'coconut'] },
  { id: 'rooh-afza', name: 'Rooh Afza Coconut Burfi', description: 'Fragrant rose and coconut come together in this rosy little treat.', price: '15 for $35 · 30 for $50', category: 'burfi', color: '#ed79a0', tags: ['rose', 'coconut'] },
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
      <SweetIllustration color={sweet.color} isNaru={sweet.category === 'narus'}/><span className="tile-shade"/><span className="tile-copy"><strong>{sweet.name}</strong><small>tap for a little more ✿</small></span><span className="tile-heart">♡</span>
    </button>)}</div>
    <div className="menu-note"><span>✷</span><p>Planning something special? We make every order fresh and can help you find the perfect sweets for your day.</p><button onClick={onOrder}>Let’s plan it <b>→</b></button></div>
    {selectedItem && <div className="sweet-modal" role="presentation" onClick={() => setSelectedItem(null)}><section role="dialog" aria-modal="true" aria-labelledby="sweet-title" className="sweet-dialog" onClick={event => event.stopPropagation()}><button className="modal-close" onClick={() => setSelectedItem(null)} aria-label="Close details">×</button><div className="modal-art"><SweetIllustration color={selectedItem.color} isNaru={selectedItem.category === 'narus'}/></div><div className="modal-copy"><span className="eyebrow">handmade with love</span><h3 id="sweet-title">{selectedItem.name}</h3><p>{selectedItem.description}</p><strong>{selectedItem.price}</strong><div className="modal-tags">{selectedItem.tags.map(tag => <span key={tag}>#{tag}</span>)}</div><button className="modal-order" onClick={() => { setSelectedItem(null); onOrder?.() }}>Request this sweet <span>→</span></button></div></section></div>}
  </div>
}

function SweetIllustration({ color, isNaru }: { color: string; isNaru: boolean }) {
  return <svg className="sweet-artwork" viewBox="0 0 400 400" aria-hidden="true"><rect width="400" height="400" fill={color}/><circle cx="42" cy="58" r="96" fill="#fff" opacity=".13"/><circle cx="365" cy="345" r="120" fill="#fff" opacity=".12"/><path d="M0 312Q110 270 210 320T400 299V400H0Z" fill="#fff" opacity=".13"/>
    <g fill="none" stroke="#fff" strokeWidth="4" opacity=".7"><circle cx="67" cy="316" r="23" strokeDasharray="2 9"/><circle cx="331" cy="74" r="18" strokeDasharray="2 8"/></g>
    {isNaru ? <g stroke="#ac724d" strokeWidth="3"><ellipse cx="200" cy="248" rx="137" ry="62" fill="#fff" opacity=".46"/><circle cx="131" cy="203" r="43" fill="#d49a62"/><circle cx="218" cy="184" r="48" fill="#f3d5a5"/><circle cx="287" cy="219" r="42" fill="#e8b675"/><circle cx="172" cy="272" r="39" fill="#f0d1a0"/><circle cx="254" cy="278" r="38" fill="#c78a55"/><g fill="none" stroke="#fff5dc" strokeWidth="5" strokeLinecap="round"><path d="M109 193l16-13m-5 40 22-25m-20-5 23 7m56-14 18-18m-3 46 19-24m-28 7 21 8m44 18 19-22m-17 47 22-27m-25-12 19 7m-113 80 21-26m25-27 18-18m-10 42 20-27"/></g></g> : <g stroke="#fff" strokeWidth="4"><ellipse cx="200" cy="263" rx="143" ry="57" fill="#fff" opacity=".45"/><g transform="rotate(-8 200 200)"><rect x="102" y="137" width="88" height="86" rx="13" fill={color} stroke="#fff9f6" strokeWidth="8"/><rect x="207" y="124" width="91" height="88" rx="13" fill={color} stroke="#fff9f6" strokeWidth="8"/><rect x="151" y="235" width="88" height="87" rx="13" fill={color} stroke="#fff9f6" strokeWidth="8"/><rect x="253" y="227" width="73" height="70" rx="12" fill={color} stroke="#fff9f6" strokeWidth="8"/><g fill="#fff6e9" stroke="none"><path d="M128 156h36v7h-36zm0 16h50v7h-50zm98-25h51v7h-51zm0 18h37v7h-37zm-57 86h44v7h-44zm0 18h31v7h-31zm98-9h35v7h-35z"/></g></g></g>}
    <g fill="#fff"><path d="M73 126l6 13 14 2-10 9 3 14-13-7-13 7 3-14-10-9 14-2z"/><path d="M322 144l4 9 10 1-7 7 2 10-9-5-9 5 2-10-7-7 10-1z"/></g><g fill="#8c4976"><circle cx="63" cy="208" r="5"/><circle cx="342" cy="266" r="6"/><circle cx="82" cy="272" r="4"/></g></svg>
}

export default MenuDisplay
