import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Check, X, AlertCircle } from 'lucide-react';
import type { Service } from '../../lib/db';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function ServicesManager() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Partial<Service>>({
    name: '',
    slug: '',
    description: '',
    duration_min: 60,
    price_from: undefined,
    price_to: undefined,
    is_active: 1,
    display_order: 0
  });

  // Alert Dialog
  const [alertConfig, setAlertConfig] = useState<{ isOpen: boolean; title: string; message: string; type: 'alert' | 'confirm'; onConfirm?: () => void }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'alert'
  });

  const closeAlert = () => setAlertConfig(prev => ({ ...prev, isOpen: false }));

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/admin/services');
      const data = await res.json();
      if (data.success) {
        setServices(data.services);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to fetch services.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (service: Service) => {
    setFormData(service);
    setIsEditing(service.id);
    setIsAdding(false);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      duration_min: 60,
      price_from: undefined,
      price_to: undefined,
      is_active: 1,
      display_order: 0
    });
    setIsEditing(null);
    setIsAdding(false);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.slug) {
      setAlertConfig({ isOpen: true, title: 'Validation Error', message: 'Name and slug are required.', type: 'alert' });
      return;
    }

    setSaving(true);
    try {
      const isNew = !isEditing;
      const url = isNew ? '/api/admin/services' : `/api/admin/services/${isEditing}`;
      const method = isNew ? 'POST' : 'PUT';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      
      if (res.ok) {
        if (isNew) {
          setServices([...services, data.service]);
        } else {
          setServices(services.map(s => s.id === isEditing ? data.service : s));
        }
        resetForm();
      } else {
        setAlertConfig({ isOpen: true, title: 'Error', message: data.error || 'Failed to save service.', type: 'alert' });
      }
    } catch (err) {
      setAlertConfig({ isOpen: true, title: 'Error', message: 'An unexpected error occurred.', type: 'alert' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id: number) => {
    setAlertConfig({
      isOpen: true,
      title: 'Delete Service?',
      message: 'Are you sure you want to delete this service? If it has associated bookings, it will be deactivated instead.',
      type: 'confirm',
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/admin/services/${id}`, { method: 'DELETE' });
          const data = await res.json();
          if (res.ok) {
            fetchServices();
          } else {
            setAlertConfig({ isOpen: true, title: 'Error', message: data.error, type: 'alert' });
          }
        } catch (err) {
          console.error(err);
        }
      }
    });
  };

  if (loading) return <div className="text-gray-500 text-[13px] p-8">Loading services...</div>;
  if (error) return <div className="text-red-600 text-[13px] p-8">{error}</div>;

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-6 md:p-8 animation-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl text-gray-900 font-semibold tracking-tight">Manage Services</h2>
          <p className="text-[13px] text-gray-500 mt-1 max-w-2xl">
            Add or edit the occasions and services displayed in the first step of the booking flow. The <strong>slug</strong> is crucial as it connects the service to its specific pricing rules under the hood.
          </p>
        </div>
        {!isAdding && !isEditing && (
          <button 
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-[13px] font-medium rounded-md hover:bg-[#701B15] transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" /> Add Service
          </button>
        )}
      </div>

      {(isAdding || isEditing) && (
        <div className="bg-white p-6 rounded-md shadow-none border border-gray-200 mb-8">
          <h3 className="text-2xl text-gray-900 tracking-tight mb-6">
            {isEditing ? 'Edit Service' : 'New Service'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Service Name *</label>
              <input 
                type="text" 
                value={formData.name || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  const slugUpdate = isAdding ? { slug: val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') } : {};
                  setFormData({ ...formData, name: val, ...slugUpdate });
                }}
                placeholder="e.g. Bridal Mehndi"
                className="w-full px-3 py-2 bg-bg border border-gray-200 rounded-md text-[13px] text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 transition-all"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Slug *</label>
              <input 
                type="text" 
                value={formData.slug || ''}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="bridal-mehndi"
                className="w-full px-3 py-2 bg-bg border border-gray-200 rounded-md text-[13px] text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 transition-all"
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Description</label>
            <textarea 
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 bg-bg border border-gray-200 rounded-md text-[13px] text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 transition-all"
              rows={3}
            />
          </div>

          <div className="mb-6 flex items-center gap-2">
            <input 
              type="checkbox" 
              id="isActive"
              checked={formData.is_active === 1}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked ? 1 : 0 })}
              className="w-4 h-4 text-gray-900 rounded border-gray-200 focus:ring-gray-900 focus:ring-2"
            />
            <label htmlFor="isActive" className="text-[13px] font-medium text-gray-900">Service is active and bookable</label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button 
              onClick={resetForm}
              className="px-4 py-2 text-[13px] font-medium text-gray-500 hover:text-gray-900 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-[13px] font-medium rounded-md hover:bg-[#701B15] transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Service'}
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-md shadow-none border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-gray-50 text-[11px] uppercase tracking-wider text-gray-500 border-b border-gray-200">
                <th className="px-5 py-3 font-medium">Service Name</th>
                <th className="px-5 py-3 font-medium">Description</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FFDAD4]/30">
              {services.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="font-medium text-lg text-gray-900 mb-0.5">{s.name}</div>
                    <div className="text-[11px] font-mono text-gray-500">{s.slug}</div>
                  </td>
                  <td className="px-5 py-3 text-[13px] text-gray-900">
                    {s.description || '-'}
                  </td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md border border-gray-200 bg-white text-gray-900 text-[11px] font-medium uppercase tracking-wider`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${s.is_active ? 'bg-success' : 'bg-ink-muted'}`}></span>
                      {s.is_active ? 'Active' : 'Hidden'}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleEdit(s)}
                        className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                        title="Edit Service"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(s.id)}
                        className="p-1.5 text-red-600/70 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors ml-1"
                        title="Delete Service"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {services.length === 0 && !loading && (
                <tr>
                  <td colSpan={4} className="px-5 py-12 text-center text-gray-500 text-sm">
                    No services found. Click "Add Service" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AlertDialog open={alertConfig.isOpen} onOpenChange={(open) => !open && closeAlert()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{alertConfig.title}</AlertDialogTitle>
            <AlertDialogDescription>{alertConfig.message}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            {alertConfig.type === 'confirm' && (
              <AlertDialogCancel onClick={closeAlert}>Cancel</AlertDialogCancel>
            )}
            <AlertDialogAction onClick={() => {
              if (alertConfig.onConfirm) alertConfig.onConfirm();
              closeAlert();
            }}>
              {alertConfig.type === 'confirm' ? 'Confirm' : 'OK'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
