import { writable } from 'svelte/store';

// Initialize local storage with default values if not present
export function initializeStorage() {
  if (!localStorage.getItem('adhd_tasks')) {
    localStorage.setItem('adhd_tasks', JSON.stringify([]));
  }
  
  if (!localStorage.getItem('adhd_time_blocks')) {
    localStorage.setItem('adhd_time_blocks', JSON.stringify([]));
  }
  
  if (!localStorage.getItem('adhd_creative_ideas')) {
    localStorage.setItem('adhd_creative_ideas', JSON.stringify([]));
  }
  
  if (!localStorage.getItem('adhd_settings')) {
    localStorage.setItem('adhd_settings', JSON.stringify({
      theme: 'default',
      soundEffects: true,
      notifications: false,
      focusDuration: 25,
      breakDuration: 5
    }));
  }
}

// Create stores backed by localStorage
function createLocalStore(key, startValue) {
  const { subscribe, set, update } = writable(startValue);
  
  return {
    subscribe,
    set: (value) => {
      localStorage.setItem(key, JSON.stringify(value));
      return set(value);
    },
    update: (cb) => {
      const value = cb(JSON.parse(localStorage.getItem(key)));
      localStorage.setItem(key, JSON.stringify(value));
      return set(value);
    },
    useLocalStorage: () => {
      const storedValue = localStorage.getItem(key);
      if (storedValue) {
        set(JSON.parse(storedValue));
      }
    }
  };
}

// Create stores for different data types
export const tasks = createLocalStore('adhd_tasks', []);
export const timeBlocks = createLocalStore('adhd_time_blocks', []);
export const creativeIdeas = createLocalStore('adhd_creative_ideas', []);
export const settings = createLocalStore('adhd_settings', {
  theme: 'default',
  soundEffects: true,
  notifications: false,
  focusDuration: 25,
  breakDuration: 5
});

// Helper functions for data export/import
export function exportData() {
  const data = {
    tasks: JSON.parse(localStorage.getItem('adhd_tasks') || '[]'),
    timeBlocks: JSON.parse(localStorage.getItem('adhd_time_blocks') || '[]'),
    creativeIdeas: JSON.parse(localStorage.getItem('adhd_creative_ideas') || '[]'),
    settings: JSON.parse(localStorage.getItem('adhd_settings') || '{}')
  };
  
  return JSON.stringify(data);
}

export function importData(jsonData) {
  try {
    const data = JSON.parse(jsonData);
    
    if (data.tasks) localStorage.setItem('adhd_tasks', JSON.stringify(data.tasks));
    if (data.timeBlocks) localStorage.setItem('adhd_time_blocks', JSON.stringify(data.timeBlocks));
    if (data.creativeIdeas) localStorage.setItem('adhd_creative_ideas', JSON.stringify(data.creativeIdeas));
    if (data.settings) localStorage.setItem('adhd_settings', JSON.stringify(data.settings));
    
    // Refresh stores
    tasks.useLocalStorage();
    timeBlocks.useLocalStorage();
    creativeIdeas.useLocalStorage();
    settings.useLocalStorage();
    
    return true;
  } catch (e) {
    console.error('Failed to import data:', e);
    return false;
  }
}
