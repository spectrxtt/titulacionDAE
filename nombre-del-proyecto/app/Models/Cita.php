<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cita extends Model
{
    use HasFactory;

    protected $table = 'citas';

    protected $fillable = [
        'fecha',
        'nombre',
        'observaciones',
        'estado_cita',
        'id_usuario',
        'num_Cuenta',

    ];
    public $timestamps = false; // Desactiva los timestamps
    // Relación con el usuario
    public function usuario()
    {
        return $this->belongsTo(User::class, 'id_usuario');
    }
}
