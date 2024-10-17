<?php

namespace App\Http\Controllers;

use App\Models\programaEducativo;
use Illuminate\Http\Request;

class programaEduController extends Controller
{
    public function create()
    {
        return view('programa_educativo.create');
    }

    public function store(Request $request)
    {
        try {
            set_time_limit(180);
            // Validación de los datos
            $request->validate([
                '*.programa_educativo' => 'required|string|max:255',
            ]);

            // Crear y guardar los nuevos registros
            foreach ($request->all() as $programa_educativo) {
                programaEducativo::create([
                    'programa_educativo' => $programa_educativo['programa_educativo'],
                ]);
            }

            // Redirigir o enviar una respuesta exitosa
            return response()->json(['message' => 'Programas educativos  creados exitosamente.'], 201);

        } catch (\Exception $e) {
            // Registrar el error y devolver un mensaje de error
            \Log::error($e->getMessage());
            return response()->json(['error' => 'No se pudo crear el programaEductaivo.'], 500);
        }
    }
}

