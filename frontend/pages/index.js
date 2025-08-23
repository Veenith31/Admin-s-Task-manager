import React from 'react';

export default function HomePage() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Task Distribution System</h1>
      <p>Welcome to the admin dashboard</p>
      <div>
        <a href="/login" style={{ marginRight: '10px' }}>Login</a>
        <a href="/dashboard">Dashboard</a>
      </div>
    </div>
  );
}