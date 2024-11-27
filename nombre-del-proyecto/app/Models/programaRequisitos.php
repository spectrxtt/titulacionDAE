<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class programaRequisitos extends Model
{
    use HasFactory;

    protected $table = 'requisitos_programa';

    protected $primaryKey = 'id_requisito_programa';

    protected $fillable = [
        'id_programa_educativo',
        'descripcion',
    ];
    public $timestamps = false;
}
