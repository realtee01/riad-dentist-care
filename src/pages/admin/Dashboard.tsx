import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Users, Calendar, Activity, CheckCircle2 } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({
    upcoming: 0,
    pending: 0,
    completed: 0,
    activeServices: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      const today = new Date().toISOString().split('T')[0];

      // Get upcoming (confirmed, today or future)
      const { count: upcoming } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'confirmed')
        .gte('appointment_date', today);

      // Get pending
      const { count: pending } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      // Get completed
      const { count: completed } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'completed');

      // Active services
      const { count: activeServices } = await supabase
        .from('services')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      setStats({
        upcoming: upcoming || 0,
        pending: pending || 0,
        completed: completed || 0,
        activeServices: activeServices || 0
      });
      setLoading(false);
    }

    loadStats();
  }, []);

  const statCards = [
    { name: 'Pending Approvals', value: stats.pending, icon: Users, color: 'text-amber-600', bg: 'bg-amber-100' },
    { name: 'Upcoming Appointments', value: stats.upcoming, icon: Calendar, color: 'text-teal-600', bg: 'bg-teal-100' },
    { name: 'Completed Visits', value: stats.completed, icon: CheckCircle2, color: 'text-blue-600', bg: 'bg-blue-100' },
    { name: 'Active Services', value: stats.activeServices, icon: Activity, color: 'text-indigo-600', bg: 'bg-indigo-100' },
  ];

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-8">Overview</h1>
      
      {loading ? (
        <div className="animate-pulse grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[1,2,3,4].map(i => (
             <div key={i} className="bg-white rounded-2xl p-6 h-32 border border-slate-200"></div>
          ))}
        </div>
      ) : (
        <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((item) => (
            <div
              key={item.name}
              className="relative bg-white pt-5 px-4 pb-12 sm:pt-6 sm:px-6 shadow-sm rounded-2xl overflow-hidden border border-slate-200"
            >
              <dt>
                <div className={`absolute rounded-xl p-3 ${item.bg}`}>
                  <item.icon className={`h-6 w-6 ${item.color}`} aria-hidden="true" />
                </div>
                <p className="ml-16 text-sm font-medium text-slate-500 truncate">{item.name}</p>
              </dt>
              <dd className="ml-16 pb-6 flex items-baseline sm:pb-7">
                <p className="text-2xl font-semibold text-slate-900">{item.value}</p>
              </dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}
