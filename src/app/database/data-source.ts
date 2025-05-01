const { DataSource } = require("typeorm");
const { City } = require("../entity/City");

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  synchronize: true,
  logging: false,
  entities: [City],
  ssl: {
    rejectUnauthorized: false,
  },
});

let initializePromise = null;

export async function ensureDbInitialized() {
  // If the promise exists, initialization is either in progress or complete.
  // Just await the existing promise.
  if (initializePromise) {
    console.log(
      "TypeORM DataSource: Awaiting existing initialization promise..."
    );
    return initializePromise; // Await the promise and return its result
  }

  // If the promise doesn't exist, start the initialization and store the promise
  console.log("TypeORM DataSource: Starting initialization...");
  // Store the promise returned by initialize()
  initializePromise = AppDataSource.initialize();

  // Now, await the promise that we just stored
  try {
    const result = await initializePromise;
    console.log("TypeORM DataSource initialized successfully.");
    return result; // Return the result of initialization (the DataSource instance)
  } catch (error) {
    console.error("Error initializing TypeORM DataSource:", error);
    // IMPORTANT: If initialization fails, clear the promise
    // so that a future attempt might try again.
    initializePromise = null;
    // Re-throw the error so the caller knows initialization failed
    throw new Error("Database initialization failed.");
  }
}
