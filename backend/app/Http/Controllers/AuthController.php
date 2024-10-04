<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        // Valida la entrada
        $request->validate([
            'usuario' => 'required',
            'contrasena' => 'required',
        ]);

        // Intenta autenticar
        $credentials = [
            'usuario' => $request->usuario,
            'contrasena' => $request->contrasena,
        ];

        // Verifica si las credenciales son correctas
        $user = User::where('usuario', $request->usuario)->first();

        // Verifica si el usuario existe y la contraseña es correcta
        if ($user && Hash::check($request->contrasena, $user->contrasena)) {
            // Autenticación exitosa
            return response()->json(['success' => true, 'message' => 'Login exitoso']);
        }

        return response()->json(['success' => false, 'message' => 'Usuario o contraseña incorrectos'], 401);
    }

}
