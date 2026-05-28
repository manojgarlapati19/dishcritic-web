'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard, Store, UtensilsCrossed, Star, Users, MapPin,
  BarChart3, Settings, LogOut, ExternalLink, Menu, X,
  Plus, Search, Edit3, Trash2, Eye, Check, X as XIcon,
  AlertTriangle, Bell, Download, ShieldAlert,
  CheckCircle2, Flag, RefreshCw,
  CircleDot, ToggleLeft, ToggleRight, Camera,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { useStore } from '@/store/useStore'

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'restaurants', label: 'Restaurants', icon: Store },
  { id: 'dishes', label: 'Dishes', icon: UtensilsCrossed },
  { id: 'reviews', label: 'Reviews', icon: Star },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'cities', label: 'Cities', icon: MapPin },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
]

/* ─── Sample Data ──────────────────────────────────────────────────────── */

const CUISINE_OPTIONS = ['North Indian', 'South Indian', 'Mughlai', 'Hyderabadi', 'Chinese', 'Continental', 'Biryani', 'Fast Food', 'Street Food', 'Desserts', 'Italian', 'Mexican', 'Japanese', 'Thai']

const CATEGORY_OPTIONS = ['Biryani', 'Starters', 'Main Course', 'Desserts', 'Drinks', 'Breads', 'Soups', 'Salads', 'Tandoor']

const CITY_NAMES = ['Hyderabad', 'Mumbai', 'Bengaluru', 'Delhi', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Chandigarh', 'Goa']

const CITY_DATA = [
  { name: 'Hyderabad', emoji: '🌆', state: 'Telangana', restaurants: 2840, reviews: 84200, active: true },
  { name: 'Mumbai', emoji: '🌊', state: 'Maharashtra', restaurants: 3650, reviews: 98500, active: true },
  { name: 'Bengaluru', emoji: '🏙️', state: 'Karnataka', restaurants: 3210, reviews: 76200, active: true },
  { name: 'Delhi', emoji: '🏛️', state: 'Delhi', restaurants: 4100, reviews: 105300, active: true },
  { name: 'Chennai', emoji: '🌴', state: 'Tamil Nadu', restaurants: 1950, reviews: 42100, active: true },
  { name: 'Kolkata', emoji: '🎭', state: 'West Bengal', restaurants: 1680, reviews: 35800, active: true },
  { name: 'Pune', emoji: '⛰️', state: 'Maharashtra', restaurants: 1840, reviews: 31200, active: true },
  { name: 'Ahmedabad', emoji: '🏗️', state: 'Gujarat', restaurants: 1120, reviews: 18400, active: true },
  { name: 'Jaipur', emoji: '🏰', state: 'Rajasthan', restaurants: 890, reviews: 14200, active: true },
  { name: 'Lucknow', emoji: '🕌', state: 'Uttar Pradesh', restaurants: 740, reviews: 9800, active: false },
]

const SAMPLE_RESTAURANTS = [
  { id: 1, name: 'Paradise Restaurant', city: 'Hyderabad', cuisine: 'Mughlai, Hyderabadi', score: 9.2, reviews: 3241, verified: true, claimed: true, date: '2023-01-15' },
  { id: 2, name: 'Bawarchi', city: 'Hyderabad', cuisine: 'Biryani, Mughlai', score: 8.9, reviews: 4100, verified: true, claimed: true, date: '2023-02-20' },
  { id: 3, name: 'Shadab Restaurant', city: 'Hyderabad', cuisine: 'Mughlai, North Indian', score: 8.7, reviews: 2800, verified: true, claimed: false, date: '2023-03-10' },
  { id: 4, name: 'Pista House', city: 'Hyderabad', cuisine: 'Biryani, Hyderabadi', score: 8.4, reviews: 3500, verified: false, claimed: true, date: '2023-04-05' },
  { id: 5, name: 'Karim\'s', city: 'Delhi', cuisine: 'Mughlai, North Indian', score: 9.0, reviews: 5200, verified: true, claimed: true, date: '2022-11-01' },
  { id: 6, name: 'Bukhara', city: 'Delhi', cuisine: 'North Indian, Tandoor', score: 9.3, reviews: 2800, verified: true, claimed: true, date: '2022-10-15' },
  { id: 7, name: 'Trishna', city: 'Mumbai', cuisine: 'South Indian, Seafood', score: 8.8, reviews: 2100, verified: true, claimed: true, date: '2023-05-20' },
  { id: 8, name: 'MTR', city: 'Bengaluru', cuisine: 'South Indian, Udupi', score: 8.6, reviews: 3900, verified: true, claimed: false, date: '2023-06-01' },
  { id: 9, name: 'Dum Pukht', city: 'Kolkata', cuisine: 'Mughlai, Awadhi', score: 9.1, reviews: 1400, verified: true, claimed: true, date: '2023-07-12' },
  { id: 10, name: 'The Spice Route', city: 'Chennai', cuisine: 'Continental, Asian', score: 8.2, reviews: 980, verified: false, claimed: false, date: '2024-01-08' },
]

const SAMPLE_DISHES = [
  { id: 1, name: 'Hyderabadi Dum Biryani', restaurant: 'Paradise Restaurant', category: 'Biryani', price: 420, score: 9.4, reviews: 4200, isVeg: false, available: true },
  { id: 2, name: 'Chicken 65', restaurant: 'Paradise Restaurant', category: 'Starters', price: 280, score: 8.7, reviews: 2100, isVeg: false, available: true },
  { id: 3, name: 'Mutton Rogan Josh', restaurant: 'Paradise Restaurant', category: 'Main Course', price: 520, score: 8.5, reviews: 1800, isVeg: false, available: true },
  { id: 4, name: 'Butter Chicken', restaurant: 'Bawarchi', category: 'Main Course', price: 400, score: 8.1, reviews: 3100, isVeg: false, available: true },
  { id: 5, name: 'Dal Makhani', restaurant: 'Karim\'s', category: 'Main Course', price: 280, score: 7.6, reviews: 1500, isVeg: true, available: true },
  { id: 6, name: 'Butter Naan', restaurant: 'Shadab Restaurant', category: 'Breads', price: 60, score: 8.2, reviews: 4200, isVeg: true, available: true },
  { id: 7, name: 'Double Ka Meetha', restaurant: 'Paradise Restaurant', category: 'Desserts', price: 150, score: 8.0, reviews: 950, isVeg: true, available: true },
  { id: 8, name: 'Veg Biryani', restaurant: 'Bawarchi', category: 'Biryani', price: 320, score: 8.4, reviews: 1800, isVeg: true, available: true },
  { id: 9, name: 'Garlic Naan', restaurant: 'Paradise Restaurant', category: 'Breads', price: 80, score: 7.9, reviews: 3100, isVeg: true, available: false },
  { id: 10, name: 'Paneer Tikka', restaurant: 'Pista House', category: 'Starters', price: 300, score: 7.8, reviews: 1200, isVeg: true, available: true },
]

const SAMPLE_REVIEWS = [
  { id: 1, user: 'Arjun Mehta', dish: 'Hyderabadi Dum Biryani', restaurant: 'Paradise Restaurant', rating: 9.5, text: 'Absolutely divine! The aroma, the taste, the tenderness of the meat — everything was perfect. Best biryani in Hyderabad hands down. The saffron and spices were perfectly balanced.', hasPhoto: true, verified: true, helpful: 42, date: '2024-01-15', status: 'approved' },
  { id: 2, user: 'Priya Sharma', dish: 'Chicken 65', restaurant: 'Paradise Restaurant', rating: 8.0, text: 'Good starter, nice crispiness. Could use a bit more spice though. The serving size was decent for the price.', hasPhoto: false, verified: true, helpful: 18, date: '2024-01-14', status: 'approved' },
  { id: 3, user: 'Vikram Reddy', dish: 'Mutton Rogan Josh', restaurant: 'Paradise Restaurant', rating: 8.7, text: 'Rich and flavorful. The gravy was perfectly spiced. Would recommend this to anyone visiting Paradise.', hasPhoto: true, verified: true, helpful: 31, date: '2024-01-13', status: 'approved' },
  { id: 4, user: 'Kavita Desai', dish: 'Hyderabadi Dum Biryani', restaurant: 'Bawarchi', rating: 9.2, text: 'Consistently good. Every time I visit, the biryani is top notch. The quality never drops.', hasPhoto: false, verified: true, helpful: 27, date: '2024-01-12', status: 'approved' },
  { id: 5, user: 'Rahul Joshi', dish: 'Butter Naan', restaurant: 'Shadab Restaurant', rating: 7.5, text: 'Good bread, soft and buttery. Went well with the curries. Nothing exceptional but solid.', hasPhoto: false, verified: false, helpful: 8, date: '2024-01-11', status: 'pending' },
  { id: 6, user: 'Ananya Gupta', dish: 'Butter Chicken', restaurant: 'Bawarchi', rating: 6.0, text: 'Disappointing. The gravy was too sweet and the chicken was dry. Not what I expected from Bawarchi.', hasPhoto: true, verified: true, helpful: 24, date: '2024-01-10', status: 'flagged' },
  { id: 7, user: 'Rohit Singh', dish: 'Dal Makhani', restaurant: 'Karim\'s', rating: 7.8, text: 'Creamy and rich. Tastes like it was slow-cooked for hours. Perfect comfort food.', hasPhoto: false, verified: false, helpful: 12, date: '2024-01-09', status: 'approved' },
  { id: 8, user: 'Neha Kapoor', dish: 'Veg Biryani', restaurant: 'Bawarchi', rating: 8.4, text: 'Surprisingly good for a veg biryani. Lots of vegetables and the masala was well balanced.', hasPhoto: false, verified: true, helpful: 19, date: '2024-01-08', status: 'pending' },
  { id: 9, user: 'Amit Verma', dish: 'Chicken 65', restaurant: 'Pista House', rating: 9.0, text: 'Crispy, spicy, and absolutely addictive. The best Chicken 65 I have ever had! A must-try starter.', hasPhoto: true, verified: true, helpful: 36, date: '2024-01-07', status: 'flagged' },
  { id: 10, user: 'Sneha Patel', dish: 'Double Ka Meetha', restaurant: 'Paradise Restaurant', rating: 7.2, text: 'Nice dessert but a bit too sweet for my taste. The bread was well soaked though.', hasPhoto: false, verified: false, helpful: 5, date: '2024-01-06', status: 'deleted' },
]

const SAMPLE_USERS = [
  { id: 1, name: 'Arjun Mehta', email: 'arjun.mehta@email.com', phone: '+91 98765 43210', city: 'Hyderabad', reviews: 124, joinDate: '2023-04-12', status: 'active' as const },
  { id: 2, name: 'Priya Sharma', email: 'priya.sharma@email.com', phone: '+91 98765 43211', city: 'Mumbai', reviews: 89, joinDate: '2023-06-22', status: 'active' as const },
  { id: 3, name: 'Vikram Reddy', email: 'vikram.reddy@email.com', phone: '+91 98765 43212', city: 'Hyderabad', reviews: 156, joinDate: '2023-01-05', status: 'active' as const },
  { id: 4, name: 'Kavita Desai', email: 'kavita.desai@email.com', phone: '+91 98765 43213', city: 'Bengaluru', reviews: 67, joinDate: '2023-08-14', status: 'active' as const },
  { id: 5, name: 'Rahul Joshi', email: 'rahul.joshi@email.com', phone: '+91 98765 43214', city: 'Delhi', reviews: 203, joinDate: '2022-11-30', status: 'warned' as const },
  { id: 6, name: 'Ananya Gupta', email: 'ananya.gupta@email.com', phone: '+91 98765 43215', city: 'Pune', reviews: 45, joinDate: '2024-02-18', status: 'banned' as const },
  { id: 7, name: 'Rohit Singh', email: 'rohit.singh@email.com', phone: '+91 98765 43216', city: 'Lucknow', reviews: 92, joinDate: '2023-03-09', status: 'active' as const },
  { id: 8, name: 'Neha Kapoor', email: 'neha.kapoor@email.com', phone: '+91 98765 43217', city: 'Chennai', reviews: 178, joinDate: '2023-05-27', status: 'active' as const },
  { id: 9, name: 'Amit Verma', email: 'amit.verma@email.com', phone: '+91 98765 43218', city: 'Mumbai', reviews: 34, joinDate: '2024-03-01', status: 'warned' as const },
  { id: 10, name: 'Sneha Patel', email: 'sneha.patel@email.com', phone: '+91 98765 43219', city: 'Ahmedabad', reviews: 210, joinDate: '2022-09-15', status: 'active' as const },
]

const ACTIVITY_FEED = [
  { id: 1, type: 'review', user: 'Arjun Mehta', detail: 'Hyderabadi Dum Biryani', score: 9.5, time: '2 min ago' },
  { id: 2, type: 'restaurant', user: 'Paradise Restaurant', detail: 'New restaurant added', time: '15 min ago' },
  { id: 3, type: 'user', user: 'Sneha Patel', detail: 'New user signed up', time: '32 min ago' },
  { id: 4, type: 'flag', user: 'Ananya Gupta', detail: 'Review flagged — Butter Chicken', time: '1h ago' },
  { id: 5, type: 'claim', user: 'Pista House', detail: 'Restaurant claimed by owner', time: '2h ago' },
  { id: 6, type: 'review', user: 'Rohit Singh', detail: 'Dal Makhani', score: 7.8, time: '3h ago' },
  { id: 7, type: 'restaurant', user: 'The Spice Route', detail: 'New restaurant added', time: '5h ago' },
]

const ANALYTICS_REVIEWS = [
  { day: 'Mon', count: 180 },
  { day: 'Tue', count: 210 },
  { day: 'Wed', count: 195 },
  { day: 'Thu', count: 240 },
  { day: 'Fri', count: 310 },
  { day: 'Sat', count: 420 },
  { day: 'Sun', count: 380 },
]

const ANALYTICS_USERS = [
  { day: 'Mon', count: 45 },
  { day: 'Tue', count: 52 },
  { day: 'Wed', count: 48 },
  { day: 'Thu', count: 63 },
  { day: 'Fri', count: 71 },
  { day: 'Sat', count: 89 },
  { day: 'Sun', count: 78 },
]

const TOP_SEARCHED_DISHES = [
  { name: 'Hyderabadi Dum Biryani', searches: 12400 },
  { name: 'Chicken 65', searches: 7200 },
  { name: 'Mutton Biryani', searches: 5800 },
  { name: 'Butter Chicken', searches: 4100 },
  { name: 'Mutton Rogan Josh', searches: 3200 },
  { name: 'Gulab Jamun', searches: 2800 },
  { name: 'Paneer Tikka', searches: 2400 },
]

const REVIEWS_BY_CITY = [
  { label: 'Hyderabad', value: 84200, color: '#C8702A' },
  { label: 'Mumbai', value: 98500, color: '#E08030' },
  { label: 'Delhi', value: 105300, color: '#F0E6CE' },
  { label: 'Bengaluru', value: 76200, color: '#A08060' },
  { label: 'Others', value: 56000, color: '#6B4226' },
]

const SCORE_DISTRIBUTION = [
  { range: '0-2', count: 120 },
  { range: '2-4', count: 340 },
  { range: '4-6', count: 890 },
  { range: '6-8', count: 2450 },
  { range: '8-9', count: 3200 },
  { range: '9-10', count: 1850 },
]

/* ─── Subcomponents ────────────────────────────────────────────────────── */

/* ── SVG Bar Chart ── */
function ReviewsBarChartSVG({ data }: { data: { day: string; count: number }[] }) {
  const width = 400; const height = 200; const padding = { top: 20, right: 15, bottom: 30, left: 40 }
  const chartW = width - padding.left - padding.right; const chartH = height - padding.top - padding.bottom
  const maxCount = Math.max(...data.map(d => d.count))
  const barWidth = Math.min(chartW / data.length - 8, 36)
  const yLabels = [0, Math.round(maxCount / 2), maxCount]

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto max-h-[200px]">
      {yLabels.map(y => {
        const yPos = padding.top + chartH - (y / maxCount) * chartH
        return (
          <g key={y}>
            <line x1={padding.left} y1={yPos} x2={width - padding.right} y2={yPos} stroke="rgba(107,66,38,0.08)" strokeDasharray="4" />
            <text x={padding.left - 8} y={yPos + 4} textAnchor="end" fontSize="10" fill="#A08060">{y.toLocaleString()}</text>
          </g>
        )
      })}
      {data.map((d, i) => {
        const x = padding.left + i * (chartW / data.length) + (chartW / data.length - barWidth) / 2
        const barH = (d.count / maxCount) * chartH; const y = padding.top + chartH - barH
        return (
          <g key={i}>
            <rect x={x} y={y} width={barWidth} height={barH} rx={3} fill="#C8702A" opacity={0.85} className="transition-all" />
            <text x={x + barWidth / 2} y={y - 6} textAnchor="middle" fontSize="9" fill="#1E1208" fontWeight="600">{d.count}</text>
          </g>
        )
      })}
      {data.map((d, i) => {
        const x = padding.left + i * (chartW / data.length) + (chartW / data.length) / 2
        return <text key={i} x={x} y={height - 5} textAnchor="middle" fontSize="9" fill="#A08060">{d.day}</text>
      })}
    </svg>
  )
}

