const citiesHandler = require('./cities');
const userHandler = require('./user');
const authHandler = require('./auth-routes')
const moviesHandler = require('./movies')
const seatHandler = require('./seats')
const screenHandler = require('./screens')

let routeHandlers = [
    citiesHandler,authHandler,userHandler,moviesHandler,seatHandler,screenHandler
];
let allHandlers = [];

routeHandlers.forEach(route => {
    allHandlers = allHandlers.concat(route);
});

module.exports = allHandlers;