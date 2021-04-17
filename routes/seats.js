const Joi = require('joi');
const Models = require('../models')

module.exports = [
    { 
        path: '/getSeatsForTheSelectedShow/{id}',
        method: 'GET',
        config: {
            auth: 'session',
            handler: async (request, reply) => {
                try {
                    const showID = request.params.id;
                    // const city = await Models.City.findByPk(showID)
                    const showDetails = await Models.Show.findAll({
                        include:[{
                            model:Models.Seat
                        }],
                        where : {
                            id:showID
                        }
                    })
                    return reply({ data: showDetails })
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
        path: '/bookSeat/{id}',
        method: 'GET',
        config: {
            auth: 'session',
            handler: async (request, reply) => {
                try {
                    const seatID = request.params.id;
                    console.log(request.auth.credentials.id);
                    const updatedSeat = await Models.Seat.update({ status: "booked",UserId: request.auth.credentials.id }, {
                        where: {
                            id: seatID
                        }
                    });
                    // const city = await Models.City.findByPk(showID)
                    return reply({ data: updatedSeat })
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
];
