<?php

namespace App\Http\Controllers;

use App\Models\Estudiante;
use App\Models\estudianteBachillerato; // Importa el modelo estudianteBachillerato
use App\Models\estudianteUni; // Importa el modelo estudianteUni
use Illuminate\Http\Request;

class DatosEstudiantesController extends Controller
{
    public function obtenerPorNumeroCuenta($num_Cuenta)
    {
        $estudiante = Estudiante::where('num_Cuenta', $num_Cuenta)->first();

        if (!$estudiante) {
            return response()->json(['message' => 'Estudiante no encontrado'], 404);
        }

        return response()->json($estudiante);
    }

    public function update(Request $request, $num_Cuenta)
    {
        // Buscar el estudiante por número de cuenta
        $estudiante = Estudiante::find($num_Cuenta);

        // Verificar si el estudiante existe
        if (!$estudiante) {
            return response()->json(['message' => 'Estudiante no encontrado'], 404);
        }

        // Validar los datos recibidos
        $validatedData = $request->validate([
            'nombre_estudiante' => 'nullable|string|max:255',
            'ap_paterno' => 'nullable|string|max:255',
            'ap_materno' => 'nullable|string|max:255',
            'genero' => 'nullable|string|max:10',
            'curp' => 'nullable|string|max:18',
            'estado' => 'nullable|string|max:255',
            'pais' => 'nullable|string|max:255'
        ]);

        // Actualizar los datos del estudiante con los datos validados
        $estudiante->update($validatedData);

        // Retornar la respuesta con el estudiante actualizado
        return response()->json(['message' => 'Datos actualizados correctamente', 'estudiante' => $estudiante]);
    }

    // Método para obtener y actualizar estudianteBachillerato por número de cuenta
    public function obtenerBachilleratoPorNumeroCuenta($num_Cuenta)
    {
        $estudianteBach = estudianteBachillerato::where('num_Cuenta', $num_Cuenta)->first();

        if (!$estudianteBach) {
            return response()->json(['message' => 'Estudiante de Bachillerato no encontrado'], 404);
        }

        return response()->json($estudianteBach);
    }

    public function updateBachillerato(Request $request, $num_Cuenta)
    {
        // Buscar el estudianteBachillerato por número de cuenta
        $estudianteBach = estudianteBachillerato::find($num_Cuenta);

        // Verificar si el estudianteBach existe
        if (!$estudianteBach) {
            return response()->json(['message' => 'Estudiante de Bachillerato no encontrado'], 404);
        }

        // Validar los datos recibidos
        $validatedData = $request->validate([
            'fecha_inicio_bach' => 'nullable|date',
            'fecha_fin_bach' => 'nullable|date',
            'id_bach' => 'nullable|integer'
        ]);

        // Actualizar los datos del estudianteBach con los datos validados
        $estudianteBach->update($validatedData);

        // Retornar la respuesta con el estudianteBach actualizado
        return response()->json(['message' => 'Datos de Bachillerato actualizados correctamente', 'estudianteBach' => $estudianteBach]);
    }

    // Método para obtener y actualizar estudianteUni por número de cuenta
    public function obtenerUniPorNumeroCuenta($num_Cuenta)
    {
        $estudianteUni = estudianteUni::where('num_Cuenta', $num_Cuenta)->first();

        if (!$estudianteUni) {
            return response()->json(['message' => 'Estudiante de Universidad no encontrado'], 404);
        }

        return response()->json($estudianteUni);
    }

    public function updateUni(Request $request, $num_Cuenta)
    {
        // Buscar el estudianteUni por número de cuenta
        $estudianteUni = estudianteUni::find($num_Cuenta);

        // Verificar si el estudianteUni existe
        if (!$estudianteUni) {
            return response()->json(['message' => 'Estudiante de Universidad no encontrado'], 404);
        }

        // Validar los datos recibidos
        $validatedData = $request->validate([
            'fecha_inicio_uni' => 'nullable|date',
            'fecha_fin_uni' => 'nullable|date',
            'periodo_pasantia' => 'nullable|string|max:20',
            'id_modalidad' => 'nullable|integer',
            'id_programa_educativo' => 'nullable|integer',
        ]);

        // Actualizar los datos del estudianteUni con los datos validados
        $estudianteUni->update($validatedData);

        // Retornar la respuesta con el estudianteUni actualizado
        return response()->json(['message' => 'Datos de Universidad actualizados correctamente', 'estudianteUni' => $estudianteUni]);
    }
}
