export interface AddTask {
    title: string,
    expAmount: number,
    dueDate: Date,
    subtasks: string[],
    badges: number[],
    taskSampleId?: number
}

export interface AddTaskSample {
    title: string,
    expAmount: number,
    repeatEachDays: number,
    subtasks: string[],
    badges: number[],
}

export interface AddBadge {
    name: string,
}

export interface Task {
    id: number;
    title: string;
    exp_amount: number;
    due_date_string: string;
    created_at_date_string: string;
    completed_at_date_string: string;
    done: 1 | 0;
    is_repeatable: 1 | 0;
    is_expired: 1 | 0;
    task_sample_id: number;
    subtasks: Subtask[] | undefined;
    badges: Badge[] | undefined
}

export interface Subtask {
    id: number;
    title: string;
    done: 1 | 0;
    task_id: number;
}

export interface Badge {
    id: number;
    name: string;
}

export interface TaskSample {
    id: number;
    title: string;
    exp_amount: number;
    repeat_every_days: number;
    subtasks: Subtask[] | undefined;
    badges: Badge[] | undefined
}