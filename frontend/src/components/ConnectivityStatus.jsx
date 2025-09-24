import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';

const ConnectivityStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState(null);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Trigger sync when coming back online
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then((registration) => {
          return registration.sync.register('background-sync');
        });
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Check for pending data
  useEffect(() => {
    const checkPendingData = async () => {
      try {
        const request = indexedDB.open('ValidadeInteligenteDB', 1);
        request.onsuccess = () => {
          const db = request.result;
          const transaction = db.transaction(['pendingData'], 'readonly');
          const store = transaction.objectStore('pendingData');
          const countRequest = store.count();
          
          countRequest.onsuccess = () => {
            setPendingCount(countRequest.result);
          };
        };
      } catch (error) {
        console.error('Error checking pending data:', error);
      }
    };

    checkPendingData();
    
    // Check every 30 seconds
    const interval = setInterval(checkPendingData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Listen for sync events
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data.type === 'SYNC_START') {
          setIsSyncing(true);
        } else if (event.data.type === 'SYNC_COMPLETE') {
          setIsSyncing(false);
          setLastSync(new Date());
          setPendingCount(0);
        }
      });
    }
  }, []);

  const handleManualSync = async () => {
    if (!isOnline) return;
    
    setIsSyncing(true);
    
    try {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        await registration.sync.register('background-sync');
      }
    } catch (error) {
      console.error('Manual sync failed:', error);
      setIsSyncing(false);
    }
  };

  const getStatusColor = () => {
    if (!isOnline) return 'bg-red-500';
    if (isSyncing) return 'bg-yellow-500';
    if (pendingCount > 0) return 'bg-orange-500';
    return 'bg-green-500';
  };

  const getStatusText = () => {
    if (!isOnline) return 'Offline';
    if (isSyncing) return 'Sincronizando...';
    if (pendingCount > 0) return `${pendingCount} pendente${pendingCount > 1 ? 's' : ''}`;
    return 'Online';
  };

  const getStatusIcon = () => {
    if (!isOnline) return <WifiOff className="w-4 h-4" />;
    if (isSyncing) return <RefreshCw className="w-4 h-4 animate-spin" />;
    if (pendingCount > 0) return <AlertCircle className="w-4 h-4" />;
    return <CheckCircle className="w-4 h-4" />;
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg shadow-lg text-white text-sm ${getStatusColor()}`}>
        {getStatusIcon()}
        <span>{getStatusText()}</span>
        
        {isOnline && pendingCount > 0 && (
          <button
            onClick={handleManualSync}
            disabled={isSyncing}
            className="ml-2 p-1 rounded hover:bg-white hover:bg-opacity-20 transition-colors"
            title="Sincronizar agora"
          >
            <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
          </button>
        )}
      </div>
      
      {lastSync && (
        <div className="mt-1 text-xs text-gray-500 text-right">
          Última sync: {lastSync.toLocaleTimeString()}
        </div>
      )}
    </div>
  );
};

export default ConnectivityStatus;