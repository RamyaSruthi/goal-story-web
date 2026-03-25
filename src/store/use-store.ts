'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Goal, Task, JournalEntry } from '@/types';
import { createClient } from '@/lib/supabase/client';

interface StoreState {
  goals: Goal[];
  journals: JournalEntry[];
  userId: string | null;
  isLoading: boolean;
  reminderEnabled: boolean;
  reminderHour: number;

  timerGoal: Goal | null;
  timerTask: Task | null;
  openTimer: (goal: Goal, task?: Task | null) => void;
  closeTimer: () => void;

  setUserId: (id: string | null) => void;
  clearData: () => void;
  deleteAccount: () => Promise<void>;
  loadData: () => Promise<void>;

  addGoal: (goal: Omit<Goal, 'id' | 'createdAt' | 'tasks'>) => void;
  editGoal: (goalId: string, updates: Omit<Goal, 'id' | 'createdAt' | 'tasks'>) => void;
  deleteGoal: (goalId: string) => void;
  toggleGoalAchieved: (goalId: string) => void;
  toggleGoalArchived: (goalId: string, reason?: string) => void;

  addTask: (goalId: string, task: Omit<Task, 'id' | 'createdAt' | 'goalId' | 'done'>) => void;
  editTask: (goalId: string, taskId: string, updates: { title: string; estimatedMins: number }) => void;
  deleteTask: (goalId: string, taskId: string) => void;
  toggleTask: (goalId: string, taskId: string, doneJournalId?: string) => void;

  addJournal: (entry: Omit<JournalEntry, 'createdAt'>) => void;
  removeJournal: (journalId: string) => void;

  setReminderSettings: (enabled: boolean, hour: number) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      goals: [],
      journals: [],
      userId: null,
      isLoading: false,
      reminderEnabled: false,
      reminderHour: 9,

      timerGoal: null,
      timerTask: null,
      openTimer: (goal, task = null) => set({ timerGoal: goal, timerTask: task ?? null }),
      closeTimer: () => set({ timerGoal: null, timerTask: null }),

      setUserId: (id) => set({ userId: id }),

      clearData: () => set({ goals: [], journals: [], userId: null }),

      deleteAccount: async () => {
        const supabase = createClient();
        const userId = get().userId;
        if (!userId) return;
        await Promise.all([
          supabase.from('journals').delete().eq('user_id', userId),
          supabase.from('tasks').delete().eq('user_id', userId),
          supabase.from('goals').delete().eq('user_id', userId),
          supabase.from('user_settings').delete().eq('user_id', userId),
        ]);
        await supabase.rpc('delete_user');
        await supabase.auth.signOut();
        get().clearData();
      },

      setReminderSettings: (enabled, hour) => {
        const supabase = createClient();
        const userId = get().userId;
        set({ reminderEnabled: enabled, reminderHour: hour });
        supabase.from('user_settings').upsert({
          user_id: userId,
          reminder_enabled: enabled,
          reminder_hour: hour,
        }, { onConflict: 'user_id' });
      },

