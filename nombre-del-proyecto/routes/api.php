<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UsuarioController;
use App\Http\Controllers\CitasController;
use App\Http\Controllers\BachilleratoController;
use App\Http\Controllers\programaEduController;
use App\Http\Controllers\tituloOtorgadoController;
use App\Http\Controllers\modalidadController;
use App\Http\Controllers\requisitosModalidadController;
use App\Http\Controllers\requisitosProgramaController;
use App\Http\Controllers\DatosEstudiantesController;


Route::middleware(['api'])->group(function () {
    // Rutas para usuarios
    Route::get('/usuarios', [UsuarioController::class, 'index']);
    Route::post('/usuarios', [UsuarioController::class, 'store']);
    Route::put('/usuarios/{id_usuario}', [UsuarioController::class, 'update']); // Actualizar un usuario
    Route::delete('/usuarios/{id_usuario}', [UsuarioController::class, 'destroy']); // Eliminar un usuario

    // Autenticación
    Route::post('/login', [UsuarioController::class, 'login']);
    Route::post('/logout', [UsuarioController::class, 'logout']);

    // Rutas para citas
    Route::post('/cargar-citas', [CitasController::class, 'cargarCitas']);

    // Rutas para bachillerato
    Route::post('/bachillerato', [BachilleratoController::class, 'store'])->name('bachillerato.store');

    Route::post('/programa-educativo', [programaEduController::class, 'store'])->name('programa_educativo.store');

    Route::post('/titulo-otorgado', [tituloOtorgadoController::class, 'store'])->name('titulo_otorgado.store');

    Route::post('/modalidad-titulacion', [modalidadController::class, 'store'])->name('modalidad_titulacion.store');

    Route::post('/requisitos-modalidad', [requisitosModalidadController::class, 'store'])->name('requisitos_modalidad.store');

    Route::post('/requisitos-programa', [requisitosProgramaController::class, 'store'])->name('requisitos_programa.store');

    Route::get('/estudiantes/{num_Cuenta}', [DatosEstudiantesController::class, 'obtenerPorNumeroCuenta']);
    Route::put('/estudiantes/{num_Cuenta}', [DatosEstudiantesController::class, 'update']);

    Route::get('/estudiantes/bachillerato/{num_Cuenta}', [DatosEstudiantesController::class, 'obtenerBachilleratoPorNumeroCuenta']);
    Route::put('/estudiantes/bachillerato/{num_Cuenta}', [DatosEstudiantesController::class, 'updateBachillerato']);

    Route::get('/estudiantes/uni/{num_Cuenta}', [DatosEstudiantesController::class, 'obtenerUniPorNumeroCuenta']);
    Route::put('/estudiantes/uni/{num_Cuenta}', [DatosEstudiantesController::class, 'updateUni']);

});

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/citas', [CitasController::class, 'index']);

});

