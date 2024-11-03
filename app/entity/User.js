const { EntitySchema } = require("typeorm");

const User = new EntitySchema({
  name: "User",
  tableName: "users", // Optional: specify the database table name
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    name: {
      type: "varchar",
      nullable: false, // Ensures name is required
    },
    age: {
      type: "int",
      nullable: false, // Ensures age is required
    },
  },
});

module.exports = { User };
