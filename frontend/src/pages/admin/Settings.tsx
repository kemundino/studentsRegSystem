import React from 'react';
import { Save, User, Bell, Shield, Database } from 'lucide-react';

export const Settings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-500 to-cyan-500 bg-clip-text text-transparent">Settings</h1>
        <p className="text-slate-400 text-sm mt-1">Configure system preferences and admin account settings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-white/10 text-white rounded-xl transition-colors">
            <User size={18} className="text-violet-400" />
            <span className="font-medium text-sm">Profile Settings</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-white/5 hover:text-slate-200 rounded-xl transition-colors">
            <Bell size={18} />
            <span className="font-medium text-sm">Notifications</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-white/5 hover:text-slate-200 rounded-xl transition-colors">
            <Shield size={18} />
            <span className="font-medium text-sm">Security</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-white/5 hover:text-slate-200 rounded-xl transition-colors">
            <Database size={18} />
            <span className="font-medium text-sm">System Preferences</span>
          </button>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-6">Profile Settings</h2>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">First Name</label>
                  <input 
                    type="text" 
                    defaultValue="Admin"
                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2 text-slate-300 focus:outline-none focus:border-violet-500 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Last Name</label>
                  <input 
                    type="text" 
                    defaultValue="User"
                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2 text-slate-300 focus:outline-none focus:border-violet-500 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Email Address</label>
                <input 
                  type="email" 
                  defaultValue="admin@university.edu"
                  className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2 text-slate-300 focus:outline-none focus:border-violet-500 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Role</label>
                <input 
                  type="text" 
                  defaultValue="System Administrator"
                  disabled
                  className="w-full bg-slate-900/50 border border-white/5 rounded-xl px-4 py-2 text-slate-500 cursor-not-allowed"
                />
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end">
                <button type="button" className="flex items-center gap-2 bg-gradient-to-r from-violet-500 to-cyan-500 text-white px-6 py-2 rounded-xl hover:opacity-90 transition-opacity">
                  <Save size={18} />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
