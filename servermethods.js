const Joi = require('joi');
const Models = require('../models')

module.exports.cacheOptions = {
    cache: {
        cache: 'my_cache',
        expiresIn: 10 * 1000,
        generateTimeout: 2000
    }
}

const getMoviesForTheGivenCityFromDB = async (cityID) => {
    const moviesRunningInTheCity = await Models.Show.findAll({
        include: [{
            model : Models.Movie,
            attributes: ['name'],
        }],
        where : {
            CityId:cityID
        },
        raw: true
    })
    // await Hoek.wait(1000);   // Simulate some slow I/O

    return moviesRunningInTheCity;
};
module.exports.getMoviesForTheGivenCityFromDBCacheMethod = getMoviesForTheGivenCityFromDB
