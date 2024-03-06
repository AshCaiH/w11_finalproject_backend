module.exports = {
    testRoute: (req, res, next) => {
        res.status(200).json({message: "Success", body: req.body, header: req.headers});
    },

    weatherResponse: (req, res, next) => {
        res.status(200).json({message: "Weather Query Success", location: req.location});
    },

    requestLocation: async (req, res, next) => {
        try {
            const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${req.body.location}&apiKey=${process.env.GEOAPIFY_KEY}`

            console.log(url);

            const response = await fetch(url, {
                method: "GET"
            }).then((response) => {return response.json()});

            req.location = response.features[0].properties;

            next();
        } catch {
            res.status(500).json({
                message: error.message,
                error: error
            });
        }
    },

    requestWeather: async (req, res, next) => {
        try {
            next();
        } catch {
            res.status(500).json({
                message: error.message,
                error: error
            });
        }
    }
}