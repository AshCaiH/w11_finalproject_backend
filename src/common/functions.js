const imageToBase64 = require("image-to-base64");

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
};

module.exports = {
  testRoute: (req, res, next) => {
    res
      .status(200)
      .json({ message: "Success", body: req.body, header: req.headers });
  },

  requestLocation: async (req, res, next) => {
    try {
      if (!req.authCheck) {
        res
          .status(501)
          .json({ message: "You are not Authorized to fetch API" });
        return;
      }
      const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${req.body.location}&apiKey=${process.env.GEOAPIFY_KEY}`;

      const response = await fetch(url, {
        method: "GET",
      }).then((response) => {
        return response.json();
      });

      req.location = response.features[0].properties;

      next();
    } catch (error) {
      res.status(500).json({
        message: error.message,
        error: error,
      });
    }
  },

  requestMapImage: async (req, res, next) => {
    try {
      const lat = req.location.lat;
      const lon = req.location.lon;

      const url = `https://maps.geoapify.com/v1/staticmap?style=klokantech-basic&width=600&height=400&center=lonlat:${lon},${lat}&zoom=13&apiKey=${process.env.GEOAPIFY_KEY}`;

      const mapImage = await imageToBase64(url) // Path to the image
        .then((response) => {
          return response;
        })
        .catch((error) => {
          console.log(error); // Logs an error if there was one
        });

      req.mapImage = mapImage;

      next();
    } catch (error) {
      res.status(500).json({
        message: error.message,
        error: error,
      });
    }
  },

  requestWeather: async (req, res, next) => {
    try {
      const lat = req.location.lat;
      const lon = req.location.lon;
      let hourArray = [];
      let tempArray = [];
      let rainArray = [];
      let cloudArray = [];

      // Note: This doesn't search by date yet, results in current weather and following 6 days.
      let newDate = new Date();
      const today = newDate.toISOString().substring(0, 10);
      console.log(today);

      let date = new Date();
      let dayAfter = date.setDate(date.getDate() + 1);
      dayAfter = date.toISOString().substring(0, 10);
      console.log(dayAfter);

      const hourNow = date.getHours();

      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weather_code,temperature_2m_max&timezone=auto`;

      const url2 = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,rain,cloud_cover&timezone=auto&start_date=${today}&end_date=${dayAfter}`;

      const [response1, response2] = await Promise.all([
        fetch(url, {
          method: "GET",
        }).then((response1) => {
          return response1.json();
        }),
        fetch(url2, {
          method: "GET",
        }).then((response2) => {
          return response2.json();
        }),
      ]);

      const hours = response2.hourly.time;

      let fullHourArray = [];
      for (let i = 0; i < hours.length; i++) {
        let date = new Date(hours[i]);
        const hour = date.getHours();
        fullHourArray.push(hour);
      }
      const mainIndex = fullHourArray.indexOf(hourNow);
      for (let i = 0; i < fullHourArray.length; i++) {
        if (i > mainIndex && hourArray.length < 24) {
          stringHour = `${fullHourArray[i]}:00`;
          hourArray.push(stringHour);
        }
      }
      console.log(hourArray);

      //
      const temps = response2.hourly.temperature_2m;
      for (let i = 0; i < temps.length; i++) {
        if (i > mainIndex && tempArray.length < 24) {
          tempArray.push(temps[i]);
        }
      }

      const rain = response2.hourly.rain;
      console.log(rain);
      for (let i = 0; i < rain.length; i++) {
        if (i > mainIndex && rainArray.length < 24) {
          rainArray.push(rain[i]);
        }
      }
      console.log(rainArray);
      const clouds = response2.hourly.cloud_cover;
      for (let i = 0; i < clouds.length; i++) {
        if (i > mainIndex && cloudArray.length < 24) {
          cloudArray.push(clouds[i]);
        }
      }
      req.weather = {
        weathername: response1.daily.weather_code.map((code) => {
          return weathercodes[code];
        }),
        weathercode: response1.daily.weather_code,
        temperature: response1.daily.temperature_2m_max,
        //
        hourly_weather: {
          hourly: hourArray,
          temperature_2m: tempArray,
          rain: rainArray,
          cloud_cover: cloudArray,
        },
      };

      next();
      //
    } catch (error) {
      res.status(500).json({
        message: error.message,
        error: error,
      });
    }
  },

  weatherResponse: (req, res, next) => {
    res.status(200).json({
      message: "Weather Query Success",
      weather: req.weather,
      hourly_weather: req.hourly_weather,
      location: req.location,
      map: req.mapImage,
    });
  },
};
