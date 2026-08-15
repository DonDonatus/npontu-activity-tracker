<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ActivityUpdate extends Model
{
    protected $fillable = ['activity_id', 'user_id', 'status', 'remark', 'activity_date'];

    protected $casts = [
        'activity_date' => 'date:Y-m-d',
    ];

    public function activity()
    {
        return $this->belongsTo(Activity::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}