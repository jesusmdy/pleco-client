import { create } from 'zustand';
import { exportKey, importKey } from '../lib/crypto';

interface CryptoState {
  masterKey: CryptoKey | null;
  isInitialized: boolean;
  setMasterKey: (key: CryptoKey | null) => void;
  initializeFromSession: () => Promise<void>;
}

export const useCryptoStore = create<CryptoState>((set, get) => ({
  masterKey: null,
  isInitialized: false,
  setMasterKey: async (key) => {
    set({ masterKey: key, isInitialized: true });
    
    if (key) {
      try {
        const exported = await exportKey(key);
        sessionStorage.setItem('pleco_master_key', exported);
      } catch (e) {
        // Silently fail or handle as needed
      }
    } else {
      sessionStorage.removeItem('pleco_master_key');
    }
  },
  initializeFromSession: async () => {
    const stored = sessionStorage.getItem('pleco_master_key');
    if (stored && !get().masterKey) {
      try {
        const key = await importKey(stored);
        set({ masterKey: key, isInitialized: true });
      } catch (e) {
        sessionStorage.removeItem('pleco_master_key');
      }
    }
  }
}));
