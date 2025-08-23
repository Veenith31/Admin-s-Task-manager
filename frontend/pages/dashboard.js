import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [mounted, loading, isAuthenticated, router]);

  if (!mounted || loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Dashboard</h1>
      <p>Welcome, {user?.name}!</p>
      <div>
        <a href="/agents" style={{ marginRight: '10px' }}>Manage Agents</a>
        <a href="/tasks/upload" style={{ marginRight: '10px' }}>Upload CSV</a>
        <a href="/tasks">View Tasks</a>
      </div>
      <button 
        onClick={() => {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            router.push('/login');
          }
        }}
        style={{ marginTop: '20px', padding: '10px' }}
      >
        Logout
      </button>
    </div>
  );
}