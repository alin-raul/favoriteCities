const { DataSource } = require("typeorm");
const { City } = require("../entity/City");

const AppDataSource = new DataSource({
  type: "sqlite",
  database: "./database.sqlite",
  synchronize: true,
  entities: [City],
  logging: true,
});

module.exports = { AppDataSource };
