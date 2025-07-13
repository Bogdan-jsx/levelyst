import { themesForDB } from "@/config/themesConfig";
import db from "./db";
import { checkWeekDayNumber, initProfile } from "./queries/profile";
import { initQuests, resetQuests } from "./queries/quests";
import { relaunchRepeatableTasks, setTasksExpired } from "./queries/tasks";
import { addTheme } from "./queries/themes";

export const initDB = async () => {
    await db.runAsync(`
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            exp_amount INTEGER DEFAULT 0,
            due_date_string TEXT,
            created_at_date_string TEXT,
            completed_at_date_string TEXT,
            done BOOLEAN DEFAULT false,
            is_repeatable BOOLEAN,
            is_expired BOOLEAN DEFAULT false,
            task_sample_id INTEGER DEFAULT 0
        );
    `);
    await db.runAsync(`
        CREATE TABLE IF NOT EXISTS task_samples (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            exp_amount INTEGER DEFAULT 0,
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
        CREATE TABLE IF NOT EXISTS sample_badges (
            sample_id INTEGER,
            badge_id INTEGER,
            PRIMARY KEY (sample_id, badge_id),
            FOREIGN KEY (sample_id) REFERENCES task_samples(id) ON DELETE CASCADE,
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
    await db.runAsync(`
        CREATE TABLE IF NOT EXISTS profile (
            nickname TEXT,
            level INTEGER DEFAULT 1,
            exp_gained INTEGER DEFAULT 0,
            coins INTEGER DEFAULT 0,
            saved_week_number INTEGER,
            saved_day_number INTEGER
        )
    `)
    await db.runAsync(`
        CREATE TABLE IF NOT EXISTS quests (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            template TEXT,
            title TEXT DEFAULT '',
            progress INTEGER DEFAULT 0,
            goal INTEGER DEFAULT 0,
            done BOOLEAN DEFAULT 0,
            active BOOLEAN DEFAULT 0,
            basic_reward INTEGER,
            reward FLOAT DEFAULT 0,
            min_goal INTEGER,
            max_goal INTEGER,
            type TEXT,
            related_to_field TEXT
        )
    `)
    await db.runAsync(`
        CREATE TABLE IF NOT EXISTS themes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            primary_color TEXT,
            secondary_color TEXT,
            surface_color TEXT,
            on_surface_color TEXT,
            background_color TEXT,
            price INTEGER,
            is_owned BOOLEAN DEFAULT false,
            name TEXT
        )
    `)
    
    // Init
    const profile = await db.getFirstAsync("SELECT * FROM profile;")
    if (!profile) await initProfile('Created nickname');

    const quests = await db.getAllAsync("SELECT * FROM quests;");
    if (quests.length <= 0) await initQuests();

    await relaunchRepeatableTasks();
    await resetQuests();
    await checkWeekDayNumber();
    await setTasksExpired();

    const allThemes = await db.getAllAsync("SELECT * FROM themes;")
    if (allThemes.length <= 0) {
        for (const theme of themesForDB) {
            await addTheme(theme);
        }
        await db.runAsync("UPDATE themes SET is_owned = 1 WHERE name = 'dark' OR name = 'light';")
    }
}