/* ── SVG Line Chart ── */
function UsersLineChartSVG({ data }: { data: { day: string; count: number }[] }) {
  const width = 400; const height = 200; const padding = { top: 20, right: 15, bottom: 30, left: 40 }
  const chartW = width - padding.left - padding.right; const chartH = height - padding.top - padding.bottom
  const maxCount = Math.max(...data.map(d => d.count)); const xStep = chartW / (data.length - 1)
  const yLabels = [0, Math.round(maxCount / 2), maxCount]

  const points = data.map((d, i) => {
    const x = padding.left + i * xStep; const y = padding.top + chartH - (d.count / maxCount) * chartH
    return `${x},${y}`
  })

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto max-h-[200px]">
      {yLabels.map(y => {
        const yPos = padding.top + chartH - (y / maxCount) * chartH
        return (
          <g key={y}>
            <line x1={padding.left} y1={yPos} x2={width - padding.right} y2={yPos} stroke="rgba(107,66,38,0.08)" strokeDasharray="4" />
            <text x={padding.left - 8} y={yPos + 4} textAnchor="end" fontSize="10" fill="#A08060">{y}</text>
          </g>
        )
      })}
      <polyline points={points.join(' ')} fill="none" stroke="#C8702A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-sm" />
      {data.map((d, i) => {
        const x = padding.left + i * xStep; const y = padding.top + chartH - (d.count / maxCount) * chartH
        return <circle key={i} cx={x} cy={y} r="3.5" fill="#C8702A" className="drop-shadow-sm" />
      })}
      {data.map((d, i) => {
        const x = padding.left + i * xStep
        return <text key={i} x={x} y={height - 5} textAnchor="middle" fontSize="9" fill="#A08060">{d.day}</text>
      })}
    </svg>
  )
}

/* ── SVG Horizontal Bar Chart ── */
function TopSearchedChartSVG({ data }: { data: { name: string; searches: number }[] }) {
  const maxVal = Math.max(...data.map(d => d.searches)); const barH = 22; const gap = 8; const totalH = data.length * (barH + gap)
  return (
    <svg viewBox={`0 0 440 ${totalH + 10}`} className="w-full h-auto">
      {data.map((d, i) => {
        const y = i * (barH + gap); const barW = (d.searches / maxVal) * 240
        return (
          <g key={i}>
            <text x={0} y={y + barH / 2 + 4} fontSize="11" fill="#1E1208" fontWeight="500">{d.name}</text>
            <rect x={180} y={y + 1} width={barW} height={barH - 2} rx={4} fill="#C8702A" opacity={0.85} />
            <text x={180 + barW + 8} y={y + barH / 2 + 4} fontSize="10" fill="#A08060" fontWeight="600">{(d.searches / 1000).toFixed(1)}K</text>
          </g>
        )
      })}
    </svg>
  )
}

