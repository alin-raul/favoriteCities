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
    email: {
      type: "varchar",
      nullable: false,
      unique: true,
    },
    password: {
      type: "varchar",
      nullable: true,
    },
    createdAt: {
      type: "datetime",
      default: () => "CURRENT_TIMESTAMP",
    },
    githubId: {
      type: "varchar",
      unique: true,
      nullable: true, // Null if the user is local, not from GitHub
    },
  },
  relations: {
    cities: {
      target: "City",
      type: "many-to-many",
      inverseSide: "users",
    },
  },
});
