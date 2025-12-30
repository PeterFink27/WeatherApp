import './CitySelector.css';

function CitySelector({ cities, selectedCities, onCityChange, onRefresh, loading }) {
  const handleSelectChange = (index, value) => {
    // Check if city is already selected in another dropdown
    const isDuplicate = selectedCities.some((id, idx) => idx !== index && id === value && value !== '');
    
    if (isDuplicate) {
      // Swap: clear the other selection and set this one
      const otherIndex = selectedCities.findIndex((id, idx) => idx !== index && id === value);
      if (otherIndex !== -1) {
        onCityChange(otherIndex, '');
      }
    }
    
    onCityChange(index, value);
  };

  return (
    <div className="city-selector">
      <div className="selector-group">
        {[0, 1, 2].map((index) => (
          <div key={index} className="selector-item">
            <label htmlFor={`city-${index}`}>
              City {index + 1}
            </label>
            <select
              id={`city-${index}`}
              value={selectedCities[index] || ''}
              onChange={(e) => handleSelectChange(index, e.target.value)}
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
        ))}
      </div>
      <button
        onClick={onRefresh}
        disabled={loading || selectedCities.filter(Boolean).length === 0}
        className="refresh-button"
      >
        {loading ? 'Loading...' : 'Refresh Weather'}
      </button>
    </div>
  );
}

export default CitySelector;

