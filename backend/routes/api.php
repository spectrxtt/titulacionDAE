<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UsuarioController;
use App\Http\Controllers\AuthController;

Route::middleware(['api'])->group(function () {
    Route::get('/usuarios', [UsuarioController::class, 'index']);
    Route::post('/usuarios', [UsuarioController::class, 'store']);
    Route::put('/usuarios/{id_usuario}', [UsuarioController::class, 'update']); // Actualizar un usuario
    Route::delete('/usuarios/{id_usuario}', [UsuarioController::class, 'destroy']); // Eliminar un usuario
    Route::post('/login', [AuthController::class, 'login']);


});

