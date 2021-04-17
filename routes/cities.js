const Joi = require('joi');
const Models = require('../models')

module.exports = [
    { 
        path: '/cities',
        method: 'GET',
        config:{
            auth: 'session',
            handler: async (request, reply) => {
                try {
                    const allCities = await Models.City.findAll({})
                    return reply({ data: allCities })
                } catch (error) {
                    return reply({ error: error.message })
                }
            }
        }
    }
];
