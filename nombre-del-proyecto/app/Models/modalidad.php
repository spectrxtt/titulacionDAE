<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class modalidad extends Model
{
    use HasFactory;

    protected $table = 'modalidad_titulacion';

    protected $primaryKey = 'id_modalidad';

    protected $fillable = [
        'modalidad_titulacion',
    ];

    public $timestamps = false;

}
