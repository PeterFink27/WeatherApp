import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './WeatherCard.css';

function WeatherCard({ data, error, displayPreferences }) {
  // Default display preferences (all enabled)
  const prefs = displayPreferences || {
    showCurrentTemp: true,
    showHourlyChart: true,
    showDailyChart: true,
    showDailyTable: true
  };
  if (error) {
    return (
      <div className="weather-card error">
        <h2>{data?.name || error.cityId}</h2>
        <p className="error-message">Error: {error.message}</p>
      </div>
    );
  }

  if (!data) return null;

  // Format hourly data for chart
  const hourlyChartData = data.hourly24.map((item) => {
    const date = new Date(item.time);
    const hour = date.getHours();
    const hour12 = hour % 12 || 12;
    const ampm = hour < 12 ? 'AM' : 'PM';
    
    return {
      time: `${hour12} ${ampm}`,
      hour: hour,
      tempF: Math.round(item.tempF)
    };
  });

  // Format daily data for chart
  const dailyChartData = data.daily7.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    }),
    dateFull: item.date,
    highF: Math.round(item.highF),
    lowF: Math.round(item.lowF),
    chanceOfRain: item.chanceOfRain ?? 0
  }));

  const updatedAt = new Date(data.updatedAt).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  return (
    <div className="weather-card">
      <div className="card-header">
        <h2>{data.name}</h2>
        {prefs.showCurrentTemp && (
          <div className="current-temp">
            {Math.round(data.current.tempF)}°F
          </div>
        )}
      </div>
      
      <div className="updated-at">
        Updated: {updatedAt}
      </div>

      {prefs.showHourlyChart && (
        <div className="chart-section">
          <h3>Next 24 Hours</h3>
          <ResponsiveContainer width="100%" height={250}>
          <LineChart data={hourlyChartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis 
              dataKey="time" 
              stroke="#666"
              tick={{ fontSize: 11 }}
              interval={3}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis 
              stroke="#666"
              tick={{ fontSize: 12 }}
              label={{ value: '°F', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '4px' }}
              formatter={(value) => [`${value}°F`, 'Temperature']}
            />
            <Line 
              type="monotone" 
              dataKey="tempF" 
              stroke="#667eea" 
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
        </div>
      )}

      {(prefs.showDailyChart || prefs.showDailyTable) && (
        <div className="chart-section">
          <h3>Next 7 Days</h3>
          {prefs.showDailyChart && (
            <ResponsiveContainer width="100%" height={200}>
          <LineChart data={dailyChartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis 
              dataKey="date" 
              stroke="#666"
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              stroke="#666"
              tick={{ fontSize: 12 }}
              label={{ value: '°F', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '4px' }}
              formatter={(value, name) => {
                if (name === 'chanceOfRain') {
                  return [`${value}%`, 'Chance of Rain'];
                }
                return [`${value}°F`, ''];
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="highF" 
              stroke="#ff6b6b" 
              strokeWidth={2}
              dot={{ r: 4 }}
              name="High"
            />
            <Line 
              type="monotone" 
              dataKey="lowF" 
              stroke="#4ecdc4" 
              strokeWidth={2}
              dot={{ r: 4 }}
              name="Low"
            />
          </LineChart>
        </ResponsiveContainer>
          )}
        
        {prefs.showDailyTable && (
          <div className="daily-forecast-table">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>High</th>
                <th>Low</th>
                <th>Rain</th>
              </tr>
            </thead>
            <tbody>
              {data.daily7.map((day, idx) => (
                <tr key={idx}>
                  <td>{new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                  <td className="high">{Math.round(day.highF)}°F</td>
                  <td className="low">{Math.round(day.lowF)}°F</td>
                  <td className="rain">{Math.round(day.chanceOfRain ?? 0)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </div>
      )}

      {/* Alternative: Daily table view (commented out, using chart instead) */}
      {/* 
      <div className="daily-table">
        <h3>Next 7 Days</h3>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>High</th>
              <th>Low</th>
            </tr>
          </thead>
          <tbody>
            {data.daily7.map((day, idx) => (
              <tr key={idx}>
                <td>{new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                <td className="high">{Math.round(day.highF)}°F</td>
                <td className="low">{Math.round(day.lowF)}°F</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      */}
    </div>
  );
}

export default WeatherCard;

