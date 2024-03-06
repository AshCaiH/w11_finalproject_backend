
module.exports = {
    testRoute: (req, res, next) => {
        res.status(200).json({message: "Success", body: req.body, header: req.headers});
    },


    weatherQuery: (req, res, next) => {
        res.status(200).json({message: "Weather Query Success", body: req.body, header: req.headers});
    }
}