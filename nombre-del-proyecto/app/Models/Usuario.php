<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens; // Asegúrate de importar HasApiTokens

class Usuario extends Authenticatable
{
    use HasApiTokens, Notifiable;
    use HasFactory, Notifiable;

    protected $table = 'usuarios';
    protected $primaryKey = 'id_usuario';
    public $timestamps = false;

    protected $fillable = [
        'nombre_usuario',
        'usuario',
        'password',
        'rol',
    ];

    protected $hidden = [
        'password', // Ocultar el campo password en las respuestas JSON
    ];

    // Laravel usará este campo como la contraseña
    public function setPasswordAttribute($value)
    {
        // Hashear la contraseña automáticamente
        $this->attributes['password'] = Hash::make($value);
    }
}
