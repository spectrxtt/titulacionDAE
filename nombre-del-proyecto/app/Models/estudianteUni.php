<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class estudianteUni extends Model
{
    use HasFactory;

    protected $table = 'datos_estudiantes_uni';
    protected $primaryKey = 'num_Cuenta';
    public $incrementing = false; // Indica que la clave primaria no es autoincremental
    protected $keyType = 'string'; // Indica que la clave primaria es de tipo string


    protected $fillable = [
        'num_Cuenta',
        'fecha_inicio_uni',
        'fecha_fin_uni',
        'periodo_pasantia',
        'id_modalidad',
        'id_programa_educativo',
        'id_titulo_otorgado',


    ];
    public $timestamps = false; // Desactiva los timestamps
    public function citas()
    {
        return $this->hasMany(Cita::class, 'num_Cuenta', 'num_Cuenta');
    }
    public function modalidad()
    {
        return $this->belongsTo(Modalidad::class, 'id_modalidad', 'id_modalidad');
    }

}
