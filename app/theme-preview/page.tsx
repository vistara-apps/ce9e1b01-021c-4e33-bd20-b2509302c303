'use client';

import { useTheme } from '../components/ThemeProvider';
import { Stethoscope, FileText, Clock, Truck, Calendar } from 'lucide-react';

export default function ThemePreview() {
  const { theme, setTheme } = useTheme();

  const themes = [
    { id: 'default', name: 'Wellness (Default)', description: 'Forest green with mint accents' },
    { id: 'celo', name: 'CELO', description: 'Black with yellow accents' },
    { id: 'solana', name: 'Solana', description: 'Dark purple with magenta accents' },
    { id: 'base', name: 'Base', description: 'Dark blue with Base blue accents' },
    { id: 'coinbase', name: 'Coinbase', description: 'Dark navy with Coinbase blue accents' },
  ] as const;

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg via-bg to-green-900 p-6">
      <div className="container mx-auto max-w-6xl">
        <div className="glass-card p-6 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <Stethoscope className="h-8 w-8 text-accent" />
            <div>
              <h1 className="text-3xl font-bold text-fg">PrescribeNow Theme Preview</h1>
              <p className="text-muted">Experience different blockchain themes</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id as any)}
                className={`p-4 rounded-theme border-2 transition-all duration-200 text-left ${
                  theme === t.id
                    ? 'border-accent bg-accent bg-opacity-20'
                    : 'border-white border-opacity-20 hover:border-accent hover:border-opacity-50'
                }`}
              >
                <h3 className="font-semibold text-fg">{t.name}</h3>
                <p className="text-muted text-sm">{t.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Preview Components */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Stats Cards */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-fg">Dashboard Metrics</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="metric-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted text-sm">Prescriptions</p>
                    <p className="text-2xl font-bold text-fg">24</p>
                  </div>
                  <FileText className="h-8 w-8 text-accent" />
                </div>
              </div>
              
              <div className="metric-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted text-sm">Ready</p>
                    <p className="text-2xl font-bold text-fg">8</p>
                  </div>
                  <Clock className="h-8 w-8 text-accent" />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-fg">Action Buttons</h2>
            <div className="space-y-3">
              <button className="btn-primary w-full flex items-center justify-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>New Prescription</span>
              </button>
              <button className="btn-secondary w-full flex items-center justify-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Schedule Appointment</span>
              </button>
            </div>
          </div>
        </div>

        {/* Sample Prescription Cards */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-fg">Prescription Cards</h2>
          <div className="grid gap-4">
            <div className="prescription-card">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-fg">Sarah Johnson</h3>
                  <p className="text-accent font-medium">Amoxicillin 500mg</p>
                  <p className="text-muted text-sm">3x daily for 7 days</p>
                </div>
                <div className="text-right">
                  <p className="text-green-400 font-medium">Delivered</p>
                  <p className="text-muted text-sm">CVS Pharmacy</p>
                </div>
              </div>
            </div>

            <div className="prescription-card">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-fg">Michael Chen</h3>
                  <p className="text-accent font-medium">Lisinopril 10mg</p>
                  <p className="text-muted text-sm">1x daily</p>
                </div>
                <div className="text-right">
                  <p className="text-blue-400 font-medium">Ready</p>
                  <p className="text-muted text-sm">Walgreens</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Elements */}
        <div className="mt-8 glass-card p-6">
          <h2 className="text-xl font-semibold text-fg mb-4">Form Elements</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Patient name"
              className="input-field"
            />
            <input
              type="text"
              placeholder="Medication"
              className="input-field"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
