const { conn, Member, Booking, Facility } = require('./db');
const express = require('express');
const app = express();

app.get('/api/members', async(req, res, next)=> {
  try {
    const members = await Member.findAll({
      include: [ 
        { model: Member, as: 'sponsor'},
        { model: Member, as: 'sponsored'},
      ]
    });
    res.send(members);
  }
  catch(ex){
    next(ex);
  }
});

app.get('/api/bookings', async(req, res, next)=> {
  try {
    const bookings = await Booking.findAll({
      include: [ 
        { model: Member, as: 'booker' }
      ]
    });
    res.send(bookings);
  }
  catch(ex){
    next(ex);
  }
});

app.get('/api/facilities', async(req, res, next)=> {
  try {
    const facilities = await Facility.findAll({
      include: [ 
        {
          model: Booking,
          include: [
            { model: Member, as: 'booker' }
          ]
        } 
      ]
    });
    res.send(facilities);
  }
  catch(ex){
    next(ex);
  }
});


const start = async()=> {
  try {
    await conn.sync({ force: true });
    console.log('starting');
    const [moe, lucy, larry, ethyl] = await Promise.all(
      ['moe', 'lucy', 'larry', 'ethyl', 'curly', 'fred'].map( name => Member.create({ name }))
    );
    const [tennis, pingPong, marbles] = await Promise.all(
      ['tennis', 'pingPong', 'marbles'].map( name => Facility.create({ name }))
    );
    console.log(moe.name);
    larry.sponsorId = lucy.id;
    ethyl.sponsorId = lucy.id;
    lucy.sponsorId = moe.id;
    await Promise.all([
      larry.save(),
      ethyl.save(),
      lucy.save(),
      Booking.create({ facilityId: marbles.id, bookerId: lucy.id }),
      Booking.create({ facilityId: marbles.id, bookerId: lucy.id }),
      Booking.create({ facilityId: marbles.id, bookerId: moe.id }),
      Booking.create({ facilityId: tennis.id, bookerId: larry.id }),
    ]);
    const port = process.env.PORT || 3000;
    app.listen(port, ()=> console.log(`listening on port ${port}`));
  }
  catch(ex){
    console.log(ex);
  }
};

start();
