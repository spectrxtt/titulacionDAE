<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DatosEstudiantesRequisitosPrograma extends Model
{
    protected $table = 'datos_estudiantes_requisitos_programa';
    public $timestamps = false;
    protected $primaryKey = 'num_Cuenta';
    public $incrementing = false; // Indica que la clave primaria no es autoincremental
    protected $keyType = 'string'; // Indica que la clave primaria es de tipo string

    protected $fillable = [
        'num_Cuenta',
        'id_programa_educativo',
        'id_requisito_1',
        'cumplido_1',
        'fecha_cumplido_1',
        'id_requisito_2',
        'cumplido_2',
        'fecha_cumplido_2',
        'id_requisito_3',
        'cumplido_3',
        'fecha_cumplido_3',
        'id_requisito_4',
        'cumplido_4',
        'fecha_cumplido_4',
        'id_requisito_5',
        'cumplido_5',
        'fecha_cumplido_5',
        'id_requisito_6',
        'cumplido_6',
        'fecha_cumplido_6',
        'id_requisito_7',
        'cumplido_7',
        'fecha_cumplido_7',
        'id_requisito_8',
        'cumplido_8',
        'fecha_cumplido_8',

    ];

    public function estudiante()
    {
        return $this->belongsTo(Estudiante::class, 'num_Cuenta', 'num_Cuenta');
    }

    public function programaEducativo()
    {
        return $this->belongsTo(programaRequisitos::class, 'id_programa_educativo', 'id_programa_educativo');
    }

    public function requisito1()
    {
        return $this->belongsTo(programaRequisitos::class, 'id_requisito_1', 'id_requisito');
    }

    public function requisito2()
    {
        return $this->belongsTo(programaRequisitos::class, 'id_requisito_2', 'id_requisito');
    }

    public function requisito3()
    {
        return $this->belongsTo(programaRequisitos::class, 'id_requisito_3', 'id_requisito');
    }

    public function requisito4()
    {
        return $this->belongsTo(programaRequisitos::class, 'id_requisito_4', 'id_requisito');
    }

    public function requisito5()
    {
        return $this->belongsTo(programaRequisitos::class, 'id_requisito_5', 'id_requisito');
    }

    public function requisito6()
    {
        return $this->belongsTo(programaRequisitos::class, 'id_requisito_6', 'id_requisito');
    }

    public function requisito7()
    {
        return $this->belongsTo(programaRequisitos::class, 'id_requisito_7', 'id_requisito');
    }
    public function requisito8()
    {
        return $this->belongsTo(programaRequisitos::class, 'id_requisito_8', 'id_requisito');
    }
}
