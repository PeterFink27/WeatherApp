import { useState, useEffect } from 'react';
import WeatherCard from './components/WeatherCard';
import Settings from './components/Settings';
import { 
  getStoredSelectedCities, 
  saveSelectedCities, 
  getStoredNumCities, 
  saveNumCities,
  getStoredDisplayPreferences,
  saveDisplayPreferences,
  getDefaultDisplayPreferences
} from './utils/storage';
import './App.css';

// Get API base URL from environment or use relative path
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

// Default values
const DEFAULT_CITIES = ['athens-ga', 'new-york-ny', 'chicago-il'];
const DEFAULT_NUM_CITIES = 3;

function App() {
  // Load persisted values from localStorage on mount
  const storedSelectedCities = getStoredSelectedCities();
  const storedNumCities = getStoredNumCities();
  const storedDisplayPrefs = getStoredDisplayPreferences();
  
  // Initialize numCities
  const initialNumCities = storedNumCities || DEFAULT_NUM_CITIES;
  
  // Initialize selectedCities and ensure it matches numCities length
  let initialSelectedCities = storedSelectedCities || DEFAULT_CITIES;
  if (initialSelectedCities.length !== initialNumCities) {
    // Adjust array to match numCities
    if (initialNumCities > initialSelectedCities.length) {
      // Add empty slots
      while (initialSelectedCities.length < initialNumCities) {
        initialSelectedCities.push('');
      }
    } else if (initialNumCities < initialSelectedCities.length) {
      // Remove extra slots
      initialSelectedCities = initialSelectedCities.slice(0, initialNumCities);
    }
  }
  
  // Initialize display preferences
  const initialDisplayPrefs = storedDisplayPrefs || getDefaultDisplayPreferences();
  
  const [cities, setCities] = useState([]);
  const [numCities, setNumCities] = useState(initialNumCities);
  const [selectedCities, setSelectedCities] = useState(initialSelectedCities);
  const [displayPreferences, setDisplayPreferences] = useState(initialDisplayPrefs);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Fetch cities list on mount
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/cities`)
      .then(res => res.json())
      .then(data => {
        // Sort cities alphabetically by name
        const sorted = [...data].sort((a, b) => a.name.localeCompare(b.name));
        setCities(sorted);
      })
      .catch(err => {
        console.error('Failed to fetch cities:', err);
        setError('Failed to load cities list');
      });
  }, []);

  // Fetch weather data when selected cities change or cities list loads
  useEffect(() => {
    const hasValidSelections = selectedCities.filter(Boolean).length > 0;
    if (hasValidSelections && cities.length > 0) {
      fetchWeather();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCities, cities.length]);

  const fetchWeather = async () => {
    setLoading(true);
    setError(null);

    try {
      const cityIdsParam = selectedCities.filter(Boolean).join(',');
      const response = await fetch(`${API_BASE_URL}/api/weather?cityIds=${cityIdsParam}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setWeatherData(data);
    } catch (err) {
      console.error('Failed to fetch weather:', err);
      setError(err.message || 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  const handleCityChange = (index, cityId) => {
    const newSelected = [...selectedCities];
    newSelected[index] = cityId;
    setSelectedCities(newSelected);
    // Persist to localStorage
    saveSelectedCities(newSelected);
  };

  const handleNumCitiesChange = (newNum) => {
    if (newNum < 1 || newNum > 6) return;
    
    setNumCities(newNum);
    // Persist to localStorage
    saveNumCities(newNum);
    
    // Adjust selectedCities array to match new number
    const newSelected = [...selectedCities];
    if (newNum > selectedCities.length) {
      // Add empty slots
      while (newSelected.length < newNum) {
        newSelected.push('');
      }
    } else if (newNum < selectedCities.length) {
      // Remove extra slots (keep existing selections)
      newSelected.splice(newNum);
    }
    setSelectedCities(newSelected);
    // Persist updated cities array
    saveSelectedCities(newSelected);
  };

  const handleDisplayPreferencesChange = (newPrefs) => {
    setDisplayPreferences(newPrefs);
    // Persist to localStorage
    saveDisplayPreferences(newPrefs);
  };

  // Helper to get weather data for a specific city index
  const getWeatherForIndex = (index) => {
    if (!weatherData) return null;
    const cityId = selectedCities[index];
    if (!cityId) return null;
    
    const cityData = weatherData.cities.find(c => c.cityId === cityId);
    const error = weatherData.errors?.find(e => e.cityId === cityId);
    
    if (error && !cityData) {
      return { error };
    }
    
    return cityData ? { data: cityData, error } : null;
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div>
            <h1>Weather Dashboard</h1>
            <p className="subtitle">Select up to {numCities} cities to view weather forecasts</p>
          </div>
          <button 
            className="settings-icon-button"
            onClick={() => setSettingsOpen(true)}
            aria-label="Settings"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24"></path>
            </svg>
          </button>
        </div>
      </header>

      <Settings
        numCities={numCities}
        onNumCitiesChange={handleNumCitiesChange}
        displayPreferences={displayPreferences}
        onDisplayPreferencesChange={handleDisplayPreferencesChange}
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />

      {error && (
        <div className="error-banner">
          Error: {error}
        </div>
      )}

      {loading && !weatherData && (
        <div className="loading">Loading weather data...</div>
      )}

      <div className="city-sections">
        {Array.from({ length: numCities }, (_, index) => index).map((index) => (
          <div key={index} className="city-section">
            <div className="city-selector-wrapper">
              <div className="selector-item">
                <label htmlFor={`city-${index}`}>
                  City {index + 1}
                </label>
                <select
                  id={`city-${index}`}
                  value={selectedCities[index] || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Check if city is already selected in another dropdown
                    const isDuplicate = selectedCities.some((id, idx) => idx !== index && id === value && value !== '');
                    if (isDuplicate) {
                      const otherIndex = selectedCities.findIndex((id, idx) => idx !== index && id === value);
                      if (otherIndex !== -1) {
                        handleCityChange(otherIndex, '');
                      }
                    }
                    handleCityChange(index, value);
                  }}
                  disabled={loading}
                >
                  <option value="">-- Select City --</option>
                  {cities.map((city) => (
                    <option
                      key={city.id}
                      value={city.id}
                      disabled={selectedCities.some((id, idx) => idx !== index && id === city.id)}
                    >
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {getWeatherForIndex(index) && (
              <div className="weather-card-wrapper">
                {getWeatherForIndex(index).error && !getWeatherForIndex(index).data ? (
                  <div className="error-card">
                    <h3>{selectedCities[index]}</h3>
                    <p>Error: {getWeatherForIndex(index).error.message}</p>
                  </div>
                ) : (
                  <WeatherCard
                    data={getWeatherForIndex(index).data}
                    error={getWeatherForIndex(index).error}
                    displayPreferences={displayPreferences}
                  />
                )}
              </div>
            )}

            {loading && selectedCities[index] && !getWeatherForIndex(index) && (
              <div className="loading-card">Loading weather data...</div>
            )}
          </div>
        ))}
      </div>

      <div className="refresh-section">
        <button
          onClick={fetchWeather}
          disabled={loading || selectedCities.filter(Boolean).length === 0}
          className="refresh-button"
        >
          {loading ? 'Loading...' : 'Refresh Weather'}
        </button>
      </div>
    </div>
  );
}

export default App;

