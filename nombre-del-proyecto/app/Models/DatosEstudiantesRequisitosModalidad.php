<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DatosEstudiantesRequisitosModalidad extends Model
{
    // Nombre de la tabla en la base de datos
    protected $table = 'datos_estudiantes_requisitos_modalidad';

    // Definir si la tabla no usa timestamps (created_at, updated_at)
    public $timestamps = false;

    // Clave primaria de la tabla
    protected $primaryKey = 'num_Cuenta';
    public $incrementing = false; // Indica que la clave primaria no es autoincremental
    protected $keyType = 'string'; // Indica que la clave primaria es de tipo string


    // Relación con los atributos que pueden ser asignados de forma masiva
    protected $fillable = [
        'num_Cuenta',
        'id_modalidad',
        'id_programa_educativo',
        'id_requisito_1',
        'cumplido_1',
        'id_requisito_2',
        'cumplido_2',
        'id_requisito_3',
        'cumplido_3',
        'id_requisito_4',
        'cumplido_4'
    ];

    // Relación con la tabla `datos_estudiantes_personales`
    public function estudiante()
    {
        return $this->belongsTo(Estudiante::class, 'num_Cuenta', 'num_Cuenta');
    }

    // Relación con la tabla `programa_educativo`
    public function programaEducativo()
    {
        return $this->belongsTo(ProgramaEducativo::class, 'id_programa_educativo', 'id_programa_educativo');
    }

    // Relación con la tabla `modalidad_titulacion`
    public function modalidad()
    {
        return $this->belongsTo(modalidad::class, 'id_modalidad', 'id_modalidad');
    }

    // Relación con la tabla `requisitos_modalidad` para cada requisito
    public function requisito1()
    {
        return $this->belongsTo(modalidadRequisitos::class, 'id_requisito_1', 'id_requisito');
    }

    public function requisito2()
    {
        return $this->belongsTo(modalidadRequisitos::class, 'id_requisito_2', 'id_requisito');
    }

    public function requisito3()
    {
        return $this->belongsTo(modalidadRequisitos::class, 'id_requisito_3', 'id_requisito');
    }

    public function requisito4()
    {
        return $this->belongsTo(modalidadRequisitos::class, 'id_requisito_4', 'id_requisito');
    }
}
