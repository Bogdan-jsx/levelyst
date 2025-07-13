import { TaskSectionNames } from "@/app/(tabs)/index";
import { AddBadge, AddTask, AddTaskSample, Badge, Subtask, Task, TaskSample } from "@/types/tasks";
import db from "../db";



export const addTask = async (task: AddTask, isRepeatable: boolean) => {
    try {
        const result = await db.runAsync("INSERT INTO tasks (title, exp_amount, due_date_string, created_at_date_string, completed_at_date_string, is_repeatable, task_sample_id) VALUES ($title, $exp_amount, $due_date_string, $created_at_date_string, $completed_at_date_string, $is_repeatable, $task_sample_id);", 
            {$title: task.title, $exp_amount: task.expAmount, $due_date_string: task.dueDate.toLocaleDateString(), $created_at_date_string: new Date().toLocaleDateString(), $completed_at_date_string: '', $is_repeatable: isRepeatable, $task_sample_id: task.taskSampleId || 0});
        if (task?.subtasks?.length > 0) {
            await db.runAsync(`INSERT INTO subtasks (title, task_id) VALUES ${task.subtasks.map((item: string) => `("${item}", ${result.lastInsertRowId})`).join(', ')}`);
        }
        if (task?.badges?.length > 0) {
            await db.runAsync(`INSERT INTO tasks_badges (task_id, badge_id) VALUES ${task.badges.map((item: number) => `(${result.lastInsertRowId}, ${item})`).join(', ')}`);
        }
    } catch (error) {
        console.log(error);
    }   
}

export const addTaskSample = async (sample: AddTaskSample) => {
    try {
        const result = await db.runAsync("INSERT INTO task_samples (title, exp_amount, repeat_every_days) VALUES ($title, $exp_amount, $repeat_every_days);", 
            {$title: sample.title, $exp_amount: sample.expAmount, $repeat_every_days: sample.repeatEachDays});
        if (sample?.subtasks?.length > 0) {
            await db.runAsync(`INSERT INTO subtasks (title, task_id) VALUES ${sample.subtasks.map((item: string) => `("${item}", ${result.lastInsertRowId})`).join(', ')}`);
        }
        if (sample?.badges?.length > 0) {
            await db.runAsync(`INSERT INTO sample_badges (sample_id, badge_id) VALUES ${sample.badges.map((item: number) => `(${result.lastInsertRowId}, ${item})`).join(', ')}`);
        }
        const newTaskDate = new Date();
        newTaskDate.setDate(newTaskDate.getDate() + sample.repeatEachDays)
        await addTask({title: sample.title, expAmount: sample.expAmount, dueDate: newTaskDate, badges: sample.badges, subtasks: sample.subtasks, taskSampleId: result.lastInsertRowId}, true)
    } catch (error) {
        console.log(error);
    }   
}

export const getAllTasks = async (type: TaskSectionNames) => {
    try {
        const tasks: Task[] = await db.getAllAsync(`
            SELECT * 
            FROM tasks 
            WHERE is_repeatable = ${type === TaskSectionNames.REPEATABLE ? 1 : 0} ${type === TaskSectionNames.REPEATABLE ? "AND is_expired = 0" : "AND done = 0"}
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
       return [];
    }
}

export const toggleTaskDone = async (newValue: number, id: number, setSubtasks: boolean = true) => {
    try {
        await db.runAsync(`UPDATE tasks SET done = $newValue${newValue === 1 ? ", completed_at_date_string = '" + (new Date()).toLocaleDateString() + "'" : ""} WHERE id = $id`, {$id: id, $newValue: newValue})
        if (setSubtasks) {
            await db.runAsync(`UPDATE subtasks SET done = $newValue WHERE task_id = $id`, {$id: id, $newValue: newValue})
        }
        if (newValue === 1) {
            const task: Task | null = await db.getFirstAsync("SELECT * FROM tasks WHERE id = $id;", {$id: id});

            if (task === null) return;

            await db.runAsync("UPDATE profile SET exp_gained = exp_gained + $expAmount;", {$expAmount: task.exp_amount})
        }
    } catch (error) {
        console.log(error)
    }
}

export const toggleSubtaskDone = async (newValue: number, id: number, taskId: number) => {
    try {
        await db.runAsync(`UPDATE subtasks SET done = $newValue WHERE id = $id;`, {$newValue: newValue, $id: id})
        const subtasksUndone: Subtask[] = await db.getAllAsync("SELECT * FROM subtasks WHERE task_id = $taskId AND done = 0;", {$taskId: taskId});
        if (subtasksUndone.length > 0) {
            await toggleTaskDone(0, taskId, false);
        } else {
            await toggleTaskDone(1, taskId);
        }
    } catch (error) {
        console.log(error)
    }
}

export const addBadge = async (badge: AddBadge) => {
    try {
        await db.runAsync("INSERT INTO badges (name) VALUES ($name)", {$name: badge.name});
    } catch (error) {
        console.log(error);
    }   
}

export const getAllBadges = async () => {
    try {
        const result: Badge[] = await db.getAllAsync("SELECT * FROM badges;")
        return result;
    } catch (error) {
        console.log(error);
    }
}

export const relaunchRepeatableTask = async (sampleId: number) => {
    try {
        const sample: TaskSample | null = await db.getFirstAsync("SELECT * FROM task_samples WHERE id = $id;", {$id: sampleId})
        const latestTask: Task | null = await db.getFirstAsync("SELECT * FROM tasks WHERE task_sample_id = $id ORDER BY due_date_string;", {$id: sampleId});
        if (!latestTask || !sample) return;
        if (latestTask?.done === 0) {
            await db.runAsync("UPDATE tasks SET is_expired = 1 WHERE id = $id;", {$id: latestTask.id})
        }

        sample.subtasks = await db.getAllAsync("SELECT title, done, id FROM subtasks WHERE subtasks.task_id = $sample_id", {$taskId: sample.id});
        sample.badges = await db.getAllAsync(`
            SELECT badges.* 
            FROM badges
            INNER JOIN sample_badges
            ON tasks_badges.badge_id = badges.id
            WHERE tasks_badges.sample_id = $sampleId; 
        `, {$sampleId: sample.id})

        let newTaskDueDate = new Date(latestTask.due_date_string);
        do {
            newTaskDueDate.setDate(newTaskDueDate.getDate() + sample.repeat_every_days);
        } while (newTaskDueDate < new Date());
        
        await addTask({
            title: sample.title, 
            expAmount: sample.exp_amount, 
            dueDate: newTaskDueDate, 
            subtasks: sample.subtasks.map((item: Subtask) => item.title), 
            badges: sample.badges.map((item: Badge) => item.id),
            taskSampleId: sample.id}, 
            true)
    } catch (error) {
        console.log(error);
    }
}

export const relaunchRepeatableTasks = async () => {
    try {
        const repeatableTasksSamples: TaskSample[] = await db.getAllAsync("SELECT * FROM task_samples;");
        for (const sample of repeatableTasksSamples) {  
            const latestTask: Task | null = await db.getFirstAsync("SELECT * FROM tasks WHERE task_sample_id = $id ORDER BY due_date_string;", {$id: sample.id});
            if (!latestTask) continue;
            if (new Date(latestTask.due_date_string) < new Date()) {
                await relaunchRepeatableTask(sample.id)
            }
        }   
    } catch (error) {
        console.log(error);
    }
}

export const setTasksExpired = async () => {
    try {
        await db.runAsync(`UPDATE tasks SET is_expired = 1 WHERE due_date_string < '${new Date().toLocaleDateString()}';`)
    } catch (error) {
        console.log(error)
    }
}