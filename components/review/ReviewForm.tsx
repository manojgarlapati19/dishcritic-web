'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { StarRating } from './StarRating'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Camera, Loader2 } from 'lucide-react'

const reviewTags = [
  'Must Try',
  'Authentic',
  'Value for Money',
  'Generous Portion',
  'Fresh',
  'Spicy',
  'Underrated',
  'Overhyped',
  'Weekend Special',
  'Hidden Gem',
]

interface ReviewFormProps {
  onSubmit: (data: {
    rating: number
    text: string
    tags: string[]
    photo?: File
  }) => Promise<void>
  className?: string
}

export function ReviewForm({ onSubmit, className }: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [text, setText] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [photo, setPhoto] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPhoto(file)
      const reader = new FileReader()
      reader.onloadend = () => setPhotoPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0) return

    setSubmitting(true)
    try {
      await onSubmit({ rating, text, tags: selectedTags, photo: photo || undefined })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card className={cn('border-brown-muted/20', className)}>
      <CardHeader>
        <CardTitle>Write Your Review</CardTitle>
        <CardDescription>
          Rate this dish out of 10 and share your experience
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Star Rating */}
          <div className="flex justify-center py-4">
            <StarRating value={rating} onChange={setRating} size="lg" />
          </div>

          {/* Review Text */}
          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">
              Your Review
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What did you think of this dish? Describe the taste, portion, freshness..."
              rows={4}
              className="w-full rounded-md border border-brown-muted/40 bg-cream px-3 py-2 text-sm ring-offset-background placeholder:text-brown-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron focus-visible:ring-offset-2 resize-none"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">
              Tags
            </label>
            <div className="flex flex-wrap gap-1.5">
              {reviewTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagToggle(tag)}
                  className={cn(
                    'px-2.5 py-1 rounded-full text-xs font-medium border transition-all',
                    selectedTags.includes(tag)
                      ? 'bg-saffron text-cream border-saffron'
                      : 'bg-cream text-brown-muted border-brown-muted/30 hover:border-saffron/50'
                  )}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Photo Upload */}
          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">
              Add a Photo
            </label>
            <div className="flex items-center gap-3">
              <label className="cursor-pointer">
                <div className="flex items-center gap-1.5 px-3 py-2 rounded-md border border-brown-muted/30 bg-cream hover:bg-cream-dark text-sm text-brown-muted transition-colors">
                  <Camera className="w-4 h-4" />
                  Upload Photo
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </label>
              {photoPreview && (
                <div className="relative w-16 h-16 rounded-md overflow-hidden">
                  <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => {
                      setPhoto(null)
                      setPhotoPreview(null)
                    }}
                    className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-ink/50 text-cream text-xs flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={rating === 0 || submitting}
            className="w-full sm:w-auto"
          >
            {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {submitting ? 'Submitting...' : 'Submit Review'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
