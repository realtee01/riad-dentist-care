import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { type BlockedDate } from '@/types/database';
import { format, parse } from 'date-fns';
import { Loader2, Trash2, CalendarOff, Plus } from 'lucide-react';

export default function BlockedDates() {
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [loading, setLoading] = useState(true);
  
  // New Blocked Date State
  const [newDate, setNewDate] = useState('');
  const [newReason, setNewReason] = useState('');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    loadBlockedDates();
  }, []);

  const loadBlockedDates = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('blocked_dates')
      .select('*')
      .order('blocked_date', { ascending: true })
      .gte('blocked_date', format(new Date(), 'yyyy-MM-dd')); // Only show today and future
    
    if (data) setBlockedDates(data);
    setLoading(false);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDate) return;

    setAdding(true);
    const { error } = await supabase
      .from('blocked_dates')
      .insert([{ blocked_date: newDate, reason: newReason || null }]);
    
    if (!error) {
      setNewDate('');
      setNewReason('');
      await loadBlockedDates();
    }
    setAdding(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('blocked_dates')
      .delete()
      .eq('id', id);
    
    if (!error) {
      setBlockedDates(prev => prev.filter(d => d.id !== id));
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Blocked Dates</h1>
        <p className="mt-2 text-sm text-slate-600">
          Manage holidays or days the clinic is closed. Patients cannot book appointments on these dates.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-4 flex items-center">
          <CalendarOff className="w-4 h-4 mr-2" />
          Add Blocked Date
        </h2>
        <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label htmlFor="date" className="block text-sm font-medium text-slate-700 mb-1">Date</label>
            <input
              type="date"
              id="date"
              required
              min={format(new Date(), 'yyyy-MM-dd')}
              value={newDate}
              onChange={e => setNewDate(e.target.value)}
              className="block w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:ring-teal-500"
            />
          </div>
          <div className="flex-[2] w-full">
            <label htmlFor="reason" className="block text-sm font-medium text-slate-700 mb-1">Reason (Optional)</label>
            <input
              type="text"
              id="reason"
              placeholder="e.g., National Holiday"
              value={newReason}
              onChange={e => setNewReason(e.target.value)}
              className="block w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:ring-teal-500"
            />
          </div>
          <button
            type="submit"
            disabled={adding || !newDate}
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-slate-800 focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 transition-colors disabled:opacity-50"
          >
            {adding ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
            Add
          </button>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {blockedDates.map((block) => (
              <div key={block.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div>
                  <p className="font-medium text-slate-900">{format(parse(block.blocked_date, 'yyyy-MM-dd', new Date()), 'EEEE, MMMM do, yyyy')}</p>
                  {block.reason && <p className="text-sm text-slate-500 mt-1">{block.reason}</p>}
                </div>
                <button
                  onClick={() => handleDelete(block.id)}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  aria-label="Delete"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
            {blockedDates.length === 0 && (
              <div className="p-12 text-center text-slate-500">
                <CalendarOff className="w-8 h-8 mx-auto text-slate-300 mb-3" />
                <p>No upcoming dates are blocked.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
