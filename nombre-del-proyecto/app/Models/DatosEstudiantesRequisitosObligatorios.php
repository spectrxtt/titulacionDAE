<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DatosEstudiantesRequisitosObligatorios extends Model
{
    // Nombre de la tabla en la base de datos
    protected $table = 'datos_estudiantes_requisitos_obligatorios';

    // Definir si la tabla no usa timestamps (created_at, updated_at)
    public $timestamps = false;

    // Clave primaria de la tabla
    protected $primaryKey = 'num_Cuenta';
    public $incrementing = false; // Indica que la clave primaria no es autoincremental
    protected $keyType = 'string'; // Indica que la clave primaria es de tipo string


    // Relación con los atributos que pueden ser asignados de forma masiva
    protected $fillable = [
        'num_Cuenta',
        'servicio_social',
        'practicas_profecionales',
        'cedai'
    ];

    public function estudiante()
    {
        return $this->belongsTo(Estudiante::class, 'num_Cuenta', 'num_Cuenta');
    }
}
