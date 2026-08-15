<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use App\Models\ActivityUpdate;
use Inertia\Inertia;
use Illuminate\Http\Request;


class ActivityController extends Controller
{
    public function index()
    {
        $today = today()->toDateString();

        $activities = Activity::with(['updates' => function ($q) use ($today) {
            $q->where('activity_date', $today)->with('user')->latest();
        }])->get();


        return Inertia::render('Activities/Index', [
        'activities' => $activities,
        'scope' => 'today',
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        Activity::create([
            ...$validated,
            'created_by' => $request->user()->id,
        ]);

        return redirect()->back();
    }

    public function update(Request $request, Activity $activity)
    {
        $validated = $request->validate([
            'status' => 'required|in:done,pending',
            'remark' => 'nullable|string',
        ]);

        $activity->updates()->create([
            ...$validated,
            'user_id' => $request->user()->id,
            'activity_date' => today()->toDateString(),
        ]);

        return redirect()->back();
    }
    public function report(Request $request)
    {
        $from = $request->input('from', today()->subDays(7)->toDateString());
        $to = $request->input('to', today()->toDateString());

        $updates = ActivityUpdate::with(['activity', 'user'])
            ->whereBetween('activity_date', [$from, $to])
            ->latest('activity_date')
            ->get();

        return Inertia::render('Reports/Index', [
            'updates' => $updates,
            'from' => $from,
            'to' => $to,
        ]);
    }
    public function manage()
    {
    $activities = Activity::with(['updates' => function ($q) {
        $q->latest()->limit(1)->with('user');
    }])->get();

    return Inertia::render('Activities/Index', [
        'activities' => $activities,
        'scope' => 'all',
    ]);
    }
}

