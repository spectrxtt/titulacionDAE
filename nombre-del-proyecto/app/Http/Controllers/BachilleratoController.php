<?php

namespace App\Http\Controllers;

use App\Models\Bachillerato;
use Illuminate\Http\Request;

class BachilleratoController extends Controller
{
    public function create()
    {
        return view('bachillerato.create');
    }

    public function store(Request $request)
    {
        try {
            set_time_limit(180);
            // Validación de los datos
            $request->validate([
                '*.nombre_bach' => 'required|string|max:255',
                '*.bach_entidad' => 'required|string|max:255',
            ]);

            // Crear y guardar los nuevos registros
            foreach ($request->all() as $bachillerato) {
                Bachillerato::create([
                    'nombre_bach' => $bachillerato['nombre_bach'],
                    'bach_entidad' => $bachillerato['bach_entidad'],
                ]);
            }

            // Redirigir o enviar una respuesta exitosa
            return response()->json(['message' => 'Bachilleratos creados exitosamente.'], 201);

        } catch (\Exception $e) {
            // Registrar el error y devolver un mensaje de error
            \Log::error($e->getMessage());
            return response()->json(['error' => 'No se pudo crear el bachillerato.'], 500);
        }
    }


}
