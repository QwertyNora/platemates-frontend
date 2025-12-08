'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api/client';

export default function Home() {
  const [entities, setEntities] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  // Hämta alla entities vid mount
  useEffect(() => {
    fetchEntities();
  }, []);

  const fetchEntities = async () => {
    try {
      const data = await api.getTestEntities();
      setEntities(data);
    } catch (error) {
      console.error('Failed to fetch:', error);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await api.createTestEntity(name);
      setName('');
      await fetchEntities(); // Refresh list
    } catch (error) {
      console.error('Failed to create:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-8">Platemates - Test</h1>
      
      <form onSubmit={handleCreate} className="mb-8">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter test name"
          className="border p-2 mr-2 text-black"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {loading ? 'Creating...' : 'Create'}
        </button>
      </form>

      <div>
        <h2 className="text-2xl font-bold mb-4">Test Entities:</h2>
        <ul className="space-y-2">
          {entities.map((entity) => (
            <li key={entity.id} className="border p-2">
              {entity.name} - {new Date(entity.createdAt).toLocaleString()}
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}