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

    public function index()
    {
            $programas = programaEducativo::all('id_programa_educativo', 'programa_educativo');  // Obtener todos los programas educativos
            return response()->json($programas, 200);
    }
    public function update(Request $request, $id)
    {
        try {
            // Validar los datos recibidos
            $request->validate([
                'programa_educativo' => 'required|string|max:255',
            ]);

            // Buscar el programa educativo por su id
            $programaEducativo = programaEducativo::findOrFail($id);

            // Actualizar el programa educativo
            $programaEducativo->update([
                'programa_educativo' => $request->input('programa_educativo'),
            ]);

            // Respuesta exitosa
            return response()->json(['message' => 'Programa educativo actualizado con éxito.'], 200);
        } catch (\Exception $e) {
            // Registrar el error y devolver un mensaje de error
            \Log::error($e->getMessage());
            return response()->json(['error' => 'No se pudo actualizar el programa educativo.'], 500);
        }
    }


}

