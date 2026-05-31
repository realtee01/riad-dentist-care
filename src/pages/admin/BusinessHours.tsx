import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { type BusinessHour } from '@/types/database';
import { Loader2, Save } from 'lucide-react';

const WEEKDAYS = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

export default function BusinessHours() {
  const [hours, setHours] = useState<BusinessHour[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  useEffect(() => {
    loadHours();
  }, []);

  const loadHours = async () => {
    const { data } = await supabase
      .from('business_hours')
      .select('*')
      .order('weekday', { ascending: true });
    
    if (data) {
      // Ensure all 7 days exist
      const fullHours = WEEKDAYS.map((_, i) => {
        const existing = data.find(d => d.weekday === i);
        return existing || { weekday: i, is_open: false, start_time: '09:00:00', end_time: '17:00:00' } as any;
      });
      setHours(fullHours);
    }
    setLoading(false);
  };

  const handleChange = (weekday: number, field: keyof BusinessHour, value: any) => {
    setHours(prev => prev.map(h => 
      h.weekday === weekday ? { ...h, [field]: value } : h
    ));
    setMessage(null);
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      for (const h of hours) {
        if (h.id) {
          await supabase.from('business_hours').update(h).eq('id', h.id);
        } else {
          // It's technically possible a day was missing and we need to insert
          await supabase.from('business_hours').insert([h]);
        }
      }
      setMessage({ type: 'success', text: 'Business hours updated successfully.' });
      await loadHours(); // Reload to get updated IDs if any
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to update business hours.' });
    }
    setSaving(false);
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Business Hours</h1>
        <p className="mt-2 text-sm text-slate-600">
          Set your clinic's weekly operating hours. This controls available times in the booking system.
        </p>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-xl text-sm ${message.type === 'success' ? 'bg-teal-50 text-teal-800 border border-teal-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
          {message.text}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
           <div className="p-12 flex justify-center text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {hours.map((hour) => (
              <div key={hour.weekday} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="w-32 flex items-center">
                  <input
                    type="checkbox"
                    id={`day-${hour.weekday}`}
                    checked={hour.is_open}
                    onChange={(e) => handleChange(hour.weekday, 'is_open', e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                  />
                  <label htmlFor={`day-${hour.weekday}`} className="ml-3 font-medium text-slate-900">
                    {WEEKDAYS[hour.weekday]}
                  </label>
                </div>

                <div className="flex items-center gap-4 flex-1">
                  {hour.is_open ? (
                    <>
                      <div className="flex-1 max-w-[150px]">
                        <input
                          type="time"
                          value={hour.start_time.substring(0, 5)} // Handle HH:mm:ss to HH:mm
                          onChange={(e) => handleChange(hour.weekday, 'start_time', e.target.value + ':00')}
                          className="block w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:ring-teal-500"
                        />
                      </div>
                      <span className="text-slate-500">to</span>
                      <div className="flex-1 max-w-[150px]">
                        <input
                          type="time"
                          value={hour.end_time.substring(0, 5)}
                          onChange={(e) => handleChange(hour.weekday, 'end_time', e.target.value + ':00')}
                          className="block w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:ring-teal-500"
                        />
                      </div>
                    </>
                  ) : (
                    <span className="text-sm text-slate-400 px-3 py-2">Closed</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="bg-slate-50 px-6 py-4 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving || loading}
            className="inline-flex items-center justify-center rounded-xl bg-teal-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Save className="w-5 h-5 mr-2" />}
            Save Business Hours
          </button>
        </div>
      </div>
    </div>
  );
}
