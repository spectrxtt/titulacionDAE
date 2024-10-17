<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEstudiantesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('datos_estudiantes_persorsonales', function (Blueprint $table) {
            $table->id();
            $table->string('nombre_estudiante');
            $table->string('ap_paterno');
            $table->string('ap_materno');
            $table->string('genero');
            $table->string('curp');
            $table->string('estado');
            $table->string('correo');
            $table->string('num_Cuenta')->unique();
            $table->timestamps();
        });
    }
    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('estudiantes');
    }
}
