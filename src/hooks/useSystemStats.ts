import { useState, useEffect } from 'react';
import { CommunityDevice } from '@capacitor-community/device';
import { Capacitor } from '@capacitor/core';

export interface SystemStats {
  cpuUsage: number;
  ramUsed: string;
  ramTotal: string;
  ramPercentage: number;
  diskUsage: number;
  platform: 'android' | 'windows';
  isMock: boolean;
  isNative: boolean;
}

/**
 * useSystemStats Hook
 * Powered by Capacitor-Community/Device for Real Native Metrics
 */
export const useSystemStats = () => {
  const [stats, setStats] = useState<SystemStats>({
    cpuUsage: 0,
    ramUsed: '0',
    ramTotal: '0',
    ramPercentage: 0,
    diskUsage: 0,
    platform: 'windows',
    isMock: true,
    isNative: false,
  });

  useEffect(() => {
    const isNative = Capacitor.isNativePlatform();
    const platform: 'android' | 'windows' = Capacitor.getPlatform() === 'android' ? 'android' : 'windows';

    const fetchStats = async () => {
      let finalStats = { ...stats, isNative, platform };
      let bridgeFound = false;

      try {
        // 1. Get Native info if available
        if (isNative) {
          try {
            const info = await CommunityDevice.getInfo();
            const totalDiskGB = info.diskTotal ? info.diskTotal / (1024 ** 3) : 64;
            const freeDiskGB = info.diskFree ? info.diskFree / (1024 ** 3) : 32;
            finalStats.diskUsage = Math.round(((totalDiskGB - freeDiskGB) / totalDiskGB) * 100);
            finalStats.isNative = true;
          } catch(e) {}
        }

        // 2. Try Bridge (127.0.0.1 is standard for Android)
        try {
          const response = await fetch(`http://127.0.0.1:3001/api/stats`, {
            signal: AbortSignal.timeout(1200) 
          });
          
          if (response.ok) {
            const bridgeData = await response.json();
            finalStats = { ...finalStats, ...bridgeData, isMock: false };
            bridgeFound = true;
          }
        } catch (e) {
          // If 127.0.0.1 fails, try localhost as backup
          try {
             const resp = await fetch(`http://localhost:3001/api/stats`, { signal: AbortSignal.timeout(1000) });
             if (resp.ok) {
                const data = await resp.json();
                finalStats = { ...finalStats, ...data, isMock: false };
                bridgeFound = true;
             }
          } catch(e2) {}
        }

        // 3. Fallback if no bridge found
        if (!bridgeFound) {
          const mockCpu = Math.floor(Math.random() * 20) + (platform === 'android' ? 5 : 2);
          const ramT = platform === 'android' ? 8 : 16;
          const ramU = (Math.random() * (ramT * 0.2) + (ramT * 0.1)).toFixed(1);
          const ramP = Math.round((parseFloat(ramU) / ramT) * 100);
          
          finalStats.cpuUsage = mockCpu;
          finalStats.ramUsed = `${ramU}G`;
          finalStats.ramTotal = `${ramT}G`;
          finalStats.ramPercentage = ramP;
          finalStats.isMock = true;
          if (!finalStats.diskUsage) finalStats.diskUsage = (platform === 'android' ? 65 : 42);
        }

        setStats(finalStats);
      } catch (error) { 
        setStats(prev => ({ ...prev, isMock: true }));
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 2000);
    return () => clearInterval(interval);
  }, []);

  return stats;
};
