import { getDayOfYear, getWeek } from "date-fns";
import dailyQuests from "../dailyQuestsConfig.json";
import db from "../db";
import weeklyQuests from "../weeklyQuestsConfig.json";

function getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

export const initQuests = async () => {
    try {
        await db.runAsync(`
            INSERT INTO quests
            (template, basic_reward, min_goal, max_goal, type, related_to_field)
            VALUES ${[...dailyQuests.map((item) => `('${item.template}', ${item.basic_reward}, ${item.min_goal}, ${item.max_goal}, 'daily', '${item.related_to_field}')`), ...weeklyQuests.map((item) => `('${item.template}', ${item.basic_reward}, ${item.min_goal}, ${item.max_goal}, 'weekly', '${item.related_to_field}')`)].join(', ')};
        `)
    } catch (error) {
        console.log(error);
    }
}

export const setActiveQuests = async (type: 'daily' | 'weekly') => {
    try {
        const quests: object[] = await db.getAllAsync("SELECT * FROM quests WHERE type = $type;", {$type: type});
        for (let i = 0; i < 3; i++) {
            const index = getRandomInt(0, quests.length-1);
            const quest: any = {...quests[index]};
            quests.splice(index, 1);
            quest.goal = getRandomInt(quest.min_goal, quest.max_goal);
            quest.title = quest.template.replace('*template*', quest.goal);
            quest.reward = Math.round(quest.basic_reward * quest.goal);
            await db.runAsync(`
                UPDATE quests
                SET title = $title,
                progress = 0,
                goal = $goal,
                done = 0,
                active = 1,
                reward = $reward
                WHERE id = $id;
            `, {$title: quest.title, $goal: quest.goal, $reward: quest.reward, $id: quest.id})
        }
    } catch (error) {
        console.log(error);
    }
}

export const updateQuestsStatus = async () => {
    try {
        const activeQuests: any[] = await db.getAllAsync("SELECT * FROM quests WHERE active = 1 AND done = 0;");
        const profile: any = await db.getFirstAsync("SELECT * FROM profile;")
        for (const quest of activeQuests) {
            quest.progress = profile[quest.related_to_field];
            if (quest.progress >= quest.goal) {
                quest.done = 1;
                quest.progress = quest.goal;
                await db.runAsync("UPDATE profile SET coins = coins + $reward;", {$reward: quest.reward});
            }
            await db.runAsync("UPDATE quests SET done = $done, progress = $progress WHERE id = $id;", {$done: quest.done, $progress: quest.progress, $id: quest.id})
        }
    } catch (error) {
        console.log(error);
    }
}

export const resetQuests = async () => {
    try {
        const profile: any = await db.getFirstAsync("SELECT saved_week_number, saved_day_number FROM profile;");
        const activeDailyQuests = await db.getAllAsync("SELECT * FROM quests WHERE type = 'daily' AND active = 1;");
        const activeWeeklyQuests = await db.getAllAsync("SELECT * FROM quests WHERE type = 'weekly' AND active = 1;");
        const weekNumber = getWeek(new Date(), {
            weekStartsOn: 1
        });
        const dayNumber = getDayOfYear(new Date());

        if (profile.saved_week_number !== weekNumber || activeWeeklyQuests.length <= 0) {
            await setActiveQuests('weekly');
        }
        if (profile.saved_day_number !== dayNumber || activeDailyQuests.length <= 0) {
            await setActiveQuests('daily');
        }

        await db.runAsync("UPDATE profile SET saved_week_number = $weekNumber, saved_day_number = $dayNumber;", {$weekNumber: weekNumber, $dayNumber: dayNumber});
    } catch (error) {
        console.log(error);
    }
}

export const getQuests = async (type: 'daily' | 'weekly') => {
    try {
        const result = await db.getAllAsync("SELECT * FROM quests WHERE active = 1 AND type = $type;", {$type: type});
        return result;
    } catch (error) {
        console.log(error)
    }
}