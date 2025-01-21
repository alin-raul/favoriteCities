const { DataSource } = require("typeorm");
const { City } = require("../entity/City");
const { User } = require("../entity/User");
import "reflect-metadata";

const AppDataSource = new DataSource({
  type: "sqlite",
  database: "./database.sqlite",
  synchronize: true,
  entities: [City, User],
});

module.exports = { AppDataSource };
