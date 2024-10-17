<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCitasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('citas', function (Blueprint $table) {
            $table->id('id_cita');
            $table->date('fecha');
            $table->string('nombre');
            $table->text('observaciones')->nullable();
            $table->string('estado_cita');
            $table->unsignedBigInteger('id_usuario');
            $table->string('num_Cuenta');
            $table->timestamps();

            // Foreign key
            $table->foreign('id_usuario')->references('id_usuario')->on('usuarios');
        });
    }


    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('citas');
    }
}
