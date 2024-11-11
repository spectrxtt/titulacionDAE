<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Estudiante extends Model
{
    use HasFactory;

    protected $table = 'datos_estudiantes_personales';
    protected $primaryKey = 'num_Cuenta';
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
    public $timestamps = false; // Desactiva los timestamps
    public function citas()
    {
        return $this->hasMany(Cita::class, 'num_Cuenta', 'num_Cuenta');
    }
}
