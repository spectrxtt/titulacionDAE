<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cita extends Model
{
    use HasFactory;

    protected $table = 'citas';

    // Especifica el nombre de la columna primaria
    protected $primaryKey = 'id_cita';

    protected $fillable = [
        'id_cita',
        'fecha',
        'nombre',
        'programa_educativo',
        'observaciones',
        'estado_cita',
        'id_usuario',
        'num_Cuenta',
    ];

    public $timestamps = false; // Desactiva los timestamps

    // Relación con el usuario
    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'id_usuario');
    }
}
