import React, { useState } from 'react'
import './index.css'
import Dashboard from './pages/Dashboard'
import Acordos from './pages/Acordos'
import AcordoDetalhe from './pages/AcordoDetalhe'
import NovoAcordo from './pages/NovoAcordo'

export default function App() {
  const [page, setPage] = useState('dashboard')
  const [selectedAcordo, setSelectedAcordo] = useState(null)

  const navigate = (p, data = null) => {
    setPage(p)
    if (data) setSelectedAcordo(data)
    window.scrollTo(0, 0)
  }

  return (
    <div className="app-shell">
      <Sidebar page={page} navigate={navigate} />
      <div className="main-content">
        {page === 'dashboard' && <Dashboard navigate={navigate} />}
        {page === 'acordos' && <Acordos navigate={navigate} />}
        {page === 'detalhe' && <AcordoDetalhe acordo={selectedAcordo} navigate={navigate} />}
        {page === 'novo-acordo' && <NovoAcordo navigate={navigate} />}
      </div>
    </div>
  )
}

function Sidebar({ page, navigate }) {
  const items = [
    { id: 'dashboard', icon: 'â', label: 'Dashboard' },
    { id: 'acordos', icon: 'â', label: 'Acordos & Repasses' },
    { id: 'novo-acordo', icon: 'ï¼', label: 'Novo Acordo' },
  ]

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-title">Stenio Advocacia</div>
        <div className="sidebar-logo-sub">Controle de Repasses</div>
      </div>
      <nav className="sidebar-nav">
        <span className="nav-section-label">Menu</span>
        {items.map(item => (
          <button
            key={item.id}
            className={`nav-item ${page === item.id ? 'active' : ''}`}
            onClick={() => navigate(item.id)}
          >
            <span className="icon">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
      <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(201,168,76,0.15)' }}>
        <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.25)', lineHeight: 1.6 }}>
          Pedro Rodrigues dos Santos Jr.<br />
          Sistema de Controle Interno
        </div>
      </div>
    </aside>
  )
}
