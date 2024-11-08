<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Usuario;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth; // Add this line
use Laravel\Sanctum\HasApiTokens;

class UsuarioController extends Controller
{
    // Crear un nuevo usuario
    public function store(Request $request)
    {
        // Validar los datos de entrada
        $validatedData = $request->validate([
            'usuario' => 'required|unique:usuarios',
            'password' => 'required|min:6',
            'nombre_usuario' => 'required',
            'rol' => 'required',
        ]);

        // Crear un nuevo usuario
        $usuario = Usuario::create($validatedData);

        return response()->json(['message' => 'Usuario creado con éxito'], 201);
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
        $credentials = $request->only('usuario', 'password');

        // Intenta autenticar al usuario
        if (Auth::attempt(['usuario' => $credentials['usuario'], 'password' => $credentials['password']])) {
            $user = Auth::user();

            // Generar el token
            $token = $user->createToken('Token de sesión')->plainTextToken;

            return response()->json([
                'message' => 'Inicio de sesión exitoso',
                'token' => $token, // Incluye el token en la respuesta
                'user' => [
                    'id' => $user->id_usuario,
                    'nombre_usuario' => $user->nombre_usuario,
                    'rol' => $user->rol,
                ],
            ], 200);
        }

        return response()->json(['message' => 'Credenciales incorrectas'], 401);
    }


    public function logout(Request $request)
    {
        // Cierra la sesión del usuario
        Auth::logout();

        // Invalidar la sesión y regenerar el token CSRF
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        // Opcionalmente, puedes retornar una respuesta indicando que la sesión se ha cerrado correctamente
        return response()->json(['message' => 'Sesión cerrada con éxito'], 200);
    }

}
