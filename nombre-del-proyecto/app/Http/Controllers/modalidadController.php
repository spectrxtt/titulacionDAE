<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\modalidad;

class modalidadController extends Controller
{
    public function create()
    {
        return view('modalidad_titulacion.create');
    }

    public function store(Request $request)
    {
        try {
            set_time_limit(180);
            // Validación de los datos
            $request->validate([
                '*.modalidad_titulacion' => 'required|string|max:255',
            ]);

            // Crear y guardar los nuevos registros
            foreach ($request->all() as $modalidad) {
                modalidad::create([
                    'modalidad_titulacion' => $modalidad['modalidad_titulacion'],
                ]);
            }

            // Redirigir o enviar una respuesta exitosa
            return response()->json(['message' => 'modalidades  creadas exitosamente.'], 201);

        } catch (\Exception $e) {
            // Registrar el error y devolver un mensaje de error
            \Log::error($e->getMessage());
            return response()->json(['error' => 'No se pudo crear la modalidad.'], 500);
        }
    }
}
