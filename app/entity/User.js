const { EntitySchema } = require("typeorm");

const User = new EntitySchema({
  name: "User",
  tableName: "users",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    username: {
      type: "varchar",
      nullable: false,
      unique: true,
    },
    name: {
      type: "varchar",
      nullable: false,
    },
    email: {
      type: "varchar",
      nullable: false,
      unique: true,
    },
    password: {
      type: "varchar",
      nullable: false,
    },
    createdAt: {
      type: "datetime", // SQLite supports `datetime` over `timestamp`
      default: () => "CURRENT_TIMESTAMP",
    },
  },
});

module.exports = { User };
