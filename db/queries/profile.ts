import { Profile } from '@/types/profile';
import { getDayOfYear, getWeek } from 'date-fns';
import db from "../db";


export const initProfile = async (nickname: string) => {
    try {
        const weekNumber = getWeek(new Date(), {
            weekStartsOn: 1
        });
        await db.runAsync(`
            INSERT INTO profile
            (nickname, saved_week_number) 
            VALUES ($nickname, $weekNum);   
        `, {$nickname: nickname, $weekNum: weekNumber})
    } catch (error) {
        console.log(error);
    }
}

export const checkWeekDayNumber = async () => {
    try {
        const dayNumber = getDayOfYear(new Date());
        const weekNumber = getWeek(new Date(), {
            weekStartsOn: 1
        });

        await db.runAsync(`
            UPDATE profile
            SET saved_day_number = $newDayNum,
            saved_week_number = $newWeekNum
        `, {$newDayNum: dayNumber, $newWeekNum: weekNumber})
    } catch (error) {
        console.log(error);
    }
}

export const getProfile = async () => {
    try {
        const result: Profile | null = await db.getFirstAsync("SELECT * FROM profile;");
        return result;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export const checkAndUpLevel = async () => {
    try {
        const profile: Profile | null = await db.getFirstAsync("SELECT * FROM profile;");
        if (profile === null) return;
        
        if (profile.exp_gained >= profile.level * 150) {
            await db.runAsync("UPDATE profile SET level = level + 1, exp_gained = $newExpGained", {$newExpGained: profile.exp_gained - profile.level * 150})
        }
    } catch (error) {
        console.log(error);
    }
}

export const changeUsername = async (newVal: string) => {
    try {
        await db.runAsync("UPDATE profile SET nickname = $newVal", {$newVal: newVal});
    } catch (error) {
        console.log(error);
    }
}