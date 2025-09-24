'use client';

import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-bg via-bg to-green-900">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <Header />
        <Dashboard />
      </div>
    </div>
  );
}
