"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Palette, 
  Monitor, 
  Zap, 
  Star, 
  Menu, 
  X, 
  ChevronRight,
  ChevronUp,
  Mail,
  Phone,
  MapPin,
  Globe,
  Quote,
  Instagram,
  Linkedin,
  ExternalLink,
  Send
} from "lucide-react";

// ============================================================================
// CUSTOM CURSOR COMPONENT - Desktop Only
// ============================================================================
function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isOnDark, setIsOnDark] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || window.innerWidth < 1024) return;
    
    // Check for touch devices
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
    if (isTouchDevice) return;
    
    const cursor = cursorRef.current;
    if (!cursor) return;

    const moveCursor = (e: MouseEvent) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
      
      const element = document.elementFromPoint(e.clientX, e.clientY);
      const computedStyle = element ? window.getComputedStyle(element) : null;
      const bgColor = computedStyle?.backgroundColor;
      
      if (bgColor) {
        const rgb = bgColor.match(/\d+/g);
        if (rgb && rgb.length >= 3) {
          const brightness = (parseInt(rgb[0]) + parseInt(rgb[1]) + parseInt(rgb[2])) / 3;
          setIsOnDark(brightness < 100);
        }
      }
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    document.addEventListener("mousemove", moveCursor);
    
    const interactiveElements = document.querySelectorAll("a, button, .interactive");
    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", handleMouseEnter);
      el.addEventListener("mouseleave", handleMouseLeave);
    });

    return () => {
      document.removeEventListener("mousemove", moveCursor);
      interactiveElements.forEach((el) => {
        el.removeEventListener("mouseenter", handleMouseEnter);
        el.removeEventListener("mouseleave", handleMouseLeave);
      });
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className={`custom-cursor hidden lg:block ${isHovering ? "hovering" : ""} ${isOnDark ? "on-dark" : ""}`}
    />
  );
}

// ============================================================================
// SCROLL REVEAL HOOK
// ============================================================================
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
}

// ============================================================================
// ANIMATED COUNTER COMPONENT
// ============================================================================
function AnimatedCounter({ end, duration = 2000, suffix = "" }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const { ref, isVisible } = useScrollReveal();

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [isVisible, end, duration]);

  return (
    <span ref={ref} className="font-[family-name:var(--font-bebas-neue)]">
      {count}{suffix}
    </span>
  );
}

