<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;

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
