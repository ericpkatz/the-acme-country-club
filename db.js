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
Member.hasMany(Member, { as: 'sponsored', foreignKey: 'sponsorId' });
Booking.belongsTo(Facility);
Facility.hasMany(Booking);
Booking.belongsTo(Member, { as: 'booker'});

module.exports = {
  conn,
  Member,
  Facility,
  Booking
};
