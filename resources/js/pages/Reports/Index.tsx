import { useForm } from '@inertiajs/react';

export default function Index({ updates, from, to }) {
    const { data, setData, get, processing } = useForm({ from, to });

    const applyFilter = (e) => {
        e.preventDefault();
        get('/reports', { preserveState: true });
    };

    const exportCsv = () => {
        const headers = ['Date', 'Activity', 'Status', 'Remark', 'Updated By'];
        const rows = updates.map(u => [u.activity_date, u.activity.name, u.status, u.remark ?? '', u.user.name]);
        const csv = [headers, ...rows]
            .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
            .join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `activity-report-${from}-to-${to}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50">
                        Activity Report
                    </h1>
                    <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                        {updates.length} {updates.length === 1 ? 'update' : 'updates'} in range
                    </p>
                </div>
                <button
                    onClick={exportCsv}
                    disabled={updates.length === 0}
                    className="self-start rounded-md border border-neutral-200 px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-50 sm:self-auto dark:border-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-900"
                >
                    Export CSV
                </button>
            </div>

            <form
                onSubmit={applyFilter}
                className="mb-6 flex flex-col gap-3 rounded-lg border border-neutral-200 bg-white p-3 sm:flex-row sm:items-end dark:border-neutral-800 dark:bg-neutral-950"
            >
                <div className="flex-1">
                    <label className="mb-1 block text-xs font-medium text-neutral-500 dark:text-neutral-400">From</label>
                    <input
                        type="date"
                        value={data.from}
                        onChange={e => setData('from', e.target.value)}
                        className="w-full rounded-md border border-neutral-200 bg-white px-2 py-1.5 text-sm text-neutral-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-50"
                    />
                </div>
                <div className="flex-1">
                    <label className="mb-1 block text-xs font-medium text-neutral-500 dark:text-neutral-400">To</label>
                    <input
                        type="date"
                        value={data.to}
                        onChange={e => setData('to', e.target.value)}
                        className="w-full rounded-md border border-neutral-200 bg-white px-2 py-1.5 text-sm text-neutral-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-50"
                    />
                </div>
                <button
                    type="submit"
                    disabled={processing}
                    className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
                >
                    Filter
                </button>
            </form>

            <div className="overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-800">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-neutral-200 bg-neutral-50 text-left text-xs font-medium uppercase tracking-wide text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
                                <th className="px-4 py-2.5">Date</th>
                                <th className="px-4 py-2.5">Activity</th>
                                <th className="px-4 py-2.5">Status</th>
                                <th className="hidden px-4 py-2.5 sm:table-cell">Remark</th>
                                <th className="px-4 py-2.5">By</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                            {updates.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-4 py-8 text-center text-neutral-500 dark:text-neutral-400">
                                        No updates in this date range.
                                    </td>
                                </tr>
                            )}
                            {updates.map(u => (
                                <tr key={u.id} className="bg-white dark:bg-neutral-950">
                                    <td className="whitespace-nowrap px-4 py-2.5 text-neutral-500 dark:text-neutral-400">{u.activity_date}</td>
                                    <td className="px-4 py-2.5 font-medium text-neutral-900 dark:text-neutral-50">{u.activity.name}</td>
                                    <td className="px-4 py-2.5">
                                        <span
                                            className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                                u.status === 'done'
                                                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                                                    : 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
                                            }`}
                                        >
                                            {u.status}
                                        </span>
                                    </td>
                                    <td className="hidden px-4 py-2.5 text-neutral-500 sm:table-cell dark:text-neutral-400">{u.remark}</td>
                                    <td className="px-4 py-2.5 text-neutral-500 dark:text-neutral-400">{u.user.name}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}