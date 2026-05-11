import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { formatCurrency, formatDate, getSituacaoBadge } from '../lib/utils'

export default function Dashboard({ navigate }) {
  const [stats, setStats] = useState(null)
  const [recentParcelas, setRecentParcelas] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => { loadDashboard() }, [])
  async function loadDashboard() {
    setLoading(true)
    try {
      const { data: parcelas } = await supabase.from('parcelas').select('*, acordos(cliente, numero_processo)').order('data_vencimento', { ascending: true })
      if (parcelas) {
        const t = parcelas.reduce((s, p) => s + Number(p.valor_total), 0)
        const r = parcelas.reduce((s, p) => s + Number(p.valor_recebido || 0), 0)
        const rp = parcelas.reduce((s, p) => s + Number(p.valor_repassado || 0), 0)
        const ea = parcelas.filter(p => p.situacao === 'Aberto').reduce((s, p) => s + Number(p.valor_total), 0)
        const q = parcelas.filter(p => p.situacao === 'Quitado').length
        const a = parcelas.filter(p => p.situacao === 'Aberto').length
        const at = parcelas.filter(p => p.situacao === 'Aberto' && p.data_vencimento && new Date(p.data_vencimento) < new Date()).length
        setStats({ total: t, recebido: r, repassado: rp, emAberto: ea, quitadas: q, abertas: a, atrasadas: at })
        setRecentParcelas(parcelas.filter(p => p.situacao === 'Aberto').slice(0, 8))
      }
    } catch (e) { console.error(e) } finally { setLoading(false) }
  }
  if (loading) return (<div className="loading-container"><div className="spinner" /></div>)
  return (
    <div>
      <div className="top-bar"><div><div className="top-bar-title">Dashboard</div><div className="top-bar-sub">Stenio Advocacia â VisÃ£o geral dos repasses</div></div></div>
      <div className="page-body">
        <div className="stats-grid">
          <div className="stat-card" style={{ background: 'var(--navy)' }}><div className="stat-label" style={{ color: 'rgba(255,255,255,0.55)' }}>Total Geral</div><div className="stat-value" style={{ color: 'var(--gold-light)' }}>{formatCurrency(stats?.total)}</div></div>
          <div className="stat-card"><div className="stat-label">Recebido</div><div className="stat-value green">{formatCurrency(stats?.recebido)}</div></div>
          <div className="stat-card"><div className="stat-label">Repassado</div><div className="stat-value green">{formatCurrency(stats?.repassado)}</div></div>
          <div className="stat-card"><div className="stat-label">Em Aberto</div><div className="stat-value amber">{formatCurrency(stats?.emAberto)}</div></div>
        </div>
        <div className="card">
          <div className="card-header"><div className="card-title">PrÃ³ximas Parcelas em Aberto</div><button className="btn btn-outline btn-sm" onClick={() => navigate('acordos')}>Ver todos</button></div>
          <div className="card-body">
            {recentParcelas.length === 0 ? (<div className="empty-state"><div className="empty-text">Nenhuma parcela em aberto</div></div>) : (
              <div className="table-wrapper"><table><thead><tr><th>Cliente</th><th>Processo</th><th>Parcela</th><th>Vencimento</th><th>Valor</th><th>SituaÃ§Ã£o</th></tr></thead><tbody>{recentParcelas.map(p => { const at = p.data_vencimento && new Date(p.data_vencimento) < new Date(); return (<tr key={p.id} style={{cursor:'pointer'}} onClick={()=>navigate('detalhe', p.acordos)}><td><strong>{p.acordos?.cliente}</strong></td><td>{p.acordos?.numero_processo}</td><td>N{p.numero_parcela}</td><td style={{color:at?'var(--red)':'inherit'}}>{formatDate(p.data_vencimento)}{at&&' â '}</td><td><strong>{formatCurrency(p.valor_total)}</strong></td><td><span className={`badge ${getSituacaoBadge(p.situacao)}`}>{p.situacao}</span></td></tr>) })}</tbody></table></div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
