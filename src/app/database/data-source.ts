const { DataSource } = require("typeorm");
const { City } = require("../entity/City");
const { User } = require("../entity/User");

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "./database.sqlite",
  synchronize: true,
  entities: [City, User],
});