      loadData: async () => {
        const supabase = createClient();
        set({ isLoading: true });
        const [
          { data: goalsData },
          { data: tasksData },
          { data: journalsData },
          { data: settingsData },
        ] = await Promise.all([
          supabase.from('goals').select('*').order('created_at'),
          supabase.from('tasks').select('*').order('created_at'),
          supabase.from('journals').select('*').order('created_at', { ascending: false }),
          supabase.from('user_settings').select('*').single(),
        ]);

        type RawTask = { id: string; goal_id: string; title: string; estimated_mins: number; done: boolean; done_journal_id?: string; created_at: string };
        type RawGoal = { id: string; title: string; emoji: string; color: string; end_date?: string; achieved?: boolean; archived?: boolean; archive_reason?: string; created_at: string };
        type RawJournal = { id: string; goal_id: string; task_title: string; minutes_spent: number; note: string; date: string; created_at: string };

        const tasks = (tasksData ?? []) as RawTask[];
        const goals: Goal[] = ((goalsData ?? []) as RawGoal[]).map((g) => ({
          id: g.id,
          title: g.title,
          emoji: g.emoji,
          color: g.color,
          endDate: g.end_date ?? undefined,
          achieved: g.achieved ?? false,
          archived: g.archived ?? false,
          archiveReason: g.archive_reason ?? undefined,
          createdAt: g.created_at,
          tasks: tasks
            .filter((t) => t.goal_id === g.id)
            .map((t): Task => ({
              id: t.id,
              goalId: t.goal_id,
              title: t.title,
              estimatedMins: t.estimated_mins,
              done: t.done,
              doneJournalId: t.done_journal_id ?? undefined,
              createdAt: t.created_at,
            })),
        }));

        const journals: JournalEntry[] = ((journalsData ?? []) as RawJournal[]).map((j) => ({
          id: j.id,
          goalId: j.goal_id,
          taskTitle: j.task_title,
          minutesSpent: j.minutes_spent,
          note: j.note,
          date: j.date,
          createdAt: j.created_at,
        }));

        set({
          goals,
          journals,
          isLoading: false,
          reminderEnabled: settingsData?.reminder_enabled ?? false,
          reminderHour: settingsData?.reminder_hour ?? 9,
        });
      },

      addGoal: (goal) => {
        const supabase = createClient();
        const userId = get().userId;
        const id = crypto.randomUUID();
        const createdAt = new Date().toISOString();
        set((state) => ({ goals: [...state.goals, { ...goal, id, createdAt, tasks: [] }] }));
        supabase.from('goals').insert({
          id,
          user_id: userId,
          title: goal.title,
          emoji: goal.emoji,
          color: goal.color,
          end_date: goal.endDate ?? null,
          created_at: createdAt,
        }).then(({ error }) => {
          if (error) console.error('[addGoal]', error);
        });
      },

      editGoal: (goalId, updates) => {
        const supabase = createClient();
        set((state) => ({
          goals: state.goals.map((g) => g.id !== goalId ? g : { ...g, ...updates }),
        }));
        supabase.from('goals').update({
          title: updates.title,
          emoji: updates.emoji,
          color: updates.color,
          end_date: updates.endDate ?? null,
        }).eq('id', goalId);
      },

      deleteGoal: (goalId) => {
        const supabase = createClient();
        set((state) => ({
          goals: state.goals.filter((g) => g.id !== goalId),
          journals: state.journals.filter((j) => j.goalId !== goalId),
        }));
        Promise.all([
          supabase.from('tasks').delete().eq('goal_id', goalId),
          supabase.from('journals').delete().eq('goal_id', goalId),
        ]).then(() => {
          supabase.from('goals').delete().eq('id', goalId);
        });
      },

      toggleGoalAchieved: (goalId) => {
        const supabase = createClient();
        const goal = get().goals.find((g) => g.id === goalId);
        const achieved = !goal?.achieved;
        set((state) => ({
          goals: state.goals.map((g) => g.id !== goalId ? g : { ...g, achieved }),
        }));
        supabase.from('goals').update({ achieved }).eq('id', goalId).then();
      },

      toggleGoalArchived: (goalId, reason) => {
        const supabase = createClient();
        const goal = get().goals.find((g) => g.id === goalId);
        const archived = !goal?.archived;
        const archiveReason = archived ? (reason ?? '') : undefined;
        set((state) => ({
          goals: state.goals.map((g) => g.id !== goalId ? g : { ...g, archived, archiveReason }),
        }));
        supabase.from('goals').update({
          archived,
          archive_reason: archived ? (reason ?? null) : null,
        }).eq('id', goalId).then(({ error }) => {
          if (error) console.error('[toggleGoalArchived]', error);
        });
      },

