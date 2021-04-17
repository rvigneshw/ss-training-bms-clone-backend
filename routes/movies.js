const Joi = require('joi');
const Models = require('../models')
const es = require('../elasticsearch');

module.exports = [
    { 
        path: '/getMoviesForCity/{id}',
        method: 'GET',
        config: {
            auth: 'session',
            handler: async (request, reply) => {
                try {
                    const cityID = request.params.id;
                    // request.server.methods.getMoviesForTheGivenCityFromDBCacheMethod(cityID, (err, result) => {

                    //     console.log(result);
                    // });
                    
                    const moviesRunningInTheCity = await request.server.methods.getMoviesForTheGivenCityFromDBCacheMethod(cityID)
                    return reply({ data: moviesRunningInTheCity })
                } catch (error) {
                    return reply({ error: error.message })
                }
            },
            validate: {
                params: {
                    id: Joi.string().min(1).max(100).required()
                }
            }
        }
    },
    { 
        path: '/movie/search',
        method: 'GET',
        config:{
            auth: 'session',
            handler: async (request, reply) => {
                try {
                    const params = request.query;
                    const movieName = params.name;
                    // const result = await es.search({
                    //     index: 'articles',
                    //     type: 'articles',
                    //     q: req.query.q
                    // })
                    const result = await es.search({
                        index: 'movies',
                        body: {
                          query: {
                            match: {
                              name: movieName
                            }
                          }
                        }
                    })
                    console.log(result);
                    
                    
                    const ids = result.hits.hits.map((item) => {
                        return item._id
                    })
                    
                    movies = await Models.Movie.findAll({
                        where: {
                            id: ids
                        }
                    })
                    //  res.send(movies)
                    return reply({ data: movies })
                } catch (error) {
                    return reply({ error: error.message })
                }
            }
        }
    },
    { 
        path: '/movie',
        method: 'POST',
        config:{
            auth: 'session',
            handler: async (request, reply) => {
                try {
                    const payload = request.payload   // <-- this is the important line
                    const name = payload.name;
                    const genre = payload.genre;
                    const createdMovie = await Models.Movie.create({
                        name:name,
                        genre:genre
                    });

                    return reply({ data: createdMovie })
                } catch (error) {
                    return reply({ error: error.message })
                }
            }
        }
    },
    { 
        path: '/movie',
        method: 'PUT',
        config:{
            auth: 'session',
            handler: async (request, reply) => {
                try {
                    const payload = request.payload   // <-- this is the important line
                    const name = payload.name;
                    const genre = payload.genre;
                    const id = payload.id;
                    const updatedMovie = await Models.Movie.update(
                        { 
                            name:name,
                            genre:genre
                        }, {
                            where: {
                            id: id
                            }
                        }
                    );

                    return reply({ data: updatedMovie })
                } catch (error) {
                    return reply({ error: error.message })
                }
            }
        }
    }
];
