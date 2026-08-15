<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ActivityController;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [ActivityController::class, 'index'])->name('dashboard');
    Route::get('/activities', [ActivityController::class, 'manage'])->name('activities.index');
    Route::post('/activities',[ActivityController::class,'store'])->name('activities.store');
    Route::post('/activities/{activity}/updates',[ActivityController::class,'update'])->name('activities.updates');
    Route::get('/reports',[ActivityController::class,'report'])->name('reports.index');
});

require __DIR__.'/settings.php';
