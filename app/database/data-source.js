const { DataSource } = require("typeorm");
const { User } = require("../entity/User");

const AppDataSource = new DataSource({
  type: "sqlite",
  database: "./database.sqlite",
  synchronize: true,
  entities: [User],
  logging: true,
});

module.exports = { AppDataSource };
