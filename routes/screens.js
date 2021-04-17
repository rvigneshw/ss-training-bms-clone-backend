const Joi = require('joi');
const Models = require('../models')

module.exports = [
    { 
        path: '/getTheatresForSelectedMovie/{cityID}/{movieID}',
        method: 'GET',
        config: {
            auth: 'session',
            handler: async (request, reply) => {
                try {
                    const cityID = request.params.cityID;
                    const movieID = request.params.movieID;
                    // const city = await Models.City.findByPk(cityID)
                    const theatreHalls = await Models.TheatreHall.findAll({
                        attributes: ['name'],
                        include:[{
                            attributes: ['name'],
                            model:Models.Screen,
                            
                            include : [{
                                attributes: ['name'],
                                model : Models.Show,
                                include: [{
                                    model:Models.Movie,
                                    required: true,
                                    where:{
                                        id:movieID
                                    }
                                }],
                                required: true
                            }],
                            required:true
                        }],
                        where : {
                            CityId:cityID
                        },
                        raw: true
                    })
                    
                    return reply({ data: theatreHalls })
                } catch (error) {
                    return reply({ error: error.message })
                }
            },
            validate: {
                params: {
                    cityID: Joi.string().min(1).max(100).required(),
                    movieID: Joi.string().min(1).max(100).required(),
                }
            }
        }
    },
];
