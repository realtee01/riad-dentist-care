import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { type Service } from '@/types/database';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Crown, Clock, CheckCircle2, Quote, Shield, HeartPulse, ChevronDown, ChevronUp } from 'lucide-react';
import { Facebook, Twitter, Youtube, Flower } from 'lucide-react';
import { AnimatedDock } from '@/components/ui/animated-dock';
import { motion, AnimatePresence } from 'motion/react';
import BeforeAfterGallery from '@/components/ui/BeforeAfterGallery';

const faqs = [
  {
    question: "Do you accept new patients?",
    answer: "Yes! We are always welcoming new patients to our dental family. You can easily book your first consultation online."
  },
  {
    question: "What insurance plans do you accept?",
    answer: "We accept most major PPO dental insurance plans. Our team will be happy to verify your benefits before your appointment to minimize out-of-pocket costs."
  },
  {
    question: "What should I expect during my first visit?",
    answer: "Your first visit will include a comprehensive oral examination, x-rays if needed, a professional cleaning, and a one-on-one consultation with the dentist."
  },
  {
    question: "Do you offer emergency dental care?",
    answer: "Yes, we reserve time in our daily schedule for dental emergencies. If you are experiencing severe pain, swelling, or a broken tooth, please contact us immediately."
  }
];

const team = [
  {
    name: "Dr. Rita Wilson",
    role: "Lead Dentist & Founder",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    bio: "With over 15 years of experience, Dr. Rita specializes in cosmetic and restorative dentistry."
  },
  {
    name: "Dr. James Carter",
    role: "Orthodontist",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    bio: "Dr. Carter helps patients achieve aligned smiles using the latest invisible aligner technology."
  },
  {
    name: "Sarah Jenkins",
    role: "Registered Dental Hygienist",
    image: "https://res.cloudinary.com/dw8jtwbka/image/upload/v1780256423/pexels-photo-37458097_bxoqn7.jpg",
    bio: "Sarah is passionate about patient education and ensuring every cleaning is gentle and pain-free."
  }
];

const testimonials = [
  {
    name: "Michael R.",
    text: "The best dental experience I've ever had. The clinic is beautiful, the staff is incredibly welcoming, and Dr. Riad is gentle and thorough. I actually look forward to my visits!",
    rating: 5
  },
  {
    name: "Emily S.",
    text: "I was extremely anxious about getting a root canal, but the team here made me feel so comfortable. I felt no pain at all, and they checked on me throughout the whole procedure.",
    rating: 5
  },
  {
    name: "David L.",
    text: "Started my Invisalign journey with Dr. Carter and the results are already amazing. Very professional clinic with transparent pricing. Highly recommend!",
    rating: 5
  }
];

