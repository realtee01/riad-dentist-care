import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useInView } from 'motion/react';
import { ChevronRight, X, Camera, MapPin, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const categories = [
  "All Treatments",
  "Veneers",
  "Teeth Whitening",
  "Dental Implants",
  "Orthodontics",
  "Smile Makeover",
  "Bonding"
];

const galleryCases = [
  {
    id: 1,
    category: "Smile Makeover",
    beforeImg: "https://res.cloudinary.com/dw8jtwbka/image/upload/v1780301345/bfr_vjxaug.jpg",
    afterImg: "https://res.cloudinary.com/dw8jtwbka/image/upload/v1780301345/bfr_vjxaug.jpg",
    isCollage: true,
    collageLayout: "top-after" as const,
    treatment: "Complete Smile Makeover",
    concern: "Discoloration & Misalignment",
    duration: "4 Months",
    visits: "6",
    story: "Sarah felt extremely self-conscious about her stained and slightly crooked teeth. By combining professional whitening with custom porcelain veneers, we completely transformed her smile. She now beams with confidence wherever she goes."
  },
  {
    id: 2,
    category: "Veneers",
    beforeImg: "https://res.cloudinary.com/dw8jtwbka/image/upload/v1780301344/after_mrttqq.jpg",
    afterImg: "https://res.cloudinary.com/dw8jtwbka/image/upload/v1780301344/after_mrttqq.jpg",
    isCollage: true,
    collageLayout: "top-before" as const,
    treatment: "Porcelain Veneers",
    concern: "Chipped & Uneven Front Teeth",
    duration: "3 Weeks",
    visits: "3",
    story: "David had chipped two front teeth in an accident and was unhappy with the uneven length of his smile. We crafted four ultra-thin porcelain veneers to match his natural teeth perfectly, restoring both function and aesthetics in just a few weeks."
  },
  {
    id: 3,
    category: "Teeth Whitening",
    beforeImg: "https://res.cloudinary.com/dw8jtwbka/image/upload/v1780306474/teeth-whitening-1_hl3wzc.jpg",
    afterImg: "https://res.cloudinary.com/dw8jtwbka/image/upload/v1780306474/teeth-whitening-1_hl3wzc.jpg",
    isCollage: true,
    collageLayout: "left-before" as const,
    treatment: "In-Clinic Laser Whitening",
    concern: "Severe Staining from Coffee",
    duration: "1.5 Hours",
    visits: "1",
    story: "A long-time coffee enthusiast, Michael noticed his smile had become dull and yellowish over the years. One single session of our premium laser whitening lifted the stains by several shades, giving him back a youthful, bright smile."
  },
  {
    id: 4,
    category: "Orthodontics",
    beforeImg: "https://res.cloudinary.com/dw8jtwbka/image/upload/v1780305935/pexels-photo-13422325_trpcll.jpg",
    afterImg: "https://res.cloudinary.com/dw8jtwbka/image/upload/v1780305908/pexels-photo-6529110_e3v9vb.jpg",
    isCollage: false,
    treatment: "Invisible Aligners",
    concern: "Crowded Lower Teeth",
    duration: "8 Months",
    visits: "8",
    story: "Emma wanted a straighter smile but didn't want traditional metal braces. Using a customized series of clear aligners, we gently guided her teeth into the perfect position. The result is a beautifully aligned, natural look."
  },
  {
    id: 5,
    category: "Dental Implants",
    beforeImg: "https://res.cloudinary.com/dw8jtwbka/image/upload/v1780301345/before_fter_ege97w.jpg",
    afterImg: "https://res.cloudinary.com/dw8jtwbka/image/upload/v1780301345/before_fter_ege97w.jpg",
    isCollage: true,
    collageLayout: "top-after" as const,
    treatment: "Tooth implant",
    concern: "Missing Molar",
    duration: "6 Months",
    visits: "5",
    story: "John had lost a lower molar, making chewing difficult and causing adjacent teeth to shift. We placed a premium titanium implant topped with a custom ceramic crown, completely restoring his bite and smile."
  },
  {
    id: 6,
    category: "Bonding",
    beforeImg: "https://res.cloudinary.com/dw8jtwbka/image/upload/v1780305879/full_face_final_3__oczvip.jpg",
    afterImg: "https://res.cloudinary.com/dw8jtwbka/image/upload/v1780305879/full_face_final_3__oczvip.jpg",
    isCollage: true,
    collageLayout: "left-before" as const,
    treatment: "Cosmetic Bonding",
    concern: "Gap Between Front Teeth",
    duration: "2 Hours",
    visits: "1",
    story: "Chloe was self-conscious about a small gap between her two front teeth. In just one appointment, we used composite resin bonding to seamlessly close the gap, providing an instant, painless transformation."
  }
];

const BeforeAfterSlider = ({ beforeImg, afterImg, isCollage, collageLayout = 'top-after', className = "" }: { beforeImg: string, afterImg: string, isCollage?: boolean, collageLayout?: 'top-after' | 'top-before' | 'left-before', className?: string }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleMove = (clientX: number) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
      const percentage = (x / rect.width) * 100;
      setSliderPosition(percentage);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) handleMove(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging) handleMove(e.touches[0].clientX);
  };

  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden select-none touch-none ${className}`}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
      onMouseMove={handleMouseMove}
      onTouchEnd={() => setIsDragging(false)}
      onTouchMove={handleTouchMove}
      onMouseDown={(e) => {
        setIsDragging(true);
        handleMove(e.clientX);
      }}
      onTouchStart={(e) => {
        setIsDragging(true);
        handleMove(e.touches[0].clientX);
      }}
    >
      <div 
        className="absolute inset-0 bg-cover bg-center" 
        style={{ 
          backgroundImage: `url(${afterImg})`,
          backgroundSize: isCollage ? (collageLayout === 'left-before' ? '200% 100%' : '100% 200%') : 'cover',
          backgroundPosition: isCollage ? (collageLayout === 'left-before' ? 'right center' : collageLayout === 'top-after' ? 'top center' : 'bottom center') : 'center'
        }}
        aria-label="After treatment"
      />
      <div 
        className="absolute inset-0 right-0 overflow-hidden"
        style={{ width: `${sliderPosition}%` }}
      >
        <div 
          className="absolute top-0 left-0 bottom-0 max-w-none h-full bg-cover bg-center"
          style={{ 
            backgroundImage: `url(${beforeImg})`, 
            width: '100vw', 
            minWidth: '100%',
            backgroundSize: isCollage ? (collageLayout === 'left-before' ? '200% 100%' : '100% 200%') : 'cover',
            backgroundPosition: isCollage ? (collageLayout === 'left-before' ? 'left center' : collageLayout === 'top-after' ? 'bottom center' : 'top center') : 'center'
          }} // Adjust based on parent size via css
          aria-label="Before treatment"
        />
        <img src={beforeImg} className="min-w-[1000%] opacity-0 pointer-events-none" alt="" />
      </div>

      <div 
        className="absolute top-0 bottom-0 z-10 bg-white w-1 cursor-ew-resize cursor-[col-resize] touch-action-none"
        style={{ left: `calc(${sliderPosition}% - 2px)` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-white rounded-full shadow-[0_0_15px_rgba(0,0,0,0.3)] flex items-center justify-center pointer-events-none">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-slate-700 w-4 h-4 md:w-5 md:h-5">
            <path d="M15 18L21 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 18L3 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
      
      {/* Labels */}
      <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full text-white text-xs font-semibold tracking-wide uppercase opacity-80 pointer-events-none">
        Before
      </div>
      <div className="absolute top-4 right-4 z-10 px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full text-white text-xs font-semibold tracking-wide uppercase opacity-80 pointer-events-none">
        After
      </div>
    </div>
  );
};

const NumberTicker = ({ value, label, inView }: { value: number, label: string, inView: boolean }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (inView) {
      let start = 0;
      const duration = 2000;
      const stepTime = Math.abs(Math.floor(duration / value));
      
      const timer = setInterval(() => {
        start += Math.ceil(value / 50);
        if (start > value) {
          start = value;
          clearInterval(timer);
        }
        setCount(start);
      }, stepTime);

      return () => clearInterval(timer);
    }
  }, [value, inView]);

  return (
    <div className="text-center">
      <div className="text-4xl md:text-5xl font-display font-bold text-teal-600 mb-2">
        {count.toLocaleString()}{label.includes('Rate') || label === 'Patient Satisfaction' ? '%' : '+'}
      </div>
      <p className="text-slate-600 font-medium">{label}</p>
    </div>
  );
};

export default function BeforeAfterGallery() {
  const [activeTab, setActiveTab] = useState("All Treatments");
  const [selectedCase, setSelectedCase] = useState<typeof galleryCases[0] | null>(null);
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const filteredCases = activeTab === "All Treatments" 
    ? galleryCases 
    : galleryCases.filter(c => c.category === activeTab);

  return (
    <section className="py-24 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
      {/* Background aesthetic */}
      <div className="absolute top-0 right-0 -m-32 w-[600px] h-[600px] bg-teal-50/50 rounded-full blur-3xl opacity-60 pointer-events-none" />
      <div className="absolute bottom-0 left-0 -m-32 w-[600px] h-[600px] bg-sky-50/50 rounded-full blur-3xl opacity-60 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white shadow-sm border border-slate-200 mb-6">
            <Camera className="w-3.5 h-3.5 text-teal-600" strokeWidth={1.5} />
            <span className="text-xs font-semibold uppercase tracking-widest text-slate-800">Transformed Smiles</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-slate-900 mb-6 tracking-tight">
            Before & After Gallery
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed md:px-10">
            Swipe left and right to see real patient transformations. See what we can achieve together through personalized, premium dental care.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex overflow-x-auto pb-4 mb-12 -mx-4 px-4 sm:mx-0 sm:px-0 gap-2 hide-scrollbar justify-start sm:justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                activeTab === cat 
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20' 
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24"
        >
          <AnimatePresence mode="popLayout">
            {filteredCases.map((item) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                key={item.id}
                className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-slate-100 group cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                onClick={() => setSelectedCase(item)}
              >
                <div className="relative aspect-[4/3] bg-slate-100 w-full overflow-hidden">
                  <BeforeAfterSlider beforeImg={item.beforeImg} afterImg={item.afterImg} isCollage={item.isCollage} collageLayout={item.collageLayout} />
                  <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-colors pointer-events-none z-20 flex items-center justify-center">
                    <div className="bg-white/90 backdrop-blur-sm text-slate-900 px-4 py-2 rounded-full font-medium text-sm translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      View Details
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="text-sm font-medium text-teal-600 mb-2 uppercase tracking-wider">{item.category}</div>
                  <h3 className="text-xl font-bold text-slate-900">{item.treatment}</h3>
                  <p className="text-slate-500 text-sm mt-2 line-clamp-2">{item.concern}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Trust Elements */}
        <div ref={containerRef} className="py-12 border-y border-slate-200/60 mb-24 grid grid-cols-1 sm:grid-cols-3 gap-10">
          <NumberTicker value={10000} label="Smiles Transformed" inView={isInView} />
          <NumberTicker value={98} label="Patient Satisfaction" inView={isInView} />
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-display font-bold text-yellow-500 mb-2">
              4.9★
            </div>
            <p className="text-slate-600 font-medium">Average Rating</p>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="bg-slate-900 rounded-[3rem] p-10 md:p-16 relative overflow-hidden border border-slate-800">
          <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/20 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-sky-500/10 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="relative z-10 text-center max-w-2xl mx-auto">
            <h3 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">
              See What Your Smile Could Look Like
            </h3>
            <p className="text-lg text-slate-300 mb-10">
              Ready to start your journey? Book a personalized consultation to discuss your smile goals with our expert team.
            </p>
            <Link
               to="/book"
               className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-teal-500 text-white text-lg font-medium hover:bg-teal-400 hover:shadow-lg hover:shadow-teal-500/30 transition-all transform hover:scale-105 active:scale-95 duration-200"
            >
              Book Consultation
              <ChevronRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </div>

      {/* Case Detail Modal */}
      <AnimatePresence>
        {selectedCase && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCase(null)}
              className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-3xl overflow-hidden shadow-2xl w-full max-w-5xl flex flex-col md:flex-row z-10 max-h-[90vh]"
            >
              <button 
                onClick={() => setSelectedCase(null)}
                className="absolute top-4 right-4 z-20 w-10 h-10 bg-white/80 backdrop-blur border border-slate-200 rounded-full flex items-center justify-center text-slate-700 hover:bg-white hover:text-red-500 transition-colors shadow-sm"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="md:w-3/5 h-64 md:h-auto min-h-[300px] shrink-0 bg-slate-100 flex p-6 pb-0 md:p-8 md:pr-0">
                <div className="w-full h-full rounded-2xl md:rounded-r-none rounded-b-none overflow-hidden relative shadow-inner border border-slate-200">
                  <BeforeAfterSlider beforeImg={selectedCase.beforeImg} afterImg={selectedCase.afterImg} isCollage={selectedCase.isCollage} collageLayout={selectedCase.collageLayout} />
                </div>
              </div>

              <div className="md:w-2/5 p-6 md:p-10 flex flex-col overflow-y-auto">
                <div className="inline-flex items-center px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-xs font-semibold uppercase tracking-widest mb-4">
                  {selectedCase.category}
                </div>
                <h3 className="text-3xl font-display font-bold text-slate-900 mb-6">{selectedCase.treatment}</h3>
                
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Time</p>
                    <p className="font-semibold text-slate-900">{selectedCase.duration}</p>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Visits</p>
                    <p className="font-semibold text-slate-900">{selectedCase.visits}</p>
                  </div>
                  <div className="col-span-2 bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Initial Concern</p>
                    <p className="font-medium text-slate-900">{selectedCase.concern}</p>
                  </div>
                </div>

                <div className="mb-10">
                  <h4 className="text-lg font-bold text-slate-900 mb-3">Patient Story</h4>
                  <p className="text-slate-600 leading-relaxed">
                    "{selectedCase.story}"
                  </p>
                </div>

                <div className="mt-auto pt-6 border-t border-slate-100">
                  <Link 
                    to="/book" 
                    className="w-full flex items-center justify-center px-6 py-4 bg-slate-900 text-white rounded-xl font-medium hover:bg-teal-600 transition-colors shadow-md"
                  >
                    Book Similar Treatment
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}
