const middlewares = [
    require('./engines'),
    require('./filesystem'),
    require('./cookie-session'),
    require('./passport'),
    require('./authentication'),
    require('./routes'),
    require('./errors'),
]

module.exports = {
    apply(app) {
        middlewares.forEach(m=>m.apply(app));
    }
};