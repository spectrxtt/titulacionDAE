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
use App\Http\Controllers\DatosRequisitosController;


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
    Route::put('/actualizar-estado-cita/{id_cita}', [CitasController::class, 'actualizarEstadoCita']);



    // Rutas para bachillerato
    Route::post('/bachillerato', [BachilleratoController::class, 'store'])->name('bachillerato.store');
    Route::get('/bachilleratos', [BachilleratoController::class, 'index']);

    Route::post('/programa-educativo', [programaEduController::class, 'store'])->name('programa_educativo.store');
    Route::get('/programas-educativos', [programaEduController::class, 'index']);

    Route::post('/titulo-otorgado', [tituloOtorgadoController::class, 'store'])->name('titulo_otorgado.store');
    Route::get('/titulo-otorgado', [tituloOtorgadoController::class, 'index'])->name('titulo_otorgado.index');

    Route::post('/modalidad-titulacion', [modalidadController::class, 'store'])->name('modalidad_titulacion.store');
    Route::get('/modalidades-titulacion', [modalidadController::class, 'index']);


    Route::post('/requisitos-modalidad', [requisitosModalidadController::class, 'store'])->name('requisitos_modalidad.store');
    Route::get('/requisitos-modalidad', [RequisitosModalidadController::class, 'index']);

    Route::post('/requisitos-programa', [requisitosProgramaController::class, 'store'])->name('requisitos_programa.store');
    Route::get('/requisitos-programa', [requisitosProgramaController::class, 'index']);

    Route::get('/estudiantes/{num_Cuenta}', [DatosEstudiantesController::class, 'obtenerPorNumeroCuenta']);
    Route::put('/estudiantes/{num_Cuenta}', [DatosEstudiantesController::class, 'update']);


    Route::get('/estudiantesCompletos/{num_Cuenta}', [DatosEstudiantesController::class, 'getAllStudentData']);


    Route::get('/estudiantes/bachillerato/{num_Cuenta}', [DatosEstudiantesController::class, 'obtenerBachilleratoPorNumeroCuenta']);

    Route::get('/estudiantes/uni/{num_Cuenta}', [DatosEstudiantesController::class, 'obtenerUniPorNumeroCuenta']);

    Route::put('/estudiantes/datos-escolares/{num_Cuenta}', [DatosEstudiantesController::class, 'updateDatosEscolares']);

    Route::get('/estudiantes/requisitos-obligatorios/{num_Cuenta}', [DatosRequisitosController::class, 'obtenerObligatoriosPorNumeroCuenta']);

    Route::get('/estudiantes/requisitos-programaEs/{num_Cuenta}', [DatosRequisitosController::class, 'obtenerRequisitosProgramaPorNumeroCuenta']);

    Route::get('/estudiantes/requisitos-modalidadEs/{num_Cuenta}', [DatosRequisitosController::class, 'obtenerRequisitosModalidadPorNumeroCuenta']);

    Route::get('/estudiantes/requisitosdata/{num_Cuenta}', [DatosRequisitosController::class, 'obtenerRequisitosCompletos']);
    Route::get('/estudiantes/requisitosdataespecifica/{num_Cuenta}', [DatosRequisitosController::class, 'obtenerRequisitosCompletosEspecificos']);

    Route::put('/estudiantes/requisitosCompletos/{num_Cuenta}', [DatosRequisitosController::class, 'actualizarRequisitosGenerico']);


    Route::get('/estudiantes/requisitos-programa/{num_Cuenta}', [DatosRequisitosController::class, 'obtenerRequisitosPrograma']);

    // Ruta para obtener el id_modalidad y el id_programa_educativo
    Route::get('/estudiantes/requisitos-modalidad/{num_Cuenta}', [DatosRequisitosController::class, 'obtenerRequisitosModalidad']);

    Route::get('/buscar-citas', [CitasController::class, 'buscar']);



});

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/citas', [CitasController::class, 'index']);

});

