<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use Notifiable;

    protected $fillable = [
        'nombre_usuario',
        'usuario',
        'contrasena',
    ];

    protected $hidden = [
        'contrasena', // Esta línea asegura que la contraseña no se exponga en las respuestas
    ];
}

