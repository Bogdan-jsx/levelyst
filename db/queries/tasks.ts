import { TaskSectionNames } from "@/app/(tabs)";
import db from "../db";

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

export const getAllUndoneTasks = async (type: TaskSectionNames) => {
    try {
        const tasks: any[] = await db.getAllAsync(`
            SELECT * 
            FROM tasks 
            WHERE done = false AND repeat_every_days IS${type === TaskSectionNames.REPEATABLE ? " NOT" : ""} NULL 
            ORDER BY due_date_string;`);
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