/* ── SVG Donut Chart ── */
function ReviewsDonutChartSVG({ data }: { data: { label: string; value: number; color: string }[] }) {
  const total = data.reduce((a, b) => a + b.value, 0); const cx = 80; const cy = 80; const r = 60
  const circumference = 2 * Math.PI * r; let offset = 0
  const slices = data.map(d => {
    const length = (d.value / total) * circumference; const slice = { ...d, length, offset }; offset += length; return slice
  })

  return (
    <div className="flex items-center gap-6 justify-center">
      <svg viewBox="0 0 160 160" className="w-[160px] h-[160px] -rotate-90 shrink-0">
        {slices.map((s, i) => (
          <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={s.color} strokeWidth="20"
            strokeDasharray={`${s.length} ${circumference - s.length}`} strokeDashoffset={-s.offset}
            strokeLinecap="round" opacity={0.9} />
        ))}
        <circle cx={cx} cy={cy} r={r - 16} fill="#FBF6EE" />
        <text x={cx} y={cy - 2} textAnchor="middle" fontSize="20" fontWeight="bold" fill="#1E1208" transform="rotate(90, 80, 80)">{(total / 1000).toFixed(0)}K</text>
        <text x={cx} y={cy + 12} textAnchor="middle" fontSize="8" fill="#A08060" transform="rotate(90, 80, 80)">Reviews</text>
      </svg>
      <div className="space-y-2">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
            <span className="text-ink">{d.label}</span>
            <span className="text-brown-muted">{((d.value / total) * 100).toFixed(0)}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── SVG Score Distribution (bell curve bars) ── */
function ScoreDistChartSVG({ data }: { data: { range: string; count: number }[] }) {
  const maxCount = Math.max(...data.map(d => d.count))
  return (
    <svg viewBox="0 0 360 180" className="w-full h-auto max-h-[180px]">
      {data.map((d, i) => {
        const barW = 48; const maxBarH = 130; const x = 15 + i * (barW + 8)
        const barH = (d.count / maxCount) * maxBarH; const y = 160 - barH
        return (
          <g key={i}>
            <rect x={x} y={y} width={barW} height={barH} rx={4} fill="#C8702A" opacity={0.75 + (barH / maxBarH) * 0.25} />
            <text x={x + barW / 2} y={y - 5} textAnchor="middle" fontSize="9" fill="#1E1208" fontWeight="600">{d.count}</text>
            <text x={x + barW / 2} y={175} textAnchor="middle" fontSize="8" fill="#A08060">{d.range}</text>
          </g>
        )
      })}
    </svg>
  )
}

/* ── Confirm Delete Dialog ── */
function ConfirmDialog({ open, onOpenChange, title, description, onConfirm, confirmLabel, variant }: {
  open: boolean; onOpenChange: (v: boolean) => void; title: string; description: string;
  onConfirm: () => void; confirmLabel?: string; variant?: 'danger' | 'warning'
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className={cn('w-10 h-10 rounded-full flex items-center justify-center', variant === 'danger' ? 'bg-red-100' : 'bg-amber-100')}>
              <AlertTriangle className={cn('w-5 h-5', variant === 'danger' ? 'text-red-600' : 'text-amber-600')} />
            </div>
            <DialogTitle className="font-serif text-lg text-ink">{title}</DialogTitle>
          </div>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            className={variant === 'danger' ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-amber-600 hover:bg-amber-700 text-white'}
            onClick={() => { onConfirm(); onOpenChange(false) }}
          >
            {confirmLabel || 'Confirm'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

/* ── Status Badge ── */
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; className: string }> = {
    active: { label: 'Active', className: 'bg-green-100 text-green-700' },
    warned: { label: 'Warned', className: 'bg-amber-100 text-amber-700' },
    banned: { label: 'Banned', className: 'bg-red-100 text-red-700' },
    verified: { label: 'Verified', className: 'bg-green-100 text-green-700' },
    unverified: { label: 'Unverified', className: 'bg-brown-muted/10 text-brown-muted' },
    claimed: { label: 'Claimed', className: 'bg-blue-100 text-blue-700' },
    approved: { label: 'Approved', className: 'bg-green-100 text-green-700' },
    pending: { label: 'Pending', className: 'bg-amber-100 text-amber-700' },
    flagged: { label: 'Flagged', className: 'bg-red-100 text-red-700' },
    deleted: { label: 'Deleted', className: 'bg-gray-100 text-gray-500' },
    'coming soon': { label: 'Coming Soon', className: 'bg-blue-100 text-blue-700' },
  }
  const s = map[status] || { label: status, className: 'bg-brown-muted/10 text-brown-muted' }
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded-full', s.className)}>
      {s.label}
    </span>
  )
}

/* ── Review Status Tabs ── */
const REVIEW_TABS = ['All', 'Pending', 'Approved', 'Flagged', 'Deleted']

/* ── Restaurant Filters ── */
const RESTAURANT_FILTERS = ['All', 'Verified', 'Unverified', 'Claimed', 'Flagged']
const RESTAURANT_SORTS = ['Newest', 'Highest Score', 'Most Reviews']

/* ── Main Page ─────────────────────────────────────────────────────────── */
export default function AdminPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading, user, signOut } = useStore()

  const [activeTab, setActiveTab] = useState('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [renderKey, setRenderKey] = useState(0)

  // Overview
  const [showPendingDialog, setShowPendingDialog] = useState(false)

  // Restaurants
  const [restSearch, setRestSearch] = useState('')
  const [restFilter, setRestFilter] = useState('All')
  const [restSort, setRestSort] = useState('Newest')
  const [selectedRestaurants, setSelectedRestaurants] = useState<number[]>([])
  const [showAddRestaurant, setShowAddRestaurant] = useState(false)
  const [editRestaurant, setEditRestaurant] = useState<typeof SAMPLE_RESTAURANTS[0] | null>(null)
  const [showDeleteRestaurant, setShowDeleteRestaurant] = useState(false)
  const [deleteRestaurantId, setDeleteRestaurantId] = useState<number | null>(null)
  const [showBulkDelete, setShowBulkDelete] = useState(false)

  // Dishes
  const [dishSearch, setDishSearch] = useState('')
  const [dishFilterRest, setDishFilterRest] = useState('All')
  const [dishFilterCat, setDishFilterCat] = useState('All')
  const [dishFilterVeg, setDishFilterVeg] = useState('All')
  const [dishSort, setDishSort] = useState('Highest Score')
  const [showAddDish, setShowAddDish] = useState(false)
  const [editDish, setEditDish] = useState<typeof SAMPLE_DISHES[0] | null>(null)
  const [showDeleteDish, setShowDeleteDish] = useState(false)
  const [deleteDishId, setDeleteDishId] = useState<number | null>(null)

  // Reviews
  const [reviewTab, setReviewTab] = useState('All')
  const [selectedReviews, setSelectedReviews] = useState<number[]>([])
  const [expandedReview, setExpandedReview] = useState<number | null>(null)
  const [showDeleteReview, setShowDeleteReview] = useState(false)
  const [deleteReviewId, setDeleteReviewId] = useState<number | null>(null)

  // Users
  const [userSearch, setUserSearch] = useState('')
  const [selectedUser, setSelectedUser] = useState<typeof SAMPLE_USERS[0] | null>(null)
  const [showUserModal, setShowUserModal] = useState(false)
  const [showWarnUser, setShowWarnUser] = useState(false)
  const [showBanUser, setShowBanUser] = useState(false)
  const [warnUserId, setWarnUserId] = useState<number | null>(null)
  const [banUserId, setBanUserId] = useState<number | null>(null)

  // Cities
  const [cities, setCities] = useState(CITY_DATA)
  const [showAddCity, setShowAddCity] = useState(false)

  // Analytics
  const [analyticsPeriod, setAnalyticsPeriod] = useState('7d')

  // Settings
  const [siteName, setSiteName] = useState('DishCritic')
  const [siteUrl, setSiteUrl] = useState('https://dishcritic.com')
  const [contactEmail, setContactEmail] = useState('hello@dishcritic.com')
  const [reviewApproval, setReviewApproval] = useState(false)
  const [restApproval, setRestApproval] = useState(true)
  const [minLeaderboardReviews, setMinLeaderboardReviews] = useState('10')
  const [featuredCities, setFeaturedCities] = useState<string[]>(['Hyderabad', 'Mumbai', 'Delhi', 'Bengaluru'])
  const [showClearData, setShowClearData] = useState(false)
  const [showResetLeaderboards, setShowResetLeaderboards] = useState(false)

  // Auth redirect
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth')
    }
  }, [isLoading, isAuthenticated, router])

  // Re-animate on tab change
  useEffect(() => { setRenderKey(k => k + 1) }, [activeTab])

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  // Reviews data (mutable)
  const [reviews, setReviews] = useState(SAMPLE_REVIEWS)

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FBF6EE] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-saffron border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-brown-muted">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  /* ── Filtered Data ── */
  const filteredRestaurants = SAMPLE_RESTAURANTS.filter(r => {
    if (restFilter === 'Verified' && !r.verified) return false
    if (restFilter === 'Unverified' && r.verified) return false
    if (restFilter === 'Claimed' && !r.claimed) return false
    if (restFilter === 'Flagged') return false
    if (restSearch && !r.name.toLowerCase().includes(restSearch.toLowerCase()) && !r.city.toLowerCase().includes(restSearch.toLowerCase())) return false
    return true
  }).sort((a, b) => {
    if (restSort === 'Highest Score') return b.score - a.score
    if (restSort === 'Most Reviews') return b.reviews - a.reviews
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })

  const filteredDishes = SAMPLE_DISHES.filter(d => {
    if (dishFilterRest !== 'All' && d.restaurant !== dishFilterRest) return false
    if (dishFilterCat !== 'All' && d.category !== dishFilterCat) return false
    if (dishFilterVeg === 'Veg' && !d.isVeg) return false
    if (dishFilterVeg === 'Non-Veg' && d.isVeg) return false
    if (dishSearch && !d.name.toLowerCase().includes(dishSearch.toLowerCase())) return false
    return true
  }).sort((a, b) => {
    if (dishSort === 'Highest Score') return b.score - a.score
    if (dishSort === 'Most Reviews') return b.reviews - a.reviews
    return 0
  })

  const filteredReviews = reviews.filter(r => {
    if (reviewTab === 'All') return true
    return r.status === reviewTab.toLowerCase()
  })

  const filteredUsers = SAMPLE_USERS.filter(u => {
    if (!userSearch) return true
    const q = userSearch.toLowerCase()
    return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.phone.includes(q)
  })

  /* ── Section Renderers ── */
  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return <OverviewSection />
      case 'restaurants': return <RestaurantsSection />
      case 'dishes': return <DishesSection />
      case 'reviews': return <ReviewsSection />
      case 'users': return <UsersSection />
      case 'cities': return <CitiesSection />
      case 'analytics': return <AnalyticsSection />
      case 'settings': return <SettingsSection />
      default: return <OverviewSection />
    }
  }

  /* ── OVERVIEW ────────────────────────────────────────────────────────── */
  const OverviewSection = () => (
    <div className="space-y-8 animate-fade-in">
      {/* Platform Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: 'Total Restaurants', value: '18,420' },
          { label: 'Total Dishes', value: '142,300' },
          { label: 'Total Reviews', value: '420,150' },
          { label: 'Total Users', value: '210,000' },
          { label: 'Reviews Today', value: '1,240' },
          { label: 'New Restaurants This Week', value: '34' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-xl border border-brown-muted/10 p-5 hover:shadow-sm transition-shadow">
            <p className="text-xs text-brown-muted font-medium mb-2">{stat.label}</p>
            <p className="font-serif text-3xl font-bold text-ink">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-brown-muted/10 p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-serif text-lg font-bold text-ink flex items-center gap-2">
              <Bell className="w-4 h-4 text-saffron" />
              Recent Activity
            </h3>
          </div>
          <div className="space-y-0 divide-y divide-brown-muted/10">
            {ACTIVITY_FEED.map((item) => (
              <div key={item.id} className="flex items-start gap-3 py-3">
                <div className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center shrink-0',
                  item.type === 'review' ? 'bg-green-100' : item.type === 'restaurant' ? 'bg-blue-100' : item.type === 'user' ? 'bg-purple-100' : item.type === 'flag' ? 'bg-red-100' : 'bg-amber-100'
                )}>
                  {item.type === 'review' ? <Star className="w-3.5 h-3.5 text-green-600" /> :
                   item.type === 'restaurant' ? <Store className="w-3.5 h-3.5 text-blue-600" /> :
                   item.type === 'user' ? <Users className="w-3.5 h-3.5 text-purple-600" /> :
                   item.type === 'flag' ? <Flag className="w-3.5 h-3.5 text-red-600" /> :
                   <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />}
                </div>                <div className="flex-1 min-w-0">
                      <p className="text-sm text-ink">
                        <span className="font-medium">{item.user}</span>
                        {item.type === 'review' ? <> reviewed <span className="text-saffron font-medium">{item.detail}</span></> :
                         item.type === 'restaurant' ? <> — {item.detail}</> :
                         item.type === 'user' ? <> — {item.detail}</> :
                         item.type === 'flag' ? <> — {item.detail}</> :
                         <> — {item.detail}</>}
                      </p>
                      {item.score && <span className="text-xs font-bold text-saffron">{item.score.toFixed(1)}/10</span>}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] text-brown-muted">{item.time}</span>
                      <Button size="sm" variant="ghost" className="h-6 text-[10px] px-2">View</Button>
                    </div>
              </div>
            ))}
          </div>
        </div>

        {/* Needs Attention */}
        <div className="bg-white rounded-xl border border-brown-muted/10 p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-serif text-lg font-bold text-ink flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              Needs Attention
            </h3>
          </div>
          <div className="space-y-4">
            {[
              { label: 'Flagged Reviews', count: 12, desc: 'Reviews reported by users', urgent: true },
              { label: 'Pending Verifications', count: 8, desc: 'Restaurants awaiting verification', urgent: true },
              { label: 'Unmoderated Restaurants', count: 5, desc: 'New restaurants not yet reviewed', urgent: true },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-red-50/50 border border-red-100">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <div>
                    <p className="text-sm font-medium text-ink">{item.label}</p>
                    <p className="text-xs text-brown-muted">{item.desc}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-serif text-xl font-bold text-red-600">{item.count}</span>
                  <Button size="sm" variant="outline" className="text-xs">Review</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  /* ── RESTAURANTS ──────────────────────────────────────────────────────── */
  const RestaurantsSection = () => (
    <div className="space-y-6 animate-fade-in">
      {/* Search + Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brown-muted" />
          <Input
            value={restSearch}
            onChange={e => setRestSearch(e.target.value)}
            placeholder="Search by name or city..."
            className="pl-9"
          />
        </div>
        <div className="flex bg-cream-dark rounded-lg p-1">
          {RESTAURANT_FILTERS.map(f => (
            <button key={f} onClick={() => setRestFilter(f)}
              className={cn('px-3 py-1.5 text-xs font-medium rounded-md transition-all', restFilter === f ? 'bg-white text-ink shadow-sm' : 'text-brown-muted hover:text-ink')}>
              {f}
            </button>
          ))}
        </div>
        <select value={restSort} onChange={e => setRestSort(e.target.value)}
          className="h-9 px-3 text-xs rounded-lg border border-brown-muted/20 bg-white text-ink focus:outline-none focus:ring-2 focus:ring-saffron">
          {RESTAURANT_SORTS.map(s => <option key={s}>{s}</option>)}
        </select>
        <div className="flex items-center gap-2 ml-auto">
          {selectedRestaurants.length > 0 && (
            <>
              <Button size="sm" variant="outline" className="text-xs gap-1" onClick={() => { /* bulk verify */ setSelectedRestaurants([]) }}>
                <Check className="w-3 h-3" /> Verify ({selectedRestaurants.length})
              </Button>
              <Button size="sm" variant="outline" className="text-xs gap-1 text-red-600 border-red-200 hover:bg-red-50" onClick={() => setShowBulkDelete(true)}>
                <Trash2 className="w-3 h-3" /> Delete ({selectedRestaurants.length})
              </Button>
            </>
          )}
          <Button className="bg-saffron hover:bg-saffron-light text-cream gap-1" onClick={() => { setEditRestaurant(null); setShowAddRestaurant(true) }}>
            <Plus className="w-4 h-4" /> Add Restaurant
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-brown-muted/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brown-muted/10 bg-cream-dark/50">
                <th className="w-10 px-3 py-3">                    <input type="checkbox" aria-label="Select all restaurants"
                    onChange={e => setSelectedRestaurants(e.target.checked ? filteredRestaurants.map(r => r.id) : [])}
                    checked={selectedRestaurants.length === filteredRestaurants.length && filteredRestaurants.length > 0}
                    className="rounded border-brown-muted/40 accent-saffron" />
                </th>
                <th className="text-left px-3 py-3 text-xs font-medium text-brown-muted">Restaurant</th>
                <th className="text-left px-3 py-3 text-xs font-medium text-brown-muted">Cuisine</th>
                <th className="text-center px-3 py-3 text-xs font-medium text-brown-muted">Score</th>
                <th className="text-center px-3 py-3 text-xs font-medium text-brown-muted">Reviews</th>
                <th className="text-center px-3 py-3 text-xs font-medium text-brown-muted">Verified</th>
                <th className="text-center px-3 py-3 text-xs font-medium text-brown-muted">Claimed</th>
                <th className="text-left px-3 py-3 text-xs font-medium text-brown-muted">Added</th>
                <th className="text-right px-3 py-3 text-xs font-medium text-brown-muted">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brown-muted/10">
              {filteredRestaurants.map(r => (
                <tr key={r.id} className="hover:bg-cream-dark/30 transition-colors">
                  <td className="px-3 py-3">
                    <input type="checkbox"
                      checked={selectedRestaurants.includes(r.id)}
                      onChange={e => setSelectedRestaurants(prev => e.target.checked ? [...prev, r.id] : prev.filter(id => id !== r.id))}
                      className="rounded border-brown-muted/40 accent-saffron" />
                  </td>
                  <td className="px-3 py-3">
                    <div>
                      <p className="text-sm font-medium text-ink">{r.name}</p>
                      <p className="text-xs text-brown-muted">{r.city}</p>
                    </div>
                  </td>
                  <td className="px-3 py-3"><span className="text-xs text-ink">{r.cuisine}</span></td>
                  <td className="px-3 py-3 text-center"><span className="text-sm font-bold text-saffron">{r.score.toFixed(1)}</span></td>
                  <td className="px-3 py-3 text-center text-xs text-brown-muted">{r.reviews.toLocaleString()}</td>
                  <td className="px-3 py-3 text-center">
                    <button onClick={() => { /* toggle verify */ }} aria-label={`Toggle verified status for ${r.name}`} className="inline-flex items-center gap-1">
                      {r.verified ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : <CircleDot className="w-4 h-4 text-brown-muted" />}
                    </button>
                  </td>
                  <td className="px-3 py-3 text-center"><StatusBadge status={r.claimed ? 'claimed' : 'unverified'} /></td>
                  <td className="px-3 py-3 text-xs text-brown-muted">{r.date}</td>
                  <td className="px-3 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><Eye className="w-3.5 h-3.5" /></Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0"
                        onClick={() => { setEditRestaurant(r); setShowAddRestaurant(true) }}>
                        <Edit3 className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => { setDeleteRestaurantId(r.id); setShowDeleteRestaurant(true) }}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Restaurant Modal */}
      <AddRestaurantModal open={showAddRestaurant} onOpenChange={setShowAddRestaurant} editRestaurant={editRestaurant} />
      <ConfirmDialog open={showDeleteRestaurant} onOpenChange={setShowDeleteRestaurant}
        title="Delete Restaurant" description="Are you sure you want to delete this restaurant? This action cannot be undone."
        onConfirm={() => {}} confirmLabel="Delete" variant="danger" />
      <ConfirmDialog open={showBulkDelete} onOpenChange={setShowBulkDelete}
        title="Bulk Delete" description={`Are you sure you want to delete ${selectedRestaurants.length} restaurants? This action cannot be undone.`}
        onConfirm={() => setSelectedRestaurants([])} confirmLabel={`Delete ${selectedRestaurants.length}`} variant="danger" />
    </div>
  )

  /* ── DISHES ────────────────────────────────────────────────────────────── */
  const DishesSection = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brown-muted" />
          <Input value={dishSearch} onChange={e => setDishSearch(e.target.value)} placeholder="Search by dish name..." className="pl-9" />
        </div>
        <select value={dishFilterRest} onChange={e => setDishFilterRest(e.target.value)}
          className="h-9 px-3 text-xs rounded-lg border border-brown-muted/20 bg-white text-ink focus:outline-none focus:ring-2 focus:ring-saffron">
          <option value="All">All Restaurants</option>
          {[...new Set(SAMPLE_DISHES.map(d => d.restaurant))].map(r => <option key={r}>{r}</option>)}
        </select>
        <select value={dishFilterCat} onChange={e => setDishFilterCat(e.target.value)}
          className="h-9 px-3 text-xs rounded-lg border border-brown-muted/20 bg-white text-ink focus:outline-none focus:ring-2 focus:ring-saffron">
          <option value="All">All Categories</option>
          {CATEGORY_OPTIONS.map(c => <option key={c}>{c}</option>)}
        </select>
        <select value={dishFilterVeg} onChange={e => setDishFilterVeg(e.target.value)}
          className="h-9 px-3 text-xs rounded-lg border border-brown-muted/20 bg-white text-ink focus:outline-none focus:ring-2 focus:ring-saffron">
          <option value="All">All Types</option>
          <option value="Veg">Veg</option>
          <option value="Non-Veg">Non-Veg</option>
        </select>
        <select value={dishSort} onChange={e => setDishSort(e.target.value)}
          className="h-9 px-3 text-xs rounded-lg border border-brown-muted/20 bg-white text-ink focus:outline-none focus:ring-2 focus:ring-saffron">
          <option>Highest Score</option>
          <option>Most Reviews</option>
          <option>Newest</option>
        </select>
        <Button className="bg-saffron hover:bg-saffron-light text-cream gap-1 ml-auto" onClick={() => { setEditDish(null); setShowAddDish(true) }}>
          <Plus className="w-4 h-4" /> Add Dish
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-brown-muted/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brown-muted/10 bg-cream-dark/50">
                <th className="text-left px-4 py-3 text-xs font-medium text-brown-muted">Dish</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-brown-muted">Restaurant</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-brown-muted">Category</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-brown-muted">Price</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-brown-muted">Score</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-brown-muted">Reviews</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-brown-muted">Type</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-brown-muted">Available</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-brown-muted">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brown-muted/10">
              {filteredDishes.map(d => (
                <tr key={d.id} className="hover:bg-cream-dark/30 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-ink">{d.name}</td>
                  <td className="px-4 py-3 text-xs text-brown-muted">{d.restaurant}</td>
                  <td className="px-4 py-3"><Badge variant="secondary" className="text-[10px]">{d.category}</Badge></td>
                  <td className="px-4 py-3 text-right text-sm text-ink">₹{d.price}</td>
                  <td className="px-4 py-3 text-center"><span className="text-sm font-bold text-saffron">{d.score.toFixed(1)}</span></td>
                  <td className="px-4 py-3 text-center text-xs text-brown-muted">{d.reviews.toLocaleString()}</td>
                  <td className="px-4 py-3 text-center">
                    <Badge variant={d.isVeg ? 'veg' : 'nonveg'} className="text-[10px] px-1.5 py-0">{d.isVeg ? 'Veg' : 'NV'}</Badge>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button role="switch" aria-checked={d.available} aria-label={`${d.name} availability`}
                      className={cn('relative inline-flex h-5 w-9 items-center rounded-full transition-colors', d.available ? 'bg-green-500' : 'bg-brown-muted/30')}>
                      <span className={cn('inline-block h-4 w-4 rounded-full bg-white transition-transform shadow-sm', d.available ? 'translate-x-[18px]' : 'translate-x-[2px]')} />
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0"
                        onClick={() => { setEditDish(d); setShowAddDish(true) }}>
                        <Edit3 className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => { setDeleteDishId(d.id); setShowDeleteDish(true) }}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Dish Modal */}
      <AddDishModal open={showAddDish} onOpenChange={setShowAddDish} editDish={editDish} />
      <ConfirmDialog open={showDeleteDish} onOpenChange={setShowDeleteDish}
        title="Delete Dish" description="Are you sure you want to delete this dish? This action cannot be undone."
        onConfirm={() => {}} confirmLabel="Delete" variant="danger" />
    </div>
  )

  /* ── REVIEWS ──────────────────────────────────────────────────────────── */
  const ReviewsSection = () => (
    <div className="space-y-6 animate-fade-in">
      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex bg-cream-dark rounded-lg p-1">
          {REVIEW_TABS.map(tab => (
            <button key={tab} onClick={() => setReviewTab(tab)}
              className={cn('px-3.5 py-1.5 text-xs font-medium rounded-md transition-all', reviewTab === tab ? 'bg-white text-ink shadow-sm' : 'text-brown-muted hover:text-ink')}>
              {tab}
              {tab === 'Flagged' && <span className="ml-1 text-red-500">(2)</span>}
            </button>
          ))}
        </div>
        {selectedReviews.length > 0 && (
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" className="text-xs gap-1" onClick={() => { setReviews(prev => prev.map(r => selectedReviews.includes(r.id) ? { ...r, status: 'approved' } : r)); setSelectedReviews([]) }}>
              <Check className="w-3 h-3" /> Approve ({selectedReviews.length})
            </Button>
            <Button size="sm" variant="outline" className="text-xs gap-1 text-red-600 border-red-200 hover:bg-red-50" onClick={() => { setReviews(prev => prev.map(r => selectedReviews.includes(r.id) ? { ...r, status: 'flagged' } : r)); setSelectedReviews([]) }}>
              <Flag className="w-3 h-3" /> Flag ({selectedReviews.length})
            </Button>
            <Button size="sm" variant="outline" className="text-xs gap-1 text-red-600 border-red-200 hover:bg-red-50" onClick={() => setShowDeleteReview(true)}>
              <Trash2 className="w-3 h-3" /> Delete ({selectedReviews.length})
            </Button>
          </div>
        )}
      </div>

      {/* Flagged Reviews Section */}
      {reviewTab === 'All' || reviewTab === 'Flagged' ? (
        <div className="bg-red-50/50 rounded-xl border border-red-200 p-5">
          <h4 className="text-sm font-bold text-red-700 flex items-center gap-2 mb-4">
            <Flag className="w-4 h-4" /> Flagged Reviews
          </h4>
          <div className="space-y-3">
            {reviews.filter(r => r.status === 'flagged').map(r => (
              <div key={r.id} className="bg-white rounded-lg border border-red-200 p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm font-semibold text-ink">{r.user}</p>
                    <p className="text-xs text-brown-muted">Reviewed: {r.dish} at {r.restaurant}</p>
                  </div>
                  <span className="text-xs text-red-600 font-medium">Flagged</span>
                </div>
                <p className="text-sm text-ink/80 mb-2">&ldquo;{r.text}&rdquo;</p>
                <div className="flex items-center gap-3 text-[10px] text-brown-muted mb-3">
                  <span>Reported by: User #4821</span>
                  <span>Date: 2024-01-11</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white text-xs gap-1"
                    onClick={() => setReviews(prev => prev.map(rev => rev.id === r.id ? { ...rev, status: 'approved' } : rev))}>
                    <Check className="w-3 h-3" /> Keep Review
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs border-red-200 text-red-600 hover:bg-red-50 gap-1"
                    onClick={() => setReviews(prev => prev.map(rev => rev.id === r.id ? { ...rev, status: 'deleted' } : rev))}>
                    <Trash2 className="w-3 h-3" /> Delete Review
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs gap-1"><AlertTriangle className="w-3 h-3" /> Warn User</Button>
                  <Button size="sm" variant="outline" className="text-xs gap-1 text-red-600"><ShieldAlert className="w-3 h-3" /> Ban User</Button>
                </div>
              </div>
            ))}
            {reviews.filter(r => r.status === 'flagged').length === 0 && (
              <p className="text-sm text-brown-muted text-center py-4">No flagged reviews.</p>
            )}
          </div>
        </div>
      ) : null}

      {/* Reviews Table */}
      <div className="bg-white rounded-xl border border-brown-muted/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brown-muted/10 bg-cream-dark/50">
                <th className="w-10 px-3 py-3">                    <input type="checkbox" aria-label="Select all reviews"
                    onChange={e => setSelectedReviews(e.target.checked ? filteredReviews.map(r => r.id) : [])}
                    checked={selectedReviews.length === filteredReviews.length && filteredReviews.length > 0}
                    className="rounded border-brown-muted/40 accent-saffron" />
                </th>
                <th className="text-left px-3 py-3 text-xs font-medium text-brown-muted">Reviewer</th>
                <th className="text-left px-3 py-3 text-xs font-medium text-brown-muted">Dish / Restaurant</th>
                <th className="text-center px-3 py-3 text-xs font-medium text-brown-muted">Rating</th>
                <th className="text-left px-3 py-3 text-xs font-medium text-brown-muted">Review</th>
                <th className="text-center px-3 py-3 text-xs font-medium text-brown-muted">Photo</th>
                <th className="text-center px-3 py-3 text-xs font-medium text-brown-muted">Verified</th>
                <th className="text-center px-3 py-3 text-xs font-medium text-brown-muted">Helpful</th>
                <th className="text-left px-3 py-3 text-xs font-medium text-brown-muted">Date</th>
                <th className="text-center px-3 py-3 text-xs font-medium text-brown-muted">Status</th>
                <th className="text-right px-3 py-3 text-xs font-medium text-brown-muted">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brown-muted/10">
              {filteredReviews.map(r => (
                <tr key={r.id} className="hover:bg-cream-dark/30 transition-colors">
                  <td className="px-3 py-3">
                    <input type="checkbox" checked={selectedReviews.includes(r.id)}
                      onChange={e => setSelectedReviews(prev => e.target.checked ? [...prev, r.id] : prev.filter(id => id !== r.id))}
                      className="rounded border-brown-muted/40 accent-saffron" />
                  </td>
                  <td className="px-3 py-3 text-sm font-medium text-ink">{r.user}</td>
                  <td className="px-3 py-3">
                    <p className="text-sm text-ink">{r.dish}</p>
                    <p className="text-xs text-brown-muted">{r.restaurant}</p>
                  </td>
                  <td className="px-3 py-3 text-center"><span className="text-sm font-bold text-saffron">{r.rating.toFixed(1)}</span></td>
                  <td className="px-3 py-3 max-w-[200px]">
                    <button onClick={() => setExpandedReview(expandedReview === r.id ? null : r.id)} className="text-left">
                      <p className={cn('text-xs text-ink/80', expandedReview !== r.id && 'line-clamp-1')}>{r.text}</p>
                    </button>
                  </td>
                  <td className="px-3 py-3 text-center">
                    {r.hasPhoto ? <Camera className="w-4 h-4 text-saffron mx-auto" /> : <span className="text-brown-muted text-xs">—</span>}
                  </td>
                  <td className="px-3 py-3 text-center">
                    {r.verified ? <CheckCircle2 className="w-4 h-4 text-green-600 mx-auto" /> : <XIcon className="w-4 h-4 text-brown-muted mx-auto" />}
                  </td>
                  <td className="px-3 py-3 text-center text-xs text-ink">{r.helpful}</td>
                  <td className="px-3 py-3 text-xs text-brown-muted">{r.date}</td>
                  <td className="px-3 py-3 text-center"><StatusBadge status={r.status} /></td>
                  <td className="px-3 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {r.status === 'pending' && (
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-green-600"
                          onClick={() => setReviews(prev => prev.map(rev => rev.id === r.id ? { ...rev, status: 'approved' } : rev))}>
                          <Check className="w-3.5 h-3.5" />
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-amber-600"
                        onClick={() => setReviews(prev => prev.map(rev => rev.id === r.id ? { ...rev, status: 'flagged' } : rev))}>
                        <Flag className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-red-500"
                        onClick={() => setReviews(prev => prev.map(rev => rev.id === r.id ? { ...rev, status: 'deleted' } : rev))}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog open={showDeleteReview} onOpenChange={setShowDeleteReview}
        title="Delete Reviews" description={`Are you sure you want to delete ${selectedReviews.length} reviews? This action cannot be undone.`}
        onConfirm={() => { setReviews(prev => prev.filter(r => !selectedReviews.includes(r.id))); setSelectedReviews([]) }}
        confirmLabel={`Delete ${selectedReviews.length}`} variant="danger" />
    </div>
  )

  /* ── USERS ────────────────────────────────────────────────────────────── */
  const UsersSection = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brown-muted" />
        <Input value={userSearch} onChange={e => setUserSearch(e.target.value)} placeholder="Search by name, email, or phone..." className="pl-9" />
      </div>

      <div className="bg-white rounded-xl border border-brown-muted/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brown-muted/10 bg-cream-dark/50">
                <th className="text-left px-4 py-3 text-xs font-medium text-brown-muted">User</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-brown-muted">Email / Phone</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-brown-muted">City</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-brown-muted">Reviews</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-brown-muted">Joined</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-brown-muted">Status</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-brown-muted">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brown-muted/10">
              {filteredUsers.map(u => (
                <tr key={u.id} className="hover:bg-cream-dark/30 transition-colors cursor-pointer" onClick={() => { setSelectedUser(u); setShowUserModal(true) }}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-saffron/10 text-saffron text-xs font-bold">{u.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium text-ink">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-ink">{u.email}</p>
                    <p className="text-xs text-brown-muted">{u.phone}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-ink">{u.city}</td>
                  <td className="px-4 py-3 text-center text-sm text-ink">{u.reviews}</td>
                  <td className="px-4 py-3 text-sm text-brown-muted">{u.joinDate}</td>
                  <td className="px-4 py-3 text-center"><StatusBadge status={u.status} /></td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1" onClick={e => e.stopPropagation()}>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><Eye className="w-3.5 h-3.5" /></Button>
                      {u.status === 'active' && (
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-amber-600"
                          onClick={() => { setWarnUserId(u.id); setShowWarnUser(true) }}>                           <AlertTriangle className="w-3.5 h-3.5" />
                        </Button>
                      )}
                      {u.status !== 'banned' && (
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500"
                          onClick={() => { setBanUserId(u.id); setShowBanUser(true) }}>
                          <ShieldAlert className="w-3.5 h-3.5" />
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500"><Trash2 className="w-3.5 h-3.5" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Detail Modal */}
      <UserDetailModal open={showUserModal} onOpenChange={setShowUserModal} user={selectedUser} />
      <ConfirmDialog open={showWarnUser} onOpenChange={setShowWarnUser}
        title="Warn User" description="Send a warning to this user for violating community guidelines."
        onConfirm={() => {}} confirmLabel="Send Warning" variant="warning" />
      <ConfirmDialog open={showBanUser} onOpenChange={setShowBanUser}
        title="Ban User" description="Are you sure you want to ban this user? They will not be able to post reviews or access their account."
        onConfirm={() => {}} confirmLabel="Ban User" variant="danger" />
    </div>
  )

  /* ── CITIES ───────────────────────────────────────────────────────────── */
  const CitiesSection = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-end">
        <Button className="bg-saffron hover:bg-saffron-light text-cream gap-1" onClick={() => setShowAddCity(true)}>
          <Plus className="w-4 h-4" /> Add City
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-brown-muted/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brown-muted/10 bg-cream-dark/50">
                <th className="text-left px-4 py-3 text-xs font-medium text-brown-muted">City</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-brown-muted">State</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-brown-muted">Restaurants</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-brown-muted">Reviews</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-brown-muted">Status</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-brown-muted">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brown-muted/10">
              {cities.map((c, i) => (
                <tr key={i} className="hover:bg-cream-dark/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{c.emoji}</span>
                      <span className="text-sm font-medium text-ink">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-brown-muted">{c.state}</td>
                  <td className="px-4 py-3 text-center text-sm text-ink">{c.restaurants.toLocaleString()}</td>
                  <td className="px-4 py-3 text-center text-sm text-ink">{c.reviews.toLocaleString()}</td>
                  <td className="px-4 py-3 text-center">
                    <StatusBadge status={c.active ? 'verified' : 'coming soon'} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><Edit3 className="w-3.5 h-3.5" /></Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 gap-1 text-xs"
                        onClick={() => setCities(prev => prev.map((city, idx) => idx === i ? { ...city, active: !city.active } : city))}>
                        {c.active ? <ToggleRight className="w-4 h-4 text-green-600" /> : <ToggleLeft className="w-4 h-4 text-brown-muted" />}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add City Modal */}
      <AddCityModal open={showAddCity} onOpenChange={setShowAddCity} />
    </div>
  )

  /* ── ANALYTICS ────────────────────────────────────────────────────────── */
  const AnalyticsSection = () => (
    <div className="space-y-6 animate-fade-in">
      {/* Time Filter */}
      <div className="flex items-center gap-2">
        {['7d', '30d', '90d', '1yr'].map(p => (
          <button key={p} onClick={() => setAnalyticsPeriod(p)}
            className={cn('px-3.5 py-1.5 text-xs font-medium rounded-lg border transition-all',
              analyticsPeriod === p ? 'bg-saffron text-cream border-saffron' : 'bg-white text-brown-muted border-brown-muted/20 hover:border-saffron/40 hover:text-saffron')}>
            {p}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2">
          <Button size="sm" variant="outline" className="text-xs gap-1"><Download className="w-3 h-3" /> Export Restaurants</Button>
          <Button size="sm" variant="outline" className="text-xs gap-1"><Download className="w-3 h-3" /> Export Reviews</Button>
          <Button size="sm" variant="outline" className="text-xs gap-1"><Download className="w-3 h-3" /> Export Users</Button>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: 'Total Reviews', value: (420150).toLocaleString(), change: '+12%' },
          { label: 'Active Users', value: (210000).toLocaleString(), change: '+8%' },
          { label: 'Avg. Rating', value: '8.4', change: '+0.2' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-xl border border-brown-muted/10 p-5">
            <p className="text-xs text-brown-muted font-medium mb-1">{stat.label}</p>
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-2xl font-bold text-ink">{stat.value}</span>
              <span className="text-xs text-green-600 font-medium">{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-brown-muted/10 p-6">
          <h3 className="font-serif text-base font-bold text-ink mb-4">Reviews Per Day</h3>
          <ReviewsBarChartSVG data={ANALYTICS_REVIEWS} />
        </div>
        <div className="bg-white rounded-xl border border-brown-muted/10 p-6">
          <h3 className="font-serif text-base font-bold text-ink mb-4">New Users Per Day</h3>
          <UsersLineChartSVG data={ANALYTICS_USERS} />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-brown-muted/10 p-6">
          <h3 className="font-serif text-base font-bold text-ink mb-4">Top Searched Dishes</h3>
          <TopSearchedChartSVG data={TOP_SEARCHED_DISHES} />
        </div>
        <div className="bg-white rounded-xl border border-brown-muted/10 p-6">
          <h3 className="font-serif text-base font-bold text-ink mb-4">Reviews by City</h3>
          <ReviewsDonutChartSVG data={REVIEWS_BY_CITY} />
        </div>
        <div className="bg-white rounded-xl border border-brown-muted/10 p-6">
          <h3 className="font-serif text-base font-bold text-ink mb-4">Score Distribution</h3>
          <ScoreDistChartSVG data={SCORE_DISTRIBUTION} />
        </div>
      </div>
    </div>
  )

  /* ── SETTINGS ─────────────────────────────────────────────────────────── */
  const SettingsSection = () => (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-white rounded-xl border border-brown-muted/10 p-6">
        <h3 className="font-serif text-lg font-bold text-ink mb-5">Site Settings</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-ink mb-1.5">Site Name</label>
            <Input value={siteName} onChange={e => setSiteName(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-medium text-ink mb-1.5">Site URL</label>
            <Input value={siteUrl} onChange={e => setSiteUrl(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-medium text-ink mb-1.5">Contact Email</label>
            <Input value={contactEmail} onChange={e => setContactEmail(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-medium text-ink mb-1.5">Minimum Reviews for Leaderboard</label>
            <Input type="number" value={minLeaderboardReviews} onChange={e => setMinLeaderboardReviews(e.target.value)} />
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-brown-muted/10">
            <div>
              <p className="text-sm font-medium text-ink">Reviews require approval</p>
              <p className="text-xs text-brown-muted">New reviews must be approved by an admin before being visible</p>
            </div>
            <button role="switch" aria-checked={reviewApproval} aria-label="Reviews require approval"
              onClick={() => setReviewApproval(!reviewApproval)}
              className={cn('relative inline-flex h-6 w-11 items-center rounded-full transition-colors', reviewApproval ? 'bg-saffron' : 'bg-brown-muted/30')}>
              <span className={cn('inline-block h-5 w-5 rounded-full bg-white transition-transform shadow-sm', reviewApproval ? 'translate-x-[22px]' : 'translate-x-[2px]')} />
            </button>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-brown-muted/10">
            <div>
              <p className="text-sm font-medium text-ink">New restaurants require approval</p>
              <p className="text-xs text-brown-muted">New restaurant submissions must be verified by an admin</p>
            </div>
            <button role="switch" aria-checked={restApproval} aria-label="New restaurants require approval"
              onClick={() => setRestApproval(!restApproval)}
              className={cn('relative inline-flex h-6 w-11 items-center rounded-full transition-colors', restApproval ? 'bg-saffron' : 'bg-brown-muted/30')}>
              <span className={cn('inline-block h-5 w-5 rounded-full bg-white transition-transform shadow-sm', restApproval ? 'translate-x-[22px]' : 'translate-x-[2px]')} />
            </button>
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-xs font-medium text-ink mb-2">Featured Cities</label>
          <div className="flex flex-wrap gap-2">
            {CITY_NAMES.map(c => (
              <button key={c} onClick={() => setFeaturedCities(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c])}
                className={cn('px-3 py-1.5 text-xs font-medium rounded-lg border transition-all',
                  featuredCities.includes(c) ? 'bg-saffron text-cream border-saffron' : 'bg-cream text-brown-muted border-brown-muted/20 hover:border-saffron/40')}>
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-xl border border-red-200 p-6">
        <h3 className="font-serif text-lg font-bold text-red-600 mb-5 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" /> Danger Zone
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-red-50 border border-red-100">
            <div>
              <p className="text-sm font-medium text-ink">Clear all sample data</p>
              <p className="text-xs text-brown-muted">Remove all sample restaurants, dishes, reviews, and users from the database.</p>
            </div>
            <Button className="bg-red-600 hover:bg-red-700 text-white text-xs gap-1" onClick={() => setShowClearData(true)}>
              <Trash2 className="w-3 h-3" /> Clear Data
            </Button>
          </div>
          <div className="flex items-center justify-between p-4 rounded-lg bg-red-50 border border-red-100">
            <div>
              <p className="text-sm font-medium text-ink">Reset leaderboards</p>
              <p className="text-xs text-brown-muted">Recalculate all dish leaderboards based on current review data.</p>
            </div>
            <Button variant="outline" className="text-xs border-red-200 text-red-600 hover:bg-red-50 gap-1" onClick={() => setShowResetLeaderboards(true)}>
              <RefreshCw className="w-3 h-3" /> Reset Leaderboards
            </Button>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button className="bg-saffron hover:bg-saffron-light text-cream px-8 gap-2">
          <Check className="w-4 h-4" /> Save Settings
        </Button>
      </div>

      <ConfirmDialog open={showClearData} onOpenChange={setShowClearData}
        title="Clear Sample Data" description="This will permanently delete all sample data from the database. This cannot be undone. Are you sure?"
        onConfirm={() => {}} confirmLabel="Yes, Clear Everything" variant="danger" />
      <ConfirmDialog open={showResetLeaderboards} onOpenChange={setShowResetLeaderboards}
        title="Reset Leaderboards" description="This will recalculate all leaderboards based on current reviews. This may take a few minutes for large datasets."
        onConfirm={() => {}} confirmLabel="Reset Leaderboards" variant="warning" />
    </div>
  )

  /* ── Modals ── */

  /* ── Add Restaurant Modal ── */
  function AddRestaurantModal({ open, onOpenChange, editRestaurant: editRest }: { open: boolean; onOpenChange: (v: boolean) => void; editRestaurant: typeof SAMPLE_RESTAURANTS[0] | null }) {
    const [form, setForm] = useState({ name: '', description: '', city: 'Hyderabad', address: '', phone: '', cuisines: [] as string[], priceRange: '3' })
    useEffect(() => {
      if (!open) return
      if (editRest) {
        setForm({ name: editRest.name, description: '', city: editRest.city, address: '', phone: '', cuisines: editRest.cuisine.split(', '), priceRange: '3' })
      } else {
        setForm({ name: '', description: '', city: 'Hyderabad', address: '', phone: '', cuisines: [], priceRange: '3' })
      }
    }, [editRest, open])

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl font-bold text-ink">{editRest ? 'Edit Restaurant' : 'Add Restaurant'}</DialogTitle>
            <DialogDescription>{editRest ? 'Update the restaurant details.' : 'Add a new restaurant to the platform.'}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
            <div>
              <label className="block text-xs font-medium text-ink mb-1.5">Restaurant Name *</label>
              <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Paradise Restaurant" />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink mb-1.5">Description</label>
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3}
                className="w-full px-3 py-2 text-sm rounded-md border border-brown-muted/40 bg-cream text-ink placeholder:text-brown-muted focus:outline-none focus:ring-2 focus:ring-saffron resize-none"
                placeholder="Brief description of the restaurant..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-ink mb-1.5">City</label>
                <select value={form.city} onChange={e => setForm({ ...form, city: e.target.value })}
                  className="w-full h-10 px-3 text-sm rounded-md border border-brown-muted/40 bg-cream text-ink focus:outline-none focus:ring-2 focus:ring-saffron">
                  {CITY_NAMES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-ink mb-1.5">Price Range</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map(p => (
                    <button key={p} onClick={() => setForm({ ...form, priceRange: String(p) })}
                      className={cn('flex-1 h-10 text-sm font-medium rounded-lg border transition-all',
                        form.priceRange === String(p) ? 'bg-saffron text-cream border-saffron' : 'bg-cream text-brown-muted border-brown-muted/20')}>
                      {'₹'.repeat(p)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-ink mb-1.5">Address</label>
              <Input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="Restaurant address..." />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink mb-1.5">Phone</label>
              <Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+91 98765 43210" />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink mb-1.5">Cuisine Type</label>
              <div className="flex flex-wrap gap-2">
                {CUISINE_OPTIONS.map(c => (
                  <button key={c} onClick={() => setForm({ ...form, cuisines: form.cuisines.includes(c) ? form.cuisines.filter(x => x !== c) : [...form.cuisines, c] })}
                    className={cn('px-2.5 py-1 text-xs font-medium rounded-lg border transition-all',
                      form.cuisines.includes(c) ? 'bg-saffron text-cream border-saffron' : 'bg-cream text-brown-muted border-brown-muted/20 hover:border-saffron/40')}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button className="bg-saffron hover:bg-saffron-light text-cream" disabled={!form.name}>
              {editRest ? 'Save Changes' : 'Add Restaurant'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  /* ── Add Dish Modal ── */
  function AddDishModal({ open, onOpenChange, editDish: editD }: { open: boolean; onOpenChange: (v: boolean) => void; editDish: typeof SAMPLE_DISHES[0] | null }) {
    const [form, setForm] = useState({ name: '', restaurant: 'Paradise Restaurant', description: '', price: '', category: 'Biryani', isVeg: true, isJain: false, isHalal: false, photoUrl: '' })
    useEffect(() => {
      if (!open) return
      if (editD) {
        setForm({ name: editD.name, restaurant: editD.restaurant, description: '', price: String(editD.price), category: editD.category, isVeg: editD.isVeg, isJain: false, isHalal: false, photoUrl: '' })
      } else {
        setForm({ name: '', restaurant: 'Paradise Restaurant', description: '', price: '', category: 'Biryani', isVeg: true, isJain: false, isHalal: false, photoUrl: '' })
      }
    }, [editD, open])

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl font-bold text-ink">{editD ? 'Edit Dish' : 'Add Dish'}</DialogTitle>
            <DialogDescription>{editD ? 'Update the dish details.' : 'Add a new dish to the platform.'}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
            <div>
              <label className="block text-xs font-medium text-ink mb-1.5">Dish Name *</label>
              <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Hyderabadi Dum Biryani" />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink mb-1.5">Restaurant</label>
              <select value={form.restaurant} onChange={e => setForm({ ...form, restaurant: e.target.value })}
                className="w-full h-10 px-3 text-sm rounded-md border border-brown-muted/40 bg-cream text-ink focus:outline-none focus:ring-2 focus:ring-saffron">
                {[...new Set(SAMPLE_DISHES.map(d => d.restaurant))].map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-ink mb-1.5">Description</label>
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3}
                className="w-full px-3 py-2 text-sm rounded-md border border-brown-muted/40 bg-cream text-ink placeholder:text-brown-muted focus:outline-none focus:ring-2 focus:ring-saffron resize-none"
                placeholder="Brief description of the dish..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-ink mb-1.5">Price (₹) *</label>
                <Input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="420" />
              </div>
              <div>
                <label className="block text-xs font-medium text-ink mb-1.5">Category</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                  className="w-full h-10 px-3 text-sm rounded-md border border-brown-muted/40 bg-cream text-ink focus:outline-none focus:ring-2 focus:ring-saffron">
                  {CATEGORY_OPTIONS.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-ink mb-2">Dietary Info</label>
              <div className="flex flex-wrap gap-2">
                {(['Veg', 'Non-Veg', 'Jain', 'Halal'] as const).map(type => {
                  const key = type === 'Non-Veg' ? 'isVeg' : type.toLowerCase() as 'isVeg' | 'isJain' | 'isHalal'
                  const isActive = type === 'Non-Veg' ? !form.isVeg : form[key]
                  return (
                    <button key={type} onClick={() => {
                      if (type === 'Non-Veg') setForm({ ...form, isVeg: !form.isVeg })
                      else setForm({ ...form, [key]: !form[key] })
                    }}
                      className={cn('px-3 py-1.5 text-xs font-medium rounded-lg border transition-all',
                        isActive ? type === 'Veg' ? 'border-green-500 bg-green-50 text-green-700' : type === 'Non-Veg' ? 'border-red-400 bg-red-50 text-red-600' : 'border-saffron/40 bg-saffron/5 text-saffron'
                          : 'border-brown-muted/20 text-brown-muted hover:border-brown-muted/40')}>
                      {type}
                    </button>
                  )
                })}
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-ink mb-1.5">Photo URL</label>
              <Input value={form.photoUrl} onChange={e => setForm({ ...form, photoUrl: e.target.value })} placeholder="https://..." />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button className="bg-saffron hover:bg-saffron-light text-cream" disabled={!form.name || !form.price}>
              {editD ? 'Save Changes' : 'Add Dish'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  /* ── User Detail Modal ── */
  function UserDetailModal({ open, onOpenChange, user: u }: { open: boolean; onOpenChange: (v: boolean) => void; user: typeof SAMPLE_USERS[0] | null }) {
    if (!u) return null
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <Avatar className="w-12 h-12">
                <AvatarFallback className="bg-saffron/10 text-saffron text-lg font-bold">{u.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <DialogTitle className="font-serif text-xl font-bold text-ink">{u.name}</DialogTitle>
                <DialogDescription>{u.email}</DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-brown-muted mb-0.5">Phone</p>
                <p className="text-ink font-medium">{u.phone}</p>
              </div>
              <div>
                <p className="text-xs text-brown-muted mb-0.5">City</p>
                <p className="text-ink font-medium">{u.city}</p>
              </div>
              <div>
                <p className="text-xs text-brown-muted mb-0.5">Reviews</p>
                <p className="text-ink font-medium">{u.reviews}</p>
              </div>
              <div>
                <p className="text-xs text-brown-muted mb-0.5">Joined</p>
                <p className="text-ink font-medium">{u.joinDate}</p>
              </div>
              <div>
                <p className="text-xs text-brown-muted mb-0.5">Status</p>
                <StatusBadge status={u.status} />
              </div>
            </div>

            <Separator />

            <div>
              <p className="text-sm font-medium text-ink mb-2">Recent Reviews by {u.name}</p>
              <div className="space-y-2">
                {SAMPLE_REVIEWS.filter(r => r.user === u.name).slice(0, 3).map(r => (
                  <div key={r.id} className="p-3 rounded-lg bg-cream-dark/50 text-sm">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-ink">{r.dish}</span>
                      <span className="text-xs font-bold text-saffron">{r.rating.toFixed(1)}</span>
                    </div>
                    <p className="text-xs text-ink/70 line-clamp-2">{r.text}</p>
                  </div>
                ))}
                {SAMPLE_REVIEWS.filter(r => r.user === u.name).length === 0 && (
                  <p className="text-xs text-brown-muted">No reviews yet.</p>
                )}
              </div>
            </div>

            {u.status === 'warned' && (
              <>
                <Separator />
                <div>
                  <p className="text-sm font-medium text-ink mb-2">Warning History</p>
                  <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-sm">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <span className="text-xs font-medium text-amber-800">Warning issued on 2024-01-20</span>
                    </div>
                    <p className="text-xs text-amber-700">Reason: Inappropriate language in review of &quot;Butter Chicken&quot;</p>
                  </div>
                </div>
              </>
            )}

            {u.status === 'active' && (
              <div className="flex items-center gap-2 pt-2">
                <Button size="sm" variant="outline" className="text-xs gap-1 text-amber-600 border-amber-200">
                  <AlertTriangle className="w-3 h-3" /> Warn User
                </Button>
                <Button size="sm" variant="outline" className="text-xs gap-1 text-red-600 border-red-200">
                  <ShieldAlert className="w-3 h-3" /> Ban User
                </Button>
              </div>
            )}
            {u.status === 'banned' && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                <p className="text-sm text-red-700 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4" /> This user has been banned.
                </p>
                <Button size="sm" variant="outline" className="mt-2 text-xs">Unban User</Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  /* ── Add City Modal ── */
  function AddCityModal({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
    const [form, setForm] = useState({ name: '', state: '', emoji: '🌆', active: true })
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl font-bold text-ink">Add City</DialogTitle>
            <DialogDescription>Add a new city to the platform.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-ink mb-1.5">City Name *</label>
              <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Hyderabad" />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink mb-1.5">State</label>
              <Input value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} placeholder="e.g. Telangana" />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink mb-1.5">Emoji</label>
              <Input value={form.emoji} onChange={e => setForm({ ...form, emoji: e.target.value })} placeholder="🌆" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-ink">Active</p>
                <p className="text-xs text-brown-muted">Show this city on the platform</p>
              </div>
              <button role="switch" aria-checked={form.active} aria-label="City active status"
                onClick={() => setForm({ ...form, active: !form.active })}
                className={cn('relative inline-flex h-6 w-11 items-center rounded-full transition-colors', form.active ? 'bg-saffron' : 'bg-brown-muted/30')}>
                <span className={cn('inline-block h-5 w-5 rounded-full bg-white transition-transform shadow-sm', form.active ? 'translate-x-[22px]' : 'translate-x-[2px]')} />
              </button>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button className="bg-saffron hover:bg-saffron-light text-cream" disabled={!form.name}>Add City</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  /* ─── Main Render ─────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-[#FBF6EE]">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-ink/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={cn(
        'fixed top-0 left-0 z-50 h-full w-[260px] bg-white border-r border-brown-muted/10 flex flex-col transition-transform duration-300 lg:translate-x-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        {/* Admin Header */}
        <div className="p-5 border-b border-brown-muted/10">
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-serif text-xl font-bold text-ink">DishCritic Admin</h2>
            <Button variant="ghost" size="icon" className="lg:hidden shrink-0 -mr-1 -mt-1" onClick={() => setSidebarOpen(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="w-10 h-0.5 rounded-full bg-saffron mb-3" />
          <p className="text-xs text-brown-muted">Super Admin Panel</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(item => (
            <button key={item.id} onClick={() => { setActiveTab(item.id); setSidebarOpen(false) }}
              className={cn('w-full flex items-center gap-3 px-3.5 py-2.5 text-sm rounded-lg transition-all text-left',
                activeTab === item.id ? 'bg-saffron/10 text-saffron font-semibold' : 'text-brown-muted hover:text-ink hover:bg-cream-dark')}>
              <item.icon className={cn('w-4 h-4', activeTab === item.id && 'text-saffron')} />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t border-brown-muted/10 space-y-1">
          {user && (
            <div className="flex items-center gap-3 px-3.5 py-2 mb-2">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-saffron/10 text-saffron text-xs font-bold">
                  {user.name?.charAt(0) || 'A'}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-ink truncate">{user.name || 'Admin'}</p>
                <p className="text-[10px] text-brown-muted truncate">{user.email || 'admin@dishcritic.com'}</p>
              </div>
            </div>
          )}
          <Link href="/" className="flex items-center gap-3 px-3.5 py-2.5 text-sm rounded-lg text-brown-muted hover:text-saffron hover:bg-cream-dark transition-all">
            <ExternalLink className="w-4 h-4" />
            Back to Site
          </Link>
          <button onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 text-sm rounded-lg text-red-500 hover:bg-red-50 transition-all">
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-[260px]">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-cream/90 backdrop-blur-md border-b border-brown-muted/10">
          <div className="flex items-center justify-between px-4 sm:px-6 h-16">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)} aria-label="Open sidebar">
                <Menu className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="font-serif text-lg font-bold text-ink">
                  {NAV_ITEMS.find(n => n.id === activeTab)?.label || 'Admin'}
                </h1>
                <p className="text-xs text-brown-muted hidden sm:block">Super Admin Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-4 h-4 text-brown-muted" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              </Button>
              <Link href="/">
                <Button variant="outline" size="sm" className="hidden sm:flex gap-1.5 text-xs">
                  <ExternalLink className="w-3.5 h-3.5" /> View Site
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  )
}
