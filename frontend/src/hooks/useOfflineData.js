import { useState, useEffect, useCallback } from 'react';

// IndexedDB helper functions
const DB_NAME = 'ValidadeInteligenteDB';
const DB_VERSION = 1;

const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      // Create object stores
      if (!db.objectStoreNames.contains('produtos')) {
        const produtosStore = db.createObjectStore('produtos', { keyPath: 'id' });
        produtosStore.createIndex('nome', 'nome', { unique: false });
        produtosStore.createIndex('categoria', 'categoria', { unique: false });
      }
      
      if (!db.objectStoreNames.contains('relatorios')) {
        const relatoriosStore = db.createObjectStore('relatorios', { keyPath: 'id' });
        relatoriosStore.createIndex('data', 'data', { unique: false });
      }
      
      if (!db.objectStoreNames.contains('alertas')) {
        const alertasStore = db.createObjectStore('alertas', { keyPath: 'id' });
        alertasStore.createIndex('tipo', 'tipo', { unique: false });
      }
      
      if (!db.objectStoreNames.contains('gamificacao')) {
        const gamificacaoStore = db.createObjectStore('gamificacao', { keyPath: 'id' });
        gamificacaoStore.createIndex('usuario_id', 'usuario_id', { unique: false });
      }
      
      if (!db.objectStoreNames.contains('pendingData')) {
        db.createObjectStore('pendingData', { keyPath: 'id' });
      }
    };
  });
};

const useOfflineData = (storeName) => {
  const [data, setData] = useState([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load data from IndexedDB
  const loadFromCache = useCallback(async () => {
    try {
      const db = await openDB();
      const transaction = db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Error loading from cache:', error);
      return [];
    }
  }, [storeName]);

  // Save data to IndexedDB
  const saveToCache = useCallback(async (newData) => {
    try {
      const db = await openDB();
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);

      // Clear existing data
      await new Promise((resolve, reject) => {
        const clearRequest = store.clear();
        clearRequest.onsuccess = () => resolve();
        clearRequest.onerror = () => reject(clearRequest.error);
      });

      // Add new data
      for (const item of newData) {
        await new Promise((resolve, reject) => {
          const addRequest = store.add(item);
          addRequest.onsuccess = () => resolve();
          addRequest.onerror = () => reject(addRequest.error);
        });
      }
    } catch (error) {
      console.error('Error saving to cache:', error);
    }
  }, [storeName]);

  // Add pending data for sync when online
  const addPendingData = useCallback(async (pendingItem) => {
    try {
      const db = await openDB();
      const transaction = db.transaction(['pendingData'], 'readwrite');
      const store = transaction.objectStore('pendingData');
      
      const pendingData = {
        id: Date.now().toString(),
        storeName,
        action: 'create',
        data: pendingItem,
        timestamp: new Date().toISOString()
      };

      await new Promise((resolve, reject) => {
        const request = store.add(pendingData);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });

      // If online, try to sync immediately
      if (isOnline && 'serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then((registration) => {
          return registration.sync.register('background-sync');
        });
      }
    } catch (error) {
      console.error('Error adding pending data:', error);
    }
  }, [storeName, isOnline]);

  // Fetch data with offline support
  const fetchData = useCallback(async (apiCall) => {
    setIsLoading(true);
    setError(null);

    try {
      if (isOnline) {
        // Try to fetch from API
        const apiData = await apiCall();
        setData(apiData);
        await saveToCache(apiData);
      } else {
        // Load from cache when offline
        const cachedData = await loadFromCache();
        setData(cachedData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error.message);
      
      // Fallback to cache on error
      const cachedData = await loadFromCache();
      setData(cachedData);
    } finally {
      setIsLoading(false);
    }
  }, [isOnline, loadFromCache, saveToCache]);

  // Create data with offline support
  const createData = useCallback(async (newItem, apiCall) => {
    try {
      if (isOnline) {
        // Try to create via API
        const createdItem = await apiCall(newItem);
        setData(prev => [...prev, createdItem]);
        
        // Update cache
        const updatedData = [...data, createdItem];
        await saveToCache(updatedData);
        
        return createdItem;
      } else {
        // Store for later sync
        const tempItem = {
          ...newItem,
          id: `temp_${Date.now()}`,
          _pending: true
        };
        
        setData(prev => [...prev, tempItem]);
        await addPendingData(newItem);
        
        return tempItem;
      }
    } catch (error) {
      console.error('Error creating data:', error);
      setError(error.message);
      throw error;
    }
  }, [isOnline, data, saveToCache, addPendingData]);

  // Update data with offline support
  const updateData = useCallback(async (id, updates, apiCall) => {
    try {
      if (isOnline) {
        // Try to update via API
        const updatedItem = await apiCall(id, updates);
        setData(prev => prev.map(item => item.id === id ? updatedItem : item));
        
        // Update cache
        const updatedData = data.map(item => item.id === id ? updatedItem : item);
        await saveToCache(updatedData);
        
        return updatedItem;
      } else {
        // Update locally and mark for sync
        const updatedItem = { ...data.find(item => item.id === id), ...updates, _pending: true };
        setData(prev => prev.map(item => item.id === id ? updatedItem : item));
        
        await addPendingData({ id, ...updates });
        
        return updatedItem;
      }
    } catch (error) {
      console.error('Error updating data:', error);
      setError(error.message);
      throw error;
    }
  }, [isOnline, data, saveToCache, addPendingData]);

  // Initialize data on mount
  useEffect(() => {
    loadFromCache().then(cachedData => {
      if (cachedData.length > 0) {
        setData(cachedData);
      }
    });
  }, [loadFromCache]);

  return {
    data,
    isOnline,
    isLoading,
    error,
    fetchData,
    createData,
    updateData,
    loadFromCache,
    saveToCache
  };
};

export default useOfflineData;