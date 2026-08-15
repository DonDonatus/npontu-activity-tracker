<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Don D',
            'email' => 'donatus@example.com',
            'password' => bcrypt('password'),
        ]);

        User::factory(4)->create();
    }
}
