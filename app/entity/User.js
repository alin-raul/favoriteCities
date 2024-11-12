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
    name: {
      type: "varchar",
      nullable: false,
    },
    age: {
      type: "int",
      nullable: false,
    },
  },
});

module.exports = { User };
