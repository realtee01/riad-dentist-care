import { Smile, Shield, HeartPulse, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="flex flex-col">
      {/* Hero Header */}
      <section className="pt-32 pb-24 md:pt-40 md:pb-32 bg-slate-900 border-b border-slate-800 text-white relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://res.cloudinary.com/dw8jtwbka/image/upload/v1780247903/pexels-photo-19976568_ubcwqp.jpg" 
            alt="Rita's Dental Care Team" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-transparent"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 text-white tracking-tight">About Riad's Dental Care</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Committed to providing compassionate, comprehensive, and modern dental care for you and your family.
          </p>
        </div>
      </section>

      {/* Main Content & Video */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Text Side */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-700 font-medium text-sm border border-teal-100 mb-6">
                <Smile className="w-4 h-4" />
                Our Story
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-6 leading-tight">Modern Dentistry with a Personal Touch</h2>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                At Riad's Dental Care, we believe that everyone deserves a healthy, beautiful smile. Founded by Dr. Riad, our clinic was built on the core principle that a trip to the dentist should be a stress-free and positive experience.
              </p>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                We combine the latest in medical expertise with a warm, welcoming atmosphere. From routine cleanings to complex restorative procedures, our dedicated team works tirelessly to ensure your comfort and well-being every step of the way.
              </p>
              
              <ul className="space-y-5 mb-10">
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 shrink-0 mt-1">
                    <HeartPulse className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 text-lg">Patient-First Care</h3>
                    <p className="text-slate-600">A compassionate, gentle approach tailored to your specific needs.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 shrink-0 mt-1">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 text-lg">Uncompromising Safety</h3>
                    <p className="text-slate-600">State-of-the-art sterile environments utilizing the latest protocols.</p>
                  </div>
                </li>
              </ul>
              
              <Link
                to="/book"
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-slate-900 text-white font-medium hover:bg-slate-800 transition-colors group"
              >
                Schedule a Visit
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Video Side */}
            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl ring-1 ring-slate-900/5 group z-10">
              <div className="aspect-video sm:aspect-[4/3] bg-slate-100 relative">
                <video 
                  className="absolute inset-0 w-full h-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                  controls
                >
                  <source src="https://res.cloudinary.com/dw8jtwbka/video/upload/v1780247556/33375890_vj2gb0.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
