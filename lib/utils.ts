import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatScore(score: number): string {
  return score.toFixed(1)
}

export function formatPrice(price: number): string {
  return `₹${price}`
}

export function getPriceRangeLabel(range: number): string {
  const labels: Record<number, string> = {
    1: 'Under ₹200',
    2: '₹200–500',
    3: '₹500–1000',
    4: 'Above ₹1000',
  }
  return labels[range] || ''
}

export function getScoreColour(score: number): string {
  if (score >= 9) return '#2E7D32'
  if (score >= 7) return '#C8702A'
  if (score >= 5) return '#F59E0B'
  return '#C0392B'
}

export function timeAgo(date: string): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}
