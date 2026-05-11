import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { formatCurrency } from '../lib/utils'

export default function Acordos({ navigate }) {
  const [acordos, setAcordos] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filtroAtivo, setFiltroAtivo] = useState('todos')

  useEffect(() => { loadAcordos() }, [])

  async function loadAcordos() {
    setLoading(true)
    const { data } = await supabase.from('acordos').select('*, parcelas(*)').order('created_at', {+ null })
    if (data) setAcordos(data)
    setLoading(false)
  }

  async function toggleAtivo(id, ativo) {
    await supabase.from('acordos').update({ ativo: !ativo }).eq('id', id)
    loadAcordos()
  }

  async function deleteAcordo(id) {
    if (!window.confirm('Excluir este acordo e todas as parcelas?')) return
    await supabase.from('acordos').delete().eq('id', id)
    loadAcordos()
  }

  function getStats(acordo) {
    const p = acordo.parcelas || []
    return {
      total: p.reduce((s, x) => s + Number(x.valor_total), 0),
      recebido: p.reduce((s, x) => s + Number(x.valor_recebido || 0), 0),
      quitadas: p.filter(x => x.situacao === 'Quitado').length,
      abertas: p.filter(x => x.situacao === 'Aberto').length,
      atrasadas: p.filter(x => x.situacao === 'Aberto' && x.data_vencimento && new Date(x.data_vencimento) < new Date()).length,
      totalParcelas: p.length,
    }
  }

  const filtered = acordos.filter(a => {
    const ms = !search || a.cliente.toLowerCase().includes(search.toLowerCase()) || a.numero_processo.toLowerCase().includes(search.toLowerCase())
    const ma = filtroAtivo === 'todos' || (filtroAtivo === 'ativos' ? a.ativo : !a.ativo)
    return ms && ma
  })

  return (
    <div>
      <div className="top-bar">
        <div><div className="top-bar-title">Acordos &amp; Repasses</div><div className="top-bar-sub">{acordos.length} acordo(s) cadastrado(s)</div></div>
        <button className="btn btn-gold" onClick={() => navigate('novo-acordo')}>ï¼ Novo Acordo</button>
      </div>
      <div className="page-body">
        <div className="card">
          <div className="filters-bar">
            <div className="search-wrapper"><span className="search-icon">ð</span><input className="search-input" placeholder="Buscar por cliente ou processo..." value={search} onChange={e => setSearch(e.target.value)} /></div>
            <div className="tabs" style={{ margin: 0 }}>{['todos', 'ativos', 'inativos'].map(f => (<button key={f} className={`tab-btn ${filtroAtivo === f ? 'active' : ''}`} onClick={() => setFiltroAtivo(f)}>{f.charAt(0).toUpperCase()+f.slice(1)}</button>))}</div>
          </div>
          {loading ? (<div className="loading-container"><div className="spinner" /></div>) : filtered.length === 0 ? (<div className="empty-state"><div className="empty-text">Nenhum acordo encontrado</div></div>) : (
            <div className="table-wrapper"><table><thead><tr><th>Cliente</th><th>Processo</th><th>Parcelas</th><th>Quitadas</th><th>Em Aberto</th><th>Atrasadas</th><th>Total Geral</th><th>Recebido</th><th>Status</th><th>AÃ§Ãµes</th></tr></thead><tbody>{filtered.map(a => { const s = getStats(a); return (<tr key={a.id}><td><strong>{a.cliente}</strong></td><td>{a.numero_processo}</td><td>{s.totalParcelas}</td><td><span style={{color:'var(--green)',fontWeight:600}}>{s.quitadas}</span></td><td><span style={{color:'var(--amber)',fontWeight:600}}>{s.abertas}</span></td><td>{s.atrasadas>0 ? <span style={{color:'var(--red)',fontWeight:700}}>â  {s.atrasadas}</span> : <span>0</span>}</td><td><strong>{formatCurrency(s.total)}</strong></td><td>{formatCurrency(s.recebido)}</td><td><span className={`badge ${a.ativo ? 'badge-green':'badge-gray'}`}>{a.ativo ? 'Ativo':'Encerrado'}</span></td><td><div style={{display:'flex',gap:6}}><button className="btn btn-outline btn-sm" onClick={()=>navigate('detalhe',a)}>Ver</button><button className="btn btn-sm" style={{background:'var(--cream-dark)',color:'var(--text-muted)'}} onClick={()=>toggleAtivo(a.id,a.ativo)}>{a.ativo?'â¸':'>v'}</button><button className="btn btn-danger btn-sm" onClick={()=>deleteAcordo(a.id)}>â</button></div></td></tr>) })}</tbody></table></div>
          )}
        </div>
      </div>
    </div>
  )
}
