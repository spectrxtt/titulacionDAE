<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Bachillerato extends Model
{
    use HasFactory;

    protected $table = 'bachillerato';

    protected $primaryKey = 'id_bach';

    protected $fillable = [
        'nombre_bach',
        'bach_entidad',  // Agregamos la nueva columna aquí
    ];

    public $timestamps = false; // Si no tienes columnas `created_at` y `updated_at`
}
