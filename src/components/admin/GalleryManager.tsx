import React, { useState, useRef } from 'react';
import { Upload, X, Save, Image as ImageIcon, Eye, EyeOff, Trash2 } from 'lucide-react';
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

interface GalleryImage {
  id: number;
  r2_key: string;
  alt_text: string | null;
  style_tag: string | null;
  occasion_tag: string | null;
  is_visible: boolean;
  display_order: number;
  created_at: string;
}

interface Props {
  initialImages: GalleryImage[];
}

export function GalleryManager({ initialImages }: Props) {
  const [images, setImages] = useState<GalleryImage[]>(initialImages);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [altText, setAltText] = useState('');
  const [styleTag, setStyleTag] = useState('');
  const [occasionTag, setOccasionTag] = useState('');

  const [alertConfig, setAlertConfig] = useState<{ isOpen: boolean; title: string; message: string; type: 'alert' | 'confirm'; onConfirm?: () => void }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'alert'
  });

  const closeAlert = () => setAlertConfig(prev => ({ ...prev, isOpen: false }));

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    if (altText) formData.append('alt_text', altText);
    if (styleTag) formData.append('style_tag', styleTag);
    if (occasionTag) formData.append('occasion_tag', occasionTag);

    try {
      const res = await fetch('/api/admin/gallery/upload', {
        method: 'POST',
        body: formData
      });
      
      if (res.ok) {
        const data = await res.json();
        setImages(prev => [data.image, ...prev]);
        
        // Reset form
        setAltText('');
        setStyleTag('');
        setOccasionTag('');
        if (fileInputRef.current) fileInputRef.current.value = '';
      } else {
        setAlertConfig({ isOpen: true, title: 'Error', message: 'Upload failed', type: 'alert' });
      }
    } catch (error) {
      console.error('Upload error', error);
      setAlertConfig({ isOpen: true, title: 'Error', message: 'Upload error', type: 'alert' });
    } finally {
      setUploading(false);
    }
  };

  const toggleVisibility = async (id: number, currentVisible: boolean) => {
    try {
      const res = await fetch(`/api/admin/gallery/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_visible: !currentVisible })
      });
      
      if (res.ok) {
        setImages(prev => prev.map(img => img.id === id ? { ...img, is_visible: !currentVisible } : img));
      }
    } catch (error) {
      console.error('Toggle visibility error', error);
    }
  };

  const deleteImage = async (id: number) => {
    setAlertConfig({
      isOpen: true,
      title: 'Delete Image?',
      message: 'Are you sure you want to delete this image?',
      type: 'confirm',
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/admin/gallery/${id}`, {
            method: 'DELETE'
          });
          
          if (res.ok) {
            setImages(prev => prev.filter(img => img.id !== id));
          }
        } catch (error) {
          console.error('Delete error', error);
        }
      }
    });
  };

  return (
    <div className="space-y-8">
      {/* Upload Section */}
      <div className="bg-white p-6 rounded-md shadow-none border border-gray-200 hover:border-gray-200 transition-colors mb-8">
        <h2 className="text-2xl tracking-tight text-gray-900 mb-6">Upload New Image</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Alt Text (SEO)</label>
            <input 
              type="text" 
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="e.g. Bridal Mehndi Design"
              className="w-full px-3 py-2 bg-bg border border-gray-200 rounded text-sm text-gray-900 focus:border-brand focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Style Tag</label>
            <input 
              type="text" 
              value={styleTag}
              onChange={(e) => setStyleTag(e.target.value)}
              placeholder="e.g. Arabic, Bridal"
              className="w-full px-3 py-2 bg-bg border border-gray-200 rounded text-sm text-gray-900 focus:border-brand focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Occasion Tag</label>
            <input 
              type="text" 
              value={occasionTag}
              onChange={(e) => setOccasionTag(e.target.value)}
              placeholder="e.g. Wedding, Engagement"
              className="w-full px-3 py-2 bg-bg border border-gray-200 rounded text-sm text-gray-900 focus:border-brand focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleUpload}
            accept="image/*"
            className="hidden"
            id="file-upload"
          />
          <label 
            htmlFor="file-upload"
            className={`inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-[13px] font-medium rounded-md cursor-pointer hover:bg-[#701B15] transition-colors ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
          >
            <Upload className="w-4 h-4" />
            {uploading ? 'Uploading...' : 'Select Image to Upload'}
          </label>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="bg-white p-6 rounded-md shadow-none border border-gray-200 hover:border-gray-200 transition-colors">
        <h2 className="text-2xl tracking-tight text-gray-900 mb-6">Gallery Images</h2>
        
        {images.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {images.map(image => (
              <div key={image.id} className={`group relative rounded-md border overflow-hidden transition-all ${image.is_visible ? 'border-gray-200' : 'border-gray-200/50 opacity-60'}`}>
                {/* Because we don't have a real CDN setup yet locally for R2, we can't preview it directly unless we create a worker route to serve images.
                    For now, we'll just show a placeholder icon. In production, we'd serve from the public bucket URL. */}
                <div className="aspect-square bg-bg flex items-center justify-center p-4 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <ImageIcon className="w-8 h-8 text-gray-500" />
                    <span className="text-[10px] font-mono text-gray-500 break-all line-clamp-2">{image.r2_key}</span>
                  </div>
                </div>
                
                <div className="p-3 bg-white border-t border-gray-200">
                  <div className="flex flex-wrap gap-1 mb-2">
                    {image.style_tag && <span className="px-1.5 py-0.5 bg-ink/10 text-gray-900 text-[10px] font-semibold uppercase tracking-wider rounded-md">{image.style_tag}</span>}
                    {image.occasion_tag && <span className="px-1.5 py-0.5 bg-gray-50 text-gray-500 text-[10px] font-bold uppercase rounded">{image.occasion_tag}</span>}
                  </div>
                  <p className="text-xs text-gray-900 truncate" title={image.alt_text || ''}>{image.alt_text || 'No alt text'}</p>
                </div>

                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => toggleVisibility(image.id, image.is_visible)}
                    className="p-1.5 bg-white rounded-md shadow-none border border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                    title={image.is_visible ? "Hide image" : "Show image"}
                  >
                    {image.is_visible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                  <button 
                    onClick={() => deleteImage(image.id)}
                    className="p-1.5 bg-white rounded-md shadow-none border border-gray-200 text-red-600/70 hover:text-red-600 hover:bg-red-50 hover:border-error/30 transition-all"
                    title="Delete image"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-md">
            <ImageIcon className="w-12 h-12 text-gray-500 mx-auto mb-3" />
            <p className="text-gray-900 font-medium">Your gallery is empty</p>
            <p className="text-sm text-gray-500 mt-1">Upload images to showcase your work.</p>
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
