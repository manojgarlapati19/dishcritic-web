'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard, Star, UtensilsCrossed, BarChart3, Trophy, Settings,
  LogOut, ExternalLink, Menu, X, ChevronRight, Plus,
  TrendingUp, TrendingDown, MapPin, Camera, Trash2,
  Edit3, Reply, Flag, Filter, Check,
  Upload, Loader2, CheckCircle2,
  MessageSquare, Eye, Award, Bell,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
  DialogFooter, DialogClose, DialogTrigger,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { useStore } from '@/store/useStore'

/* ─── Sample Data ──────────────────────────────────────────────────────── */
const RESTAURANT = {
  name: 'Paradise Restaurant',
  owner: 'Rahul Sharma',
  city: 'Hyderabad',
  isVerified: true,
  overallScore: 9.2,
  totalReviews: 3241,
  profileViews: 12400,
}

const SCORE_BREAKDOWN = [
  { label: 'Food Quality', score: 9.4 },
  { label: 'Service', score: 8.8 },
  { label: 'Ambience', score: 8.2 },
  { label: 'Value for Money', score: 9.0 },
]

const RECENT_REVIEWS = [
  { id: 1, name: 'Arjun Mehta', dish: 'Hyderabadi Dum Biryani', rating: 9.5, text: 'Absolutely divine! The aroma, the taste, the tenderness of the meat — everything was perfect. Best biryani in Hyderabad hands down.', date: '2h ago', initials: 'AM', replied: false },
  { id: 2, name: 'Priya Sharma', dish: 'Chicken 65', rating: 8.0, text: 'Good starter, nice crispiness. Could use a bit more spice though.', date: '6h ago', initials: 'PS', replied: true, reply: 'Thank you for your feedback! We will pass it to the chef.' },
  { id: 3, name: 'Vikram Reddy', dish: 'Mutton Rogan Josh', rating: 8.7, text: 'Rich and flavorful. The gravy was perfectly spiced. Would recommend!', date: '1d ago', initials: 'VR', replied: false },
  { id: 4, name: 'Kavita Desai', dish: 'Hyderabadi Dum Biryani', rating: 9.2, text: 'Consistently good. Every time I visit, the biryani is top notch.', date: '2d ago', initials: 'KD', replied: false },
  { id: 5, name: 'Rahul Joshi', dish: 'Butter Naan', rating: 7.5, text: 'Good bread, soft and buttery. Went well with the curries.', date: '3d ago', initials: 'RJ', replied: true, reply: 'Glad you enjoyed it! Try our Garlic Naan next time.' },
]

const TOP_DISHES = [
  { name: 'Hyderabadi Dum Biryani', score: 9.4, reviews: 4200, rank: 1, category: 'Biryani' },
  { name: 'Chicken 65', score: 8.7, reviews: 2100, rank: 5, category: 'Starters' },
  { name: 'Mutton Rogan Josh', score: 8.5, reviews: 1800, rank: 8, category: 'Main Course' },
  { name: 'Butter Naan', score: 8.2, reviews: 3100, rank: 12, category: 'Breads' },
  { name: 'Double Ka Meetha', score: 8.0, reviews: 950, rank: 15, category: 'Desserts' },
]

const MENU_DISHES = [
  { id: 1, name: 'Hyderabadi Dum Biryani', price: 420, category: 'Biryani', isVeg: false, isAvailable: true, score: 9.4 },
  { id: 2, name: 'Chicken Biryani', price: 380, category: 'Biryani', isVeg: false, isAvailable: true, score: 8.9 },
  { id: 3, name: 'Mutton Biryani', price: 480, category: 'Biryani', isVeg: false, isAvailable: true, score: 8.7 },
  { id: 4, name: 'Veg Biryani', price: 320, category: 'Biryani', isVeg: true, isAvailable: true, score: 8.4 },
  { id: 5, name: 'Chicken 65', price: 280, category: 'Starters', isVeg: false, isAvailable: true, score: 8.7 },
  { id: 6, name: 'Paneer Tikka', price: 300, category: 'Starters', isVeg: true, isAvailable: true, score: 7.8 },
  { id: 7, name: 'Mutton Rogan Josh', price: 520, category: 'Main Course', isVeg: false, isAvailable: true, score: 8.5 },
  { id: 8, name: 'Butter Chicken', price: 400, category: 'Main Course', isVeg: false, isAvailable: true, score: 8.1 },
  { id: 9, name: 'Dal Makhani', price: 280, category: 'Main Course', isVeg: true, isAvailable: true, score: 7.6 },
  { id: 10, name: 'Butter Naan', price: 60, category: 'Breads', isVeg: true, isAvailable: true, score: 8.2 },
  { id: 11, name: 'Garlic Naan', price: 80, category: 'Breads', isVeg: true, isAvailable: true, score: 7.9 },
  { id: 12, name: 'Double Ka Meetha', price: 150, category: 'Desserts', isVeg: true, isAvailable: true, score: 8.0 },
  { id: 13, name: 'Qubani Ka Meetha', price: 180, category: 'Desserts', isVeg: true, isAvailable: false, score: 7.5 },
  { id: 14, name: 'Mint Lemonade', price: 120, category: 'Drinks', isVeg: true, isAvailable: true, score: 7.2 },
  { id: 15, name: 'Buttermilk', price: 60, category: 'Drinks', isVeg: true, isAvailable: true, score: 7.0 },
]

const WEEKLY_SCORES = [
  { week: 'Week 1', score: 8.9 },
  { week: 'Week 2', score: 9.0 },
  { week: 'Week 3', score: 9.1 },
  { week: 'Week 4', score: 8.8 },
  { week: 'Week 5', score: 9.0 },
  { week: 'Week 6', score: 9.2 },
]

const WEEKLY_REVIEWS = [
  { week: 'Week 1', count: 28 },
  { week: 'Week 2', count: 35 },
  { week: 'Week 3', count: 22 },
  { week: 'Week 4', count: 40 },
  { week: 'Week 5', count: 31 },
  { week: 'Week 6', count: 45 },
]

