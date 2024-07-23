interface Config {
  fichesPath: string;
  db: {
    user: string;
    host: string;
    database: string;
    password: string;
    port: number;
    maxConnections: number;
  }
}

export const config: Config = {
  fichesPath: process.env.FICHES_PATH || '',
  db: {
    user: process.env.DB_USER || '',
    host: process.env.DB_HOST || '',
    database: process.env.DB_NAME || '',
    password: process.env.DB_PASSWORD || '',
    port: parseInt(process.env.DB_PORT || '') || 5432,
    maxConnections: parseInt(process.env.DB_MAX_CONNECTIONS || '') || 10
  }
}