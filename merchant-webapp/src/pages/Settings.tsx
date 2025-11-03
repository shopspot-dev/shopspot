import React, { useState, useEffect } from 'react';
import { StoreSettings } from '../types';
import SettingsSection from '../components/settings/SettingsSection';
import { Bell, Clock, DollarSign, Globe } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { settings as settingsAPI } from '../lib/supabase';

export default function Settings() {
  const { currentStore } = useAuth(); // ✅ Use currentStore
  const [storeSettings, setStoreSettings] = useState<StoreSettings>({
    notifications: { email: true, push: true, sms: false },
    autoAcceptOrders: false,
    preparationTime: 20,
    taxRate: 8.5,
    currency: 'USD',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (currentStore?.id) {
      loadSettings();
    } else {
      setLoading(false);
    }
  }, [currentStore?.id]); // ✅ Reload when store changes

  const loadSettings = async () => {
    if (!currentStore?.id) return;
    
    try {
      setLoading(true);
      setError('');
      
      const data = await settingsAPI.get(currentStore.id); // ✅ Use helper
      
      if (data) {
        // Map database settings to UI format
        setStoreSettings({
          notifications: {
            email: data.email_notifications || true,
            push: data.push_notifications || true,
            sms: data.sms_notifications || false,
          },
          autoAcceptOrders: data.auto_accept_orders || false,
          preparationTime: data.preparation_time || 20,
          taxRate: data.tax_rate || 8.5,
          currency: data.currency || 'USD',
        });
      }
    } catch (err) {
      console.error('Error loading settings:', err);
      setError('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!currentStore?.id) return;
    
    try {
      await settingsAPI.update(currentStore.id, {
        email_notifications: storeSettings.notifications.email,
        push_notifications: storeSettings.notifications.push,
        sms_notifications: storeSettings.notifications.sms,
        auto_accept_orders: storeSettings.autoAcceptOrders,
        preparation_time: storeSettings.preparationTime,
        tax_rate: storeSettings.taxRate,
        currency: storeSettings.currency,
      });
      // Show success message
    } catch (err) {
      setError('Failed to save settings');
    }
  };

  const handleNotificationChange = (type: keyof StoreSettings['notifications']) => {
    setStoreSettings({
      ...storeSettings,
      notifications: {
        ...storeSettings.notifications,
        [type]: !storeSettings.notifications[type],
      },
    });
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <p className="mt-2 text-sm text-gray-600">
          Manage your store preferences and configurations
        </p>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="p-6 space-y-6">
          <SettingsSection
            title="Notifications"
            description="Choose how you want to receive order notifications"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Bell className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Email Notifications</p>
                    <p className="text-sm text-gray-500">Receive order updates via email</p>
                  </div>
                </div>
                <button
                  onClick={() => handleNotificationChange('email')}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                    storeSettings.notifications.email ? 'bg-indigo-600' : 'bg-gray-200'
                  }`}
                >
                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    storeSettings.notifications.email ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Bell className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Push Notifications</p>
                    <p className="text-sm text-gray-500">Receive notifications in your browser</p>
                  </div>
                </div>
                <button
                  onClick={() => handleNotificationChange('push')}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                    storeSettings.notifications.push ? 'bg-indigo-600' : 'bg-gray-200'
                  }`}
                >
                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    storeSettings.notifications.push ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Bell className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">SMS Notifications</p>
                    <p className="text-sm text-gray-500">Receive notifications via SMS</p>
                  </div>
                </div>
                <button
                  onClick={() => handleNotificationChange('sms')}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                    storeSettings.notifications.sms ? 'bg-indigo-600' : 'bg-gray-200'
                  }`}
                >
                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    storeSettings.notifications.sms ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            </div>
          </SettingsSection>

          <SettingsSection
            title="Order Management"
            description="Configure how you handle incoming orders"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Auto-accept Orders</p>
                    <p className="text-sm text-gray-500">Automatically accept new orders</p>
                  </div>
                </div>
                <button
                  onClick={() => setStoreSettings({ ...storeSettings, autoAcceptOrders: !storeSettings.autoAcceptOrders })}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                    storeSettings.autoAcceptOrders ? 'bg-indigo-600' : 'bg-gray-200'
                  }`}
                >
                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    storeSettings.autoAcceptOrders ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Default Preparation Time (minutes)
                </label>
                <input
                  type="number"
                  value={storeSettings.preparationTime}
                  onChange={(e) => setStoreSettings({ ...storeSettings, preparationTime: parseInt(e.target.value) })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          </SettingsSection>

          <SettingsSection
            title="Payment Settings"
            description="Configure your payment and tax settings"
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tax Rate (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={storeSettings.taxRate}
                  onChange={(e) => setStoreSettings({ ...storeSettings, taxRate: parseFloat(e.target.value) })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Currency
                </label>
                <select
                  value={storeSettings.currency}
                  onChange={(e) => setStoreSettings({ ...storeSettings, currency: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
            </div>
          </SettingsSection>
        </div>
      </div>
    </div>
  );
}