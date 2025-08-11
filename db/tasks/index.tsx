import * as SQLite from "expo-sqlite";

export type TaskRow = {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  completed: boolean;
};

type DbResult<T> = {
  success: boolean;
  data?: T;
  error?: unknown;
};

const dbPromise = SQLite.openDatabaseAsync("databaseName");

const initializeTasksDb = async (): Promise<DbResult<null>> => {
  try {
    const db = await dbPromise;
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        date TEXT,
        time TEXT,
        completed INTEGER NOT NULL DEFAULT 0
      );
    `);
    return { success: true, data: null };
  } catch (error) {
    return { success: false, error };
  }
};

const updateTask = async (
  id: number,
  title: string,
  description: string,
  date: string,
  time: string,
  completed: boolean
): Promise<DbResult<null>> => {
  try {
    const db = await dbPromise;
    await db.runAsync(
      "UPDATE tasks SET title = ?, description = ?, date = ?, time = ?, completed = ? WHERE id = ?",
      title,
      description,
      date,
      time,
      completed ? 1 : 0,
      id
    );
    return { success: true, data: null };
  } catch (error) {
    return { success: false, error };
  }
};

const addTask = async (
  title: string,
  description: string,
  date: string,
  time: string,
  completed: boolean = false
): Promise<DbResult<number>> => {
  try {
    const db = await dbPromise;
    const result = await db.runAsync(
      "INSERT INTO tasks (title, description, date, time, completed) VALUES (?, ?, ?, ?, ?)",
      title,
      description,
      date,
      time,
      completed ? 1 : 0
    );
    return { success: true, data: result.lastInsertRowId };
  } catch (error) {
    return { success: false, error };
  }
};

const updateTaskCompleted = async (
  id: number,
  completed: boolean
): Promise<DbResult<null>> => {
  try {
    const db = await dbPromise;
    await db.runAsync(
      "UPDATE tasks SET completed = ? WHERE id = ?",
      completed ? 1 : 0,
      id
    );
    return { success: true, data: null };
  } catch (error) {
    return { success: false, error };
  }
};

const deleteTaskById = async (id: number): Promise<DbResult<null>> => {
  try {
    const db = await dbPromise;
    await db.runAsync("DELETE FROM tasks WHERE id = ?", id);
    return { success: true, data: null };
  } catch (error) {
    return { success: false, error };
  }
};

const getTaskById = async (
  id: number
): Promise<DbResult<TaskRow | undefined>> => {
  try {
    const db = await dbPromise;
    const result = await db.getFirstAsync<TaskRow>(
      "SELECT * FROM tasks WHERE id = ?",
      id
    );
    return { success: true, data: result === null ? undefined : result };
  } catch (error) {
    return { success: false, error };
  }
};

const getAllTasks = async (): Promise<DbResult<TaskRow[]>> => {
  try {
    const db = await dbPromise;
    const rows = await db.getAllAsync<TaskRow>("SELECT * FROM tasks");
    return { success: true, data: rows };
  } catch (error) {
    return { success: false, error };
  }
};

export {
  addTask,
  deleteTaskById,
  getAllTasks,
  getTaskById,
  initializeTasksDb,
  updateTask,
  updateTaskCompleted,
};
