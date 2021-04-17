const Joi = require('joi');
const Models = require('../models')

module.exports = [
    { 
        path: '/login',
        method: 'POST',
        config:{
            // auth: 'session',
            handler: async (request, reply) => {
                var payload = request.payload   // <-- this is the important line
                const username = payload.username;
                const password = payload.password;
                
                const user = await Models.User.findOne({
                    where:{
                        username:username,
                        password:password
                    }
                });
                // console.log(user)

                if (!user) {
                    return reply({status:'error'});
                }
                request.cookieAuth.set(user);
                // return reply({ data: todos })
            
                return reply({status:'sucess'});
            }
        }
    },
    { 
        path: '/register',
        method: 'POST',
        config:{
            // auth: 'session',
            handler: async (request, reply) => {
                var payload = request.payload   // <-- this is the important line
                const username = payload.username;
                const password = payload.password;
                const createdUser = await Models.User.create({
                    username:username,
                    password:password
                });
                // const user = await Models.User.findOne({
                //     where:{
                //         username:username,
                //         password:password
                //     }
                // });
                // // console.log(user)

                // if (!user) {
                //     return reply({status:'error'});
                // }
                request.cookieAuth.set(user);
                // return reply({ data: todos })
            
                return reply({status:'sucess'});
            }
        }
    }
];
