import { Difficulties, expAmounts } from "@/app/addTask";
import { getDiffToMonday, getFirstDayOfWeek } from "@/utils/getFirstDayOfWeek";
import db from "../db";


export const getAllStats = async (type: 'daily' | 'weekly' ) => {
    try {
        const completedTasks = await db.getAllAsync(`SELECT COUNT(*) as count, is_repeatable FROM tasks WHERE done = 1 AND completed_at_date_string >= '${type === 'daily' ? (new Date()).toLocaleDateString() : getFirstDayOfWeek().toLocaleDateString()}' GROUP BY is_repeatable;`);
        const completedTasksByLevel = await db.getAllAsync(`SELECT COUNT(*) as count, exp_amount FROM tasks WHERE done = 1 AND exp_amount > 15 AND completed_at_date_string >= '${type === 'daily' ? (new Date()).toLocaleDateString() : getFirstDayOfWeek().toLocaleDateString()}' GROUP BY exp_amount;`);
        const experienceGained = await db.getFirstAsync(`SELECT SUM(exp_amount) as expGained FROM tasks WHERE done = 1 AND completed_at_date_string >= '${type === 'daily' ? (new Date()).toLocaleDateString() : getFirstDayOfWeek().toLocaleDateString()}';`);
        const expiredTasks = await db.getFirstAsync(`SELECT COUNT(*) as count FROM tasks WHERE is_expired = 1 AND completed_at_date_string >= '${type === 'daily' ? (new Date()).toLocaleDateString() : getFirstDayOfWeek().toLocaleDateString()}';`);

        const completedTasksTotal = completedTasks.reduce((acc: number, item: any) => acc + item.count, 0)

        const stats = {
            completedTasks: completedTasksTotal,
            completedSingleTimeTasks: (completedTasks.find((item: any) => item.is_repeatable === 0) as any)?.count || 0,
            completedRepeatableTasks: (completedTasks.find((item: any) => item.is_repeatable === 1) as any)?.count || 0,
            completedHardLevelTasks: (completedTasksByLevel.find((item: any) => item.exp_amount === expAmounts[Difficulties.HARD]) as any)?.count || 0,
            completedInsaneLevelTasks: (completedTasksByLevel.find((item: any) => item.exp_amount === expAmounts[Difficulties.INSANE]) as any)?.count || 0,
            experienceGained: (experienceGained as any)?.expGained || 0,
            expiredTasks: (expiredTasks as any)?.count || 0,
            tasksCompletedInTimePercentage: 100 - (((expiredTasks as any)?.count || 0) / completedTasksTotal * 100),
            averageCompletedTasksDaily: type === 'daily' ? completedTasksTotal : (completedTasksTotal / getDiffToMonday()).toFixed(2),
        }

        return stats;
    } catch (error) {
        console.log(error)
    }
}