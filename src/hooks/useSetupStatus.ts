import { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';

export interface SetupStatus {
  prootInstalled: boolean;
  selectedDistro: string | null;
  distroId: string | null;
  username: string;
  isReady: boolean;
  isDataDownloaded: boolean;
  installedPackages: string[];
  bridgeStatus: 'offline' | 'connecting' | 'online';
  platform: string;
}

export const useSetupStatus = () => {
  const [status, setStatus] = useState<SetupStatus>(() => {
    const saved = localStorage.getItem('xterml_setup_status');
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      prootInstalled: false,
      selectedDistro: null,
      distroId: null,
      username: 'user',
      isReady: false,
      isDataDownloaded: false,
      installedPackages: ['bash', 'coreutils'],
      bridgeStatus: 'offline',
      platform: Capacitor.getPlatform(),
    };
  });

  useEffect(() => {
    const checkBridge = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1000);
        
        const response = await fetch('http://localhost:3001/api/stats', { signal: controller.signal });
        clearTimeout(timeoutId);
        
        if (response.ok) {
          updateStatus({ bridgeStatus: 'online' });
        } else {
          updateStatus({ bridgeStatus: 'offline' });
        }
      } catch (e) {
        updateStatus({ bridgeStatus: 'offline' });
      }
    };

    const interval = setInterval(checkBridge, 5000);
    checkBridge();
    return () => clearInterval(interval);
  }, []);

  const updateStatus = (newStatus: Partial<SetupStatus>) => {
    setStatus(prev => {
      const updated = { ...prev, ...newStatus };
      updated.isReady = updated.prootInstalled;
      
      // Sync only critical state to localStorage to avoid loop-back issues with bridgeStatus
      const { bridgeStatus, ...persisted } = updated;
      localStorage.setItem('xterml_setup_status', JSON.stringify(persisted));
      
      return updated;
    });
  };

  return { status, updateStatus };
};
