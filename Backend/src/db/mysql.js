import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Crie o pool de conexões. As configurações específicas do pool são os padrões
const db = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  database:  process.env.MYSQL_DB,
  password: process.env.MYSQL_PASSWORD,
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10, // max idle connections, o valor padrão é o mesmo que 'connectionLimit'
  idleTimeout: 60000, // Tempo limite de conexões ociosas, em milissegundos, o valor padrão 60000
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

export default db;

