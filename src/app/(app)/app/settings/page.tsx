'use client';

import { useState } from 'react';
import { useStore } from '@/store/use-store';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Sun, Moon, Bell, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

function SettingRow({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-4" style={{ borderBottom: '1px solid var(--gs-border)' }}>
      <div>
        <p className="text-sm font-medium" style={{ color: 'var(--gs-text)' }}>{label}</p>
        {description && <p className="text-xs mt-0.5" style={{ color: 'var(--gs-text-dim)' }}>{description}</p>}
      </div>
      {children}
    </div>
  );
}

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { deleteAccount, reminderEnabled, reminderHour, setReminderSettings } = useStore();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteAccount();
      toast.success('Account deleted');
    } catch {
      toast.error('Failed to delete account');
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-8 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="font-black tracking-tight" style={{ fontSize: 36, letterSpacing: '-0.03em', color: 'var(--gs-text)' }}>Settings</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--gs-text-sub)' }}>Manage your preferences</p>
      </div>

      {/* Appearance */}
      <div className="rounded-2xl border overflow-hidden mb-6" style={{ background: 'var(--gs-card)', borderColor: 'var(--gs-border)' }}>
        <div className="px-5 py-3 border-b" style={{ borderColor: 'var(--gs-border)' }}>
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--gs-text-dim)' }}>Appearance</p>
        </div>
        <div className="px-5">
          <SettingRow label="Theme" description="Choose your preferred color scheme">
            <div className="flex rounded-xl p-1 gap-1" style={{ background: 'var(--gs-card2)' }}>
              <button
                onClick={() => setTheme('light')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                style={{
                  background: theme === 'light' ? 'var(--gs-accent)' : 'transparent',
                  color: theme === 'light' ? '#fff' : 'var(--gs-text-sub)',
                }}
              >
                <Sun size={13} /> Light
              </button>
              <button
                onClick={() => setTheme('dark')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                style={{
                  background: theme === 'dark' ? 'var(--gs-accent)' : 'transparent',
                  color: theme === 'dark' ? '#fff' : 'var(--gs-text-sub)',
                }}
              >
                <Moon size={13} /> Dark
              </button>
            </div>
          </SettingRow>
        </div>
      </div>

      {/* Reminders */}
      <div className="rounded-2xl border overflow-hidden mb-6" style={{ background: 'var(--gs-card)', borderColor: 'var(--gs-border)' }}>
        <div className="px-5 py-3 border-b" style={{ borderColor: 'var(--gs-border)' }}>
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--gs-text-dim)' }}>Notifications</p>
        </div>
        <div className="px-5">
          <SettingRow
            label="Daily reminder"
            description={reminderEnabled ? `Remind me at ${String(reminderHour).padStart(2, '0')}:00` : 'Get a daily nudge to work on your goals'}
          >
            <button
              onClick={() => setReminderSettings(!reminderEnabled, reminderHour)}
              className="relative w-11 h-6 rounded-full transition-colors shrink-0"
              style={{ background: reminderEnabled ? 'var(--gs-accent)' : 'var(--gs-card2)' }}
            >
              <span
                className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200"
                style={{ transform: reminderEnabled ? 'translateX(20px)' : 'translateX(0)' }}
              />
            </button>
          </SettingRow>

          {reminderEnabled && (
            <div className="pb-4 pt-1">
              <div className="flex items-center gap-4">
                <Bell size={14} style={{ color: 'var(--gs-text-dim)' }} />
                <input
                  type="range"
                  min={0}
                  max={23}
                  value={reminderHour}
                  onChange={(e) => setReminderSettings(reminderEnabled, parseInt(e.target.value))}
                  className="flex-1"
                  style={{ accentColor: 'var(--gs-accent)' }}
                />
                <span
                  className="text-sm font-semibold tabular-nums w-14 text-center px-2 py-1 rounded-lg"
                  style={{ background: 'var(--gs-card2)', color: 'var(--gs-text)' }}
                >
                  {String(reminderHour).padStart(2, '0')}:00
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Danger zone */}
      <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.03)' }}>
        <div className="px-5 py-3 border-b" style={{ borderColor: 'rgba(239,68,68,0.15)' }}>
          <p className="text-xs font-semibold uppercase tracking-widest text-red-500">Danger zone</p>
        </div>
        <div className="px-5">
          <SettingRow
            label="Delete account"
            description="Permanently delete your account and all data. This cannot be undone."
          >
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setDeleteOpen(true)}
              className="gap-1.5 rounded-xl shrink-0"
            >
              <Trash2 size={13} /> Delete
            </Button>
          </SettingRow>
        </div>
      </div>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent style={{ background: 'var(--gs-card2)', borderColor: 'var(--gs-border)' }}>
          <AlertDialogHeader>
            <AlertDialogTitle style={{ color: 'var(--gs-text)' }}>Delete account?</AlertDialogTitle>
            <AlertDialogDescription style={{ color: 'var(--gs-text-dim)' }}>
              This will permanently delete all your goals, tasks, and journal entries. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel style={{ background: 'var(--gs-input-bg)', color: 'var(--gs-text)', border: 'none' }}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleting} className="bg-red-600 hover:bg-red-700 text-white">
              {deleting ? 'Deleting…' : 'Yes, delete everything'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
