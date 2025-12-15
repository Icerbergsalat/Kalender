// Hent vejrdata fra Open-Meteo API
async function getWeatherForecast(lat, lng, date) {
    try {
        // Format dato til YYYY-MM-DD
        const eventDate = new Date(date);
        const dateStr = eventDate.toISOString().split('T')[0];
        
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=Europe/Copenhagen&start_date=${dateStr}&end_date=${dateStr}`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.daily) {
            const weatherCode = data.daily.weather_code[0];
            const tempMax = data.daily.temperature_2m_max[0];
            const tempMin = data.daily.temperature_2m_min[0];
            const avgTemp = Math.round((tempMax + tempMin) / 2);
            
            return {
                temperature: avgTemp,
                weatherCode: weatherCode,
                description: getWeatherDescription(weatherCode)
            };
        }
        
        return null;
    } catch (error) {
        console.error('Weather API error:', error);
        return null;
    }
}

// Konverter WMO weather code til beskrivelse
function getWeatherDescription(code) {
    const weatherCodes = {
        0: 'Klart',
        1: 'Hovedsageligt klart',
        2: 'Delvist skyet',
        3: 'Overskyet',
        45: 'Tåget',
        48: 'Tåget',
        51: 'Let støvregn',
        53: 'Støvregn',
        55: 'Kraftig støvregn',
        61: 'Let regn',
        63: 'Regn',
        65: 'Kraftig regn',
        71: 'Let sne',
        73: 'Sne',
        75: 'Kraftig sne',
        77: 'Snefnug',
        80: 'Let regnbyge',
        81: 'Regnbyge',
        82: 'Kraftig regnbyge',
        85: 'Let snebyge',
        86: 'Snebyge',
        95: 'Tordenvejr',
        96: 'Tordenvejr med hagl',
        99: 'Kraftigt tordenvejr'
    };
    
    return weatherCodes[code] || 'Ukendt';
}

// Få vejr-emoji baseret på weather code
function getWeatherEmoji(code) {
    if (code === 0 || code === 1) return '☀️';
    if (code === 2) return '⛅';
    if (code === 3) return '☁️';
    if (code === 45 || code === 48) return '🌫️';
    if (code >= 51 && code <= 55) return '🌦️';
    if (code >= 61 && code <= 65) return '🌧️';
    if (code >= 71 && code <= 77) return '❄️';
    if (code >= 80 && code <= 82) return '🌧️';
    if (code >= 85 && code <= 86) return '🌨️';
    if (code >= 95) return '⛈️';
    return '🌤️';
}

module.exports = {
    getWeatherForecast,
    getWeatherDescription,
    getWeatherEmoji
};