const Sequelize = require('sequelize-hierarchy')()

module.exports = new Sequelize(
  process.env.DATABASE,
  process.env.USERNAME,
  null,
  {
    operatorsAliases: false,
    logging: false,
    dialect: process.env.DIALECT,
    sync: { force: true }
  }
)
