<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Usuario;
use Illuminate\Support\Facades\Auth;

class UsuarioController extends Controller
{
    // Crear un nuevo usuario
    public function store(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'nombre_usuario' => 'required|string|max:255',
                'usuario' => 'required|string|max:255|unique:usuarios',
                'contrasena' => 'required|string|min:6',
                'rol' => 'required|string|max:50',
            ]);

            $usuario = Usuario::create($validatedData);

            return response()->json($usuario, 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            \Log::error('Error al crear usuario: ' . $e->getMessage());
            return response()->json(['message' => 'Error interno del servidor'], 500);
        }
    }

    // En tu controlador UsuariosController.php
    public function index()
    {
        $usuarios = Usuario::all(); // Asegúrate de que Usuario sea tu modelo correcto
        return response()->json($usuarios);
    }


    public function show($id_usuario)
    {
        $usuario = Usuario::where('id_usuario', $id_usuario)->first();

        if (!$usuario) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        return response()->json($usuario);
    }

    public function update(Request $request, $id_usuario)
    {
        $usuario = Usuario::where('id_usuario', $id_usuario)->first();

        if (!$usuario) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        // Actualiza el usuario con los datos recibidos
        $usuario->update($request->all());
        return response()->json(['message' => 'Usuario actualizado con éxito']);
    }


    public function destroy($id_usuario) // Cambia el parámetro a $id_usuario
    {
        $usuario = Usuario::where('id_usuario', $id_usuario)->first();

        if (!$usuario) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        $usuario->delete();
        return response()->json(['message' => 'Usuario eliminado con éxito']);
    }

    public function login(Request $request)
    {
        $credentials = $request->only('usuario', 'contrasena');

        if (auth()->attempt($credentials)) {
            // Autenticación exitosa
            return response()->json(['message' => 'Inicio de sesión exitoso'], 200);
        }

        // Autenticación fallida
        return response()->json(['message' => 'Credenciales incorrectas'], 401);
    }

}
