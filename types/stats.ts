export interface Stats {
    completedTasks: number,
    completedSingleTimeTasks: number,
    completedRepeatableTasks: number,
    completedHardLevelTasks: number,
    completedInsaneLevelTasks: number,
    experienceGained: number,
    expiredTasks: number,
    tasksCompletedInTimePercentage: number,
    averageCompletedTasksDaily: number,
}

export interface CompletedTasksStats {
    count: number;
    is_repeatable: 1 | 0;
}

export interface CompletedTasksByExpAmountStats {
    count: number;
    exp_amount: number;
}