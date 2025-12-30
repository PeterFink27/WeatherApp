import { useState, useEffect } from 'react';
import './Settings.css';

function Settings({ 
  numCities, 
  onNumCitiesChange, 
  displayPreferences,
  onDisplayPreferencesChange,
  isOpen, 
  onClose 
}) {
  const [localNumCities, setLocalNumCities] = useState(numCities);
  const [localDisplayPrefs, setLocalDisplayPrefs] = useState(displayPreferences || {
    showCurrentTemp: true,
    showHourlyChart: true,
    showDailyChart: true,
    showDailyTable: true
  });

  // Update local state when props change
  useEffect(() => {
    setLocalNumCities(numCities);
    if (displayPreferences) {
      setLocalDisplayPrefs(displayPreferences);
    }
  }, [numCities, displayPreferences]);

  const handleSave = () => {
    onNumCitiesChange(localNumCities);
    onDisplayPreferencesChange(localDisplayPrefs);
    onClose();
  };

  const handleCancel = () => {
    setLocalNumCities(numCities);
    setLocalDisplayPrefs(displayPreferences);
    onClose();
  };

  const handleToggleDisplay = (key) => {
    setLocalDisplayPrefs(prev => {
      const newPrefs = {
        ...prev,
        [key]: !prev[key]
      };
      return newPrefs;
    });
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="settings-overlay" onClick={handleCancel}></div>
      <div className="settings-modal">
        <div className="settings-header">
          <h2>Settings</h2>
          <button className="close-button" onClick={handleCancel}>×</button>
        </div>
        <div className="settings-content">
          <div className="setting-item">
            <label htmlFor="num-cities">
              Number of Cities (1-6)
            </label>
            <input
              id="num-cities"
              type="number"
              min="1"
              max="6"
              value={localNumCities}
              onChange={(e) => {
                const value = parseInt(e.target.value, 10);
                if (value >= 1 && value <= 6) {
                  setLocalNumCities(value);
                }
              }}
            />
            <p className="setting-hint">Select how many cities to display (maximum 6)</p>
          </div>

          <div className="setting-divider"></div>

          <div className="setting-item">
            <label className="setting-section-label">Display Options</label>
            <p className="setting-hint">Choose which information to show on weather cards</p>
            
            <div className="display-options">
              <label 
                className="checkbox-label" 
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <input
                  type="checkbox"
                  checked={localDisplayPrefs?.showCurrentTemp ?? true}
                  onChange={(e) => {
                    e.stopPropagation();
                    handleToggleDisplay('showCurrentTemp');
                  }}
                />
                <span className="checkbox-custom"></span>
                <span className="checkbox-text">Current Temperature</span>
              </label>

              <label 
                className="checkbox-label"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <input
                  type="checkbox"
                  checked={localDisplayPrefs?.showHourlyChart ?? true}
                  onChange={(e) => {
                    e.stopPropagation();
                    handleToggleDisplay('showHourlyChart');
                  }}
                />
                <span className="checkbox-custom"></span>
                <span className="checkbox-text">24-Hour Forecast Chart</span>
              </label>

              <label 
                className="checkbox-label"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <input
                  type="checkbox"
                  checked={localDisplayPrefs?.showDailyChart ?? true}
                  onChange={(e) => {
                    e.stopPropagation();
                    handleToggleDisplay('showDailyChart');
                  }}
                />
                <span className="checkbox-custom"></span>
                <span className="checkbox-text">7-Day Forecast Chart</span>
              </label>

              <label 
                className="checkbox-label"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <input
                  type="checkbox"
                  checked={localDisplayPrefs?.showDailyTable ?? true}
                  onChange={(e) => {
                    e.stopPropagation();
                    handleToggleDisplay('showDailyTable');
                  }}
                />
                <span className="checkbox-custom"></span>
                <span className="checkbox-text">7-Day Forecast Table</span>
              </label>
            </div>
          </div>
        </div>
        <div className="settings-footer">
          <button className="settings-button cancel" onClick={handleCancel}>
            Cancel
          </button>
          <button className="settings-button save" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </>
  );
}

export default Settings;

