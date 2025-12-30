/**
 * LocalStorage utility functions for persisting user preferences
 */

const STORAGE_KEYS = {
  SELECTED_CITIES: 'weather-dashboard-selected-cities',
  NUM_CITIES: 'weather-dashboard-num-cities',
  DISPLAY_PREFERENCES: 'weather-dashboard-display-preferences'
};

// Default display preferences
const DEFAULT_DISPLAY_PREFS = {
  showCurrentTemp: true,
  showHourlyChart: true,
  showDailyChart: true,
  showDailyTable: true
};

/**
 * Get selected cities from localStorage
 * @returns {string[]} Array of city IDs
 */
export function getStoredSelectedCities() {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.SELECTED_CITIES);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Validate it's an array
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (error) {
    console.warn('Failed to load selected cities from storage:', error);
  }
  return null;
}

/**
 * Save selected cities to localStorage
 * @param {string[]} cities - Array of city IDs
 */
export function saveSelectedCities(cities) {
  try {
    localStorage.setItem(STORAGE_KEYS.SELECTED_CITIES, JSON.stringify(cities));
  } catch (error) {
    console.warn('Failed to save selected cities to storage:', error);
  }
}

/**
 * Get number of cities from localStorage
 * @returns {number|null} Number of cities (1-6) or null
 */
export function getStoredNumCities() {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.NUM_CITIES);
    if (stored) {
      const num = parseInt(stored, 10);
      // Validate it's between 1 and 6
      if (num >= 1 && num <= 6) {
        return num;
      }
    }
  } catch (error) {
    console.warn('Failed to load num cities from storage:', error);
  }
  return null;
}

/**
 * Save number of cities to localStorage
 * @param {number} num - Number of cities (1-6)
 */
export function saveNumCities(num) {
  try {
    if (num >= 1 && num <= 6) {
      localStorage.setItem(STORAGE_KEYS.NUM_CITIES, num.toString());
    }
  } catch (error) {
    console.warn('Failed to save num cities to storage:', error);
  }
}

/**
 * Get display preferences from localStorage
 * @returns {Object|null} Display preferences object or null
 */
export function getStoredDisplayPreferences() {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.DISPLAY_PREFERENCES);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Validate it's an object with expected keys
      if (typeof parsed === 'object' && parsed !== null) {
        return {
          ...DEFAULT_DISPLAY_PREFS,
          ...parsed
        };
      }
    }
  } catch (error) {
    console.warn('Failed to load display preferences from storage:', error);
  }
  return null;
}

/**
 * Save display preferences to localStorage
 * @param {Object} prefs - Display preferences object
 */
export function saveDisplayPreferences(prefs) {
  try {
    localStorage.setItem(STORAGE_KEYS.DISPLAY_PREFERENCES, JSON.stringify(prefs));
  } catch (error) {
    console.warn('Failed to save display preferences to storage:', error);
  }
}

/**
 * Get default display preferences
 * @returns {Object} Default display preferences
 */
export function getDefaultDisplayPreferences() {
  return { ...DEFAULT_DISPLAY_PREFS };
}

/**
 * Clear all stored preferences
 */
export function clearStorage() {
  try {
    localStorage.removeItem(STORAGE_KEYS.SELECTED_CITIES);
    localStorage.removeItem(STORAGE_KEYS.NUM_CITIES);
    localStorage.removeItem(STORAGE_KEYS.DISPLAY_PREFERENCES);
  } catch (error) {
    console.warn('Failed to clear storage:', error);
  }
}

