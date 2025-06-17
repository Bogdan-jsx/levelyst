import { themesForDB } from "@/theme/themesConfig";
import db from "./db";
import { checkAndResetDailyStats, checkAndResetWeeklyStats, initProfile } from "./queries/profile";
import { initQuests, resetQuests } from "./queries/quests";
import { relaunchRepeatableTasks } from "./queries/tasks";
import { addTheme } from "./queries/themes";

export const initDB = async () => {
    // await db.runAsync("DROP TABLE IF EXISTS profile;")
    // console.log(await db.getAllAsync("SELECt * FROM profile;"))
    await db.runAsync("UPDATE tasks SET done = 0 WHERE id > 0")
    // await db.runAsync("UPDATE quests SET active = 0 WHERE id > 0")

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
    await db.runAsync(`
        CREATE TABLE IF NOT EXISTS profile (
            nickname TEXT,
            level INTEGER DEFAULT 1,
            exp_gained INTEGER DEFAULT 0,
            coins INTEGER DEFAULT 0,
            completed_tasks_weekly INTEGER DEFAULT 0,
            completed_singletime_tasks_weekly INTEGER DEFAULT 0,
            completed_repeatable_tasks_weekly INTEGER DEFAULT 0,
            completed_insane_tasks_weekly INTEGER DEFAULT 0,
            completed_hard_tasks_weekly INTEGER DEFAULT 0,
            exp_gained_weekly INTEGER DEFAULT 0,
            achievements_gained_weekly INTEGER DEFAULT 0,
            completed_tasks_daily INTEGER DEFAULT 0,
            completed_singletime_tasks_daily INTEGER DEFAULT 0,
            completed_repeatable_tasks_daily INTEGER DEFAULT 0,
            completed_hard_tasks_daily INTEGER DEFAULT 0,
            exp_gained_daily INTEGER DEFAULT 0,
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
            main_color_to_display TEXT,
            secondary_color_to_display TEXT,
            last_color_to_display TEXT,
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
    await checkAndResetWeeklyStats();
    await checkAndResetDailyStats();
    await resetQuests();

    await db.runAsync("DELETE FROM themes;")

    const allThemes = await db.getAllAsync("SELECT * FROM themes;")
    if (allThemes.length <= 0) {
        for (const theme of themesForDB) {
            await addTheme(theme);
        }
        await db.runAsync("UPDATE themes SET is_owned = 1;")
    }
}