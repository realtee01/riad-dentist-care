import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { type AppointmentWithService } from '@/types/database';
import { format, parse } from 'date-fns';
import { Loader2, Calendar as CalendarIcon, Clock, Check, X, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Appointments() {
  const [appointments, setAppointments] = useState<AppointmentWithService[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    setLoading(true);
    // Note: Due to how supabase returns joined nested object, it will be mapped to 'services'
    const { data, error } = await supabase
      .from('appointments')
      .select('*, services:service_id(*)')
      .order('appointment_date', { ascending: false })
      .order('start_time', { ascending: false });

    if (data) {
      setAppointments(data as AppointmentWithService[]);
    }
    setLoading(false);
  };

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id);
    const { error } = await supabase
      .from('appointments')
      .update({ status })
      .eq('id', id);
    
    if (!error) {
      setAppointments(apps => apps.map(app => app.id === id ? { ...app, status: status as any } : app));
    }
    setUpdating(null);
  };

  const filteredApps = filter === 'all' 
    ? appointments 
    : appointments.filter(app => app.status === filter);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return 'bg-amber-100 text-amber-800';
      case 'confirmed': return 'bg-teal-100 text-teal-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-slate-100 text-slate-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="p-4 md:p-8">
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Appointments</h1>
          <p className="mt-2 text-sm text-slate-600">
            Manage incoming bookings and patient visits.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="block w-full rounded-xl border-slate-300 py-2 pl-3 pr-10 text-base focus:border-teal-500 focus:outline-none focus:ring-teal-500 sm:text-sm"
          >
            <option value="all">All Appointments</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {filteredApps.map((app) => (
              <div key={app.id} className="p-6 hover:bg-slate-50 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
                  
                  {/* Patient Info */}
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 flex-shrink-0">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{app.full_name}</p>
                      <p className="text-sm text-slate-500">{app.email}</p>
                      <p className="text-sm text-slate-500">{app.phone}</p>
                    </div>
                  </div>

                  {/* Appointment Details */}
                  <div className="flex flex-col justify-center">
                    <p className="font-medium text-slate-900 flex items-center mb-1">
                      {app.services?.name || 'Unknown Service'}
                    </p>
                    <div className="flex items-center text-sm text-slate-500 space-x-4">
                      <span className="flex items-center">
                        <CalendarIcon className="w-4 h-4 mr-1.5" />
                        {format(parse(app.appointment_date, 'yyyy-MM-dd', new Date()), 'MMM do, yyyy')}
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1.5" />
                        {app.start_time.substring(0, 5)} - {app.end_time.substring(0, 5)}
                      </span>
                    </div>
                    {app.notes && (
                      <p className="mt-2 text-sm text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 inline-block line-clamp-2">
                        <span className="font-medium text-slate-700">Note:</span> {app.notes}
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions & Status */}
                <div className="flex flex-col items-start lg:items-end gap-3 min-w-[200px]">
                  <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize', getStatusColor(app.status))}>
                    {app.status}
                  </span>
                  
                  <div className="flex flex-wrap gap-2">
                    {app.status === 'pending' && (
                      <>
                        <button
                          onClick={() => updateStatus(app.id, 'confirmed')}
                          disabled={updating === app.id}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-lg text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => updateStatus(app.id, 'cancelled')}
                          disabled={updating === app.id}
                          className="inline-flex items-center px-3 py-1.5 border border-slate-300 text-xs font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                    {app.status === 'confirmed' && (
                      <>
                        <button
                          onClick={() => updateStatus(app.id, 'completed')}
                          disabled={updating === app.id}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                        >
                          Mark Completed
                        </button>
                        <button
                          onClick={() => updateStatus(app.id, 'cancelled')}
                          disabled={updating === app.id}
                          className="inline-flex items-center px-3 py-1.5 border border-slate-300 text-xs font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {filteredApps.length === 0 && (
              <div className="p-12 text-center text-slate-500">
                No appointments found for this filter.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
