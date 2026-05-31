import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Smile, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      let threshold = 50;
      if (location.pathname === '/') {
        threshold = window.innerHeight * 0.85; // almost past the 90vh hero
      } else if (location.pathname === '/about') {
        threshold = 300; // rough height of about hero
      }
      setIsScrolled(window.scrollY > threshold);
    };

    handleScroll(); // Check initially
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const closeMenu = () => setIsMobileMenuOpen(false);

  // We have dark hero sections on Home and About. So on those pages, text is white when resting at top.
  const isDarkHeroPage = location.pathname === '/' || location.pathname === '/about';
  const useLightText = isDarkHeroPage && !isScrolled;

  const textClass = useLightText ? "text-white" : "text-slate-900";
  const textDimClass = useLightText ? "text-white/90" : "text-slate-600";
  const borderClass = useLightText ? "border-white/30" : "border-slate-200";

  return (
    <header className={cn(
      "z-[100] w-full transition-all duration-300",
      isScrolled ? "fixed top-0 bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100 animate-in fade-in slide-in-from-top-4" : "absolute top-0 bg-transparent"
    )}>
      <div className={cn("max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between transition-all duration-300", isScrolled ? "h-16 mt-0" : "h-24 mt-2 lg:mt-4")}>
        <Link to="/" className="flex items-center gap-4 group" onClick={closeMenu}>
          <div className={cn("relative flex items-center justify-center w-10 h-10 font-serif select-none", textClass)}>
            <span className="text-[2.5rem] absolute -left-1 opacity-90">S</span>
            <span className="text-[3rem] absolute bottom-[-6px] -right-2 z-10 leading-none">J</span>
          </div>
          <div className={cn("flex flex-col pl-4 py-1 border-l", borderClass)}>
            <span className={cn("text-base uppercase tracking-[0.2em] font-serif leading-tight", textClass)}>
              Riad's
            </span>
            <span className={cn("text-xs uppercase tracking-[0.2em] font-sans leading-tight mt-1", useLightText ? "text-white/80" : "text-slate-500")}>
              Dental Care
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className={cn("hidden md:flex items-center gap-10 text-sm font-medium transition-colors", textDimClass)}>
          <Link to="/about" className={cn("transition-colors", useLightText ? "hover:text-teal-400" : "hover:text-teal-600")}>About Us</Link>
          <a href="/#services" className={cn("transition-colors", useLightText ? "hover:text-teal-400" : "hover:text-teal-600")}>Services</a>
          <a href="/#location" className={cn("transition-colors", useLightText ? "hover:text-teal-400" : "hover:text-teal-600")}>Maps</a>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Link 
            to="/book" 
            className="inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-2.5 rounded-full bg-teal-500 text-white text-xs sm:text-sm font-medium hover:bg-teal-400 hover:shadow-lg hover:shadow-teal-500/20 transition-all focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            Book Appointment
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className={cn("md:hidden p-2 transition-colors focus:outline-none", textDimClass, useLightText ? "hover:text-teal-400" : "hover:text-teal-600")}
          onClick={() => setIsMobileMenuOpen(true)}
          aria-label="Open mobile menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-white/95 backdrop-blur-md z-[100] flex flex-col p-6 overflow-y-auto w-full h-[100dvh]">
          <div className="flex items-center justify-between mb-12">
            <Link to="/" className="flex items-center gap-4 group" onClick={closeMenu}>
              <div className="relative flex items-center justify-center w-10 h-10 text-slate-900 font-serif select-none">
                <span className="text-[2.5rem] absolute -left-1 opacity-90">S</span>
                <span className="text-[3rem] absolute bottom-[-6px] -right-2 z-10 leading-none">J</span>
              </div>
              <div className="flex flex-col pl-4 py-1 border-l border-slate-200">
                <span className="text-slate-900 text-base uppercase tracking-[0.2em] font-serif leading-tight">
                  Riad's
                </span>
                <span className="text-slate-500 text-xs uppercase tracking-[0.2em] font-sans leading-tight mt-1">
                  Dental Care
                </span>
              </div>
            </Link>
            <button
              className="p-2 text-slate-600 hover:text-teal-600 transition-colors focus:outline-none"
              onClick={closeMenu}
              aria-label="Close mobile menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <nav className="flex flex-col gap-6 text-2xl font-semibold text-slate-700">
            <Link to="/about" onClick={closeMenu} className="hover:text-teal-600 transition-colors">About Us</Link>
            <a href="/#services" onClick={closeMenu} className="hover:text-teal-600 transition-colors">Services</a>
            <a href="/#location" onClick={closeMenu} className="hover:text-teal-600 transition-colors">Maps</a>
          </nav>
          
          <div className="mt-10 pt-10 border-t border-slate-100 flex flex-col gap-4">
            <Link 
              to="/book" 
              onClick={closeMenu}
              className="inline-flex justify-center w-full px-6 py-4 rounded-full bg-teal-600 text-white font-medium text-xl hover:bg-teal-700 transition-all"
            >
              Book Appointment
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
