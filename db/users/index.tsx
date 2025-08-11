import * as SQLite from "expo-sqlite";

export type UserRow = {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
};

export type UpdateUserRow = {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
};

type DbResult<T> = {
  success: boolean;
  data?: T;
  error?: unknown;
};

const dbPromise = SQLite.openDatabaseAsync("databaseName");

const initializeUsersDb = async (): Promise<DbResult<null>> => {
  try {
    const db = await dbPromise;
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY NOT NULL,
        username TEXT NOT NULL UNIQUE,
        firstname TEXT NOT NULL UNIQUE,
        lastname TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      );
    `);
    await db.runAsync(
      `INSERT OR IGNORE INTO users (username, firstname, lastname, email, password)
       VALUES (?, ?, ?, ?, ?)`,
      "testuser",
      "Test",
      "User",
      "test@gmail.com",
      "123456"
    );
    return { success: true, data: null };
  } catch (error) {
    return { success: false, error };
  }
};

const registerUser = async (
  username: string,
  firstname: string,
  lastname: string,
  email: string,
  password: string
): Promise<DbResult<number>> => {
  try {
    const db = await dbPromise;
    const result = await db.runAsync(
      "INSERT INTO users (username, firstname, lastname, email, password) VALUES (?, ?, ?, ?, ?)",
      username,
      firstname,
      lastname,
      email,
      password
    );
    return { success: true, data: result.lastInsertRowId };
  } catch (error) {
    return { success: false, error };
  }
};

const loginUser = async (
  usernameOrEmail: string,
  password: string
): Promise<DbResult<number | undefined>> => {
  try {
    const db = await dbPromise;
    const result = await db.getFirstAsync<{ id: number }>(
      "SELECT id FROM users WHERE (username = ? OR email = ?) AND password = ?",
      usernameOrEmail,
      usernameOrEmail,
      password
    );
    return { success: true, data: result?.id };
  } catch (error) {
    return { success: false, error };
  }
};

const getUserById = async (
  id: number
): Promise<
  DbResult<
    | {
        id: number;
        username: string;
        firstname: string;
        lastname: string;
        email: string;
      }
    | undefined
  >
> => {
  try {
    const db = await dbPromise;
    const result = await db.getFirstAsync<{
      id: number;
      username: string;
      firstname: string;
      lastname: string;
      email: string;
    }>(
      "SELECT id, username, firstname, lastname, email FROM users WHERE id = ?",
      id
    );
    return { success: true, data: result === null ? undefined : result };
  } catch (error) {
    return { success: false, error };
  }
};

const getAllUserDataById = async (
  id: number
): Promise<
  DbResult<
    | {
        id: number;
        username: string;
        firstname: string;
        lastname: string;
        email: string;
        password: string;
      }
    | undefined
  >
> => {
  try {
    const db = await dbPromise;
    const result = await db.getFirstAsync<{
      id: number;
      username: string;
      firstname: string;
      lastname: string;
      email: string;
      password: string;
    }>(
      "SELECT id, username, firstname, lastname, email, password FROM users WHERE id = ?",
      id
    );
    return { success: true, data: result === null ? undefined : result };
  } catch (error) {
    return { success: false, error };
  }
};

const updateUserInfo = async (
  id: number,
  username: string,
  firstname: string,
  lastname: string,
  email: string,
  password: string
): Promise<DbResult<null>> => {
  try {
    const db = await dbPromise;
    await db.runAsync(
      "UPDATE users SET username = ?, firstname = ?, lastname = ?, email = ?, password = ? WHERE id = ?",
      username,
      firstname,
      lastname,
      email,
      password,
      id
    );
    return { success: true, data: null };
  } catch (error) {
    return { success: false, error };
  }
};

const deleteUserById = async (id: number): Promise<DbResult<null>> => {
  try {
    const db = await dbPromise;
    await db.runAsync("DELETE FROM users WHERE id = ?", id);
    return { success: true, data: null };
  } catch (error) {
    return { success: false, error };
  }
};

export {
  deleteUserById,
  getAllUserDataById,
  getUserById,
  initializeUsersDb,
  loginUser,
  registerUser,
  updateUserInfo,
};
