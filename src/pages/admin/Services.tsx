import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { type Service } from '@/types/database';
import { Plus, Pencil, Loader2, X, AlertCircle } from 'lucide-react';

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingService, setEditingService] = useState<Partial<Service> | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setServices(data);
    setLoading(false);
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setIsEditing(true);
    setError(null);
  };

  const handleAddNew = () => {
    setEditingService({
      name: '',
      description: '',
      duration_minutes: 30,
      price: 0,
      is_active: true,
      image_url: ''
    });
    setIsEditing(true);
    setError(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 600;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setEditingService(prev => prev ? { ...prev, image_url: dataUrl } : prev);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;
    
    setSaving(true);
    setError(null);

    const payload = {
      name: editingService.name,
      description: editingService.description,
      duration_minutes: editingService.duration_minutes,
      price: editingService.price,
      is_active: editingService.is_active,
      image_url: editingService.image_url,
    };

    try {
      if (editingService.id) {
        // Update
        const { error } = await supabase
          .from('services')
          .update(payload)
          .eq('id', editingService.id);
        if (error) throw error;
      } else {
        // Insert
        const { error } = await supabase
          .from('services')
          .insert([payload]);
        if (error) throw error;
      }
      
      await loadServices();
      setIsEditing(false);
      setEditingService(null);
    } catch (err: any) {
      setError(err.message || 'Failed to save service');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 md:p-8">
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Services</h1>
          <p className="mt-2 text-sm text-slate-600">
            Manage the dental services offered at your clinic.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={handleAddNew}
            className="inline-flex items-center justify-center rounded-xl border border-transparent bg-teal-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 sm:w-auto transition-colors"
          >
            <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Add Service
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Service</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Duration</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Price</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="relative px-6 py-4"><span className="sr-only">Edit</span></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {services.map((service) => (
                  <tr key={service.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-slate-900">{service.name}</div>
                      <div className="text-sm text-slate-500 truncate max-w-sm">{service.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {service.duration_minutes} min
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      ${service.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                        service.is_active ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'
                      }`}>
                        {service.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => handleEdit(service)}
                        className="text-teal-600 hover:text-teal-900 mx-auto inline-flex items-center"
                      >
                        <Pencil className="w-4 h-4 mr-1" /> Edit
                      </button>
                    </td>
                  </tr>
                ))}
                {services.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                      No services found. Add your first service to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit/Add Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-[100] overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4 text-center">
            <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity" onClick={() => setIsEditing(false)} />
            
            <div className="relative inline-block w-full max-w-lg transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
              <form onSubmit={handleSave}>
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <h3 className="text-lg font-medium leading-6 text-slate-900 mb-6 border-b border-slate-100 pb-4 flex justify-between items-center">
                      {editingService?.id ? 'Edit Service' : 'Add New Service'}
                      <button type="button" onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-slate-600">
                        <X className="w-5 h-5" />
                      </button>
                    </h3>
                    
                    {error && (
                      <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-start mt-2">
                        <AlertCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                        {error}
                      </div>
                    )}
                    
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-slate-700">Name</label>
                        <input
                          type="text"
                          id="name"
                          required
                          value={editingService?.name || ''}
                          onChange={e => setEditingService({...editingService, name: e.target.value})}
                          className="mt-1 block w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="description" className="block text-sm font-medium text-slate-700">Description</label>
                        <textarea
                          id="description"
                          rows={3}
                          required
                          value={editingService?.description || ''}
                          onChange={e => setEditingService({...editingService, description: e.target.value})}
                          className="mt-1 block w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700">Service Image</label>
                        <div className="mt-2 flex items-center space-x-4">
                          {editingService?.image_url && (
                            <img src={editingService.image_url} alt="Service preview" className="w-16 h-16 object-cover rounded-xl border border-slate-200" />
                          )}
                          <label className="cursor-pointer inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                            <span>Upload Image</span>
                            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                          </label>
                          {editingService?.image_url && (
                            <button type="button" onClick={() => setEditingService({...editingService, image_url: ''})} className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors">
                              Remove
                            </button>
                          )}
                        </div>
                        <p className="mt-1 text-xs text-slate-500">Image will be automatically optimized before saving.</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="duration" className="block text-sm font-medium text-slate-700">Duration (mins)</label>
                          <input
                            type="number"
                            id="duration"
                            min="5"
                            step="5"
                            required
                            value={editingService?.duration_minutes === undefined || isNaN(editingService.duration_minutes) ? '' : editingService.duration_minutes}
                            onChange={e => setEditingService({...editingService, duration_minutes: parseInt(e.target.value) || 0})}
                            className="mt-1 block w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                          />
                        </div>
                        <div>
                          <label htmlFor="price" className="block text-sm font-medium text-slate-700">Price ($)</label>
                          <input
                            type="number"
                            id="price"
                            min="0"
                            step="0.01"
                            required
                            value={editingService?.price === undefined || isNaN(editingService.price) ? '' : editingService.price}
                            onChange={e => setEditingService({...editingService, price: parseFloat(e.target.value) || 0})}
                            className="mt-1 block w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                          />
                        </div>
                      </div>

                      <div className="flex items-center mt-4">
                        <input
                          id="is_active"
                          type="checkbox"
                          checked={editingService?.is_active || false}
                          onChange={e => setEditingService({...editingService, is_active: e.target.checked})}
                          className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                        />
                        <label htmlFor="is_active" className="ml-2 block text-sm text-slate-700">
                          Active (visible on website)
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 px-4 py-4 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex w-full justify-center rounded-xl border border-transparent bg-teal-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Service'}
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => setIsEditing(false)}
                  className="mt-3 inline-flex w-full justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-base font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
