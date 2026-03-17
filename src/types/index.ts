export interface Task {
  id: string;
  goalId: string;
  title: string;
  estimatedMins: number;
  done: boolean;
  doneJournalId?: string;
  createdAt: string;
}

export interface Goal {
  id: string;
  title: string;
  emoji: string;
  color: string;
  tasks: Task[];
  createdAt: string;
  endDate?: string;
  achieved?: boolean;
  archived?: boolean;
  archiveReason?: string;
}

export interface JournalEntry {
  id: string;
  goalId: string;
  taskTitle: string;
  minutesSpent: number;
  note: string;
  date: string; // YYYY-MM-DD
  createdAt: string;
}