const HeroSlider = () => {
  const heroImages = [
    "https://i.pinimg.com/1200x/d9/69/10/d96910980844a5bc71b3dc0bca7cab87.jpg",
    "https://i.pinimg.com/webp/1200x/92/1a/65/921a654cf48b275868ef7d9ad6be1a22.webp",
    "https://i.pinimg.com/1200x/db/6e/cd/db6ecd4372f8e43edd83f08bf3bd8b8d.jpg"
  ];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  return (
    <section className="relative min-h-screen flex flex-col justify-center pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden bg-slate-900 w-full transform-gpu">
      <div className="absolute inset-0 z-0">
        {heroImages.map((img, index) => (
          <img 
            key={img}
            src={img} 
            alt={`Modern dental clinic interior ${index + 1}`} 
            fetchPriority={index === 0 ? "high" : "auto"}
            loading={index === 0 ? "eager" : "lazy"}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              index === currentImageIndex ? "opacity-70" : "opacity-0"
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-transparent"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-white w-full">
        <div className="max-w-2xl mt-12 md:mt-0">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8 shadow-sm">
            <Crown className="w-3.5 h-3.5 text-teal-400" strokeWidth={1.5} />
            <span className="text-xs font-semibold uppercase tracking-widest text-teal-50">Premium Dental Care</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-6 leading-[1.1]">
            A healthier smile,<br />
            <span className="text-teal-400">a brighter you.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-200 mb-10 max-w-xl leading-relaxed">
            Experience modern, pain-free dental care in a calm and luxurious environment. Your comfort is our priority, from checkup to transformation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Link
              to="/book"
              className="group inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-teal-500 text-white text-sm font-semibold tracking-widest uppercase hover:bg-teal-400 shadow-lg shadow-teal-500/20 transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              Book Consultation
              <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform" strokeWidth={1.5} />
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border-t border-white/20 pt-8 mt-8">
            <div className="flex -space-x-3">
              <img loading="lazy" decoding="async" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&h=64&q=80" alt="Patient" className="w-10 h-10 rounded-full border-2 border-slate-900 object-cover relative z-0" />
              <img loading="lazy" decoding="async" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=64&h=64&q=80" alt="Patient" className="w-10 h-10 rounded-full border-2 border-slate-900 object-cover relative z-10" />
              <img loading="lazy" decoding="async" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=64&h=64&q=80" alt="Patient" className="w-10 h-10 rounded-full border-2 border-slate-900 object-cover relative z-20" />
              <img loading="lazy" decoding="async" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=64&h=64&q=80" alt="Patient" className="w-10 h-10 rounded-full border-2 border-slate-900 object-cover relative z-30" />
              <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-teal-500 flex items-center justify-center text-xs font-bold text-white relative z-40">
                +1k
              </div>
            </div>
            <div>
              <div className="flex items-center text-yellow-400 gap-1 mb-1">
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
              </div>
              <div className="text-sm text-slate-300">
                <span className="text-white font-medium">4.9/5</span> from over 1,000+ happy patients
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default function Home() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [expandedTestimonial, setExpandedTestimonial] = useState<number | null>(null);

  useEffect(() => {
    supabase
      .from('services')
      .select('*')
      .eq('is_active', true)
      .order('price', { ascending: true })
      .then(({ data, error }) => {
        if (error) throw error;
        if (data && data.length > 0) {
          setServices(data);
        } else {
          throw new Error("No data");
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching services:', error);
        setServices([
          { id: '1', name: 'Comprehensive Checkup & Cleaning', description: 'A thorough examination of your teeth and gums, followed by a professional cleaning to remove plaque and tartar.', duration_minutes: 60, price: 150, is_active: true },
          { id: '2', name: 'Professional Teeth Whitening', description: 'Safe and effective teeth whitening treatment to brighten your smile by several shades in just one session.', duration_minutes: 90, price: 299, is_active: true },
          { id: '3', name: 'Dental Fillings', description: 'High-quality composite fillings to repair cavities and restore the natural appearance and function of your teeth.', duration_minutes: 45, price: 180, is_active: true }
        ] as Service[]);
        setLoading(false);
      });
  }, []);

  const ServicesGrid = useMemo(() => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {services.map((service, index) => (
        <div key={service.id} className="bg-white rounded-[2rem] p-6 lg:p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-teal-900/5 hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full">
          <div className="mb-6 h-52 rounded-[1.5rem] overflow-hidden bg-slate-100 relative">
            <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors duration-300 z-10" />
              <img 
              loading="lazy" decoding="async"
              src={service.image_url || [
                "https://res.cloudinary.com/dw8jtwbka/image/upload/v1780255598/pexels-photo-8413334_ikelwa.jpg",
                "https://res.cloudinary.com/dw8jtwbka/image/upload/v1780255662/pexels-photo-6627320_njyw83.jpg",
                "https://res.cloudinary.com/dw8jtwbka/image/upload/v1780255732/pexels-photo-6627330_gus01z.jpg",
                "https://res.cloudinary.com/dw8jtwbka/image/upload/v1780255794/pexels-photo-5622257_adkdqj.jpg",
                "https://res.cloudinary.com/dw8jtwbka/image/upload/v1780256192/pexels-photo-3845954_gkdfmh.jpg",
                "https://res.cloudinary.com/dw8jtwbka/image/upload/v1780255624/pexels-photo-16430838_afn2ya.jpg"
              ][index % 6]} 
              alt={service.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-sm font-semibold text-teal-700 shadow-sm flex items-center gap-1">
              ${service.price}
            </div>
          </div>
          
          <h3 className="text-xl font-display font-bold text-slate-900 tracking-tight mb-3">{service.name}</h3>
          <p className="text-slate-500 leading-relaxed mb-6 flex-grow">{service.description}</p>
          
          <div className="flex justify-between items-center pt-6 border-t border-slate-100">
            <div className="flex items-center text-slate-500 text-sm bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
              <Clock className="w-4 h-4 mr-1.5 text-slate-400" />
              {service.duration_minutes} mins
            </div>
            <Link
              to={`/book?service=${service.id}`}
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-slate-900 text-white font-medium hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2 transition-all duration-300"
            >
              Book now
            </Link>
          </div>
        </div>
      ))}
      
      {loading ? (
        <div className="col-span-full py-12 text-center text-slate-500">
          Loading services...
        </div>
      ) : services.length === 0 ? (
        <div className="col-span-full py-12 text-center text-slate-500">
          No active services available at the moment.
        </div>
      ) : null}
    </div>
  ), [services, loading]);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <HeroSlider />

      {/* Services Section */}
      <section id="services" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-6">Our Premium Services</h2>
            <p className="text-lg text-slate-600">
              We offer a comprehensive range of dental treatments using state-of-the-art diagnostic technology and the highest patient care standards.
            </p>
          </div>
          
          {ServicesGrid}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2 relative">
              <div className="aspect-[4/5] rounded-3xl overflow-hidden">
                <img 
                  loading="lazy" decoding="async"
                  src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                  alt="Dentist consulting with patient" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-8 -right-8 bg-white p-6 rounded-3xl shadow-xl border border-slate-100 hidden md:block">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-teal-50 rounded-full flex items-center justify-center text-teal-600">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">15+</p>
                    <p className="text-sm text-slate-500 font-medium">Years Experience</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-50 border border-slate-200 mb-6 shadow-sm">
                <Shield className="w-3.5 h-3.5 text-teal-600" strokeWidth={1.5} />
                <span className="text-xs font-semibold uppercase tracking-widest text-slate-800">Trusted Dental Care</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-display font-bold text-slate-900 mb-6">Expert care in a calming environment</h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                At Riad's Dental Care, we believe that a trip to the dentist should be a stress-free and positive experience. Our clinic is designed to put you at ease, combining modern medical expertise with a warm, welcoming atmosphere.
              </p>
              <ul className="space-y-4 mb-10">
                {[
                  'State-of-the-art diagnostic imaging',
                  'Pain-minimizing treatment techniques',
                  'Transparent pricing and treatment plans',
                  'Sterile, impeccably clean treatment rooms'
                ].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <CheckCircle2 className="w-6 h-6 text-teal-500 mr-3 flex-shrink-0" />
                    <span className="text-slate-700 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Before & After Gallery */}
      <BeforeAfterGallery />

      {/* Testimonials */}
      <section className="py-24 bg-teal-900 text-teal-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-24 -mr-24 w-96 h-96 bg-teal-800 rounded-full opacity-50 blur-3xl"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">What Our Patients Say</h2>
            <p className="text-teal-100/80 text-lg">
              Don't just take our word for it. Read about the experiences of our valued patients.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <motion.div 
                layout
                key={idx} 
                onClick={() => setExpandedTestimonial(expandedTestimonial === idx ? null : idx)}
                className="bg-teal-800/40 p-8 rounded-3xl border border-teal-700/50 backdrop-blur-sm cursor-pointer hover:bg-teal-700/50 transition-colors"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Quote className="w-10 h-10 text-teal-400 mb-6 opacity-50" />
                <motion.p 
                  layout="position"
                  className={`text-lg text-teal-50 mb-6 italic leading-relaxed ${expandedTestimonial === idx ? "" : "line-clamp-3"}`}
                >
                  "{testimonial.text}"
                </motion.p>
                
                <AnimatePresence>
                  {expandedTestimonial === idx && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-4 text-teal-100 text-sm overflow-hidden"
                    >
                      <p>Viewed more details. We're glad {testimonial.name} had such a wonderful experience!</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.div layout="position" className="flex items-center justify-between">
                  <span className="font-semibold text-white">{testimonial.name}</span>
                  <div className="flex">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </motion.div>
                
                <motion.div layout="position" className="mt-4 text-xs text-teal-400/80 font-medium tracking-wide uppercase text-center flex items-center justify-center gap-1">
                  {expandedTestimonial === idx ? (
                    <>Show less <ChevronUp className="w-3 h-3" /></>
                  ) : (
                    <>Click to read more <ChevronDown className="w-3 h-3" /></>
                  )}
                </motion.div>
              </motion.div>
            ))}
          </div>

          <div className="mt-20">
            <p className="text-center text-teal-100/70 text-sm font-medium tracking-widest uppercase mb-6">Connect with Us</p>
            <AnimatedDock
                items={[
                    {
                        link: "https://facebook.com/RiadsDental",
                        target: "_blank",
                        Icon: <Facebook size={22} />,
                    },
                    {
                        link: "https://x.com/RiadsDental",
                        target: "_blank",
                        Icon: <Twitter size={22} />,
                    },
                    {
                        link: "https://www.youtube.com/@RiadsDental",
                        target: "_blank",
                        Icon: <Youtube size={22} />,
                    },
                    {
                        link: "https://www.instagram.com/RiadsDental",
                        target: "_blank",
                        Icon: <Flower size={22} />,
                    },
                ]}
            />
          </div>
        </div>
      </section>

      {/* Meet the Team */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-6">Meet Your Smile Experts</h2>
            <p className="text-slate-600 text-lg">
              Our team of friendly, experienced professionals is dedicated to bringing you the best in dental science and patient comfort.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, idx) => (
              <div key={idx} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 group">
                <div className="aspect-square overflow-hidden bg-slate-100">
                  <img 
                    loading="lazy" decoding="async"
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-8">
                  <h3 className="text-xl font-display font-bold text-slate-900 mb-1">{member.name}</h3>
                  <p className="text-teal-600 font-medium mb-4 text-sm">{member.role}</p>
                  <p className="text-slate-600">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-teal-50 text-teal-600 rounded-full mb-6">
              <HeartPulse className="w-6 h-6" />
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-6">Frequently Asked Questions</h2>
            <p className="text-slate-600 text-lg">
              Got questions? We've got answers to help you prepare for your visit.
            </p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border border-slate-200 rounded-2xl overflow-hidden bg-white">
                <button 
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                >
                  <span className="font-semibold text-slate-900 text-lg">{faq.question}</span>
                  {openFaq === idx ? (
                    <ChevronUp className="w-5 h-5 text-teal-600 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                  )}
                </button>
                <div 
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openFaq === idx ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <p className="p-6 pt-0 text-slate-600 leading-relaxed border-t border-slate-100">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          {/* CTA Box inside FAQ section */}
          <div className="mt-16 bg-teal-50 rounded-3xl p-8 md:p-12 text-center border border-teal-100">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Ready to perfect your smile?</h3>
            <p className="text-slate-600 mb-8 max-w-xl mx-auto">
              Our books are open! Schedule your consultation today and take the first step towards a healthier, more confident you.
            </p>
            <Link
              to="/book"
              className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-teal-600 text-white text-lg font-medium hover:bg-teal-700 hover:shadow-lg transition-all"
            >
              Book Your Appointment
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
