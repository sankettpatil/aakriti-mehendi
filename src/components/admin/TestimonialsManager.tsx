import React, { useState } from 'react';
import { Plus, Save, Trash2, Edit2, Eye, EyeOff, Quote } from 'lucide-react';
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

interface Testimonial {
  id: number;
  customer_name: string;
  occasion: string | null;
  city: string | null;
  year: number | null;
  quote: string;
  photo_r2_key: string | null;
  is_visible: boolean;
  display_order: number;
}

interface Props {
  initialTestimonials: Testimonial[];
}

export function TestimonialsManager({ initialTestimonials }: Props) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [formData, setFormData] = useState<Partial<Testimonial>>({
    customer_name: '',
    occasion: '',
    city: '',
    year: new Date().getFullYear(),
    quote: '',
    is_visible: true
  });

  const [saving, setSaving] = useState(false);

  const [alertConfig, setAlertConfig] = useState<{ isOpen: boolean; title: string; message: string; type: 'alert' | 'confirm'; onConfirm?: () => void }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'alert'
  });

  const closeAlert = () => setAlertConfig(prev => ({ ...prev, isOpen: false }));

  const resetForm = () => {
    setFormData({
      customer_name: '',
      occasion: '',
      city: '',
      year: new Date().getFullYear(),
      quote: '',
      is_visible: true
    });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleEdit = (t: Testimonial) => {
    setFormData(t);
    setEditingId(t.id);
    setIsAdding(true);
  };

  const handleSave = async () => {
    if (!formData.customer_name || !formData.quote) {
      setAlertConfig({ isOpen: true, title: 'Error', message: 'Name and quote are required', type: 'alert' });
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        const res = await fetch(`/api/admin/testimonials/${editingId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        
        if (res.ok) {
          const data = await res.json();
          setTestimonials(prev => prev.map(t => t.id === editingId ? data.testimonial : t));
          resetForm();
        }
      } else {
        const res = await fetch('/api/admin/testimonials', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        
        if (res.ok) {
          const data = await res.json();
          setTestimonials(prev => [data.testimonial, ...prev]);
          resetForm();
        }
      }
    } catch (error) {
      console.error('Save error', error);
      setAlertConfig({ isOpen: true, title: 'Error', message: 'Failed to save', type: 'alert' });
    } finally {
      setSaving(false);
    }
  };

  const toggleVisibility = async (id: number, currentVisible: boolean) => {
    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_visible: !currentVisible })
      });
      
      if (res.ok) {
        setTestimonials(prev => prev.map(t => t.id === id ? { ...t, is_visible: !currentVisible } : t));
      }
    } catch (error) {
      console.error('Toggle visibility error', error);
    }
  };

  const deleteTestimonial = async (id: number) => {
    setAlertConfig({
      isOpen: true,
      title: 'Delete Testimonial?',
      message: 'Are you sure you want to delete this testimonial?',
      type: 'confirm',
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/admin/testimonials/${id}`, {
            method: 'DELETE'
          });
          
          if (res.ok) {
            setTestimonials(prev => prev.filter(t => t.id !== id));
          }
        } catch (error) {
          console.error('Delete error', error);
        }
      }
    });
  };

  return (
    <div className="space-y-8">
      {/* Header Actions */}
      {!isAdding && (
        <div className="flex justify-end">
          <button 
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-[13px] font-medium rounded-md hover:bg-[#701B15] transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Testimonial
          </button>
        </div>
      )}

      {/* Add / Edit Form */}
      {isAdding && (
        <div className="bg-white p-6 rounded-md shadow-none border border-gray-200 hover:border-gray-200 transition-colors">
          <h2 className="text-2xl tracking-tight text-gray-900 mb-6">
            {editingId ? 'Edit Testimonial' : 'New Testimonial'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Customer Name *</label>
              <input 
                type="text" 
                value={formData.customer_name}
                onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                className="w-full px-3 py-2 bg-bg border border-gray-200 rounded-md text-sm text-gray-900 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">City</label>
              <input 
                type="text" 
                value={formData.city || ''}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="e.g. Delhi"
                className="w-full px-3 py-2 bg-bg border border-gray-200 rounded-md text-sm text-gray-900 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Occasion</label>
              <input 
                type="text" 
                value={formData.occasion || ''}
                onChange={(e) => setFormData({ ...formData, occasion: e.target.value })}
                placeholder="e.g. Bridal Mehndi"
                className="w-full px-3 py-2 bg-bg border border-gray-200 rounded-md text-sm text-gray-900 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Year</label>
              <input 
                type="number" 
                value={formData.year || ''}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                className="w-full px-3 py-2 bg-bg border border-gray-200 rounded-md text-sm text-gray-900 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Quote *</label>
            <textarea 
              value={formData.quote}
              onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
              rows={4}
              placeholder="What did the customer say?"
              className="w-full px-3 py-2 bg-bg border border-gray-200 rounded-md text-sm text-gray-900 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            />
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
              {saving ? 'Saving...' : <><Save className="w-4 h-4" /> Save</>}
            </button>
          </div>
        </div>
      )}

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testimonials.length > 0 ? testimonials.map(t => (
          <div key={t.id} className={`bg-white p-6 rounded-md border hover:border-gray-200 transition-all relative group ${t.is_visible ? 'border-gray-200 shadow-none' : 'border-gray-200/20 opacity-60'}`}>
            <Quote className="absolute top-6 right-6 w-8 h-8 text-[#FFDAD4]/30" />
            
            <p className="text-[15px] leading-relaxed text-gray-900 mb-6 relative z-10">"{t.quote}"</p>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[13px] font-semibold text-gray-900">{t.customer_name}</p>
                <p className="text-[12px] text-gray-500">
                  {[t.occasion, t.city, t.year].filter(Boolean).join(' • ')}
                </p>
              </div>
            </div>

            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
              <button 
                onClick={() => toggleVisibility(t.id, t.is_visible)}
                className="p-1.5 bg-white rounded-md shadow-none border border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                title={t.is_visible ? "Hide from public" : "Show to public"}
              >
                {t.is_visible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
              <button 
                onClick={() => handleEdit(t)}
                className="p-1.5 bg-white rounded-md shadow-none border border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                title="Edit testimonial"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => deleteTestimonial(t.id)}
                className="p-1.5 bg-white rounded-md shadow-none border border-gray-200 text-red-600/70 hover:text-red-600 hover:bg-red-50 hover:border-error/30 transition-all"
                title="Delete testimonial"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )) : (
          <div className="col-span-1 md:col-span-2 text-center py-12 border-2 border-dashed border-gray-200 rounded-md">
            <Quote className="w-12 h-12 text-gray-500 mx-auto mb-3" />
            <p className="text-gray-900 font-medium">No testimonials yet</p>
            <p className="text-sm text-gray-500 mt-1">Add your first customer review to display on the site.</p>
          </div>
        )}
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
