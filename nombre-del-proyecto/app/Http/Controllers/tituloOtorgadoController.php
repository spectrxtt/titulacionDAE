<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\tituloOtorgado;

class tituloOtorgadoController extends Controller
{
    public function create()
    {
        return view('titulos_otorgados.create');
    }
    public function index()
    {

        $programas = tituloOtorgado::all('id_titulo_otorgado', 'titulo_otorgado');
        return response()->json($programas, 200);
    }
    public function store(Request $request)
    {
        try {
            set_time_limit(180);
            // Validación de los datos
            $request->validate([
                '*.titulo_otorgado' => 'required|string|max:255',
            ]);

            // Crear y guardar los nuevos registros
            foreach ($request->all() as $programa_educativo) {
                tituloOtorgado::create([
                    'titulo_otorgado' => $programa_educativo['titulo_otorgado'],
                ]);
            }

            // Redirigir o enviar una respuesta exitosa
            return response()->json(['message' => 'titulos que se otorgan  creados exitosamente.'], 201);

        } catch (\Exception $e) {
            // Registrar el error y devolver un mensaje de error
            \Log::error($e->getMessage());
            return response()->json(['error' => 'No se pudo crear el titulo que se otorga.'], 500);
        }
    }
}
