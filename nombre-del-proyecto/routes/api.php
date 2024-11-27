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
    Route::put('/actualizar-estado-cita-fecha/{id_cita}', [CitasController::class, 'actualizarEstadoCitafECHA']);

    // Rutas para bachillerato
    Route::post('/bachillerato', [BachilleratoController::class, 'store'])->name('bachillerato.store');
    Route::get('/bachilleratos', [BachilleratoController::class, 'index']);
    Route::put('/bachillerato/{id}', [BachilleratoController::class, 'updateBachillerato']);

    // Rutas para programas educativos
    Route::post('/programa-educativo', [programaEduController::class, 'store'])->name('programa_educativo.store');
    Route::get('/programas-educativos', [programaEduController::class, 'index']);
    Route::put('/programa-educativo/{id}', [programaEduController::class, 'update'])->name('programa_educativo.update');


    // Rutas para titulos otorgados
    Route::post('/titulo-otorgado', [tituloOtorgadoController::class, 'store'])->name('titulo_otorgado.store');
    Route::get('/titulo-otorgado', [tituloOtorgadoController::class, 'index'])->name('titulo_otorgado.index');
    Route::put('/titulo-otorgadoM/{id}', [tituloOtorgadoController::class, 'update'])->name('titulo_otorgado.update');

    // Rutas para modalidades
    Route::post('/modalidad-titulacion', [modalidadController::class, 'store'])->name('modalidad_titulacion.store');
    Route::get('/modalidades-titulacion', [modalidadController::class, 'index']);
    Route::put('/modalidades-titulacionM/{id}', [modalidadController::class, 'update'])->name('modalidad_titulacion.update');


    // Rutas para requisitos de modalidad
    Route::post('/requisitos-modalidad', [requisitosModalidadController::class, 'store'])->name('requisitos_modalidad.store');
    Route::get('/requisitos-modalidad', [RequisitosModalidadController::class, 'index']);
    Route::get('requisitos-modalidad/{idPrograma}/{idModalidad}', [RequisitosModalidadController::class, 'getRequisitosPorModalidadYPrograma']);
    Route::put('requisitos/modalidad/{id_requisito_modalidad}', [RequisitosModalidadController::class, 'update']);
    Route::post('requisitos/modalidad/delete', [RequisitosModalidadController::class, 'deleteRequisito']);



    // Rutas para requisitos de programa
    Route::post('/requisitos-programa', [requisitosProgramaController::class, 'store'])->name('requisitos_programa.store');
    Route::get('/requisitos-programa', [requisitosProgramaController::class, 'index']);
    Route::put('/requisitos-programa/{id_requisito_programa}', [requisitosProgramaController::class, 'update']);
    Route::get('/programas-educativos/{id}/requisitos', [requisitosProgramaController::class, 'getRequisitos']); // Requisitos de un programa
    Route::post('/requisitos-programa/delete', [requisitosProgramaController::class, 'deleteRequisito']);


    Route::get('/estudiantes/{num_Cuenta}', [DatosEstudiantesController::class, 'obtenerPorNumeroCuenta']);
    Route::put('/estudiantes/{num_Cuenta}', [DatosEstudiantesController::class, 'update']);

    // Rutas para descargar excel
    Route::get('/estudiantesCompletos', [DatosEstudiantesController::class, 'busquedaExcel']);

    // Rutas para obtener bachillerato de estudiante
    Route::get('/estudiantes/bachillerato/{num_Cuenta}', [DatosEstudiantesController::class, 'obtenerBachilleratoPorNumeroCuenta']);

    // Rutas para obtener programa educativo de estudiante
    Route::get('/estudiantes/uni/{num_Cuenta}', [DatosEstudiantesController::class, 'obtenerUniPorNumeroCuenta']);

    // Rutas para actualizar datos escolares
    Route::put('/estudiantes/datos-escolares/{num_Cuenta}', [DatosEstudiantesController::class, 'updateDatosEscolares']);

    // Rutas para obtener requisitos obligatorios
    Route::get('/estudiantes/requisitos-obligatorios/{num_Cuenta}', [DatosRequisitosController::class, 'obtenerObligatoriosPorNumeroCuenta']);

    Route::get('/estudiantes/requisitos-programaEs/{num_Cuenta}', [DatosRequisitosController::class, 'obtenerRequisitosProgramaPorNumeroCuenta']);

    Route::get('/estudiantes/requisitos-modalidadEs/{num_Cuenta}', [DatosRequisitosController::class, 'obtenerRequisitosModalidadPorNumeroCuenta']);

    Route::get('/estudiantes/requisitosdata/{num_Cuenta}', [DatosRequisitosController::class, 'obtenerRequisitosCompletos']);
    Route::get('/estudiantes/requisitosdataespecifica/{num_Cuenta}', [DatosRequisitosController::class, 'obtenerRequisitosCompletosEspecificos']);

    Route::put('/estudiantes/requisitosCompletos/{num_Cuenta}', [DatosRequisitosController::class, 'actualizarRequisitosGenerico']);


    Route::get('/estudiantes/requisitos-programa/{num_Cuenta}', [DatosRequisitosController::class, 'obtenerRequisitosPrograma']);

    // Ruta para obtener el id_modalidad y el id_programa_educativo
    Route::get('/estudiantes/requisitos-modalidad/{num_Cuenta}', [DatosRequisitosController::class, 'obtenerRequisitosModalidad']);

    // Rutas para buscar citas
    Route::get('/buscar-citas', [CitasController::class, 'buscar']);

});
// Rutas para obtener citas por rol

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/citas', [CitasController::class, 'index']);
    Route::get('/citasExpedientes', [CitasController::class, 'indexExpedientes']);
    Route::delete('/citas/{id_cita}', [CitasController::class, 'destroy']);
});
