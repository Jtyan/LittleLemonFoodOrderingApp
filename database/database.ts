import { MenuItemType } from "@/hooks/useMenuData";
import * as SQLite from "expo-sqlite";


const DB_NAME = "little_lemon";
let _db: SQLite.SQLiteDatabase | null = null;

const getDb = async () => {
  if (!_db) {
    _db = await SQLite.openDatabaseAsync(DB_NAME);
  }
  return _db;
};

export const initDatabase = async () => {
  const db = await getDb();
  await db.execAsync(
    `CREATE TABLE IF NOT EXISTS menu (
        id INTEGER PRIMARY KEY NOT NULL, 
        name TEXT NOT NULL, 
        price TEXT, 
        description TEXT, 
        image TEXT, 
        category TEXT
    );`
  );
};

export const getMenuFromDb = async() => {
    const db = await getDb()
    const result = await db.getAllAsync<MenuItemType>(`SELECT * FROM menu`)
    return result
}

export const saveMenuinDb = async(menu: MenuItemType[]) => {
    const db = await getDb()
    await db.withTransactionAsync(async() => {
        const insertSql = `INSERT INTO menu (id, name, price, description, image, category) VALUES(?, ?, ?, ?, ?, ?);`
        for (const item of menu) {
            await db.runAsync(insertSql, [
                item.id,
                item.name,
                item.price,
                item.description,
                item.image,
                item.category
            ])
        }
    })
}