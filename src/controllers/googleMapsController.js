const controller = {};

controller.list = (req, res) => {
    const initialLatitude = 10.2126;
    const initialLongitude = -83.7908;
    const zoom = 18;

    res.render('google_maps', {
        initialLatitude,
        initialLongitude,
        zoom
    });
};

module.exports = controller;
