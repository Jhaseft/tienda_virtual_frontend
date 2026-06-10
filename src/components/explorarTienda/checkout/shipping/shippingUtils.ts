function horasATexto(h: number): string {
  const dias = Math.floor(h / 24)
  const horas = h % 24
  const partes: string[] = []
  if (dias > 0) partes.push(`${dias} ${dias === 1 ? 'día' : 'días'}`)
  if (horas > 0) partes.push(`${horas} ${horas === 1 ? 'hora' : 'horas'}`)
  return partes.join(' y ')
}

export function formatTime(minH: number, maxH: number): string {
  return `Mínimo. ${horasATexto(minH)} · Máximo. ${horasATexto(maxH)}`
}
