<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class modalidadRequisitos extends Model
{
    use HasFactory;

    protected $table = 'requisitos_modalidad';

    protected $primaryKey = 'id_requisito_modalidad';

    protected $fillable = [
        'id_modalidad',
        'id_programa_educativo',
        'descripcion',
    ];


    public $timestamps = false;


}

