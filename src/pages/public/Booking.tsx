import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { type Service, type BusinessHour, type BlockedDate, type ClinicSettings, type Appointment } from '@/types/database';
import { generateAvailableSlots, type TimeSlot } from '@/lib/availability';
import { format, addDays, startOfToday, isSameDay } from 'date-fns';
import { ChevronRight, Calendar, Clock, CheckCircle2, Loader2, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Booking() {
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Data State
  const [services, setServices] = useState<Service[]>([]);
  const [settings, setSettings] = useState<ClinicSettings | null>(null);
  const [businessHours, setBusinessHours] = useState<BusinessHour[]>([]);
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  
  // Selection State
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(startOfToday());
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    notes: ''
  });

  useEffect(() => {
    async function loadInitialData() {
      try {
        const [servicesRes, settingsRes, hoursRes, blockedRes] = await Promise.all([
          supabase.from('services').select('*').eq('is_active', true).order('price'),
          supabase.from('clinic_settings').select('*').limit(1).single(),
          supabase.from('business_hours').select('*'),
          supabase.from('blocked_dates').select('*')
        ]);

        if (servicesRes.data && servicesRes.data.length > 0) {
          setServices(servicesRes.data);
        } else {
          setServices([
            { id: '1', name: 'Comprehensive Checkup & Cleaning', description: 'A thorough examination of your teeth and gums, followed by a professional cleaning to remove plaque and tartar.', duration_minutes: 60, price: 150, is_active: true },
            { id: '2', name: 'Professional Teeth Whitening', description: 'Safe and effective teeth whitening treatment to brighten your smile by several shades in just one session.', duration_minutes: 90, price: 299, is_active: true },
            { id: '3', name: 'Dental Fillings', description: 'High-quality composite fillings to repair cavities and restore the natural appearance and function of your teeth.', duration_minutes: 45, price: 180, is_active: true }
          ] as Service[]);
        }

        if (settingsRes.data) {
          setSettings(settingsRes.data);
        } else {
          // Fallback if settings table is empty
          setSettings({
            id: 'fallback',
            clinic_name: "Riad's Dental Care",
            clinic_email: "contact@riadsdental.example.com",
            clinic_phone: "(555) 123-4567",
            clinic_address: "123 Smile Avenue",
            slot_interval_minutes: 30,
            booking_notice_hours: 24,
            created_at: new Date().toISOString()
          });
        }
        if (hoursRes.data) setBusinessHours(hoursRes.data);
        if (blockedRes.data) setBlockedDates(blockedRes.data);

        const serviceId = searchParams.get('service');
        if (serviceId) {
          const preSelected = (servicesRes.data || []).find((s:any) => s.id === serviceId);
          if (preSelected) setSelectedService(preSelected);
        }
      } catch (error) {
        console.error('Failed to load initial data:', error);
        setServices([
            { id: '1', name: 'Comprehensive Checkup & Cleaning', description: 'A thorough examination of your teeth and gums, followed by a professional cleaning to remove plaque and tartar.', duration_minutes: 60, price: 150, is_active: true },
            { id: '2', name: 'Professional Teeth Whitening', description: 'Safe and effective teeth whitening treatment to brighten your smile by several shades in just one session.', duration_minutes: 90, price: 299, is_active: true },
            { id: '3', name: 'Dental Fillings', description: 'High-quality composite fillings to repair cavities and restore the natural appearance and function of your teeth.', duration_minutes: 45, price: 180, is_active: true }
        ] as Service[]);
        setSettings({
            id: 'fallback',
            clinic_name: "Riad's Dental Care",
            clinic_email: "contact@riadsdental.example.com",
            clinic_phone: "(555) 123-4567",
            clinic_address: "123 Smile Avenue",
            slot_interval_minutes: 30,
            booking_notice_hours: 24,
            created_at: new Date().toISOString()
        });
      } finally {
        setLoading(false);
      }
    }
    loadInitialData();
  }, [searchParams]);

  useEffect(() => {
    setSelectedSlot(null);
  }, [selectedDate, selectedService]);

  useEffect(() => {
    if (!selectedService || !settings) return;

    async function loadAvailability() {
      try {
        // Fetch appointments for the selected date to filter overlapping
        const dateStr = format(selectedDate, 'yyyy-MM-dd');
        const { data: apps, error } = await supabase
          .from('appointments')
          .select('*')
          .eq('appointment_date', dateStr);

        if (error) {
          console.error("Failed to load appointments:", error);
        }

        const slots = generateAvailableSlots(
          selectedDate,
          selectedService.duration_minutes,
          businessHours,
          blockedDates,
          apps || [],
          settings
        );
        
        setAvailableSlots(slots);
      } catch (err) {
        console.error("Failed to generate slots:", err);
        setAvailableSlots([]);
      }
    }

    loadAvailability();
  }, [selectedDate, selectedService, businessHours, blockedDates, settings]);

  const handleNext = () => {
    if (step === 1 && !selectedService) return;
    if (step === 2 && !selectedSlot) return;
    setStep(s => s + 1);
  };

  const handleBack = () => {
    setStep(s => s - 1);
  };

  const [bookingError, setBookingError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !selectedSlot) return;

    setSubmitting(true);
    setBookingError(null);
    try {
      const { error } = await supabase.from('appointments').insert([{
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        service_id: selectedService.id,
        appointment_date: format(selectedDate, 'yyyy-MM-dd'),
        start_time: format(selectedSlot.start, 'HH:mm:ss'),
        end_time: format(selectedSlot.end, 'HH:mm:ss'),
        status: 'pending',
        notes: formData.notes || null,
      }]);

      if (error) throw error;
      setStep(4); // Success
    } catch (err: any) {
      console.error('Booking failed:', err);
      setBookingError(err.message || 'Failed to submit appointment request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
      </div>
    );
  }

  // Date picker quick dates (next N days)
  const quickDates = Array.from({ length: 14 }, (_, i) => addDays(startOfToday(), i));

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-32 pb-12 md:pt-40 md:pb-24">
      {step < 4 && (
        <div className="mb-12">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-slate-100 -z-10"></div>
            {[
              { num: 1, label: 'Service' },
              { num: 2, label: 'Date & Time' },
              { num: 3, label: 'Details' }
            ].map((s) => (
              <div key={s.num} className="flex flex-col items-center bg-white px-4">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors",
                  step >= s.num ? "bg-teal-600 text-white" : "bg-slate-100 text-slate-400 border-2 border-slate-200"
                )}>
                  {step > s.num ? <CheckCircle2 className="w-5 h-5" /> : s.num}
                </div>
                <span className={cn(
                  "mt-2 text-sm font-medium",
                  step >= s.num ? "text-slate-900" : "text-slate-400"
                )}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        {step === 1 && (
          <div className="p-6 md:p-10">
            <h2 className="text-2xl font-display font-bold text-slate-900 mb-6">Select a Service</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map(service => (
                <button
                  key={service.id}
                  onClick={() => setSelectedService(service)}
                  className={cn(
                    "text-left p-6 rounded-2xl border-2 transition-all",
                    selectedService?.id === service.id 
                      ? "border-teal-600 bg-teal-50 ring-1 ring-teal-600" 
                      : "border-slate-100 hover:border-teal-200 hover:bg-slate-50"
                  )}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-slate-900">{service.name}</h3>
                    <span className="font-semibold text-teal-700">${service.price}</span>
                  </div>
                  <p className="text-slate-500 text-sm mb-4 line-clamp-2">{service.description}</p>
                  <div className="flex items-center text-slate-400 text-sm">
                    <Clock className="w-4 h-4 mr-1.5" />
                    {service.duration_minutes} min
                  </div>
                </button>
              ))}
            </div>
            <div className="mt-8 flex justify-end">
              <button
                onClick={handleNext}
                disabled={!selectedService}
                className="inline-flex items-center px-6 py-3 rounded-xl bg-slate-900 text-white font-medium hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Continue
                <ChevronRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="p-6 md:p-10">
            <div className="flex items-center gap-4 mb-8">
              <button onClick={handleBack} className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h2 className="text-2xl font-display font-bold text-slate-900">Select Date & Time</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">Choose Date</h3>
                <div className="grid grid-cols-4 gap-2">
                  {quickDates.map((date, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedDate(date)}
                      className={cn(
                        "flex flex-col items-center justify-center p-3 rounded-xl border transition-all",
                        isSameDay(selectedDate, date)
                          ? "border-teal-600 bg-teal-600 text-white"
                          : "border-slate-200 hover:border-teal-300 hover:bg-teal-50 text-slate-700"
                      )}
                    >
                      <span className="text-xs uppercase font-medium">{format(date, 'MMM')}</span>
                      <span className="text-lg font-bold">{format(date, 'dd')}</span>
                      <span className="text-xs">{format(date, 'EEE')}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">
                  Available Times <span className="text-slate-400 font-normal normal-case">for {format(selectedDate, 'MMM do')}</span>
                </h3>
                
                {availableSlots.length === 0 ? (
                  <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center text-center">
                    <Calendar className="w-8 h-8 text-slate-400 mb-3" />
                    <p className="text-slate-600 font-medium">No available slots</p>
                    <p className="text-sm text-slate-500 mt-1">Please select another date</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    {availableSlots.map((slot, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedSlot(slot)}
                        className={cn(
                          "py-3 px-2 rounded-xl border text-sm font-medium transition-all text-center",
                          selectedSlot?.start.getTime() === slot.start.getTime()
                            ? "border-teal-600 bg-teal-50 text-teal-800 ring-1 ring-teal-600"
                            : "border-slate-200 hover:border-teal-300 text-slate-700 hover:bg-slate-50"
                        )}
                      >
                        {slot.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-12 flex justify-end pt-6 border-t border-slate-100">
              <button
                onClick={handleNext}
                disabled={!selectedSlot}
                className="inline-flex items-center px-6 py-3 rounded-xl bg-slate-900 text-white font-medium hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Continue
                <ChevronRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="p-6 md:p-10 flex flex-col md:flex-row gap-12">
            <div className="md:w-2/3">
              <div className="flex items-center gap-4 mb-8">
                <button onClick={handleBack} className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h2 className="text-2xl font-display font-bold text-slate-900">Your Details</h2>
              </div>

              <form id="bookingForm" onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    id="fullName"
                    required
                    value={formData.fullName}
                    onChange={e => setFormData({...formData, fullName: e.target.value})}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 placeholder-slate-400 focus:border-teal-500 focus:ring-teal-500"
                    placeholder="Jane Doe"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 placeholder-slate-400 focus:border-teal-500 focus:ring-teal-500"
                      placeholder="jane@example.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      required
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 placeholder-slate-400 focus:border-teal-500 focus:ring-teal-500"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-slate-700 mb-1">Any notes for the dentist (Optional)</label>
                  <textarea
                    id="notes"
                    rows={3}
                    value={formData.notes}
                    onChange={e => setFormData({...formData, notes: e.target.value})}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 placeholder-slate-400 focus:border-teal-500 focus:ring-teal-500"
                    placeholder="E.g., I have sensitive teeth..."
                  />
                </div>
              </form>
            </div>

            <div className="md:w-1/3">
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 sticky top-24">
                <h3 className="font-bold text-slate-900 mb-4">Appointment Summary</h3>
                <div className="space-y-4">
                  <div>
                    <span className="text-xs text-slate-500 font-medium uppercase tracking-wider block mb-1">Service</span>
                    <p className="font-semibold text-slate-900">{selectedService?.name}</p>
                    <p className="text-sm text-slate-600">{selectedService?.duration_minutes} mins</p>
                  </div>
                  <div className="pt-4 border-t border-slate-200">
                    <span className="text-xs text-slate-500 font-medium uppercase tracking-wider block mb-1">Date & Time</span>
                    <p className="font-semibold text-slate-900">{selectedDate && format(selectedDate, 'EEEE, MMMM do, yyyy')}</p>
                    <p className="text-sm text-slate-600">{selectedSlot?.label}</p>
                  </div>
                  <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
                    <span className="font-bold text-slate-900">Total</span>
                    <span className="font-bold text-teal-700 text-lg">${selectedService?.price}</span>
                  </div>
                </div>

                {bookingError && (
                  <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600">
                    {bookingError}
                  </div>
                )}

                <button
                  type="submit"
                  form="bookingForm"
                  disabled={submitting || !formData.fullName || !formData.email || !formData.phone}
                  className="w-full mt-4 py-3.5 rounded-xl bg-teal-600 text-white font-semibold hover:bg-teal-700 shadow-lg shadow-teal-600/20 disabled:opacity-50 disabled:shadow-none transition-all flex items-center justify-center"
                >
                  {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirm Booking'}
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="p-10 md:p-16 text-center">
             <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6 text-teal-600">
                <CheckCircle2 className="w-10 h-10" />
             </div>
             <h2 className="text-3xl font-display font-bold text-slate-900 mb-4">Request Confirmed!</h2>
             <p className="text-lg text-slate-600 max-w-md mx-auto mb-8">
               Thank you, {formData.fullName}. Your appointment request for {selectedService?.name} on {selectedDate && format(selectedDate, 'MMM do')} at {selectedSlot?.label} has been received. Our team will review and confirm shortly.
             </p>
             <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => window.location.href = '/'}
                  className="px-6 py-3 rounded-xl bg-slate-100 text-slate-800 font-medium hover:bg-slate-200 transition-colors"
                >
                  Return to Home
                </button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
