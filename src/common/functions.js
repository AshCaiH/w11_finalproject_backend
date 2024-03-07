const weathercodes = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",

    45: "Fog",
    48: "Depositing rime fog",

    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",

    56: "Light freezing drizzle",
    57: "Dense freezing drizzle",
    
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",

    66: "Light freezing rain",
    67: "Heavy freezing rain",

    71: "Slight snow fall",
    73: "Moderate snow fall",
    75: "Heavy snow fall",

    77: "Snow grains",
    
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    
    85: "Slight snow showers",
    86: "Heavy snow showers",
    
    95: "Slight or moderate thunderstorm",

    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail",    
}

module.exports = {
    testRoute: (req, res, next) => {
        res.status(200).json({message: "Success", body: req.body, header: req.headers});
    },

    requestLocation: async (req, res, next) => {
        try {
            const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${req.body.location}&apiKey=${process.env.GEOAPIFY_KEY}`

            const response = await fetch(url, {
                method: "GET"
            }).then((response) => {return response.json()});

            req.location = response.features[0].properties;

            next();
        } catch (error) {
            res.status(500).json({
                message: error.message,
                error: error
            });
        }
    },

    requestWeather: async (req, res, next) => {
        try {
            const lat = req.location.lat
            const lon = req.location.lon

            // Note: This doesn't search by date yet, results in current weather and following 6 days.

            const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weather_code,temperature_2m_max&timezone=auto`

            const response = await fetch(url, {
                method: "GET"
            }).then((response) => {return response.json()});

            req.weather = {
                weathername: weathercodes[response.daily.weather_code[0]],
                weathercode: response.daily.weather_code[0],
                temperature: response.daily.temperature_2m_max
            }

            next();
        } catch (error) {
            res.status(500).json({
                message: error.message,
                error: error
            });
        }
    },

    weatherResponse: (req, res, next) => {
        res.status(200).json({
            message: "Weather Query Success", 
            weather: req.weather,
            location: req.location,
        });
    },
}