const Joi = require('joi');
const Models = require('../models')

module.exports = [
    { 
        path: '/getBookedSeats',
        method: 'GET',
        config:{
            auth: 'session',
            handler: async (request, reply) => {
                try {
                    console.log(request.auth.credentials);
                    const userID = request.auth.credentials.id;
                    const seatsBookedBytheUser = await Models.User.findOne({
                        where:{
                            id:userID
                        },
                        include:[{
                            model:Models.Seat
                        }]
                    });
                    return reply({ data: seatsBookedBytheUser })
                } catch (error) {
                    return reply({ error: error.message })
                }
            }
        }
    }
];
