const Sequelize = require('sequelize');
const { UUID, UUIDV4, STRING } = Sequelize;
const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/acme_country_club_2207');


const Member = conn.define('member', {
  id: {
    primaryKey: true,
    type: UUID,
    defaultValue: UUIDV4
  },
  name: {
    type: STRING(20),
    allowNull: false,
    unique: true
  }
});


const Booking = conn.define('booking', {
  id: {
    primaryKey: true,
    type: UUID,
    defaultValue: UUIDV4
  }
});

const Facility = conn.define('facility', {
  id: {
    primaryKey: true,
    type: UUID,
    defaultValue: UUIDV4
  },
  name: {
    type: STRING(20),
    allowNull: false
  }
});
Member.belongsTo(Member, { as: 'sponsor' });
Booking.belongsTo(Facility);
Booking.belongsTo(Member, { as: 'booker'});


const start = async()=> {
  try {
    await conn.sync({ force: true });
    console.log('starting');
    const [moe, lucy, larry, ethyl] = await Promise.all(
      ['moe', 'lucy', 'larry', 'ethyl'].map( name => Member.create({ name }))
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
  }
  catch(ex){
    console.log(ex);
  }
};

start();
