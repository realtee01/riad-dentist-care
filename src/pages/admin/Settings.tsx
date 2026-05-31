import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { type ClinicSettings } from '@/types/database';
import { Loader2, Save } from 'lucide-react';

export default function Settings() {
  const [settings, setSettings] = useState<ClinicSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('clinic_settings')
      .select('*')
      .limit(1)
      .single();
    
    if (data) {
      setSettings(data);
    } else {
      // Default fallback in case DB is unexpectedly completely empty
      setSettings({
        clinic_name: "Rita's Dental Center",
        clinic_email: "contact@ritasdental.example.com",
        clinic_phone: "(555) 123-4567",
        clinic_address: "123 Healthy Smile Ave.",
        slot_interval_minutes: 30,
        booking_notice_hours: 24,
      } as ClinicSettings);
    }
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    
    setSaving(true);
    setMessage(null);

    try {
      if (settings.id) {
        const { error } = await supabase
          .from('clinic_settings')
          .update(settings)
          .eq('id', settings.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('clinic_settings')
          .insert([settings]);
        if (error) throw error;
      }
      setMessage({ type: 'success', text: 'Clinic settings updated successfully.' });
      await loadSettings();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to update settings.' });
    }
    setSaving(false);
  };

  if (loading) {
     return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Clinic Settings</h1>
        <p className="mt-2 text-sm text-slate-600">
          Manage your clinic's public contact information and booking rules.
        </p>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-xl text-sm ${message.type === 'success' ? 'bg-teal-50 text-teal-800 border border-teal-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white shadow-sm border border-slate-200 rounded-2xl overflow-hidden">
        <div className="p-4 md:p-8 space-y-8">
          
          <div>
            <h3 className="text-lg font-medium text-slate-900 mb-4 border-b border-slate-100 pb-2">Business Profile</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700">Clinic Name</label>
                <input
                  type="text"
                  required
                  value={settings?.clinic_name || ''}
                  onChange={e => setSettings({...settings!, clinic_name: e.target.value})}
                  className="mt-1 block w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Contact Email</label>
                <input
                  type="email"
                  required
                  value={settings?.clinic_email || ''}
                  onChange={e => setSettings({...settings!, clinic_email: e.target.value})}
                  className="mt-1 block w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Contact Phone</label>
                <input
                  type="text"
                  required
                  value={settings?.clinic_phone || ''}
                  onChange={e => setSettings({...settings!, clinic_phone: e.target.value})}
                  className="mt-1 block w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:ring-teal-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700">Physical Address</label>
                <textarea
                  rows={2}
                  required
                  value={settings?.clinic_address || ''}
                  onChange={e => setSettings({...settings!, clinic_address: e.target.value})}
                  className="mt-1 block w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:ring-teal-500"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-slate-900 mb-4 border-b border-slate-100 pb-2">Booking Rules</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700">Slot Interval (Minutes)</label>
                <p className="text-xs text-slate-500 mb-2">How frequently slots appear (e.g., every 30 mins)</p>
                <input
                  type="number"
                  min="5"
                  step="5"
                  required
                  value={settings?.slot_interval_minutes === undefined || isNaN(settings.slot_interval_minutes) ? '' : settings.slot_interval_minutes}
                  onChange={e => setSettings({...settings!, slot_interval_minutes: parseInt(e.target.value) || 0})}
                  className="mt-1 block w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Minimum Notice (Hours)</label>
                <p className="text-xs text-slate-500 mb-2">How far in advance a patient must book</p>
                <input
                  type="number"
                  min="0"
                  required
                  value={settings?.booking_notice_hours === undefined || isNaN(settings.booking_notice_hours) ? '' : settings.booking_notice_hours}
                  onChange={e => setSettings({...settings!, booking_notice_hours: parseInt(e.target.value) || 0})}
                  className="mt-1 block w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:ring-teal-500"
                />
              </div>
            </div>
          </div>

        </div>
        <div className="bg-slate-50 px-8 py-5 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center rounded-xl bg-teal-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Save className="w-5 h-5 mr-2" />}
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}
