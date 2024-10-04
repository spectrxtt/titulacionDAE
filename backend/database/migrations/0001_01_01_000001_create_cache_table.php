<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsuariosTable extends Migration
{
    public function up()
    {
        Schema::create('usuarios', function (Blueprint $table) {
            $table->id();
            $table->string('nombre_usuario');
            $table->string('usuario')->unique();
            $table->string('contrasena');
            $table->string('rol');
            $table->timestamps(); // Esto añade created_at y updated_at
        });
    }

    public function down()
    {
        Schema::dropIfExists('usuarios');
    }
}
