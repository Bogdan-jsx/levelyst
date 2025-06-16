import { TaskSectionNames } from "@/app/(tabs)";
import { Difficulties, expAmounts } from "@/app/addTask";
import db from "../db";
import { checkAndUpLevel } from "./profile";

interface Task {
    title: string,
    expAmount: number,
    dueDate: Date,
    subtasks: string[],
    badges: number[],
    repeatEveryDays: number | null;
}

interface Badge {
    name: string,
}

export const addTask = async (task: Task) => {
    try {
        const result = await db.runAsync("INSERT INTO tasks (title, exp_amount, due_date_string, repeat_every_days) VALUES ($title, $exp_amount, $due_date_string, $repeat_every_days);", 
            {$title: task.title, $exp_amount: task.expAmount, $due_date_string: task.dueDate.toLocaleDateString(), $repeat_every_days: task.repeatEveryDays});
        if (task?.subtasks?.length > 0) {
            await db.runAsync(`INSERT INTO subtasks (title, task_id) VALUES ${task.subtasks.map((item: string) => `("${item}", ${result.lastInsertRowId})`).join(', ')}`);
        }
        if (task?.badges?.length > 0) {
            await db.runAsync(`INSERT INTO tasks_badges (task_id, badge_id) VALUES ${task.badges.map((item: number) => `(${result.lastInsertRowId}, "${item}")`).join(', ')}`);
        }
    } catch (error) {
        console.log(error);
    }   
}

export const getAllTasks = async (type: TaskSectionNames) => {
    try {
        const tasks: any[] = await db.getAllAsync(`
            SELECT * 
            FROM tasks 
            WHERE repeat_every_days IS${type === TaskSectionNames.REPEATABLE ? " NOT" : ""} NULL ${type === TaskSectionNames.REPEATABLE ? "" : "AND done = 0"}
            ORDER BY done DESC, due_date_string;`);
        for (const task of tasks) {
            task.subtasks = await db.getAllAsync("SELECT title, done, id FROM subtasks WHERE subtasks.task_id = $taskId", {$taskId: task.id});
            task.badges = await db.getAllAsync(`
                SELECT badges.* 
                FROM badges
                INNER JOIN tasks_badges
                ON tasks_badges.badge_id = badges.id
                WHERE tasks_badges.task_id = $taskId; 
            `, {$taskId: task.id})
        }
        return tasks;
    } catch (error) {
       console.log(error);
    }
}

export const toggleTaskDone = async (newValue: number, id: number, setSubtasks: boolean = true) => {
    try {
        await db.runAsync(`UPDATE tasks SET done = $newValue WHERE id = $id`, {$id: id, $newValue: newValue})
        if (setSubtasks) {
            await db.runAsync(`UPDATE subtasks SET done = $newValue WHERE task_id = $id`, {$id: id, $newValue: newValue})
        }
        if (newValue === 1) {
            const task: any = await db.getFirstAsync("SELECT * FROM tasks WHERE id = $id", {$id: id});
            const fieldType = `completed_${task.repeat_every_days === null ? 'repeatable' : 'singletime'}_tasks_weekly`
            await db.runAsync(`UPDATE profile SET ${fieldType} = ${fieldType} + 1, exp_gained_weekly = exp_gained_weekly + $expAmount, exp_gained = exp_gained + $expAmount;`, {$expAmount: task.exp_amount})
            if (task.exp_amount === expAmounts[Difficulties.INSANE]) {
                await db.runAsync("UPDATE profile SET completed_insane_tasks_weekly = completed_insane_tasks_weekly + 1;")
            }
            await checkAndUpLevel();
        }
    } catch (error) {
        console.log(error)
    }
}

export const toggleSubtaskDone = async (newValue: number, id: number, taskId: number) => {
    try {
        await db.runAsync(`UPDATE subtasks SET done = $newValue WHERE id = $id;`, {$newValue: newValue, $id: id})
        const subtasksUndone = await db.getAllAsync("SELECT * FROM subtasks WHERE task_id = $taskId AND done = 0;", {$taskId: taskId});
        if (subtasksUndone.length > 0) {
            await toggleTaskDone(0, taskId, false);
        } else {
            await toggleTaskDone(1, taskId);
        }
    } catch (error) {
        console.log(error)
    }
}

export const addBadge = async (badge: Badge) => {
    try {
        await db.runAsync("INSERT INTO badges (name) VALUES ($name)", {$name: badge.name});
    } catch (error) {
        console.log(error);
    }   
}

export const getAllBadges = async () => {
    try {
        const result = await db.getAllAsync("SELECT * FROM badges;")
        return result;
    } catch (error) {
        console.log(error);
    }
}

export const relaunchRepeatableTasks = async () => {
    try {
        const repeatableTasks: any = await db.getAllAsync("SELECT * FROM tasks WHERE repeat_every_days IS NOT NULL;")
        for (const task of repeatableTasks) {
            if (new Date(task.due_date_string) <= new Date()) {
                do {
                    const temp = new Date(task.due_date_string);
                    temp.setDate(temp.getDate() + task.repeat_every_days);
                    task.due_date_string = temp.toLocaleDateString();
                } while (new Date(task.due_date_string) <= new Date());
                await db.runAsync("UPDATE tasks SET due_date_string = $dateString WHERE id = $id", {$dateString: task.due_date_string, $id: task.id})
            }
        }
    } catch (error) {
        console.log(error);
    }
}