const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5184';

export const api = {
  async getTestEntities() {
    const response = await fetch(`${API_URL}/api/test`);
    if (!response.ok) throw new Error('Failed to fetch');
    return response.json();
  },

  async createTestEntity(name: string) {
    const response = await fetch(`${API_URL}/api/test`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(name),
    });
    if (!response.ok) throw new Error('Failed to create');
    return response.json();
  },
};