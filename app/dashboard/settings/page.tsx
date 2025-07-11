'use client';

import { useAuth } from '@/hooks/useAuth';
import { signOut } from 'next-auth/react';
import { Card } from '@/components/ui/card';
import { Settings, LogOut, User, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SettingsPage() {
  const { user } = useAuth();

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/login' });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Settings className="w-8 h-8 text-blue-600" />
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Settings</h1>
      </div>

      <div className="grid gap-6">
        {/* Account Information */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">Account Information</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              {user?.image && (
                <img 
                  src={user.image} 
                  alt={user.name || 'Profile'} 
                  className="w-16 h-16 rounded-full border-2 border-blue-100 dark:border-blue-900"
                />
              )}
              <div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <User className="w-4 h-4" />
                  <span>{user?.name}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <Mail className="w-4 h-4" />
                  <span>{user?.email}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Connected Accounts */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">Connected Accounts</h2>
          <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
            <img src="/google.svg" alt="Google" className="w-6 h-6" />
            <span>Google Account Connected</span>
          </div>
        </Card>

        {/* Actions */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">Account Actions</h2>
          <motion.button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-400 
                     bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <LogOut className="w-5 h-5" />
            <span>Log Out</span>
          </motion.button>
        </Card>
      </div>
    </div>
  );
} 