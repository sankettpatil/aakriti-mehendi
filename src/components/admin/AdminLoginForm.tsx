import React, { useState } from 'react';

export function AdminLoginForm() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        window.location.href = '/admin';
      } else {
        const data = await response.json();
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-900 mb-2">
          Admin Password
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all"
          placeholder="Enter your password"
          required
        />
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-ink text-white font-medium text-[13px] tracking-wide rounded-md transition-all hover:bg-ink/90 disabled:opacity-70"
      >
        {loading ? 'Authenticating...' : 'Sign In'}
      </button>
    </form>
  );
}