// ============================================================================
// LOADING SCREEN COMPONENT
// ============================================================================
function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [showTahir, setShowTahir] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    
    // Animate progress bar 0 to 100 over 1.5s with easing
    const duration = 1800;
    const startTime = Date.now();
    
    const animateProgress = () => {
      const elapsed = Date.now() - startTime;
      // Ease out cubic for smoother feel
      const rawProgress = Math.min(elapsed / duration, 1);
      const easedProgress = 1 - Math.pow(1 - rawProgress, 3);
      const newProgress = easedProgress * 100;
      setProgress(newProgress);
      
      // Show "Tahir" when progress reaches 40%
      if (newProgress >= 40 && !showTahir) {
        setShowTahir(true);
      }
      
      if (rawProgress < 1) {
        requestAnimationFrame(animateProgress);
      }
    };
    
    requestAnimationFrame(animateProgress);
    
    // After 2.5s call onComplete()
    const timeout = setTimeout(() => {
      document.body.style.overflow = 'unset';
      onComplete();
    }, 2500);
    
    return () => {
      clearTimeout(timeout);
      document.body.style.overflow = 'unset';
    };
  }, [onComplete, showTahir]);

  return (
    <motion.div
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0A0A0A] overflow-hidden"
    >
      {/* Background Decorative Elements */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.1 }}
        transition={{ delay: 0.3, duration: 1 }}
        className="absolute w-[600px] h-[600px] border-2 border-[#FFD000] rotate-45"
      />
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.05 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="absolute w-[400px] h-[400px] border-2 border-[#FFD000] rotate-12"
      />
      
      {/* Name Container */}
      <div className="relative flex flex-col items-center mb-12 sm:mb-14 md:mb-16 overflow-hidden gap-1 sm:gap-2 md:gap-3">
        {/* Logo Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.1, duration: 0.6, type: "spring" }}
          className="mb-2 sm:mb-4"
        >
          <img 
            src="/logo.png" 
            alt="Logo" 
            className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-contain"
          />
        </motion.div>
        
        {/* Abdullah. */}
        <motion.div
          initial={{ x: '-100vw', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ 
            delay: 0.2, 
            duration: 0.8, 
            ease: [0.25, 0.46, 0.45, 0.94],
            type: "spring",
            stiffness: 100
          }}
          className="relative py-1"
        >
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-[family-name:var(--font-bebas-neue)] text-[#FFD000]">
            Abdullah
          </h1>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.7, duration: 0.3 }}
            className="absolute -bottom-1 left-0 w-full h-0.5 sm:h-1 bg-[#FFD000] origin-left"
          />
        </motion.div>
        
        {/* Tahir. */}
        <motion.div
          initial={{ x: '100vw', opacity: 0 }}
          animate={showTahir ? { x: 0, opacity: 1 } : {}}
          transition={{ 
            duration: 0.8, 
            ease: [0.25, 0.46, 0.45, 0.94],
            type: "spring",
            stiffness: 100
          }}
          className="relative py-1"
        >
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-[family-name:var(--font-bebas-neue)] text-white">
            Tahir
          </h1>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="absolute -bottom-1 left-0 w-full h-0.5 sm:h-1 bg-white origin-left"
          />
        </motion.div>
        
        {/* Decorative Dot */}
        <motion.span
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 1.5, duration: 0.5, type: "spring" }}
          className="absolute -right-4 sm:-right-6 md:-right-8 lg:-right-10 top-1 text-[#FFD000] text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-[family-name:var(--font-bebas-neue)]"
        >
          .
        </motion.span>
      </div>
      
      {/* Crazy Progress Bar Container */}
      <div className="relative w-56 sm:w-72 md:w-80">
        {/* Progress Bar Background */}
        <div className="relative h-2 bg-[#222] overflow-hidden">
          {/* Main Progress Fill */}
          <motion.div
            className="h-full relative"
            style={{ width: `${progress}%` }}
          >
            {/* Gradient Layer */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#FFD000] via-[#FFF9D6] to-[#FFD000] animate-loading-shimmer" 
                 style={{ backgroundSize: '200% 100%' }} />
            
            {/* Glowing Edge */}
            <motion.div
              className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#FFD000] to-transparent blur-sm"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            />
          </motion.div>
          
          {/* Scan Line Effect */}
          <motion.div
            className="absolute top-0 bottom-0 w-1 bg-white/50 blur-sm"
            animate={{ left: ['-10%', '110%'] }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          
          {/* Striped Pattern Overlay */}
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 4px, #FFD000 4px, #FFD000 8px)',
              animation: 'stripes 0.5s linear infinite'
            }}
          />
        </div>
        
        {/* Progress Percentage */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute -top-8 right-0 text-xs font-[family-name:var(--font-syne)] font-bold text-[#FFD000]"
        >
          {Math.round(progress)}%
        </motion.div>
        
        {/* Decorative Corner Brackets */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 0.5 }}
          className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-[#FFD000]"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 0.5 }}
          className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-[#FFD000]"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 0.5 }}
          className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-[#FFD000]"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 0.5 }}
          className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-[#FFD000]"
        />
      </div>
      
      {/* Loading Text with Typing Effect */}
      <div className="mt-6 flex items-center gap-2">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-sm text-[#888888] font-[family-name:var(--font-dm-sans)]"
        >
          Loading
          <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
          >...</motion.span>
        </motion.p>
        
        {/* Pulsing Dots */}
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 bg-[#FFD000]"
              animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
              transition={{ 
                duration: 0.8, 
                repeat: Infinity, 
                delay: i * 0.15 
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================================
// WHATSAPP FLOATING BUTTON
// ============================================================================
function WhatsAppButton({ isVisible }: { isVisible: boolean }) {
  const [showTooltip, setShowTooltip] = useState(false);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="fixed bottom-20 right-6 z-50"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-[#0A0A0A] text-white px-3 py-2 text-xs font-[family-name:var(--font-syne)] whitespace-nowrap"
          >
            Chat on WhatsApp
          </motion.div>
        )}
      </AnimatePresence>
      
      <a
        href="https://wa.me/923196457841"
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-btn w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center bg-[#25D366] transition-all"
        aria-label="Chat on WhatsApp"
      >
        <svg viewBox="0 0 24 24" fill="white" width="26" height="26">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </motion.div>
  );
}

// ============================================================================
// BACK TO TOP BUTTON
// ============================================================================
function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsVisible(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-49 w-12 h-12 flex items-center justify-center bg-[#FFD000] hover:bg-[#0A0A0A] hover:text-[#FFD000] transition-all group"
          aria-label="Back to top"
        >
          <ChevronUp size={24} className="text-[#0A0A0A] group-hover:text-[#FFD000]" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

// ============================================================================
// NAVIGATION COMPONENT
// ============================================================================
function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Track active section using Intersection Observer
  useEffect(() => {
    const sections = ["services", "works", "contact"];
    
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -80% 0px",
      threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach((sectionId) => {
      const section = document.getElementById(sectionId);
      if (section) {
        observer.observe(section);
      }
    });

    return () => observer.disconnect();
  }, []);

  const navLinks = [
    { href: "#services", label: "Services" },
    { href: "#works", label: "Works" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-[#0A0A0A]/95 backdrop-blur-sm border-b-2 border-[#FFD000] py-2 md:py-3"
            : "bg-transparent py-3 md:py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a
              href="#"
              className="flex items-center gap-2 sm:gap-3 group"
            >
              <img 
                src="/logo.png" 
                alt="Abdullah Tahir Logo" 
                className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 object-contain transition-transform group-hover:scale-110"
              />
              <span className="text-2xl sm:text-3xl md:text-4xl font-[family-name:var(--font-bebas-neue)] text-[#FFD000] group-hover:text-[#E6B800] transition-colors">
                Abdullah.
              </span>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => {
                const sectionId = link.href.replace("#", "");
                const isActive = activeSection === sectionId;
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    className={`nav-link font-[family-name:var(--font-syne)] font-medium transition-colors ${
                      isActive 
                        ? "text-[#FFD000]" 
                        : "text-white hover:text-[#FFD000]"
                    }`}
                  >
                    {link.label}
                  </a>
                );
              })}
            </div>

            {/* Right Side - Desktop */}
            <div className="hidden lg:flex items-center gap-6">
              <a
                href="tel:+923196457841"
                className="text-white font-[family-name:var(--font-syne)] font-medium hover:text-[#FFD000] transition-colors"
              >
                +92 319 6457841
              </a>
              <a
                href="#contact"
                className="btn-primary bg-[#FFD000] text-[#0A0A0A] px-6 py-3 font-[family-name:var(--font-syne)] font-bold hover:bg-[#E6B800] transition-all"
              >
                Hire Me
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden text-white p-2 -mr-2"
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#FFD000] overflow-y-auto"
          >
            <div className="min-h-screen flex flex-col p-4 sm:p-6">
              <div className="flex justify-between items-center">
                <a href="#" className="flex items-center gap-2">
                  <img 
                    src="/logo.png" 
                    alt="Abdullah Tahir Logo" 
                    className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
                  />
                  <span className="text-2xl sm:text-3xl font-[family-name:var(--font-bebas-neue)] text-[#0A0A0A]">
                    Abdullah.
                  </span>
                </a>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-[#0A0A0A] p-2 -mr-2"
                  aria-label="Close menu"
                >
                  <X size={24} />
                </button>
              </div>

              <nav className="flex-1 flex flex-col justify-center gap-4 sm:gap-6 py-8">
                {navLinks.map((link, index) => {
                  const sectionId = link.href.replace("#", "");
                  const isActive = activeSection === sectionId;
                  return (
                    <motion.a
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`text-4xl sm:text-5xl md:text-6xl font-[family-name:var(--font-bebas-neue)] transition-colors ${
                        isActive 
                          ? "text-white" 
                          : "text-[#0A0A0A] hover:text-white"
                      }`}
                    >
                      {link.label}
                    </motion.a>
                  );
                })}
              </nav>

              <div className="space-y-4 pt-4 border-t-2 border-[#0A0A0A]/20">
                <a
                  href="tel:+923196457841"
                  className="flex items-center gap-2 text-base sm:text-lg font-[family-name:var(--font-syne)] text-[#0A0A0A] hover:text-white transition-colors"
                >
                  <Phone size={18} />
                  +92 319 6457841
                </a>
                <a
                  href="https://wa.me/923196457841"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-[#0A0A0A] text-white text-center py-3 sm:py-4 font-[family-name:var(--font-syne)] font-bold hover:bg-black transition-colors"
                >
                  Hire Me
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ============================================================================
// HERO SECTION
// ============================================================================
function HeroSection() {
  const stats = [
    { value: 5, suffix: "+", label: "Years Exp" },
    { value: 300, suffix: "+", label: "Projects" },
    { value: 8, suffix: "", label: "Websites" },
  ];

  return (
    <section className="relative flex items-center overflow-hidden bg-white">
      {/* Background Yellow Blob */}
      <div className="absolute top-0 right-0 w-[50%] h-[40%] bg-[#FFD000] rounded-bl-[60px] md:rounded-bl-[120px] lg:rounded-bl-[180px] opacity-20 md:opacity-30 -z-10" />
      
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 lg:pt-24 pb-4 sm:pb-6 lg:pb-8">
        <div className="flex flex-col-reverse sm:flex-row gap-4 sm:gap-6 md:gap-8 lg:gap-12 items-center">
          
          {/* Left Side - Content */}
          <div className="w-full sm:w-[55%] lg:w-[55%] space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6">
            {/* Available Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="inline-flex items-center gap-2 bg-[#FFD000] text-[#0A0A0A] px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-[family-name:var(--font-syne)] font-bold">
                <span className="relative flex h-2.5 w-2.5 sm:h-3 sm:w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 sm:h-3 sm:w-3 bg-green-500"></span>
                </span>
                AVAILABLE FOR WORK
              </span>
            </motion.div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-[family-name:var(--font-bebas-neue)] text-[#0A0A0A] leading-[0.95]">
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="block"
              >
                HEY,
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="block"
              >
                I&apos;M ABDULLAH
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="block relative"
              >
                TAHIR.
                <span className="absolute bottom-0 left-0 w-full h-[18%] sm:h-[20%] lg:h-[22%] bg-[#FFD000] -z-10" />
              </motion.span>
            </h1>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-sm sm:text-base md:text-lg lg:text-xl text-[#888888] max-w-md font-[family-name:var(--font-dm-sans)] leading-relaxed"
            >
              Digital Designer crafting bold brand visuals, web solutions, and digital experiences that actually get results.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-wrap gap-3 sm:gap-4"
            >
              <a
                href="#works"
                className="btn-primary bg-[#FFD000] text-[#0A0A0A] px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 font-[family-name:var(--font-syne)] font-bold text-xs sm:text-sm md:text-base lg:text-lg hover:bg-[#E6B800] transition-all flex items-center gap-2"
              >
                See My Work
                <ChevronRight className="rotate-90 w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              <a
                href="https://wa.me/923196457841"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary bg-[#0A0A0A] text-white px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 font-[family-name:var(--font-syne)] font-bold text-xs sm:text-sm md:text-base lg:text-lg hover:bg-black transition-all flex items-center gap-2"
              >
                Say Hello
                <span className="text-base sm:text-lg md:text-xl">👋</span>
              </a>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-wrap items-center gap-3 sm:gap-4 md:gap-6 pt-1 sm:pt-2"
            >
              {stats.map((stat, index) => (
                <div key={stat.label} className="flex items-center gap-3 sm:gap-4 md:gap-6">
                  {index > 0 && <div className="h-6 sm:h-8 md:h-10 w-px bg-[#0A0A0A]/20" />}
                  <div className="text-left">
                    <div className="text-xl sm:text-2xl md:text-3xl font-[family-name:var(--font-bebas-neue)] text-[#0A0A0A]">
                      <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                    </div>
                    <div className="text-xs sm:text-sm text-[#888888] font-[family-name:var(--font-dm-sans)]">
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Side - Photo */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="w-full sm:w-[42%] md:w-[40%] lg:w-[40%] relative flex-shrink-0 flex justify-center sm:justify-end animate-float"
          >
            {/* Photo Container */}
            <div className="relative w-full max-w-[200px] sm:max-w-[200px] md:max-w-[280px] lg:max-w-[350px] xl:max-w-[400px] sm:ml-auto">
              {/* Main Photo */}
              <div className="relative">
                <img
                  src="/abdullah-hero.jpg"
                  alt="Abdullah Tahir - Digital Designer"
                  className="w-full h-auto object-contain"
                />
                
                {/* Border accents - visible on lg+ */}
                <div className="hidden lg:block absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-[#FFD000]" />
                <div className="hidden lg:block absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-[#FFD000]" />
              </div>

              {/* Floating Badges - visible on lg+ */}
              <div className="hidden lg:flex absolute -bottom-3 left-4 bg-[#0A0A0A] text-white px-3 py-1.5 font-[family-name:var(--font-syne)] text-xs items-center gap-1.5 whitespace-nowrap z-10">
                <MapPin size={12} className="text-[#FFD000]" />
                Pakistan
              </div>
              <div className="hidden lg:flex absolute -top-3 right-4 bg-[#FFD000] text-[#0A0A0A] px-3 py-1.5 font-[family-name:var(--font-syne)] text-xs font-bold items-center gap-1.5 whitespace-nowrap z-10">
                <Globe size={12} />
                Remote
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// MARQUEE SECTION
// ============================================================================
function MarqueeSection() {
  const items = [
    "BRAND VISUALS",
    "WEB SOLUTIONS",
    "DIGITAL DESIGNER",
    "WEDDING DESIGNS",
    "ISLAMIC ART",
    "EVENT GRAPHICS",
    "AI-POWERED",
    "PAKISTAN",
  ];

  return (
    <section className="bg-[#0A0A0A] py-2 sm:py-3 md:py-4 overflow-hidden">
      <div className="flex animate-marquee whitespace-nowrap">
        {[...items, ...items].map((item, index) => (
          <span
            key={index}
            className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-[family-name:var(--font-bebas-neue)] text-[#FFD000] mx-2 sm:mx-3 md:mx-4 lg:mx-8"
          >
            ✦ {item}
          </span>
        ))}
      </div>
    </section>
  );
}

// ============================================================================
// SERVICES SECTION
// ============================================================================
function ServicesSection() {
  const { ref, isVisible } = useScrollReveal();

  const services = [
    {
      number: "01",
      icon: Palette,
      title: "Brand Visuals",
      description:
        "Wedding designs, Islamic art, event graphics, social media content, and complete brand identity — delivered fast and beautifully.",
      tag: "300+ Designs",
    },
    {
      number: "02",
      icon: Monitor,
      title: "Web Solutions",
      description:
        "Clean, professional websites built to represent your brand online and convert visitors into real customers.",
      tag: "8 Websites Built",
    },
    {
      number: "03",
      icon: Zap,
      title: "Digital Solutions",
      description:
        "AI-powered problem solving — documents, presentations, automation, and custom digital deliverables tailored to your needs.",
      tag: "Fast Turnaround",
    },
    {
      number: "04",
      icon: Star,
      title: "Event & Wedding",
      description:
        "Baat Paaki, Mayon, Mehndi, Engagement, Bridal Shower — beautifully crafted event graphics for your special moments.",
      tag: "Pakistani Specialist",
    },
  ];

  return (
    <section
      id="services"
      ref={ref}
      className="py-12 sm:py-16 md:py-20 lg:py-28 bg-[#F9F7F0]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-8 sm:mb-12 md:mb-16"
        >
          <span className="text-xs sm:text-sm font-[family-name:var(--font-syne)] text-[#888888] uppercase tracking-wider">
            — SERVICES
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-[family-name:var(--font-bebas-neue)] text-[#0A0A0A] mt-1 sm:mt-2">
            WHAT I DO BEST
          </h2>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.number}
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="service-card bg-white border-2 border-[#0A0A0A] p-5 sm:p-6 md:p-8 relative group cursor-pointer active:bg-[#FFD000] transition-colors"
            >
              {/* Background Number */}
              <span className="card-number absolute top-2 sm:top-3 md:top-4 right-2 sm:right-3 md:right-4 text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-[family-name:var(--font-bebas-neue)] text-[#F9F7F0] transition-colors">
                {service.number}
              </span>

              {/* Content */}
              <div className="relative z-10">
                <service.icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-[#FFD000] mb-3 sm:mb-4" />
                <h3 className="card-title text-xl sm:text-2xl md:text-3xl font-[family-name:var(--font-bebas-neue)] text-[#0A0A0A] mb-2 sm:mb-3 transition-colors">
                  {service.title}
                </h3>
                <p className="card-description text-sm sm:text-base text-[#888888] font-[family-name:var(--font-dm-sans)] mb-3 sm:mb-4 leading-relaxed transition-colors">
                  {service.description}
                </p>
                <span className="card-tag inline-block bg-[#FFF9D6] text-[#0A0A0A] px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm font-[family-name:var(--font-syne)] font-bold transition-colors">
                  {service.tag}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// STATS SECTION
// ============================================================================
function StatsSection() {
  const { ref, isVisible } = useScrollReveal();

  const stats = [
    { value: 300, suffix: "+", label: "Projects Completed" },
    { value: 8, suffix: "", label: "Websites Built" },
    { value: 5, suffix: "", label: "Years Experience" },
  ];

  return (
    <section
      ref={ref}
      className="py-8 sm:py-12 md:py-16 lg:py-20 bg-[#0A0A0A]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-center gap-4 sm:gap-8 md:gap-12 lg:gap-16"
        >
          {stats.map((stat, index) => (
            <div key={stat.label} className="flex items-center gap-4 sm:gap-8 md:gap-12 lg:gap-16">
              {index > 0 && (
                <div className="h-8 sm:h-14 md:h-16 lg:h-20 w-px bg-[#FFD000]" />
              )}
              <div className="text-center">
                <div className="text-2xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-[family-name:var(--font-bebas-neue)] text-[#FFD000]">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-[10px] sm:text-sm md:text-base lg:text-lg xl:text-xl text-white font-[family-name:var(--font-dm-sans)] mt-0.5 sm:mt-2">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ============================================================================
// PROJECT MODAL COMPONENT
// ============================================================================
function ProjectModal({ 
  project, 
  isOpen, 
  onClose 
}: { 
  project: {
    title: string;
    category: string;
    description: string;
    client: string;
    year: string;
    services: string[];
  } | null; 
  isOpen: boolean; 
  onClose: () => void;
}) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!project || !isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0A0A0A]/90 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-[#0A0A0A] text-white hover:bg-[#FFD000] hover:text-[#0A0A0A] transition-colors"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>

          {/* Project Image Placeholder */}
          <div className="h-48 sm:h-64 md:h-80 bg-gradient-to-br from-[#FFD000] via-[#E6B800] to-[#FFD000] flex items-center justify-center">
            <span className="text-6xl sm:text-8xl font-[family-name:var(--font-bebas-neue)] text-[#0A0A0A]/20">
              {project.title.charAt(0)}
            </span>
          </div>

          {/* Project Content */}
          <div className="p-6 sm:p-8 md:p-10">
            {/* Category Badge */}
            <span className="inline-block bg-[#FFD000] text-[#0A0A0A] px-3 py-1 text-xs sm:text-sm font-[family-name:var(--font-syne)] font-bold mb-4">
              {project.category}
            </span>

            {/* Title */}
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-[family-name:var(--font-bebas-neue)] text-[#0A0A0A] mb-4">
              {project.title}
            </h3>

            {/* Description */}
            <p className="text-sm sm:text-base md:text-lg text-[#888888] font-[family-name:var(--font-dm-sans)] leading-relaxed mb-6">
              {project.description}
            </p>

            {/* Project Details */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div>
                <p className="text-xs text-[#888888] font-[family-name:var(--font-dm-sans)] uppercase tracking-wider mb-1">
                  Client
                </p>
                <p className="text-sm sm:text-base font-[family-name:var(--font-syne)] font-bold text-[#0A0A0A]">
                  {project.client}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#888888] font-[family-name:var(--font-dm-sans)] uppercase tracking-wider mb-1">
                  Year
                </p>
                <p className="text-sm sm:text-base font-[family-name:var(--font-syne)] font-bold text-[#0A0A0A]">
                  {project.year}
                </p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-xs text-[#888888] font-[family-name:var(--font-dm-sans)] uppercase tracking-wider mb-1">
                  Services
                </p>
                <p className="text-sm sm:text-base font-[family-name:var(--font-syne)] font-bold text-[#0A0A0A]">
                  {project.services.join(", ")}
                </p>
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <a
                href="#contact"
                onClick={onClose}
                className="flex items-center justify-center gap-2 bg-[#FFD000] text-[#0A0A0A] px-6 py-3 font-[family-name:var(--font-syne)] font-bold hover:bg-[#E6B800] transition-all"
              >
                Start Similar Project
                <ChevronRight size={18} />
              </a>
              <button
                onClick={onClose}
                className="flex items-center justify-center gap-2 border-2 border-[#0A0A0A] text-[#0A0A0A] px-6 py-3 font-[family-name:var(--font-syne)] font-bold hover:bg-[#0A0A0A] hover:text-white transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ============================================================================
// WORKS SECTION
// ============================================================================
function WorksSection() {
  const { ref, isVisible } = useScrollReveal();
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");

  const categories = ["All", "Event Design", "Islamic Design", "Web Solution", "Brand Visual"];

  const projects = [
    { 
      title: "Wedding Thank You Card", 
      category: "Event Design", 
      size: "large",
      image: "/projects/wedding-card.png",
      description: "A beautifully crafted wedding thank you card design that captures the essence of the couple's special day. Features elegant typography, custom illustrations, and a cohesive color palette that reflects the wedding theme.",
      client: "Ahmad & Sarah",
      year: "2024",
      services: ["Print Design", "Illustration", "Typography"]
    },
    { 
      title: "Ramadan Kareem Series", 
      category: "Islamic Design", 
      size: "tall",
      image: "/projects/ramadan-design.png",
      description: "A comprehensive series of Ramadan greeting designs for social media and print. Each piece combines traditional Islamic geometric patterns with modern design aesthetics, creating visually stunning content for the holy month.",
      client: "Islamic Center",
      year: "2024",
      services: ["Social Media", "Print Design", "Branding"]
    },
    { 
      title: "Engagement Announcement", 
      category: "Event Design", 
      size: "normal",
      image: "/projects/engagement.png",
      description: "An elegant engagement announcement design featuring sophisticated layouts and premium color combinations. The design balances traditional elements with contemporary styling for a memorable first impression.",
      client: "Bilal Family",
      year: "2024",
      services: ["Print Design", "Digital Design"]
    },
    { 
      title: "Bridal Shower Invite", 
      category: "Event Design", 
      size: "normal",
      image: "/projects/bridal-shower.png",
      description: "A whimsical and romantic bridal shower invitation that sets the perfect tone for the celebration. Features hand-drawn elements, soft color palettes, and elegant typography that captures the joy of the occasion.",
      client: "Fatima Khan",
      year: "2024",
      services: ["Illustration", "Print Design"]
    },
    { 
      title: "Business Website", 
      category: "Web Solution", 
      size: "normal",
      image: "/projects/business-website.png",
      description: "A modern, responsive business website designed to convert visitors into customers. Features clean UI/UX, optimized performance, and seamless integration with business tools for maximum efficiency.",
      client: "TechStart Inc.",
      year: "2024",
      services: ["Web Design", "Development", "UI/UX"]
    },
    { 
      title: "Brand Identity Package", 
      category: "Brand Visual", 
      size: "normal",
      image: "/projects/brand-identity.png",
      description: "A complete brand identity package including logo design, color palette, typography system, and brand guidelines. Created a cohesive visual identity that communicates the brand's values and resonates with its target audience.",
      client: "Urban Cafe",
      year: "2024",
      services: ["Logo Design", "Branding", "Guidelines"]
    },
  ];

  const filteredProjects = activeFilter === "All" 
    ? projects 
    : projects.filter(p => p.category === activeFilter);

  const openModal = (project: typeof projects[0]) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedProject(null), 300);
  };

  return (
    <>
      <section
        id="works"
        ref={ref}
        className="py-12 sm:py-16 md:py-20 lg:py-28 bg-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mb-8 sm:mb-12"
          >
            <span className="text-xs sm:text-sm font-[family-name:var(--font-syne)] text-[#888888] uppercase tracking-wider">
              — SELECTED WORKS
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-[family-name:var(--font-bebas-neue)] text-[#0A0A0A] mt-1 sm:mt-2">
              MY LATEST WORK
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-[#888888] font-[family-name:var(--font-dm-sans)] mt-2 sm:mt-4">
              Real projects. Real clients. Real results.
            </p>
          </motion.div>

          {/* Filter Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-12"
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveFilter(category)}
                className={`filter-btn ${activeFilter === category ? "active" : ""}`}
              >
                {category}
              </button>
            ))}
          </motion.div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.title}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => openModal(project)}
                  className={`project-card relative overflow-hidden cursor-pointer group aspect-[4/3] ${
                    project.size === "large" ? "sm:col-span-1 lg:col-span-2" : ""
                  } ${
                    project.size === "tall" ? "sm:aspect-[3/4] lg:row-span-2" : ""
                  }`}
                >
                  {/* Project Image */}
                  <img
                    src={project.image}
                    alt={project.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/80 via-[#0A0A0A]/20 to-transparent" />
                  
                  {/* Category Badge */}
                  <div className="absolute top-3 sm:top-4 left-3 sm:left-4 px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm font-[family-name:var(--font-syne)] bg-[#FFD000] text-[#0A0A0A] font-bold">
                    {project.category}
                  </div>
                  
                  {/* Title */}
                  <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 font-[family-name:var(--font-bebas-neue)] text-lg sm:text-xl md:text-2xl text-white">
                    {project.title}
                  </div>
                  
                  {/* Hover Overlay */}
                  <div className="overlay absolute inset-0 flex items-center justify-center bg-[#FFD000]/95">
                    <span className="font-[family-name:var(--font-syne)] font-bold flex items-center gap-2 text-sm sm:text-base text-[#0A0A0A]">
                      View Project <ExternalLink size={16} className="sm:w-5 sm:h-5" />
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center mt-8 sm:mt-12"
          >
            <a
              href="#contact"
              className="inline-flex items-center gap-2 border-2 border-[#0A0A0A] bg-[#0A0A0A] text-[#FFD000] px-6 sm:px-8 py-3 sm:py-4 font-[family-name:var(--font-syne)] font-bold text-sm sm:text-base hover:bg-[#FFD000] hover:text-[#0A0A0A] transition-all"
            >
              Start Your Project
              <ChevronRight size={18} className="sm:w-5 sm:h-5" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Project Modal */}
      <ProjectModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </>
  );
}

// ============================================================================
// TESTIMONIALS SECTION
// ============================================================================
function TestimonialsSection() {
  const { ref, isVisible } = useScrollReveal();

  const testimonials = [
    {
      quote:
        "Abdullah delivered our wedding designs beautifully and on time. Highly recommend!",
      name: "Ahmad R.",
      role: "Small Business Owner",
    },
    {
      quote:
        "The Ramadan series he made for us went viral on Instagram. Amazing work!",
      name: "Sara K.",
      role: "Wedding Client",
    },
    {
      quote:
        "Fast, professional, and creative. Our website looks exactly how we imagined.",
      name: "Bilal M.",
      role: "Startup Founder",
    },
  ];

  return (
    <section
      ref={ref}
      className="py-12 sm:py-16 md:py-20 lg:py-28 bg-[#FFD000]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12 md:mb-16"
        >
          <span className="text-xs sm:text-sm font-[family-name:var(--font-syne)] text-[#0A0A0A] uppercase tracking-wider">
            — KIND WORDS
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-[family-name:var(--font-bebas-neue)] text-[#0A0A0A] mt-1 sm:mt-2">
            PEOPLE TALK ABOUT ME
          </h2>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="testimonial-card bg-white border-2 border-[#0A0A0A] p-5 sm:p-6 md:p-8"
              style={{ transform: `rotate(${(index - 1) * 1}deg)` }}
            >
              {/* Quote Icon */}
              <Quote className="w-8 h-8 sm:w-10 sm:h-10 text-[#FFD000] mb-3 sm:mb-4" />

              {/* Quote */}
              <p className="text-sm sm:text-base md:text-lg text-[#0A0A0A] font-[family-name:var(--font-dm-sans)] mb-4 sm:mb-6 leading-relaxed">
                &quot;{testimonial.quote}&quot;
              </p>

              {/* Author */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-[family-name:var(--font-syne)] font-bold text-[#0A0A0A] text-sm sm:text-base">
                    {testimonial.name}
                  </p>
                  <p className="text-xs sm:text-sm text-[#888888] font-[family-name:var(--font-dm-sans)]">
                    {testimonial.role}
                  </p>
                </div>

                {/* Stars */}
                <div className="flex gap-0.5 sm:gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-3 h-3 sm:w-4 sm:h-4 fill-[#FFD000] text-[#FFD000]"
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// CONTACT SECTION
// ============================================================================
function ContactSection() {
  const { ref, isVisible } = useScrollReveal();
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setSubmitStatus("error");
      setIsSubmitting(false);
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setSubmitStatus("error");
      setIsSubmitting(false);
      return;
    }
    
    try {
      // Submit directly to Web3Forms from client
      const web3FormData = new FormData();
      web3FormData.append("access_key", "e4e2e7f0-bf8a-4d78-9348-cf2a01332f32");
      web3FormData.append("name", formData.name);
      web3FormData.append("email", formData.email);
      web3FormData.append("subject", formData.subject);
      web3FormData.append("message", formData.message);

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: web3FormData
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSubmitStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        console.error("Form error:", data);
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("Submit error:", error);
      setSubmitStatus("error");
    }
    
    setIsSubmitting(false);
  };

  return (
    <section
      id="contact"
      ref={ref}
      className="py-12 sm:py-16 md:py-20 lg:py-28 bg-[#0A0A0A]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-16 xl:gap-20">
          {/* Left Side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="text-xs sm:text-sm font-[family-name:var(--font-syne)] text-[#FFD000] uppercase tracking-wider">
              — GET IN TOUCH
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-[family-name:var(--font-bebas-neue)] text-white mt-1 sm:mt-2 leading-tight">
              LET&apos;S MAKE SOMETHING AMAZING.
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-[#888888] font-[family-name:var(--font-dm-sans)] mt-3 sm:mt-4 mb-6 sm:mb-8">
              Have a project in mind? Let&apos;s talk.
            </p>

            <a
              href="https://wa.me/923196457841"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center gap-2 bg-[#FFD000] text-[#0A0A0A] px-6 sm:px-8 py-3 sm:py-4 font-[family-name:var(--font-syne)] font-bold text-sm sm:text-base md:text-lg hover:bg-[#E6B800] transition-all"
            >
              Say Hello on WhatsApp
              <span className="text-lg sm:text-xl">💬</span>
            </a>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 sm:mt-10"
            >
              <span className="text-xs sm:text-sm font-[family-name:var(--font-syne)] text-[#FFD000] uppercase tracking-wider block mb-4">
                — OR SEND A MESSAGE
              </span>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  required
                  className="contact-input"
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your Email"
                  required
                  className="contact-input"
                />
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Project Subject"
                  required
                  className="contact-input"
                />
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell me about your project..."
                  rows={4}
                  required
                  className="contact-input resize-none"
                />
                
                {submitStatus === "success" && (
                  <p className="text-[#FFD000] text-sm font-[family-name:var(--font-dm-sans)]">
                    Message sent! I&apos;ll get back to you within 24 hours. 🙌
                  </p>
                )}
                {submitStatus === "error" && (
                  <p className="text-red-400 text-sm font-[family-name:var(--font-dm-sans)]">
                    Something went wrong. Please try WhatsApp instead.
                  </p>
                )}
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#FFD000] text-[#0A0A0A] py-3 sm:py-4 font-[family-name:var(--font-syne)] font-bold text-sm sm:text-base hover:bg-[#E6B800] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                  <Send size={18} />
                </button>
              </form>
            </motion.div>
          </motion.div>

          {/* Right Side */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4 sm:space-y-6"
          >
            {/* Contact Info Box */}
            <div className="bg-[#FFD000] p-4 sm:p-6 md:p-8 space-y-3 sm:space-y-4">
              <a
                href="mailto:gcspideysir@gmail.com"
                className="flex items-center gap-2 sm:gap-3 text-[#0A0A0A] hover:text-[#E6B800] transition-colors"
              >
                <Mail size={18} className="sm:w-5 sm:h-5 flex-shrink-0" />
                <span className="text-sm sm:text-base font-[family-name:var(--font-dm-sans)] break-all">
                  gcspideysir@gmail.com
                </span>
              </a>
              <a
                href="tel:+923196457841"
                className="flex items-center gap-2 sm:gap-3 text-[#0A0A0A] hover:text-[#E6B800] transition-colors"
              >
                <Phone size={18} className="sm:w-5 sm:h-5 flex-shrink-0" />
                <span className="text-sm sm:text-base font-[family-name:var(--font-dm-sans)]">
                  +92 319 6457841
                </span>
              </a>
              <div className="flex items-center gap-2 sm:gap-3 text-[#0A0A0A]">
                <MapPin size={18} className="sm:w-5 sm:h-5 flex-shrink-0" />
                <span className="text-sm sm:text-base font-[family-name:var(--font-dm-sans)]">
                  Pakistan
                </span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 text-[#0A0A0A]">
                <Globe size={18} className="sm:w-5 sm:h-5 flex-shrink-0" />
                <span className="text-sm sm:text-base font-[family-name:var(--font-dm-sans)]">
                  Available Worldwide
                </span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex gap-3 sm:gap-4">
              {/* Add your real social media links here */}
              <a
                href="#"
                className="w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 border-2 border-white flex items-center justify-center text-white hover:bg-white hover:text-[#0A0A0A] transition-all"
                aria-label="Instagram"
              >
                <Instagram size={18} className="sm:w-5 sm:h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 border-2 border-white flex items-center justify-center text-white hover:bg-white hover:text-[#0A0A0A] transition-all"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} className="sm:w-5 sm:h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 border-2 border-white flex items-center justify-center text-white hover:bg-white hover:text-[#0A0A0A] transition-all"
                aria-label="Behance"
              >
                <ExternalLink size={18} className="sm:w-5 sm:h-5" />
              </a>
            </div>
          </motion.div>
        </div>

        {/* Bottom Divider */}
        <div className="h-px bg-[#FFD000] mt-10 sm:mt-16" />
      </div>
    </section>
  );
}

// ============================================================================
// FOOTER
// ============================================================================
function Footer() {
  return (
    <footer className="bg-[#0A0A0A] py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
          {/* Logo */}
          <a
            href="#"
            className="flex items-center gap-2 group"
          >
            <img 
              src="/logo.png" 
              alt="Abdullah Tahir Logo" 
              className="w-8 h-8 sm:w-10 sm:h-10 object-contain transition-transform group-hover:scale-110"
            />
            <span className="text-xl sm:text-2xl font-[family-name:var(--font-bebas-neue)] text-[#FFD000] group-hover:text-[#E6B800] transition-colors">
              Abdullah.
            </span>
          </a>

          {/* Copyright */}
          <p className="text-xs sm:text-sm text-[#888888] font-[family-name:var(--font-dm-sans)] text-center order-3 md:order-2">
            © 2026 Abdullah Tahir. All Rights Reserved.
          </p>

          {/* Quick Links */}
          <div className="flex gap-4 sm:gap-6 order-2 md:order-3">
            <a
              href="#works"
              className="text-white font-[family-name:var(--font-syne)] text-xs sm:text-sm hover:text-[#FFD000] transition-colors"
            >
              Works
            </a>
            <a
              href="#services"
              className="text-white font-[family-name:var(--font-syne)] text-xs sm:text-sm hover:text-[#FFD000] transition-colors"
            >
              Services
            </a>
            <a
              href="#contact"
              className="text-white font-[family-name:var(--font-syne)] text-xs sm:text-sm hover:text-[#FFD000] transition-colors"
            >
              Contact
            </a>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="h-0.5 bg-[#FFD000] mt-4 sm:mt-6" />
      </div>
    </footer>
  );
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================
export default function PortfolioPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [showFloatingButtons, setShowFloatingButtons] = useState(false);

  useEffect(() => {
    // Show floating buttons 3 seconds after page load
    if (!isLoading) {
      const timer = setTimeout(() => {
        setShowFloatingButtons(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  return (
    <main className="relative">
      {/* Loading Screen */}
      <AnimatePresence>
        {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>
      
      {/* Custom Cursor - Desktop Only */}
      <CustomCursor />
      
      {/* Navigation */}
      <Navigation />
      
      {/* Main Content */}
      <HeroSection />
      <MarqueeSection />
      <ServicesSection />
      <StatsSection />
      <WorksSection />
      <TestimonialsSection />
      <ContactSection />
      <Footer />
      
      {/* Floating Action Buttons */}
      <WhatsAppButton isVisible={showFloatingButtons} />
      <BackToTopButton />
    </main>
  );
}
