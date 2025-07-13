import { Difficulties, expAmounts } from "@/app/addTask";
import { QuestType } from "@/types/quests";
import { CompletedTasksByExpAmountStats, CompletedTasksStats, Stats } from "@/types/stats";
import { getDiffToMonday, getFirstDayOfWeek } from "@/utils/getFirstDayOfWeek";
import db from "../db";

export const getAllStats = async (type: QuestType) => {
    try {
        const completedTasks: CompletedTasksStats[] = await db.getAllAsync(`SELECT COUNT(*) as count, is_repeatable FROM tasks WHERE done = 1 AND completed_at_date_string >= '${type === 'daily' ? (new Date()).toLocaleDateString() : getFirstDayOfWeek().toLocaleDateString()}' GROUP BY is_repeatable;`);
        const completedTasksByLevel: CompletedTasksByExpAmountStats[] = await db.getAllAsync(`SELECT COUNT(*) as count, exp_amount FROM tasks WHERE done = 1 AND exp_amount > 15 AND completed_at_date_string >= '${type === 'daily' ? (new Date()).toLocaleDateString() : getFirstDayOfWeek().toLocaleDateString()}' GROUP BY exp_amount;`);
        const experienceGained: {expGained: number} | null = await db.getFirstAsync(`SELECT SUM(exp_amount) as expGained FROM tasks WHERE done = 1 AND completed_at_date_string >= '${type === 'daily' ? (new Date()).toLocaleDateString() : getFirstDayOfWeek().toLocaleDateString()}';`);
        const expiredTasks: {count: number} | null = await db.getFirstAsync(`SELECT COUNT(*) as count FROM tasks WHERE is_expired = 1 AND completed_at_date_string >= '${type === 'daily' ? (new Date()).toLocaleDateString() : getFirstDayOfWeek().toLocaleDateString()}';`);

        const completedTasksTotal = completedTasks.reduce((acc: number, item: CompletedTasksStats) => acc + item.count, 0)

        const stats: Stats = {
            completedTasks: completedTasksTotal,
            completedSingleTimeTasks: completedTasks.find((item: CompletedTasksStats) => item.is_repeatable === 0)?.count || 0,
            completedRepeatableTasks: completedTasks.find((item: CompletedTasksStats) => item.is_repeatable === 1)?.count || 0,
            completedHardLevelTasks: completedTasksByLevel.find((item: CompletedTasksByExpAmountStats) => item.exp_amount === expAmounts[Difficulties.HARD])?.count || 0,
            completedInsaneLevelTasks: completedTasksByLevel.find((item: CompletedTasksByExpAmountStats) => item.exp_amount === expAmounts[Difficulties.INSANE])?.count || 0,
            experienceGained: experienceGained?.expGained || 0,
            expiredTasks: expiredTasks?.count || 0,
            tasksCompletedInTimePercentage: 100 - ((expiredTasks?.count || 0) / completedTasksTotal * 100),
            averageCompletedTasksDaily: type === 'daily' ? completedTasksTotal : Number((completedTasksTotal / getDiffToMonday()).toFixed(2)),
        }

        return stats;
    } catch (error) {
        console.log(error);
        return null;
    }
}