      addTask: (goalId, task) => {
        const supabase = createClient();
        const userId = get().userId;
        const id = crypto.randomUUID();
        const createdAt = new Date().toISOString();
        set((state) => ({
          goals: state.goals.map((g) =>
            g.id === goalId
              ? { ...g, tasks: [...g.tasks, { ...task, id, goalId, done: false, createdAt }] }
              : g
          ),
        }));
        supabase.from('tasks').insert({
          id,
          goal_id: goalId,
          user_id: userId,
          title: task.title,
          estimated_mins: task.estimatedMins,
          done: false,
          created_at: createdAt,
        }).then(({ error }) => {
          if (error) console.error('[addTask]', error);
        });
      },

      deleteTask: (goalId, taskId) => {
        const supabase = createClient();
        const task = get().goals.find((g) => g.id === goalId)?.tasks.find((t) => t.id === taskId);
        set((state) => ({
          goals: state.goals.map((g) =>
            g.id !== goalId ? g : { ...g, tasks: g.tasks.filter((t) => t.id !== taskId) }
          ),
          journals: task?.doneJournalId
            ? state.journals.filter((j) => j.id !== task.doneJournalId)
            : state.journals,
        }));
        supabase.from('tasks').delete().eq('id', taskId).then(({ error }) => {
          if (error) console.error('[deleteTask]', error);
        });
        if (task?.doneJournalId) supabase.from('journals').delete().eq('id', task.doneJournalId).then();
      },

      editTask: (goalId, taskId, updates) => {
        const supabase = createClient();
        set((state) => ({
          goals: state.goals.map((g) =>
            g.id !== goalId ? g : {
              ...g,
              tasks: g.tasks.map((t) => t.id !== taskId ? t : { ...t, ...updates }),
            }
          ),
        }));
        supabase.from('tasks').update({
          title: updates.title,
          estimated_mins: updates.estimatedMins,
        }).eq('id', taskId).then(({ error }) => {
          if (error) console.error('[editTask]', error);
        });
      },

      toggleTask: (goalId, taskId, doneJournalId) => {
        const supabase = createClient();
        const goal = get().goals.find((g) => g.id === goalId);
        const task = goal?.tasks.find((t) => t.id === taskId);
        const markingDone = task ? !task.done : false;
        set((state) => ({
          goals: state.goals.map((g) => {
            if (g.id !== goalId) return g;
            return {
              ...g,
              tasks: g.tasks.map((t) =>
                t.id === taskId
                  ? { ...t, done: markingDone, doneJournalId: markingDone ? doneJournalId : undefined }
                  : t
              ),
            };
          }),
        }));
        supabase.from('tasks').update({
          done: markingDone,
          done_journal_id: markingDone ? (doneJournalId ?? null) : null,
        }).eq('id', taskId).then(({ error }) => {
          if (error) console.error('[toggleTask]', error);
        });
      },

      addJournal: (entry) => {
        const supabase = createClient();
        const userId = get().userId;
        const createdAt = new Date().toISOString();
        set((state) => ({
          journals: [{ ...entry, createdAt }, ...state.journals],
        }));
        supabase.from('journals').insert({
          id: entry.id,
          goal_id: entry.goalId,
          user_id: userId,
          task_title: entry.taskTitle,
          minutes_spent: entry.minutesSpent,
          note: entry.note,
          date: entry.date,
          created_at: createdAt,
        }).then(({ error }) => {
          if (error) console.error('[addJournal]', error);
        });
      },

      removeJournal: (journalId) => {
        const supabase = createClient();
        set((state) => ({
          journals: state.journals.filter((j) => j.id !== journalId),
        }));
        supabase.from('journals').delete().eq('id', journalId).then(({ error }) => {
          if (error) console.error('[removeJournal]', error);
        });
      },
    }),
    {
      name: 'gs-prefs',
      partialize: (state) => ({
        reminderEnabled: state.reminderEnabled,
        reminderHour: state.reminderHour,
      }),
    }
  )
);
