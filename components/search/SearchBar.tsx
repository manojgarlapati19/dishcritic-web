'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, X } from 'lucide-react'
import { useStore } from '@/store/useStore'

interface SearchBarProps {
  variant?: 'hero' | 'compact'
  className?: string
  placeholder?: string
}

const popularSearches = [
  'Biryani',
  'Masala Dosa',
  'Butter Chicken',
  'Pani Puri',
  'Hyderabadi Biryani',
  'Pav Bhaji',
]

export function SearchBar({
  variant = 'compact',
  className,
  placeholder = 'Search any dish... e.g. Biryani, Dosa, Butter Chicken',
}: SearchBarProps) {
  const router = useRouter()
  const { searchQuery, setSearchQuery } = useStore()
  const [localQuery, setLocalQuery] = useState(searchQuery)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = (query: string) => {
    const q = query.trim()
    if (q) {
      setSearchQuery(q)
      setShowSuggestions(false)
      router.push(`/search?q=${encodeURIComponent(q)}`)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(localQuery)
    }
  }

  const filteredSuggestions = localQuery
    ? popularSearches.filter((s) =>
        s.toLowerCase().includes(localQuery.toLowerCase())
      )
    : popularSearches

  return (
    <div ref={wrapperRef} className={cn('relative', className)}>
      <div
        className={cn(
          'flex items-center gap-2',
          variant === 'hero' && 'scale-110'
        )}
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brown-muted" />
          <Input
            ref={inputRef}
            value={localQuery}
            onChange={(e) => {
              setLocalQuery(e.target.value)
              setShowSuggestions(true)
            }}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={cn(
              'pl-9 pr-8',
              variant === 'hero' && 'h-12 text-base rounded-xl'
            )}
          />
          {localQuery && (
            <button
              onClick={() => {
                setLocalQuery('')
                setSearchQuery('')
                inputRef.current?.focus()
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-brown-muted hover:text-ink"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <Button
          onClick={() => handleSearch(localQuery)}
          className={cn(variant === 'hero' && 'h-12 px-6 rounded-xl')}
        >
          <Search className="w-4 h-4 sm:mr-1.5" />
          <span className="hidden sm:inline">Search</span>
        </Button>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-cream border border-brown-muted/20 rounded-lg shadow-lg z-10 overflow-hidden">
          {filteredSuggestions.length === 0 ? (
            <p className="px-4 py-3 text-sm text-brown-muted">
              No results. Press Enter to search &ldquo;{localQuery}&rdquo;
            </p>
          ) : (
            <ul>
              {filteredSuggestions.map((suggestion) => (
                <li key={suggestion}>
                  <button
                    onClick={() => {
                      setLocalQuery(suggestion)
                      handleSearch(suggestion)
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm text-ink hover:bg-cream-dark transition-colors flex items-center gap-2"
                  >
                    <Search className="w-3.5 h-3.5 text-brown-muted flex-shrink-0" />
                    {suggestion}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
