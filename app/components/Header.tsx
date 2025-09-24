'use client';

import { ConnectWallet, Wallet } from '@coinbase/onchainkit/wallet';
import { Name, Avatar } from '@coinbase/onchainkit/identity';
import { Stethoscope, Bell, Settings2 } from 'lucide-react';

export function Header() {
  return (
    <header className="glass-card p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-accent rounded-full">
            <Stethoscope className="h-6 w-6 text-bg" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-fg">PrescribeNow</h1>
            <p className="text-muted text-sm">Digital Prescription Management</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-white hover:bg-opacity-10 rounded-full transition-colors duration-200">
            <Bell className="h-5 w-5 text-fg" />
          </button>
          <button className="p-2 hover:bg-white hover:bg-opacity-10 rounded-full transition-colors duration-200">
            <Settings2 className="h-5 w-5 text-fg" />
          </button>
          
          <Wallet>
            <ConnectWallet>
              <div className="flex items-center space-x-2 bg-white bg-opacity-10 px-3 py-2 rounded-full">
                <Avatar className="h-8 w-8" />
                <Name className="text-fg font-medium" />
              </div>
            </ConnectWallet>
          </Wallet>
        </div>
      </div>
    </header>
  );
}
