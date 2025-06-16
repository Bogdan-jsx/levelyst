import { getWeek } from 'date-fns';
import db from "../db";


export const initProfile = async (nickname: string) => {
    try {
        const weekNumber = getWeek(new Date(), {
            weekStartsOn: 1
        });
        await db.runAsync(`
            INSERT INTO profile
            (nickname, level, exp_gained, completed_singletime_tasks_weekly, completed_repeatable_tasks_weekly, completed_insane_tasks_weekly, exp_gained_weekly, achievements_gained_weekly, saved_week_number) 
            VALUES ($nickname, 1, 0, 0, 0, 0, 0, 0, $weekNum);   
        `, {$nickname: nickname, $weekNum: weekNumber})
    } catch (error) {
        console.log(error);
    }
}

export const checkAndResetWeeklyStats = async () => {
    try {
        const weekNumber = getWeek(new Date(), {
            weekStartsOn: 1
        });
        const user: any = await db.getFirstAsync("SELECT * FROM profile;");
        if (user.saved_week_number !== weekNumber) {
            await db.runAsync(`
                UPDATE profile
                SET completed_singletime_tasks_weekly = 0,
                completed_repeatable_tasks_weekly = 0,
                completed_insane_tasks_weekly = 0,
                exp_gained_weekly = 0,
                achievements_gained_weekly = 0,
                saved_week_number = $newWeekNum
            `, {$newWeekNum: weekNumber})
        }
    } catch (error) {
        console.log(error);
    }
}

export const getProfile = async () => {
    try {
        const result = await db.getFirstAsync("SELECT * FROM profile;");
        return result;
    } catch (error) {
        console.log(error);
    }
}

export const checkAndUpLevel = async () => {
    try {
        const profile: any = await db.getFirstAsync("SELECT * FROM profile;");
        if (profile.exp_gained >= profile.level * 150) {
            await db.runAsync("UPDATE profile SET level = level + 1, exp_gained = $newExpGained", {$newExpGained: profile.exp_gained - profile.level * 150})
        }
    } catch (error) {
        console.log(error);
    }
}