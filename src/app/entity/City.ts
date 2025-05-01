const { EntitySchema } = require("typeorm");

export const City = new EntitySchema({
  name: "City",
  tableName: "cities",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    clerkUserId: {
      type: "varchar",
      nullable: true,
    },
    name: {
      type: "varchar",
      nullable: false,
    },
    country: {
      type: "varchar",
      nullable: false,
    },
    countrycode: {
      type: "varchar",
      nullable: false,
    },
    county: {
      type: "varchar",
      nullable: true,
    },
    osm_type: {
      type: "varchar",
      nullable: false,
    },
    osm_id: {
      type: "int",
      nullable: false,
    },
    osm_key: {
      type: "varchar",
      nullable: false,
    },
    osm_value: {
      type: "varchar",
      nullable: false,
    },
    extent: {
      type: "simple-array",
      nullable: false,
    },
    geometry: {
      type: "json",
      nullable: false,
    },
    selected: {
      type: "boolean",
      default: true,
    },
    image: {
      type: "varchar",
      nullable: true,
    },
  },
});
