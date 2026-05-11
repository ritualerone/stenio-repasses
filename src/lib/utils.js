export function formatCurrency(value) {
  if (value === null || value === undefined || value === '') return 'â'
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value))
}

export function formatDate(dateStr) {
  if (!dateStr) return 'â'
  try {
    const d = new Date(dateStr + 'T12:00:00')
    return d.toLocaleDateString('pt-BR')
  } catch {
    return dateStr
  }
}

export function getSituacaoBadge(situacao) {
  switch (situacao) {
    case 'Quitado': return 'badge-green'
    case 'Aberto': return 'badge-amber'
    case 'Atrasado': return 'badge-red'
    case 'Parcial': return 'badge-blue'
    default: return 'badge-gray'
  }
}

export function isAtrasada(parcela) {
  if (parcela.situacao !== 'Aberto') return false
  if (!parcela.data_vencimento) return false
  return new Date(parcela.data_vencimento) < new Date()
}
