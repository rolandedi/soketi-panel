function getDatabaseUrl() {
  const {
    DATABASE_URL,
    DB_DRIVER = "mysql",
    DATABASE_HOST = "localhost",
    DATABASE_PORT = "3306",
    DATABASE_NAME = "soketi_db",
    DATABASE_USER = "root",
    DATABASE_PASSWORD = "",
  } = process.env;

  if (DATABASE_URL) {
    return DATABASE_URL;
  }

  return `${DB_DRIVER}://${DATABASE_USER}:${DATABASE_PASSWORD}@${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}`;
}