const TOP_SEARCHED = [
  { name: 'Hyderabadi Dum Biryani', searches: 12400 },
  { name: 'Chicken 65', searches: 7200 },
  { name: 'Mutton Biryani', searches: 5800 },
  { name: 'Butter Chicken', searches: 4100 },
  { name: 'Mutton Rogan Josh', searches: 3200 },
]

const TRAFFIC_SOURCES = [
  { label: 'Direct', value: 42, color: '#C8702A' },
  { label: 'Search', value: 31, color: '#E08030' },
  { label: 'Social', value: 17, color: '#F0E6CE' },
  { label: 'Referral', value: 10, color: '#A08060' },
]

const COMPETITORS = [
  { name: 'Paradise Restaurant', score: 9.2, reviews: 3241, priceRange: '₹₹₹', topDishScore: 9.4 },
  { name: 'Bawarchi', score: 8.9, reviews: 4100, priceRange: '₹₹', topDishScore: 8.9 },
  { name: 'Shadab Restaurant', score: 8.7, reviews: 2800, priceRange: '₹₹', topDishScore: 8.7 },
  { name: 'Pista House', score: 8.4, reviews: 3500, priceRange: '₹₹₹', topDishScore: 8.5 },
]

const RANKED_DISHES = [
  { name: 'Hyderabadi Dum Biryani', category: 'Best Biryani', rank: 2, city: 'Hyderabad', score: 9.4, change: 1, competitors: 24 },
  { name: 'Mutton Rogan Josh', category: 'Best Main Course', rank: 5, city: 'Hyderabad', score: 8.5, change: -1, competitors: 18 },
  { name: 'Chicken 65', category: 'Best Starters', rank: 8, city: 'Hyderabad', score: 8.7, change: 2, competitors: 15 },
]

const UNRANKED_DISHES = [
  { name: 'Double Ka Meetha', reviews: 8, needed: 10 },
  { name: 'Dal Makhani', reviews: 6, needed: 10 },
  { name: 'Mint Lemonade', reviews: 4, needed: 10 },
]

const WEEKLY_MOVERS = [
  { dish: 'Chicken 65', direction: 'up' as const, change: 2, category: 'Starters', from: 10, to: 8 },
  { dish: 'Hyderabadi Dum Biryani', direction: 'up' as const, change: 1, category: 'Biryani', from: 3, to: 2 },
  { dish: 'Mutton Rogan Josh', direction: 'down' as const, change: 1, category: 'Main Course', from: 4, to: 5 },
]

const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const CATEGORIES = ['All', 'Biryani', 'Starters', 'Main Course', 'Desserts', 'Drinks', 'Breads']
const MENU_CATEGORIES_DROPDOWN = ['Biryani', 'Starters', 'Main Course', 'Desserts', 'Drinks', 'Breads']

/* ─── Sidebar nav items ─────────────────────────────────────────────────── */
const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'reviews', label: 'Reviews', icon: Star },
  { id: 'menu', label: 'Menu Management', icon: UtensilsCrossed },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'rankings', label: 'Dish Rankings', icon: Trophy },
  { id: 'settings', label: 'Profile Settings', icon: Settings },
]

/* ─── Subcomponents ────────────────────────────────────────────────────── */

/* ── SVG Line Chart ── */
function ScoreLineChart({ data }: { data: { week: string; score: number }[] }) {
  const width = 320
  const height = 160
  const padding = { top: 15, right: 10, bottom: 25, left: 30 }
  const chartW = width - padding.left - padding.right
  const chartH = height - padding.top - padding.bottom
  const minScore = 8
  const maxScore = 9.5
  const xStep = chartW / (data.length - 1)

  const points = data.map((d, i) => {
    const x = padding.left + i * xStep
    const y = padding.top + chartH - ((d.score - minScore) / (maxScore - minScore)) * chartH
    return `${x},${y}`
  })

  const yLabels = [8.0, 8.5, 9.0, 9.5]

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-[320px] h-auto">
      {yLabels.map((y) => {
        const yPos = padding.top + chartH - ((y - minScore) / (maxScore - minScore)) * chartH
        return (
          <g key={y}>
            <line x1={padding.left} y1={yPos} x2={width - padding.right} y2={yPos} stroke="rgba(107,66,38,0.08)" strokeDasharray="4" />
            <text x={padding.left - 6} y={yPos + 4} textAnchor="end" fontSize="10" fill="#A08060">{y}</text>
          </g>
        )
      })}
      <polyline
        points={points.join(' ')}
        fill="none"
        stroke="#C8702A"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="drop-shadow-sm"
      />
      {data.map((d, i) => {
        const x = padding.left + i * xStep
        const y = padding.top + chartH - ((d.score - minScore) / (maxScore - minScore)) * chartH
        return <circle key={i} cx={x} cy={y} r="3.5" fill="#C8702A" className="drop-shadow-sm" />
      })}
      {data.map((d, i) => {
        const x = padding.left + i * xStep
        if (i % 2 !== 0) return null
        return (
          <text key={i} x={x} y={height - 5} textAnchor="middle" fontSize="9" fill="#A08060">
            {d.week}
          </text>
        )
      })}
    </svg>
  )
}

/* ── SVG Bar Chart ── */
function ReviewsBarChart({ data }: { data: { week: string; count: number }[] }) {
  const width = 320
  const height = 160
  const padding = { top: 10, right: 10, bottom: 25, left: 30 }
  const chartW = width - padding.left - padding.right
  const chartH = height - padding.top - padding.bottom
  const maxCount = Math.max(...data.map((d) => d.count))
  const barWidth = Math.min(chartW / data.length - 6, 30)

  const yLabels = [0, 15, 30, 45]

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-[320px] h-auto">
      {yLabels.map((y) => {
        const yPos = padding.top + chartH - (y / maxCount) * chartH
        return (
          <g key={y}>
            <line x1={padding.left} y1={yPos} x2={width - padding.right} y2={yPos} stroke="rgba(107,66,38,0.08)" strokeDasharray="4" />
            <text x={padding.left - 6} y={yPos + 4} textAnchor="end" fontSize="10" fill="#A08060">{y}</text>
          </g>
        )
      })}
      {data.map((d, i) => {
        const x = padding.left + i * (chartW / data.length) + (chartW / data.length - barWidth) / 2
        const barH = (d.count / maxCount) * chartH
        const y = padding.top + chartH - barH
        return (
          <g key={i}>
            <rect x={x} y={y} width={barWidth} height={barH} rx={3} fill="#C8702A" opacity={0.85} />
            <text x={x + barWidth / 2} y={y - 6} textAnchor="middle" fontSize="10" fill="#1E1208" fontWeight="600">
              {d.count}
            </text>
          </g>
        )
      })}
      {data.map((d, i) => {
        const x = padding.left + i * (chartW / data.length) + (chartW / data.length) / 2
        if (i % 2 !== 0) return null
        return (
          <text key={i} x={x} y={height - 5} textAnchor="middle" fontSize="9" fill="#A08060">
            {d.week}
          </text>
        )
      })}
    </svg>
  )
}

