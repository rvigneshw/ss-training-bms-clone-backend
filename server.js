const Hapi = require('hapi');
const CatboxRedis = require('@hapi/catbox-redis');

const plugins = require('./plugins').plugins;
const cookieAuthStrategy = require('./strategy').cookieAuthStrategy;
const routes = require('./routes');
const serverMethods =  require('./servermethods');

  
// Create a server with a host and port
const server = new Hapi.Server({
  cache: require('catbox-redis'),
});
server.connection({
  host: 'localhost',
  port: Number(process.argv[2]) || 8080
});

server.register(plugins,function (err) {
    if (err) {
      server.log('error', 'failed to install plugins')
      throw err
    }else{
        server.log('debug','No errors while installing plugins');
    }
});

server.auth.strategy(cookieAuthStrategy.name, 'cookie', cookieAuthStrategy.options);


// Add the route
server.route({
  method: 'GET',
  path:'/',
  handler: function (request, reply) {
    request.cookieAuth.set({id:1});
    return reply('HapiJS Server running!');
  }
});

server.route({  
    method: 'GET',
    path: '/secure',
    config: {
        auth: 'session',
        handler: (request, reply) => {
            return reply('Yeah! This message is only available for authenticated users!');
        }
    }
})

server.route(routes);

server.method(
  'getMoviesForTheGivenCityFromDBCacheMethod',
  serverMethods.getMoviesForTheGivenCityFromDBCacheMethod,
  serverMethods.options
);

const bootUpServer = async () => {
    await server.start();
    console.log(`Server is running at ${server.info.uri}`)

    process.on('unhandledRejection', (err) => {
        console.log(err);
        process.exit(1);
    })
}

bootUpServer();