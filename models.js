const { Sequelize, Model, DataTypes } = require('sequelize');
const es = require('./elasticsearch');
var Queue = require('bull');

var movieCreateQueue = new Queue('creation', 'redis://127.0.0.1:6379');
var movieUpdateQueue = new Queue('update', 'redis://127.0.0.1:6379');
var movieDeleteQueue = new Queue('delete', 'redis://127.0.0.1:6379');

movieCreateQueue.process(async(job, done)=>{
  return es.create(job.data);
});
movieUpdateQueue.process(async(job, done)=>{
  return es.update(job.data);
});
movieDeleteQueue.process(async(job, done)=>{
  return es.delete(job.data);
});


async function createIndexAndPutMapping () {
  es.indices.exists({index: 'movies'}, (err, res, status) => {
    if (res) {
        console.log('index already exists');
    } else {
        es.indices.create( {index: 'movies'}, (err, res, status) => {
        console.log(err, res, status);
    })
  }
  })
  console.log("Creating Mapping index");
  es.indices.putMapping({
      index: 'movies',
      type: 'movies',
      body: {
        properties: { 
            name: { type: 'text' },
        }
      }
  }, (err,resp, status) => {
      if (err) {
        console.error(err, status);
      }
      else {
          console.log('Successfully Created Index', status, resp);
      }
  });
}
const saveDocument = (instance) => {
  return movieCreateQueue.add({
    index: 'movies',
    type: 'movies',
    id: instance.dataValues.id,
    body: { name: instance.dataValues.name },
    refresh:true
  });
}

const deleteDocument = (instance) => {
  movieDeleteQueue.add({
    index: 'movies',
    type: 'movies',
    id: instance.dataValues.id,
  })
}

const updateDocument = (instance)=>{
  movieUpdateQueue.add({
    index: 'movies',
    type: 'movies',
    id: instance.dataValues.id,
    body: { name: instance.dataValues.name },
  })
}
// const sequelize = new Sequelize('sqlite::memory:');
// const sequelize = new Sequelize(config.database, config.username, config.password, config);
const sequelize = new Sequelize('postgres://postgres:postgres@localhost:5432/bms') // Example for postgres


const User = sequelize.define('User', {
  username: DataTypes.STRING,
  password: DataTypes.STRING,
});

const City = sequelize.define('City', {
  name: DataTypes.STRING,
  pincode: DataTypes.INTEGER
});

const TheatreHall = sequelize.define('TheatreHall',{
  name : DataTypes.STRING
});

City.hasMany(TheatreHall);


const Screen = sequelize.define('Screen',{
  name : DataTypes.STRING
});

TheatreHall.hasMany(Screen);

const Movie = sequelize.define('Movie',{
  name : DataTypes.STRING,
  genre : DataTypes.STRING
},{
  hooks: {
      afterCreate: saveDocument,
      afterUpdate: updateDocument,
      afterDestroy: deleteDocument
  }
});

const Seat = sequelize.define('Seat',{
  seatNumber : DataTypes.STRING,
  status : DataTypes.ENUM(['available', 'booked']),
});

const Show = sequelize.define('Show',{
  name : DataTypes.STRING,
  // startTime: DataTypes.DATE,
  // endTime : DataTypes.DATE,
});

Show.hasMany(Seat);
Show.belongsTo(Movie);
Show.belongsTo(City);
User.hasMany(Seat);
Seat.belongsTo(User);
Movie.hasMany(Show);
Screen.hasMany(Show);
City.hasMany(Show);

const usersArray = ['ram','ragu','ramu'];
const seatStatusArray=['available', 'booked'];
const cities = ['karaikal','chennai'];
const theatreHalls = ['theatre 1','theatre 2','theatre 3'];
const screens = ['screen 1','screen 2'];
const movies = ['final destination','fast and furios 6','sherlock holmes'];
// const movies = ['final destination'];
const shows = ['morning show', 'evening show'];
const seats = [1,2,3,4,5,6,7,8];
let moviesArray = [];

(async () => {
  // createIndexAndPutMapping();
  // await sequelize.sync({ force: true })
  await sequelize.sync()
//   // usersArray.forEach(async (user)=>{
//   //   const createdUser = await User.create({username:user,password:'1234'});
//   //   // moviesArray.push(createdMovie);
//   // })
//   // movies.forEach(async (movie)=>{
//   //   const createdMovie = await Movie.create({name:movie,genre:'actions'});
//   //   moviesArray.push(createdMovie);
//   //   console.log(moviesArray)
//   // cities.forEach( async(city) => {
//   //   const createdCity = await City.create({ name: city,pincode: 609200});
    
//   //   theatreHalls.forEach( async(theatreHall)=>{
//   //     const createdTheatreHall = await TheatreHall.create({ name: theatreHall});
      
//   //     screens.forEach( async(screen) => {
//   //       const createdScreen = await Screen.create({ name: screen});
        
//   //       shows.forEach( async(show)=>{
//   //         const createdShow = await Show.create({ name: show});
//   //         const randomMovie = moviesArray[Math.floor(Math.random() * moviesArray.length)];
//   //         // const movie = await Movie.create({name:randomMovie,genre:'actions'});
//   //         seats.forEach( async(seat) => {
//   //           const createdSeat = await Seat.create({ seatNumber: seat,status:seatStatusArray[Math.floor(Math.random() * seatStatusArray.length)]});
//   //           createdShow.addSeat(createdSeat);
//   //         })
//   //         createdScreen.addShow(createdShow);
//   //         createdShow.setMovie(randomMovie);
//   //         createdCity.addShow(createdShow);
//   //       })
        
//   //       createdTheatreHall.addScreen(createdScreen);
//   //     })

//   //     createdCity.addTheatreHall(createdTheatreHall);
//   //   })

//   // })
// })
console.log(moviesArray)
})();

module.exports.City = City 
module.exports.TheatreHall = TheatreHall 
module.exports.Screen = Screen 
module.exports.Movie = Movie 
module.exports.Seat = Seat 
module.exports.Show = Show 
module.exports.User = User 