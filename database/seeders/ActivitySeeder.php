<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Activity;
use App\Models\ActivityUpdate;
use App\Models\User;

class ActivitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
            $users = User::all();

    $activities = [
        'Daily SMS count vs logs',
        'Server uptime check',
        'Failed transaction review',
        'API response time monitoring',
        'Database backup verification',
    ];

    foreach ($activities as $name) {
        $activity = Activity::create([
            'name' => $name,
            'description' => "Track and verify: {$name}",
            'created_by' => $users->random()->id,
        ]);

        // simulate updates across the last 5 days
        foreach (range(0, 4) as $daysAgo) {
            ActivityUpdate::create([
                'activity_id' => $activity->id,
                'user_id' => $users->random()->id,
                'status' => collect(['done', 'pending'])->random(),
                'remark' => 'Checked and logged',
                'activity_date' => now()->subDays($daysAgo)->toDateString(),
            ]);
        }
    }

    }
}
