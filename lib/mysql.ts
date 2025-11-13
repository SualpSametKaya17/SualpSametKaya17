import mysql from "mysql2/promise";

export interface DbConfig {
  host: string;
  port: string;
  user: string;
  password: string;
  database?: string;
}

export async function createConnection(config: DbConfig) {
  try {
    const connection = await mysql.createConnection({
      host: config.host,
      port: parseInt(config.port),
      user: config.user,
      password: config.password,
      database: config.database,
    });
    return connection;
  } catch (error: any) {
    throw new Error(`MySQL bağlantı hatası: ${error.message}`);
  }
}

export async function testConnection(config: DbConfig): Promise<{
  success: boolean;
  databases?: string[];
  error?: string;
}> {
  let connection;
  try {
    connection = await createConnection(config);
    const [rows] = await connection.query("SHOW DATABASES");
    const databases = (rows as any[])
      .map((row) => row.Database)
      .filter(
        (db) =>
          db !== "information_schema" &&
          db !== "performance_schema" &&
          db !== "mysql" &&
          db !== "sys"
      );

    return { success: true, databases };
  } catch (error: any) {
    return { success: false, error: error.message };
  } finally {
    if (connection) await connection.end();
  }
}

export async function getTables(config: DbConfig): Promise<{
  success: boolean;
  tables?: string[];
  error?: string;
}> {
  let connection;
  try {
    connection = await createConnection(config);
    const [rows] = await connection.query("SHOW TABLES");
    const tables = (rows as any[]).map((row) => Object.values(row)[0] as string);

    return { success: true, tables };
  } catch (error: any) {
    return { success: false, error: error.message };
  } finally {
    if (connection) await connection.end();
  }
}

export async function getTableSchema(
  config: DbConfig,
  tableName: string
): Promise<{
  success: boolean;
  schema?: any[];
  error?: string;
}> {
  let connection;
  try {
    connection = await createConnection(config);
    const [rows] = await connection.query(`DESCRIBE ${tableName}`);

    return { success: true, schema: rows as any[] };
  } catch (error: any) {
    return { success: false, error: error.message };
  } finally {
    if (connection) await connection.end();
  }
}

export async function executeQuery(
  config: DbConfig,
  query: string
): Promise<{
  success: boolean;
  results?: any[];
  error?: string;
}> {
  let connection;
  try {
    connection = await createConnection(config);
    const [rows] = await connection.query(query);

    return { success: true, results: rows as any[] };
  } catch (error: any) {
    return { success: false, error: error.message };
  } finally {
    if (connection) await connection.end();
  }
}

export async function getDatabaseStructure(config: DbConfig): Promise<string> {
  let connection;
  try {
    connection = await createConnection(config);

    // Get all tables
    const [tables] = await connection.query("SHOW TABLES");
    const tableNames = (tables as any[]).map((row) => Object.values(row)[0] as string);

    let structure = `Veritabanı: ${config.database}\n\nTablolar:\n\n`;

    // Get schema for each table
    for (const tableName of tableNames) {
      const [columns] = await connection.query(`DESCRIBE ${tableName}`);
      structure += `\nTablo: ${tableName}\n`;
      structure += `Kolonlar:\n`;

      (columns as any[]).forEach((col) => {
        structure += `  - ${col.Field} (${col.Type}) ${
          col.Null === "NO" ? "NOT NULL" : ""
        } ${col.Key === "PRI" ? "PRIMARY KEY" : ""}\n`;
      });

      // Get sample data count
      const [countResult] = await connection.query(
        `SELECT COUNT(*) as count FROM ${tableName}`
      );
      const count = (countResult as any[])[0].count;
      structure += `  Kayıt Sayısı: ${count}\n`;
    }

    return structure;
  } catch (error: any) {
    throw new Error(`Veritabanı yapısı alınamadı: ${error.message}`);
  } finally {
    if (connection) await connection.end();
  }
}
