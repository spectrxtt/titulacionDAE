<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class programaEducativo extends Model
{
    use HasFactory;

    protected $table = 'programa_educativo';

    protected $primaryKey = 'id_programa_educativo';

    protected $fillable = [
        'programa_educativo',
    ];

    public $timestamps = false;


}
