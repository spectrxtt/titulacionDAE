<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Usuario;


class UsuarioController extends Controller
{
    // Crear un nuevo usuario
    public function store(Request $request)
    {
        // Validar los datos de entrada
        $validatedData = $request->validate([
            'nombre_usuario' => 'required|string|max:255',
            'usuario' => 'required|string|max:255|unique:usuarios',
            'contrasena' => 'required|string|min:6',
            'rol' => 'required|string|max:50',
        ]);

        // Crear el usuario en la base de datos
        $usuario = Usuario::create($validatedData);

        // Retornar la respuesta
        return response()->json($usuario, 201); // Retorna el usuario creado
    }

    // Obtener todos los usuarios
    public function index()
    {
        return Usuario::all(); // Retorna todos los usuarios
    }

    // Obtener un usuario por ID
    public function show($id)
    {
        $usuario = Usuario::find($id);

        if (!$usuario) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        return $usuario; // Retorna el usuario encontrado
    }

    // Actualizar un usuario
    public function update(Request $request, $id)
    {
        $usuario = Usuario::find($id);

        if (!$usuario) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        $validatedData = $request->validate([
            'nombre_usuario' => 'sometimes|required|string|max:255',
            'usuario' => 'sometimes|required|string|max:255|unique:usuarios,usuario,' . $usuario->id,
            'contrasena' => 'sometimes|required|string|min:6',
            'rol' => 'sometimes|required|string|max:50',
        ]);

        $usuario->update($validatedData);
        return response()->json($usuario); // Retorna el usuario actualizado
    }

    // Eliminar un usuario
    public function destroy($id)
    {
        $usuario = Usuario::find($id);

        if (!$usuario) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        $usuario->delete();
        return response()->json(['message' => 'Usuario eliminado']); // Mensaje de éxito
    }
}
