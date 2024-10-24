<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cita extends Model
{
    use HasFactory;

    // Define la tabla asociada
    protected $table = 'citas';
    protected $primaryKey = 'id_cita';

    // Campos que se pueden rellenar (asignación masiva)
    protected $fillable = [
        'id_cita',
        'fecha',
        'nombre',
        'observaciones',
        'estado_cita',
        'id_usuario',
        'num_Cuenta',
    ];

    // Desactiva los timestamps si no los usas
    public $timestamps = false;

    // Relación con el usuario
    public function usuario()
    {
        return $this->belongsTo(User::class, 'id_usuario');
    }
}
