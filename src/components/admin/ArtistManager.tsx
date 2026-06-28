import React, { useState } from 'react';
import type { Artist } from '../../lib/db';
import { Plus, Edit2, Trash2, X, Check } from 'lucide-react';

interface Props {
  initialArtists: Artist[];
}

export function ArtistManager({ initialArtists }: Props) {
  const [artists, setArtists] = useState<Artist[]>(initialArtists);
  const [isEditing, setIsEditing] = useState(false);
  const [currentArtist, setCurrentArtist] = useState<Partial<Artist>>({});
  const [loading, setLoading] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const isNew = !currentArtist.id;
      const url = isNew ? '/api/admin/artists' : `/api/admin/artists/${currentArtist.id}`;
      const method = isNew ? 'POST' : 'PATCH';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentArtist),
      });

      if (!res.ok) throw new Error('Failed to save artist');
      
      const data = await res.json();
      
      if (isNew) {
        setArtists([...artists, data.artist]);
      } else {
        setArtists(artists.map(a => a.id === data.artist.id ? data.artist : a));
      }
      
      setIsEditing(false);
      setCurrentArtist({});
    } catch (err) {
      alert("Error saving artist");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this artist?')) return;
    try {
      const res = await fetch(`/api/admin/artists/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const error = await res.json();
        alert(error.error || 'Failed to delete');
        return;
      }
      setArtists(artists.filter(a => a.id !== id));
    } catch (err) {
      alert("Error deleting artist");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl tracking-tight text-gray-900">Manage Roster</h2>
        <button 
          onClick={() => { setCurrentArtist({ is_active: 1 }); setIsEditing(true); }}
          className="btn-primary text-[13px] py-2 px-4"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Artist
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {artists.map(artist => (
          <div key={artist.id} className="bg-white rounded-md border border-gray-200 overflow-hidden shadow-none flex flex-col hover:border-gray-200 transition-colors">
            <div className="aspect-[4/3] bg-bg relative">
              {artist.photo_r2_key ? (
                <img src={`/${artist.photo_r2_key}`} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">No Image</div>
              )}
              {!artist.is_active && (
                <div className="absolute top-2 right-2 bg-ink text-surface text-xs px-2 py-1 rounded">Inactive</div>
              )}
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <h3 className="font-medium text-2xl text-gray-900 mb-2">{artist.name}</h3>
              <p className="text-sm text-gray-500 line-clamp-3 mb-4 flex-1">{artist.bio || 'No bio provided.'}</p>
              
              <div className="flex justify-end gap-2 mt-auto pt-4 border-t border-gray-200">
                <button onClick={() => { setCurrentArtist(artist); setIsEditing(true); }} className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(artist.id)} className="p-2 text-red-600/70 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {artists.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-500 bg-white rounded-md border border-gray-200">
            No artists found. Add one to get started!
          </div>
        )}
      </div>

      {isEditing && (
        <div className="fixed inset-0 bg-gray-500 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-md shadow-xl w-full max-w-lg overflow-hidden border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h3 className="font-semibold text-lg text-gray-900">
                {currentArtist.id ? 'Edit Artist' : 'Add New Artist'}
              </h3>
              <button onClick={() => setIsEditing(false)} className="text-gray-500 hover:text-gray-900">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-[13px] font-medium text-gray-500 mb-1 uppercase tracking-wide">Artist Name</label>
                <input 
                  type="text" 
                  required
                  value={currentArtist.name || ''}
                  onChange={e => setCurrentArtist({...currentArtist, name: e.target.value})}
                  className="w-full px-3 py-2 bg-bg border border-gray-200 rounded-md text-gray-900 focus:outline-none focus:border-brand"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-gray-500 mb-1 uppercase tracking-wide">Bio</label>
                <textarea 
                  rows={4}
                  value={currentArtist.bio || ''}
                  onChange={e => setCurrentArtist({...currentArtist, bio: e.target.value})}
                  className="w-full px-3 py-2 bg-bg border border-gray-200 rounded-md text-gray-900 focus:outline-none focus:border-brand"
                ></textarea>
              </div>

              <div>
                <label className="block text-[13px] font-medium text-gray-500 mb-1 uppercase tracking-wide">Photo R2 Key (Optional)</label>
                <input 
                  type="text" 
                  value={currentArtist.photo_r2_key || ''}
                  onChange={e => setCurrentArtist({...currentArtist, photo_r2_key: e.target.value})}
                  placeholder="e.g. uploads/artist-1.jpg"
                  className="w-full px-3 py-2 bg-bg border border-gray-200 rounded-md text-gray-900 focus:outline-none focus:border-brand"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input 
                  type="checkbox" 
                  id="isActive"
                  checked={currentArtist.is_active === 1}
                  onChange={e => setCurrentArtist({...currentArtist, is_active: e.target.checked ? 1 : 0})}
                  className="w-4 h-4 text-brand rounded border-gray-200 focus:ring-brand"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-900">Active Status</label>
              </div>

              <div className="pt-6 flex justify-end gap-3">
                <button type="button" onClick={() => setIsEditing(false)} className="btn-secondary">Cancel</button>
                <button type="submit" disabled={loading} className="btn-primary">
                  {loading ? 'Saving...' : 'Save Artist'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
