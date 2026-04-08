"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";

const departments = [
  { id: "Pantry Staples", name: "Épicerie", slug: "epicerie" },
  { id: "Frozen Foods", name: "Surgelés", slug: "surgeles" },
  { id: "Beverages", name: "Boissons", slug: "boissons" },
  { id: "Produce & Greens", name: "Légumes", slug: "legumes" },
  { id: "Snacks", name: "Snacks", slug: "snacks" },
  { id: "Cosmetics", name: "Cosmétiques", slug: "cosmetiques" },
  { id: "Condiments", name: "Condiments", slug: "condiments" },
  { id: "Maison", name: "Maison", slug: "maison" },
];

const navItems = [
  { href: "/", label: "Accueil" },
  { href: "/shop", label: "Boutique" },
  { href: "/promotions", label: "Promotions" },
  { href: "/about", label: "À Propos" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDepartementsOpen, setIsDepartementsOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const departementsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    const handleClickOutside = (event: MouseEvent) => {
      if (departementsRef.current && !departementsRef.current.contains(event.target as Node)) {
        setIsDepartementsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    
    const stored = localStorage.getItem("admin_cart");
    if (stored) {
      try {
        const cart = JSON.parse(stored);
        setCartCount(cart.length || 0);
      } catch {}
    }
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/shop?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  if (!mounted) {
    return (
      <header className="bg-[#19212b]">
        <div className="max-w-7xl mx-auto px-4 h-16 lg:h-20"></div>
      </header>
    );
  }

  return (
    <header className={`bg-[#19212b] shadow-md`}>
      {/* Top Bar */}
      <div className="bg-[#47b6b1] text-white py-2">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center text-xs">
          <span>4821 Boul Henri-Bourassa Est, Montréal</span>
          <div className="flex items-center gap-4">
            <span>Lun-Ven: 9 AM - 9 PM | Sam: 9 AM - 10 PM | Dim: 9 AM - 10 PM</span>
            <a href="tel:+15144670229" className="hover:underline">+1 (514) 467-0229</a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-white p-1">
              <Image src="/logo.jpg" alt="Marché LT Eben-Ezer" width={40} height={40} className="w-full h-full object-contain" />
            </div>
            <div className="hidden sm:block">
              <span className="text-white font-bold text-lg leading-tight">Marché LT</span>
              <span className="block text-[#47b6b1] text-xs font-semibold">Eben-Ezer</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="px-3 py-2 text-white/90 hover:text-white hover:bg-white/10 rounded text-sm font-medium transition-colors">
                {item.label}
              </Link>
            ))}
            {/* Départements Dropdown */}
            <div className="relative" ref={departementsRef}>
              <button 
                onClick={() => setIsDepartementsOpen(!isDepartementsOpen)}
                className="flex items-center gap-1 px-3 py-2 text-white/90 hover:text-white hover:bg-white/10 rounded text-sm font-medium transition-colors"
              >
                Départements
                <svg className={`w-4 h-4 transition-transform ${isDepartementsOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isDepartementsOpen && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded shadow-xl border border-gray-200 overflow-hidden z-50">
                  {departments.map((dept) => (
                    <Link 
                      key={dept.id} 
                      href={`/shop/${dept.slug}`}
                      onClick={() => setIsDepartementsOpen(false)}
                      className="block px-4 py-2 text-[#19212b] hover:bg-[#f5f7fa] text-sm transition-colors"
                    >
                      {dept.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Rechercher un produit..." className="w-full px-4 py-2 pl-10 bg-white border border-gray-300 rounded text-[#19212b] placeholder-gray-500 focus:outline-none focus:border-[#47b6b1] transition-colors" />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </form>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Mobile Search Toggle */}
            <button onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)} className="md:hidden p-2 text-white/90 hover:text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Promotions Button */}
            <Link href="/promotions" className="hidden sm:flex items-center gap-1 px-3 py-1.5 bg-[#ec7205] text-white text-sm font-semibold rounded hover:bg-[#d66a05] transition-colors">
              Promos
            </Link>

            {/* Cart */}
            <Link href="/cart" className="relative p-2 text-white/90 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#ec7205] text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Toggle */}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-2 text-white/90 hover:text-white">
              {isMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        {isMobileSearchOpen && (
          <form onSubmit={handleSearch} className="md:hidden pb-4">
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Rechercher..." className="w-full px-4 py-2 bg-white border border-gray-300 rounded text-[#19212b] placeholder-gray-500 focus:outline-none focus:border-[#47b6b1]" />
          </form>
        )}

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="lg:hidden py-4 border-t border-white/20">
            <div className="flex flex-col gap-1">
              {navItems.map((item) => (
                <Link key={item.href} onClick={() => setIsMenuOpen(false)} href={item.href} className="px-3 py-2 text-white/90 hover:text-white hover:bg-white/10 rounded text-sm font-medium">
                  {item.label}
                </Link>
              ))}
              <div className="border-t border-white/20 my-2"></div>
              <span className="px-3 py-2 text-white/50 text-xs font-medium uppercase">Départements</span>
              {departments.map((dept) => (
                <Link key={dept.id} onClick={() => setIsMenuOpen(false)} href={`/shop/${dept.slug}`} className="px-3 py-2 text-white/90 hover:text-white hover:bg-white/10 rounded text-sm font-medium">
                  {dept.name}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
