import db from "./db";
import { relaunchRepeatableTasks } from "./queries/tasks";

export const initDB = async () => {
    await db.runAsync("UPDATE tasks SET done = 0 WHERE id > 0")
    await db.runAsync(`
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            exp_amount INTEGER DEFAULT 0,
            due_date_string TEXT,
            done BOOLEAN DEFAULT false,
            repeat_every_days INTEGER
        );
    `);
    await db.runAsync(`
        CREATE TABLE IF NOT EXISTS badges (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL
        );
    `);
    await db.runAsync(`
        CREATE TABLE IF NOT EXISTS tasks_badges (
            task_id INTEGER,
            badge_id INTEGER,
            PRIMARY KEY (task_id, badge_id),
            FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
            FOREIGN KEY (badge_id) REFERENCES badges(id) ON DELETE CASCADE
        );
    `)
    await db.runAsync(`
        CREATE TABLE IF NOT EXISTS subtasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            done BOOLEAN DEFAULT false,
            task_id INTEGER
        );  
    `)
    await relaunchRepeatableTasks();
}