<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\programaRequisitos;

class requisitosProgramaController extends Controller
{
    public function create()
    {
        return view('requisitos_modalidad.create');
    }

    public function store(Request $request)
    {
        try {
            set_time_limit(300);

            // Validación de los datos
            $request->validate([
                '*.id_programa_educativo' => 'required|integer',
                '*.descripcion' => 'required|string|max:255',
            ]);

            // Crear y guardar los nuevos registros
            foreach ($request->all() as $requisito_programa) {
                programaRequisitos::create([
                    'id_programa_educativo' => $requisito_programa['id_programa_educativo'],
                    'descripcion' => $requisito_programa['descripcion'],
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
        $programaR = programaRequisitos::all('id_requisito_programa', 'id_programa_educativo','descripcion');  // Obtener todos los programas educativos
        return response()->json($programaR , 200);
    }
}
