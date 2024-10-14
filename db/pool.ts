import { Pool, PoolConfig } from 'pg';
import { config } from '../config/config';

const poolConfig: PoolConfig = {
  user: config.db.user,
  host: config.db.host,
  database: config.db.database,
  password: config.db.password,
  port: config.db.port,
  max: config.db.maxConnections
};

const pool = new Pool(poolConfig);

export default pool;