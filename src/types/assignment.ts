export interface Assignment {
  id: string;
  name: string;
  subject: string;
  description: string;
  deadline: Date;
  completed: boolean;
  createdAt: Date;
  color: SubjectColor;
  priority: Priority;
  reminderTime?: string; // Specific reminder time
}

export type SubjectColor = "coral" | "mint" | "lavender" | "peach" | "sky" | "rose" | "sage" | "amber";
export type Priority = "low" | "medium" | "high";