/* ── SVG Horizontal Bar Chart ── */
function TopSearchedChart({ data }: { data: { name: string; searches: number }[] }) {
  const maxSearches = Math.max(...data.map((d) => d.searches))
  const barHeight = 24
  const gap = 8
  const totalHeight = data.length * (barHeight + gap)
  const labelWidth = 180

  return (
    <svg viewBox={`0 0 ${labelWidth + 200} ${totalHeight}`} className="w-full h-auto">
      {data.map((d, i) => {
        const y = i * (barHeight + gap)
        const barW = (d.searches / maxSearches) * (200 - 40)
        return (
          <g key={i}>
            <text x={0} y={y + barHeight / 2 + 4} fontSize="11" fill="#1E1208" fontWeight="500">
              {d.name}
            </text>
            <rect x={labelWidth} y={y + 2} width={barW} height={barHeight - 4} rx={4} fill="#C8702A" opacity={0.85} />
            <text x={labelWidth + barW + 8} y={y + barHeight / 2 + 4} fontSize="11" fill="#A08060" fontWeight="600">
              {(d.searches / 1000).toFixed(1)}K
            </text>
          </g>
        )
      })}
    </svg>
  )
}

/* ── SVG Donut Chart ── */
function TrafficDonut({ data }: { data: { label: string; value: number; color: string }[] }) {
  const total = data.reduce((a, b) => a + b.value, 0)
  const cx = 60
  const cy = 60
  const r = 45
  const circumference = 2 * Math.PI * r
  let offset = 0
  const slices = data.map((d) => {
    const length = (d.value / total) * circumference
    const slice = { ...d, length, offset }
    offset += length
    return slice
  })

  return (
    <div className="flex items-center gap-6">
      <svg viewBox="0 0 120 120" className="w-[120px] h-[120px] -rotate-90">
        {slices.map((s, i) => (
          <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={s.color} strokeWidth="18"
            strokeDasharray={`${s.length} ${circumference - s.length}`} strokeDashoffset={-s.offset}
            strokeLinecap="round" opacity={0.9}
          />
        ))}
        <circle cx={cx} cy={cy} r={r - 14} fill="#FBF6EE" />
        <text x={cx} y={cy - 2} textAnchor="middle" fontSize="18" fontWeight="bold" fill="#1E1208">{total}</text>
        <text x={cx} y={cy + 12} textAnchor="middle" fontSize="8" fill="#A08060">Total</text>
      </svg>
      <div className="space-y-2">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
            <span className="text-ink">{d.label}</span>
            <span className="text-brown-muted">{d.value}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Add Dish Modal ── */
function AddDishModal({ open, onOpenChange, editDish }: { open: boolean; onOpenChange: (v: boolean) => void; editDish?: typeof MENU_DISHES[0] | null }) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Biryani',
    isVeg: true,
    isJain: false,
    isHalal: false,
  })

  useEffect(() => {
    if (!open) return
    if (editDish) {
      setForm({
        name: editDish.name,
        description: '',
        price: String(editDish.price),
        category: editDish.category,
        isVeg: editDish.isVeg,
        isJain: false,
        isHalal: false,
      })
    } else {
      setForm({ name: '', description: '', price: '', category: 'Biryani', isVeg: true, isJain: false, isHalal: false })
    }
  }, [editDish, open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl font-bold text-ink">
            {editDish ? 'Edit Dish' : 'Add New Dish'}
          </DialogTitle>
          <DialogDescription>
            {editDish ? 'Update the dish details below.' : 'Add a new dish to your menu.'}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-ink mb-1.5">Dish Name *</label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Hyderabadi Dum Biryani" />
          </div>
          <div>
            <label className="block text-xs font-medium text-ink mb-1.5">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Brief description of the dish..."
              rows={3}
              className="w-full px-3 py-2 text-sm rounded-md border border-brown-muted/40 bg-cream text-ink placeholder:text-brown-muted focus:outline-none focus:ring-2 focus:ring-saffron resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-ink mb-1.5">Price (₹) *</label>
              <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="420" />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink mb-1.5">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full h-10 px-3 text-sm rounded-md border border-brown-muted/40 bg-cream text-ink focus:outline-none focus:ring-2 focus:ring-saffron"
              >
                {MENU_CATEGORIES_DROPDOWN.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-ink mb-2">Dietary Info</label>
            <div className="flex flex-wrap gap-2">
              {(['Veg', 'Non-Veg', 'Jain', 'Halal'] as const).map((type) => {
                const key = type === 'Non-Veg' ? 'isVeg' : type.toLowerCase() as 'isVeg' | 'isJain' | 'isHalal'
                const isActive = type === 'Non-Veg' ? !form.isVeg : form[key]
                return (
                  <button
                    key={type}
                    onClick={() => {
                      if (type === 'Non-Veg') setForm({ ...form, isVeg: !form.isVeg })
                      else setForm({ ...form, [key]: !form[key] })
                    }}
                    className={cn(
                      'px-3 py-1.5 text-xs font-medium rounded-lg border transition-all',
                      isActive
                        ? type === 'Veg' ? 'border-green-500 bg-green-50 text-green-700'
                          : type === 'Non-Veg' ? 'border-red-400 bg-red-50 text-red-600'
                            : 'border-saffron/40 bg-saffron/5 text-saffron'
                        : 'border-brown-muted/20 text-brown-muted hover:border-brown-muted/40'
                    )}
                  >
                    {type}
                  </button>
                )
              })}
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-ink mb-1.5">Photo</label>
            <label className="cursor-pointer flex items-center gap-2 px-3 py-5 border border-dashed border-brown-muted/20 rounded-lg hover:border-saffron/30 transition-colors">
              <Camera className="w-4 h-4 text-brown-muted" />
              <span className="text-sm text-brown-muted">Upload a photo</span>
              <input type="file" accept="image/*" className="hidden" />
            </label>
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button className="bg-saffron hover:bg-saffron-light text-cream" disabled={!form.name || !form.price}>
            {editDish ? 'Save Changes' : 'Save Dish'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

/* ── Edit Reply Modal ── */
function ReplyModal({ open, onOpenChange, review }: { open: boolean; onOpenChange: (v: boolean) => void; review: typeof RECENT_REVIEWS[0] | null }) {
  const [reply, setReply] = useState(review?.reply || '')
  useEffect(() => { setReply(review?.reply || '') }, [review])
  if (!review) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl font-bold text-ink">Reply to Review</DialogTitle>
          <DialogDescription>Review by {review.name} on {review.dish}</DialogDescription>
        </DialogHeader>
        <div className="bg-cream-dark rounded-lg p-3 mb-4 text-sm text-ink italic">
          &ldquo;{review.text}&rdquo;
        </div>
        <textarea
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          placeholder="Write your reply..."
          rows={4}
          className="w-full px-3 py-2 text-sm rounded-md border border-brown-muted/40 bg-cream text-ink placeholder:text-brown-muted focus:outline-none focus:ring-2 focus:ring-saffron resize-none"
        />
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button className="bg-saffron hover:bg-saffron-light text-cream">
            {review.replied ? 'Update Reply' : 'Post Reply'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

/* ─── Main Dashboard Page ──────────────────────────────────────────────── */
export default function DashboardPage() {
  const router = useRouter()
  const { isAuthenticated, user, isLoading, signOut } = useStore()

  const [activeTab, setActiveTab] = useState('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Menu management
  const [menuCategory, setMenuCategory] = useState('All')
  const [showAddDish, setShowAddDish] = useState(false)
  const [editDish, setEditDish] = useState<typeof MENU_DISHES[0] | null>(null)

  // Reviews
  const [reviewFilter, setReviewFilter] = useState('All Reviews')
  const [reviewSort, setReviewSort] = useState('Most Recent')
  const [replyReview, setReplyReview] = useState<typeof RECENT_REVIEWS[0] | null>(null)
  const [showReplyModal, setShowReplyModal] = useState(false)

  // Analytics
  const [analyticsPeriod, setAnalyticsPeriod] = useState('Last 30 days')

  // Settings
  const [openingHours, setOpeningHours] = useState<Record<string, { open: string; close: string }>>(
    Object.fromEntries(WEEKDAYS.map((d) => [d, { open: '11:00', close: '23:00' }]))
  )
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>(['North Indian', 'Mughlai', 'Hyderabadi'])
  const [priceRange, setPriceRange] = useState(3)

  // Auth redirect
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth')
    }
  }, [isLoading, isAuthenticated, router])

  const [menuItems, setMenuItems] = useState(MENU_DISHES)
  const filteredMenu = menuCategory === 'All' ? menuItems : menuItems.filter((d) => d.category === menuCategory)

  const toggleAvailability = (id: number) => {
    setMenuItems((prev) => prev.map((d) => d.id === id ? { ...d, isAvailable: !d.isAvailable } : d))
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  // Tab transition animation — re-renders content on tab change
  const [renderKey, setRenderKey] = useState(0)
  useEffect(() => { setRenderKey((k) => k + 1) }, [activeTab])

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FBF6EE] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-saffron" />
          <p className="text-sm text-brown-muted">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  const renderContent = () => {
    const section = (() => {
      switch (activeTab) {
      case 'overview': return <OverviewSection />
      case 'reviews': return <ReviewsSection />
      case 'menu': return <MenuSection />
      case 'analytics': return <AnalyticsSection />
      case 'rankings': return <RankingsSection />
      case 'settings': return <SettingsSection />
      default: return <OverviewSection />
    })()
    return (
      <div key={activeTab} className="animate-fade-in">
        {section}
      </div>
    )
  }

  /* ─── OVERVIEW ─────────────────────────────────────────────────────── */
  const OverviewSection = () => (
    <div className="space-y-8">
      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Overall Score', value: '9.2', sub: '/ 10', trend: '+0.2', trendLabel: 'this month', icon: Award, color: 'text-saffron' },
          { label: 'Total Reviews', value: '3,241', sub: '', trend: '+124', trendLabel: 'this month', icon: MessageSquare, color: 'text-green-600' },
          { label: 'Dish Rankings', value: '3', sub: 'dishes', trend: 'in top 10', trendLabel: 'Hyderabad', icon: Trophy, color: 'text-amber-600' },
          { label: 'Profile Views', value: '12,400', sub: '', trend: '+8%', trendLabel: 'this month', icon: Eye, color: 'text-blue-600' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-xl border border-brown-muted/10 p-5 hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-brown-muted font-medium">{stat.label}</span>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="font-serif text-3xl font-bold text-ink">{stat.value}</span>
              {stat.sub && <span className="text-sm text-brown-muted">{stat.sub}</span>}
            </div>
            <div className="flex items-center gap-1.5 mt-2">
              {stat.trend.startsWith('+') ? (
                <TrendingUp className="w-3.5 h-3.5 text-green-600" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5 text-red-500" />
              )}
              <span className={cn('text-xs font-medium', stat.trend.startsWith('+') ? 'text-green-600' : 'text-red-500')}>
                {stat.trend}
              </span>
              <span className="text-xs text-brown-muted">{stat.trendLabel}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Score Breakdown */}
        <div className="bg-white rounded-xl border border-brown-muted/10 p-6">
          <h3 className="font-serif text-lg font-bold text-ink mb-5">Score Breakdown</h3>
          <div className="space-y-4">
            {SCORE_BREAKDOWN.map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-ink font-medium">{item.label}</span>
                  <span className="text-sm font-bold text-saffron">{item.score.toFixed(1)}</span>
                </div>
                <div className="h-2.5 rounded-full bg-cream-dark overflow-hidden">
                  <div
                    className="h-full rounded-full bg-saffron animate-grow-width transition-all"
                    style={{ width: `${(item.score / 10) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performing Dishes */}
        <div className="bg-white rounded-xl border border-brown-muted/10 p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-serif text-lg font-bold text-ink">Your Best Dishes</h3>
            <Button size="sm" className="bg-saffron hover:bg-saffron-light text-cream gap-1" onClick={() => { setActiveTab('menu'); setShowAddDish(true) }}>
              <Plus className="w-3.5 h-3.5" /> Add New Dish
            </Button>
          </div>
          <div className="space-y-3">
            {TOP_DISHES.map((dish) => (
              <div key={dish.name} className="flex items-center justify-between p-3 rounded-lg bg-cream-dark/50 hover:bg-cream-dark transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex items-center justify-center w-7 h-7 rounded-full bg-saffron/10 text-xs font-bold text-saffron shrink-0">
                    #{dish.rank}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-ink truncate">{dish.name}</p>
                    <p className="text-xs text-brown-muted">{dish.reviews.toLocaleString()} reviews</p>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-3">
                  <span className="text-sm font-bold text-saffron">{dish.score.toFixed(1)}</span>
                  <p className="text-[10px] text-brown-muted">/10</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Reviews */}
      <div className="bg-white rounded-xl border border-brown-muted/10 p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-serif text-lg font-bold text-ink">Latest Reviews</h3>
          <Button variant="ghost" size="sm" className="text-saffron gap-1" onClick={() => setActiveTab('reviews')}>
            View All <ChevronRight className="w-3.5 h-3.5" />
          </Button>
        </div>
        <div className="space-y-4">
          {RECENT_REVIEWS.slice(0, 5).map((review) => (
            <div key={review.id} className="flex gap-3 p-3 rounded-lg hover:bg-cream-dark/50 transition-colors">
              <Avatar className="w-9 h-9 shrink-0">
                <AvatarFallback className="bg-saffron/10 text-saffron text-xs font-bold">{review.initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-ink">{review.name}</span>
                  <span className="text-xs text-brown-muted">on</span>
                  <span className="text-xs font-medium text-saffron">{review.dish}</span>
                  <span className="text-xs text-brown-muted ml-auto">{review.date}</span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-xs font-bold text-saffron">{review.rating.toFixed(1)}</span>
                  <span className="text-[10px] text-brown-muted">/10</span>
                </div>
                <p className="text-sm text-ink/80 mt-1 line-clamp-2">{review.text}</p>
                {review.replied && (
                  <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Replied
                  </p>
                )}
              </div>
              {!review.replied && (
                <Button
                  variant="ghost" size="sm"
                  className="shrink-0 gap-1 text-brown-muted"
                  onClick={() => { setReplyReview(review); setShowReplyModal(true) }}
                >
                  <Reply className="w-3.5 h-3.5" /> Reply
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  /* ─── REVIEWS ───────────────────────────────────────────────────────── */
  const ReviewsSection = () => (
    <div className="space-y-6">
      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex bg-cream-dark rounded-lg p-1">
          {['All Reviews', 'Replied', 'Unreplied', 'Flagged'].map((f) => (
            <button
              key={f}
              onClick={() => setReviewFilter(f)}
              className={cn(
                'px-3.5 py-1.5 text-xs font-medium rounded-md transition-all',
                reviewFilter === f ? 'bg-white text-ink shadow-sm' : 'text-brown-muted hover:text-ink'
              )}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <select
            value={reviewSort}
            onChange={(e) => setReviewSort(e.target.value)}
            className="h-9 px-3 text-xs rounded-lg border border-brown-muted/20 bg-white text-ink focus:outline-none focus:ring-2 focus:ring-saffron"
          >
            <option>Most Recent</option>
            <option>Highest Rated</option>
            <option>Lowest Rated</option>
          </select>
          <Button variant="outline" size="sm" className="gap-1.5 text-xs">
            <Filter className="w-3.5 h-3.5" /> Filter
          </Button>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {RECENT_REVIEWS.map((review) => (
          <div key={review.id} className="bg-white rounded-xl border border-brown-muted/10 p-5 hover:shadow-sm transition-shadow">
            <div className="flex items-start gap-3">
              <Avatar className="w-10 h-10 shrink-0">
                <AvatarFallback className="bg-saffron/10 text-saffron text-sm font-bold">{review.initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-ink">{review.name}</span>
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0">Foodie</Badge>
                  <span className="text-xs text-brown-muted ml-auto">{review.date}</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-brown-muted">Reviewed:</span>
                  <span className="text-xs font-medium text-saffron">{review.dish}</span>
                  <span className="flex items-center gap-1 text-xs font-bold text-saffron ml-auto">
                    {review.rating.toFixed(1)}
                    <span className="text-[10px] text-brown-muted font-normal">/10</span>
                  </span>
                </div>
                <p className="text-sm text-ink/80 mt-2 leading-relaxed">{review.text}</p>

                {/* Reply Section */}
                <div className="mt-3 pt-3 border-t border-brown-muted/10">
                  {review.replied ? (
                    <div className="flex items-start gap-2">
                      <div className="flex-1 bg-cream-dark rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold text-ink">Your Reply</span>
                          <span className="text-[10px] text-green-600 flex items-center gap-0.5">
                            <CheckCircle2 className="w-3 h-3" /> Posted
                          </span>
                        </div>
                        <p className="text-sm text-ink/70">{review.reply}</p>
                      </div>
                      <Button variant="ghost" size="sm" className="shrink-0" onClick={() => { setReplyReview(review); setShowReplyModal(true) }}>
                        <Edit3 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <Button
                        variant="ghost" size="sm"
                        className="gap-1.5 text-brown-muted text-xs"
                        onClick={() => { setReplyReview(review); setShowReplyModal(true) }}
                      >
                        <Reply className="w-3.5 h-3.5" />
                        Write a Reply
                      </Button>
                      <button className="flex items-center gap-1 text-[10px] text-brown-muted/60 hover:text-red-500 transition-colors">
                        <Flag className="w-3 h-3" /> Flag
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  /* ─── MENU MANAGEMENT ──────────────────────────────────────────────── */
  const MenuSection = () => (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex bg-cream-dark rounded-lg p-1 overflow-x-auto">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setMenuCategory(cat)}
              className={cn(
                'px-3.5 py-1.5 text-xs font-medium whitespace-nowrap rounded-md transition-all',
                menuCategory === cat ? 'bg-white text-ink shadow-sm' : 'text-brown-muted hover:text-ink'
              )}
            >
              {cat}
            </button>
          ))}
        </div>
        <Button className="bg-saffron hover:bg-saffron-light text-cream gap-1" onClick={() => { setEditDish(null); setShowAddDish(true) }}>
          <Plus className="w-4 h-4" /> Add New Dish
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-brown-muted/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brown-muted/10 bg-cream-dark/50">
                <th className="text-left px-4 py-3 text-xs font-medium text-brown-muted">Dish</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-brown-muted">Price</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-brown-muted">Category</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-brown-muted">Type</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-brown-muted">Available</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-brown-muted">Score</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-brown-muted">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brown-muted/10">
              {filteredMenu.map((dish) => (
                <tr key={dish.id} className="hover:bg-cream-dark/30 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-ink">{dish.name}</td>
                  <td className="px-4 py-3 text-sm text-ink">₹{dish.price}</td>
                  <td className="px-4 py-3">
                    <Badge variant="secondary" className="text-[10px]">{dish.category}</Badge>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge variant={dish.isVeg ? 'veg' : 'nonveg'} className="text-[10px] px-1.5 py-0">
                      {dish.isVeg ? 'Veg' : 'NV'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-center">                      <button
                      onClick={() => toggleAvailability(dish.id)}
                      className={cn(
                        'relative inline-flex h-5 w-9 items-center rounded-full transition-colors',
                        dish.isAvailable ? 'bg-green-500' : 'bg-brown-muted/30'
                      )}
                    >
                      <span
                        className={cn(
                          'inline-block h-4 w-4 rounded-full bg-white transition-transform shadow-sm',
                          dish.isAvailable ? 'translate-x-[18px]' : 'translate-x-[2px]'
                        )}
                      />
                    </button>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-sm font-bold text-saffron">{dish.score.toFixed(1)}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost" size="sm" className="h-8 w-8 p-0"
                        onClick={() => { setEditDish(dish); setShowAddDish(true) }}
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50">
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
    </div>
  )

  /* ─── ANALYTICS ─────────────────────────────────────────────────────── */
  const AnalyticsSection = () => (
    <div className="space-y-6">
      {/* Time Filter */}
      <div className="flex items-center gap-2">
        {['Last 7 days', 'Last 30 days', 'Last 90 days', '1 year'].map((p) => (
          <button
            key={p}
            onClick={() => setAnalyticsPeriod(p)}
            className={cn(
              'px-3.5 py-1.5 text-xs font-medium rounded-lg border transition-all',
              analyticsPeriod === p
                ? 'bg-saffron text-cream border-saffron'
                : 'bg-white text-brown-muted border-brown-muted/20 hover:border-saffron/40 hover:text-saffron'
            )}
          >
            {p}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Score Over Time */}
        <div className="bg-white rounded-xl border border-brown-muted/10 p-6">
          <h3 className="font-serif text-base font-bold text-ink mb-4">Score Over Time</h3>
          <ScoreLineChart data={WEEKLY_SCORES} />
          <div className="flex items-center justify-center gap-4 mt-3 text-xs text-brown-muted">
            <span className="flex items-center gap-1">
              <span className="w-3 h-0.5 bg-saffron rounded-full" /> Overall Score
            </span>
            <span className="text-green-600 flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> +0.3 this period
            </span>
          </div>
        </div>

        {/* Reviews Over Time */}
        <div className="bg-white rounded-xl border border-brown-muted/10 p-6">
          <h3 className="font-serif text-base font-bold text-ink mb-4">Reviews Over Time</h3>
          <ReviewsBarChart data={WEEKLY_REVIEWS} />
          <div className="text-center mt-3 text-xs text-brown-muted">
            Total: {WEEKLY_REVIEWS.reduce((a, b) => a + b.count, 0)} reviews this period
          </div>
        </div>

        {/* Top Searched Dishes */}
        <div className="bg-white rounded-xl border border-brown-muted/10 p-6">
          <h3 className="font-serif text-base font-bold text-ink mb-4">Top Searched Dishes</h3>
          <TopSearchedChart data={TOP_SEARCHED} />
        </div>

        {/* Traffic Sources */}
        <div className="bg-white rounded-xl border border-brown-muted/10 p-6">
          <h3 className="font-serif text-base font-bold text-ink mb-4">Traffic Sources</h3>
          <TrafficDonut data={TRAFFIC_SOURCES} />
        </div>
      </div>

      {/* Competitor Comparison */}
      <div className="bg-white rounded-xl border border-brown-muted/10 p-6">
        <h3 className="font-serif text-lg font-bold text-ink mb-5">How You Compare</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brown-muted/10">
                <th className="text-left px-3 py-2 text-xs font-medium text-brown-muted">Restaurant</th>
                <th className="text-center px-3 py-2 text-xs font-medium text-brown-muted">Score</th>
                <th className="text-center px-3 py-2 text-xs font-medium text-brown-muted">Reviews</th>
                <th className="text-center px-3 py-2 text-xs font-medium text-brown-muted">Price Range</th>
                <th className="text-center px-3 py-2 text-xs font-medium text-brown-muted">Top Dish Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brown-muted/10">
              {COMPETITORS.map((comp, i) => (
                <tr key={comp.name} className={cn(i === 0 ? 'bg-saffron/5 font-medium' : 'hover:bg-cream-dark/30')}>
                  <td className="px-3 py-3 text-ink">
                    <div className="flex items-center gap-2">
                      {comp.name}
                      {i === 0 && <Badge variant="default" className="text-[10px]">You</Badge>}
                    </div>
                  </td>
                  <td className="px-3 py-3 text-center">
                    <span className={cn('font-bold', i === 0 ? 'text-saffron' : 'text-ink')}>
                      {comp.score.toFixed(1)}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-center text-brown-muted">{comp.reviews.toLocaleString()}</td>
                  <td className="px-3 py-3 text-center text-brown-muted">{comp.priceRange}</td>
                  <td className="px-3 py-3 text-center text-brown-muted">{comp.topDishScore.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  /* ─── DISH RANKINGS ─────────────────────────────────────────────────── */
  const RankingsSection = () => (
    <div className="space-y-8">
      <h2 className="font-serif text-xl font-bold text-ink">Your Dishes in City Leaderboards</h2>

      {/* Ranked Dishes */}
      <div className="space-y-4">
        {RANKED_DISHES.map((dish) => (
          <div key={dish.name} className="bg-white rounded-xl border border-brown-muted/10 p-5 hover:shadow-sm transition-shadow">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-saffron/10 shrink-0">
                <span className="font-serif text-xl font-bold text-saffron">#{dish.rank}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-serif text-base font-bold text-ink">{dish.name}</h4>
                <p className="text-xs text-brown-muted">{dish.category} · {dish.city}</p>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-saffron">{dish.score.toFixed(1)}</div>
                <div className="flex items-center gap-1 mt-0.5">
                  {dish.change > 0 ? (
                    <span className="text-xs text-green-600 flex items-center gap-0.5">
                      <TrendingUp className="w-3 h-3" /> ↑{dish.change}
                    </span>
                  ) : (
                    <span className="text-xs text-red-500 flex items-center gap-0.5">
                      <TrendingDown className="w-3 h-3" /> ↓{Math.abs(dish.change)}
                    </span>
                  )}
                  <span className="text-[10px] text-brown-muted">this week</span>
                </div>
              </div>
              <div className="text-right text-[10px] text-brown-muted shrink-0">
                <p>vs {dish.competitors} competitors</p>
                <Link href={`/leaderboards?city=${dish.city}`} className="text-saffron hover:underline">
                  View Leaderboard →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Weekly Movers */}
      <div className="bg-white rounded-xl border border-brown-muted/10 p-6">
        <h3 className="font-serif text-lg font-bold text-ink mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-saffron" />
          This Week&apos;s Biggest Movers
        </h3>
        <div className="space-y-3">
          {WEEKLY_MOVERS.map((mover) => (
            <div key={mover.dish} className="flex items-center justify-between p-3 rounded-lg bg-cream-dark/50">
              <div className="flex items-center gap-3">
                <div className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center',
                  mover.direction === 'up' ? 'bg-green-100' : 'bg-red-100'
                )}>
                  {mover.direction === 'up' ? (
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-ink">{mover.dish}</p>
                  <p className="text-xs text-brown-muted">{mover.category}</p>
                </div>
              </div>
              <div className="text-right">
                <div className={cn(
                  'text-sm font-bold',
                  mover.direction === 'up' ? 'text-green-600' : 'text-red-500'
                )}>
                  {mover.direction === 'up' ? '↑' : '↓'}{mover.change}
                </div>
                <p className="text-[10px] text-brown-muted">#{mover.from} → #{mover.to}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Unranked Dishes */}
      <div className="bg-white rounded-xl border border-brown-muted/10 p-6">
        <h3 className="font-serif text-lg font-bold text-ink mb-4">Dishes Needing More Reviews</h3>
        <div className="space-y-4">
          {UNRANKED_DISHES.map((dish) => {
            const progress = (dish.reviews / dish.needed) * 100
            return (
              <div key={dish.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium text-ink">{dish.name}</span>
                  <span className="text-xs text-brown-muted">{dish.reviews}/{dish.needed} reviews</span>
                </div>
                <div className="h-2 rounded-full bg-cream-dark overflow-hidden">
                  <div
                    className="h-full rounded-full bg-saffron transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs text-brown-muted mt-1">
                  Needs {dish.needed - dish.reviews} more review{dish.needed - dish.reviews !== 1 ? 's' : ''} to appear in rankings
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )

  /* ─── SETTINGS ──────────────────────────────────────────────────────── */
  const SettingsSection = () => (
    <div className="space-y-8">
      {/* Restaurant Info */}
      <div className="bg-white rounded-xl border border-brown-muted/10 p-6">
        <h3 className="font-serif text-lg font-bold text-ink mb-5">Restaurant Information</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-ink mb-1.5">Restaurant Name</label>
            <Input defaultValue="Paradise Restaurant" />
          </div>
          <div>
            <label className="block text-xs font-medium text-ink mb-1.5">City</label>
            <select
              defaultValue="Hyderabad"
              className="w-full h-10 px-3 text-sm rounded-md border border-brown-muted/40 bg-cream text-ink focus:outline-none focus:ring-2 focus:ring-saffron"
            >
              {['Hyderabad', 'Mumbai', 'Bengaluru', 'Delhi', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad'].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-ink mb-1.5">Description</label>
            <textarea
              defaultValue="One of Hyderabad's most iconic restaurants, known for its legendary Hyderabadi Dum Biryani and authentic Mughlai cuisine. Serving since 1953."
              rows={3}
              className="w-full px-3 py-2 text-sm rounded-md border border-brown-muted/40 bg-cream text-ink placeholder:text-brown-muted focus:outline-none focus:ring-2 focus:ring-saffron resize-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-ink mb-1.5">Address</label>
            <Input defaultValue="Hi-Tech City Main Road, Hyderabad" />
          </div>
          <div>
            <label className="block text-xs font-medium text-ink mb-1.5">Phone Number</label>
            <Input defaultValue="+91 98765 43210" />
          </div>
          <div>
            <label className="block text-xs font-medium text-ink mb-1.5">Website URL</label>
            <Input defaultValue="https://paradiserestaurant.in" />
          </div>
          <div>
            <label className="block text-xs font-medium text-ink mb-1.5">Price Range</label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4].map((p) => (
                <button
                  key={p}
                  onClick={() => setPriceRange(p)}
                  className={cn(
                    'flex-1 h-10 text-sm font-medium rounded-lg border transition-all',
                    priceRange >= p
                      ? 'bg-saffron text-cream border-saffron'
                      : 'bg-cream text-brown-muted border-brown-muted/20 hover:border-saffron/40'
                  )}
                >
                  {'₹'.repeat(p)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Opening Hours */}
      <div className="bg-white rounded-xl border border-brown-muted/10 p-6">
        <h3 className="font-serif text-lg font-bold text-ink mb-5">Opening Hours</h3>
        <div className="space-y-2">
          {WEEKDAYS.map((day) => (
            <div key={day} className="flex items-center gap-4 py-2">
              <span className="w-24 text-sm text-ink font-medium">{day}</span>
              <input
                type="time"
                value={openingHours[day]?.open || '11:00'}
                onChange={(e) => setOpeningHours({ ...openingHours, [day]: { ...openingHours[day], open: e.target.value } })}
                className="h-9 px-3 text-sm rounded-lg border border-brown-muted/20 bg-cream text-ink focus:outline-none focus:ring-2 focus:ring-saffron"
              />
              <span className="text-brown-muted text-xs">to</span>
              <input
                type="time"
                value={openingHours[day]?.close || '23:00'}
                onChange={(e) => setOpeningHours({ ...openingHours, [day]: { ...openingHours[day], close: e.target.value } })}
                className="h-9 px-3 text-sm rounded-lg border border-brown-muted/20 bg-cream text-ink focus:outline-none focus:ring-2 focus:ring-saffron"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Cuisine Type */}
      <div className="bg-white rounded-xl border border-brown-muted/10 p-6">
        <h3 className="font-serif text-lg font-bold text-ink mb-5">Cuisine Type</h3>
        <div className="flex flex-wrap gap-2">
          {['North Indian', 'South Indian', 'Mughlai', 'Hyderabadi', 'Chinese', 'Continental', 'Biryani', 'Fast Food', 'Street Food', 'Desserts'].map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCuisines((prev) => prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c])}
              className={cn(
                'px-3.5 py-1.5 text-xs font-medium rounded-lg border transition-all',
                selectedCuisines.includes(c)
                  ? 'bg-saffron text-cream border-saffron'
                  : 'bg-cream text-brown-muted border-brown-muted/20 hover:border-saffron/40 hover:text-saffron'
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Photo Management */}
      <div className="bg-white rounded-xl border border-brown-muted/10 p-6">
        <h3 className="font-serif text-lg font-bold text-ink mb-5">Photo Management</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          {[1, 2, 3, 4].map((p) => (
            <div key={p} className="relative aspect-video rounded-lg bg-gradient-to-br from-saffron/10 to-cream-darker flex items-center justify-center group cursor-pointer overflow-hidden border border-brown-muted/10">
              <Camera className="w-6 h-6 text-brown-muted" />
              <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/40 transition-colors flex items-center justify-center">
                <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 bg-red-500 rounded-full hover:bg-red-600">
                  <Trash2 className="w-3.5 h-3.5 text-white" />
                </button>
              </div>
            </div>
          ))}
        </div>
        <Button variant="outline" className="gap-2">
          <Upload className="w-4 h-4" /> Upload New Photos
        </Button>
      </div>

      {/* Verification */}
      <div className="bg-white rounded-xl border border-brown-muted/10 p-6">
        <h3 className="font-serif text-lg font-bold text-ink mb-5">Verification</h3>
        <div className="flex items-center justify-between p-4 rounded-lg bg-green-50 border border-green-200">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
            <div>
              <p className="text-sm font-semibold text-green-800">Verified Restaurant</p>
              <p className="text-xs text-green-600">Your restaurant has been verified. The verification badge is visible on your listing.</p>
            </div>
          </div>
          <Badge variant="success" className="text-xs">Verified</Badge>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button className="bg-saffron hover:bg-saffron-light text-cream px-8 gap-2">
          <Check className="w-4 h-4" /> Save Changes
        </Button>
      </div>
    </div>
  )

  /* ─── RENDER ────────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-[#FBF6EE]">
      {/* Mobile Menu Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-ink/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full w-[260px] bg-white border-r border-brown-muted/10 flex flex-col transition-transform duration-300 lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Sidebar Header */}
        <div className="p-5 border-b border-brown-muted/10">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-saffron/10 flex items-center justify-center shrink-0">
                <span className="font-serif text-lg font-bold text-saffron">PR</span>
              </div>
              <div>
                <h2 className="font-serif text-base font-bold text-ink">{RESTAURANT.name}</h2>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs text-brown-muted">{RESTAURANT.owner}</span>
                  {RESTAURANT.isVerified && (
                    <Badge variant="success" className="text-[8px] px-1.5 py-0 gap-0.5">
                      <CheckCircle2 className="w-2.5 h-2.5" /> Verified
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="lg:hidden shrink-0 -mr-1 -mt-1" onClick={() => setSidebarOpen(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex items-center gap-1 text-xs text-brown-muted">
            <MapPin className="w-3 h-3" /> {RESTAURANT.city}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setSidebarOpen(false) }}
              className={cn(
                'w-full flex items-center gap-3 px-3.5 py-2.5 text-sm rounded-lg transition-all text-left',
                activeTab === item.id
                  ? 'bg-saffron/10 text-saffron font-semibold'
                  : 'text-brown-muted hover:text-ink hover:bg-cream-dark'
              )}
            >
              <item.icon className={cn('w-4 h-4', activeTab === item.id && 'text-saffron')} />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Bottom Links */}
        <div className="p-3 border-t border-brown-muted/10 space-y-1">
          <Link
            href="/restaurant/hyderabad/paradise"
            className="flex items-center gap-3 px-3.5 py-2.5 text-sm rounded-lg text-brown-muted hover:text-saffron hover:bg-cream-dark transition-all"
          >
            <ExternalLink className="w-4 h-4" />
            View Public Listing
            <span className="ml-auto">
              <ExternalLink className="w-3 h-3" />
            </span>
          </Link>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 text-sm rounded-lg text-red-500 hover:bg-red-50 transition-all"
          >
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
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="font-serif text-lg font-bold text-ink">
                  {NAV_ITEMS.find((n) => n.id === activeTab)?.label || 'Dashboard'}
                </h1>
                <p className="text-xs text-brown-muted hidden sm:block">
                  {RESTAURANT.name} · {RESTAURANT.city}
                </p>
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

      {/* Modals */}
      <AddDishModal open={showAddDish} onOpenChange={setShowAddDish} editDish={editDish} />
      <ReplyModal open={showReplyModal} onOpenChange={setShowReplyModal} review={replyReview} />
    </div>
  )
}
