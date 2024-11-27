<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Estudiante extends Model
{
    use HasFactory;

    protected $table = 'datos_estudiantes_personales';
    protected $primaryKey = 'num_Cuenta';
    public $incrementing = false; // Indica que la clave primaria no es autoincremental
    protected $keyType = 'string'; // Indica que la clave primaria es de tipo string

    protected $guarded = ['num_Cuenta'];

    protected $fillable = [
        'nombre_estudiante',
        'ap_paterno',
        'ap_materno',
        'genero',
        'curp',
        'estado',
        'num_Cuenta',
        'pais'
    ];

    public $timestamps = false;

    public function citas()
    {
        return $this->hasMany(Cita::class, 'num_Cuenta', 'num_Cuenta');
    }
}
