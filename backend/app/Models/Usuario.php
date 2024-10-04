<?php

    namespace App\Models;

    use Illuminate\Foundation\Auth\User as Authenticatable;
    use Illuminate\Notifications\Notifiable;

    class Usuario extends Authenticatable
    {
        use Notifiable;

        protected $table = 'usuarios'; // Especifica el nombre de la tabla

        protected $fillable = [
            'nombre_usuario',
            'usuario',  // Asegúrate de que este campo exista en la base de datos
            'contrasena',
            'rol',
        ];

        protected $hidden = [
            'contrasena',
        ];
    }



