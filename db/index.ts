import { PoolConfig, Pool } from 'pg';
import { config } from '../config/config';

const poolConfig: PoolConfig = {
  user: config.db.user,
  host: config.db.host,
  database: config.db.database,
  password: config.db.password,
  port: config.db.port,
  max: config.db.maxConnections
};

const db = new Pool(poolConfig);

export default db;