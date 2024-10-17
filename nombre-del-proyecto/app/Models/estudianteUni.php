<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class estudianteUni extends Model
{
    use HasFactory;

    protected $table = 'datos_estudiantes_uni';
    protected $primaryKey = 'num_Cuenta';

    protected $fillable = [
        'num_Cuenta',
        'fecha_inicio_uni',
        'fecha_fin_uni',
        'periodo_pasantia',
        'id_modalidad',
        'id_programa_educativo',

    ];
    public $timestamps = false; // Desactiva los timestamps
    public function citas()
    {
        return $this->hasMany(Cita::class, 'num_Cuenta', 'num_Cuenta');
    }
}
