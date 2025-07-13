export type QuestType = 'weekly' | 'daily';

export interface Quest {
    id: number;
    template: string;
    title: string;
    progress: number;
    goal: number;
    done: 1 | 0;
    active: 1 | 0;
    basic_reward: number;
    reward: number;
    min_goal: number;
    max_goal: number;
    type: QuestType;
    related_to_field: string
}