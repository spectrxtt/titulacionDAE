<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsuariosTable extends Migration
{
    public function up()
    {
        Schema::create('usuarios', function (Blueprint $table) {
            $table->id('id_usuario');
            $table->string('nombre_usuario')->unique();
            $table->string('usuario')->unique(); // Asegúrate de que este campo exista
            $table->string('contrasena');
            $table->string('rol');
        });
    }

    public function down()
    {
        Schema::dropIfExists('usuarios');
    }
}
