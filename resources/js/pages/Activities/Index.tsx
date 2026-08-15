import { useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';

interface ActivityUser {
    id: number;
    name: string;
}

interface ActivityUpdate {
    id: number;
    status: 'pending' | 'done';
    remark: string | null;
    activity_date: string;
    user: ActivityUser;
}

interface Activity {
    id: number;
    name: string;
    description: string | null;
    updates: ActivityUpdate[];
}

interface IndexProps {
    activities: Activity[];
    scope?: 'today' | 'all';
}

export default function Index({ activities, scope = 'all' }: IndexProps) {
    const { data, setData, post, reset, processing } = useForm({
        name: '',
        description: '',
    });
    const isToday = scope === 'today';

    const addActivity = (e: FormEvent) => {
        e.preventDefault();
        post('/activities', { onSuccess: () => reset() });
    };

    return (
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-6">
                <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50">
                    {isToday ? "Today's Activities" : 'All Activities'}
                </h1>
                <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                    {isToday
                        ? 'Daily handover view — status updates logged today'
                        : `${activities.length} ${activities.length === 1 ? 'activity' : 'activities'} tracked`}
                </p>
            </div>

            <form onSubmit={addActivity} className="mb-6 flex gap-2">
                <input
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    placeholder="Add a new activity…"
                    className="flex-1 rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-50"
                />
                <button
                    type="submit"
                    disabled={processing || !data.name}
                    className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
                >
                    Add
                </button>
            </form>

            <div className="flex flex-col divide-y divide-neutral-200 rounded-lg border border-neutral-200 dark:divide-neutral-800 dark:border-neutral-800">
                {activities.length === 0 && (
                    <p className="px-4 py-8 text-center text-sm text-neutral-500 dark:text-neutral-400">
                        No activities yet — add one above to get started.
                    </p>
                )}
                {activities.map((activity) => (
                    <ActivityRow key={activity.id} activity={activity} />
                ))}
            </div>
        </div>
    );
}

function ActivityRow({ activity }: { activity: Activity }) {
    const { data, setData, post, reset, processing } = useForm({
        status: 'pending',
        remark: '',
    });
    const latest = activity.updates[0];
    const isDone = latest?.status === 'done';

    const submitUpdate = (e: FormEvent) => {
        e.preventDefault();
        post(`/activities/${activity.id}/updates`, {
            onSuccess: () => reset(),
            onError: (errors) => console.log('Update failed:', errors),
        });
    };

    return (
        <div
            className={`flex flex-col gap-3 border-l-4 bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between dark:bg-neutral-950 ${
                isDone ? 'border-l-emerald-500' : 'border-l-amber-400'
            }`}
        >
            <div className="min-w-0">
                <div className="flex items-center gap-2">
                    <h2 className="truncate font-medium text-neutral-900 dark:text-neutral-50">
                        {activity.name}
                    </h2>
                    {latest && (
                        <span
                            className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                                isDone
                                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                                    : 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
                            }`}
                        >
                            {latest.status}
                        </span>
                    )}
                </div>
                {activity.description && (
                    <p className="mt-0.5 truncate text-sm text-neutral-500 dark:text-neutral-400">
                        {activity.description}
                    </p>
                )}
                {latest && (
                    <p className="mt-1 text-xs text-neutral-400 dark:text-neutral-500">
                        {latest.user.name} · {latest.remark || 'no remark'}
                    </p>
                )}
            </div>

            <form
                onSubmit={submitUpdate}
                className="flex shrink-0 gap-2 sm:w-auto"
            >
                <select
                    value={data.status}
                    onChange={(e) =>
                        setData('status', e.target.value as 'pending' | 'done')
                    }
                    className="rounded-md border border-neutral-200 bg-white px-2 py-1.5 text-sm text-neutral-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300"
                >
                    <option value="pending">Pending</option>
                    <option value="done">Done</option>
                </select>
                <input
                    value={data.remark}
                    onChange={(e) => setData('remark', e.target.value)}
                    placeholder="Remark"
                    className="w-28 rounded-md border border-neutral-200 bg-white px-2 py-1.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none sm:w-36 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-50"
                />
                <button
                    type="submit"
                    disabled={processing}
                    className="rounded-md bg-neutral-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-neutral-700 disabled:opacity-50 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-300"
                >
                    Update
                </button>
            </form>
        </div>
    );
}
