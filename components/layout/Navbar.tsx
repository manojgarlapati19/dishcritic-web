'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Menu, Search, MapPin, Award, Store, PenSquare, User, LogOut, Bookmark, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { useStore } from '@/store/useStore'

const navLinks = [
  { label: 'Discover', href: '/search', icon: Search },
  { label: 'Leaderboards', href: '/leaderboards', icon: Award },
  { label: 'Cities', href: '/cities', icon: MapPin },
  { label: 'For Restaurants', href: '/for-restaurants', icon: Store },
]

export function Navbar() {
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { user, isAuthenticated, signOut } = useStore()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSignOut = async () => {
    await signOut()
    setShowUserMenu(false)
    router.push('/')
  }

  const getUserInitial = () => {
    if (user?.name) return user.name.charAt(0).toUpperCase()
    return 'U'
  }

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-cream/90 backdrop-blur-md shadow-sm'
          : 'bg-cream'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-full bg-saffron flex items-center justify-center transition-transform group-hover:scale-105">
              <span className="text-cream font-bold text-lg font-serif">D</span>
            </div>
            <span className="font-serif text-xl font-semibold text-ink hidden sm:block">
              DishCritic
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="flex items-center gap-1.5 px-3 py-2 text-sm text-ink/70 hover:text-saffron rounded-md hover:bg-cream-dark transition-all"
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-cream-dark transition-all"
                >
                  <div className="w-8 h-8 rounded-full bg-saffron flex items-center justify-center">
                    {user.avatar_url ? (
                      <Image
                        src={user.avatar_url}
                        alt={user.name}
                        className="w-full h-full rounded-full object-cover"
                        width={32}
                        height={32}
                      />
                    ) : (
                      <span className="text-cream font-bold text-sm">{getUserInitial()}</span>
                    )}
                  </div>
                  <span className="text-sm font-medium text-ink hidden sm:block max-w-[100px] truncate">
                    {user.name || 'User'}
                  </span>
                  <ChevronDown className={cn('w-3.5 h-3.5 text-brown-muted transition-transform', showUserMenu && 'rotate-180')} />
                </button>

                {showUserMenu && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowUserMenu(false)} />
                    <div className="absolute right-0 top-full mt-1.5 z-20 w-52 bg-cream border border-brown-muted/10 rounded-xl shadow-xl overflow-hidden">
                      <Link
                        href={`/profile/${user.id}`}
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2.5 px-4 py-3 text-sm text-ink hover:bg-cream-dark transition-colors"
                      >
                        <User className="w-4 h-4 text-brown-muted" />
                        My Profile
                      </Link>
                      <Link
                        href={`/profile/${user.id}?tab=reviews`}
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2.5 px-4 py-3 text-sm text-ink hover:bg-cream-dark transition-colors"
                      >
                        <PenSquare className="w-4 h-4 text-brown-muted" />
                        My Reviews
                      </Link>
                      <Link
                        href={`/profile/${user.id}?tab=saved`}
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2.5 px-4 py-3 text-sm text-ink hover:bg-cream-dark transition-colors"
                      >
                        <Bookmark className="w-4 h-4 text-brown-muted" />
                        Saved
                      </Link>
                      <div className="border-t border-brown-muted/10" />
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link href="/auth">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
            )}
            <Link href="/review/new">
              <Button size="sm" className="hidden sm:inline-flex gap-1.5">
                <PenSquare className="w-4 h-4" />
                Write a Review
              </Button>
            </Link>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <div className="flex flex-col gap-6 mt-8">
                  <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-saffron flex items-center justify-center">
                      <span className="text-cream font-bold text-base font-serif">D</span>
                    </div>
                    <span className="font-serif text-lg font-semibold">DishCritic</span>
                  </Link>

                  <nav className="flex flex-col gap-1">
                    {navLinks.map((link) => (
                      <SheetClose asChild key={link.label}>
                        <Link
                          href={link.href}
                          className="flex items-center gap-3 px-3 py-2.5 text-sm text-ink/70 hover:text-saffron rounded-md hover:bg-cream-dark transition-all"
                        >
                          <link.icon className="w-4 h-4" />
                          {link.label}
                        </Link>
                      </SheetClose>
                    ))}
                    {isAuthenticated && user && (
                      <>
                        <SheetClose asChild>
                          <Link
                            href={`/profile/${user.id}`}
                            className="flex items-center gap-3 px-3 py-2.5 text-sm text-ink/70 hover:text-saffron rounded-md hover:bg-cream-dark transition-all"
                          >
                            <User className="w-4 h-4" />
                            My Profile
                          </Link>
                        </SheetClose>
                      </>
                    )}
                  </nav>

                  <div className="border-t border-brown-muted/20 pt-4 flex flex-col gap-2">
                    {!isAuthenticated && (
                      <SheetClose asChild>
                        <Link href="/auth">
                          <Button variant="outline" className="w-full">
                            Sign In
                          </Button>
                        </Link>
                      </SheetClose>
                    )}
                    {isAuthenticated && (
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    )}
                    <SheetClose asChild>
                      <Link href="/review/new">
                        <Button className="w-full gap-1.5">
                          <PenSquare className="w-4 h-4" />
                          Write a Review
                        </Button>
                      </Link>
                    </SheetClose>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
