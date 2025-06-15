import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('levelyst.db');

export default db;