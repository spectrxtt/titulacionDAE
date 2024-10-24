<?php

namespace App\Http\Controllers;

use App\Models\Estudiante;
use App\Models\estudianteBachillerato; // Importa el modelo estudianteBachillerato
use App\Models\estudianteUni; // Importa el modelo estudianteUni
use App\Models\DatosEstudiantesRequisitosModalidad; // Importa el modelo estudianteUni
use App\Models\DatosEstudiantesRequisitosPrograma; // Importa el modelo estudianteUni
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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


    // Método para obtener y actualizar estudianteUni por número de cuenta
    public function obtenerUniPorNumeroCuenta($num_Cuenta)
    {
        $estudianteUni = estudianteUni::where('num_Cuenta', $num_Cuenta)->first();

        if (!$estudianteUni) {
            return response()->json(['message' => 'Estudiante de Universidad no encontrado'], 404);
        }

        return response()->json($estudianteUni);
    }

    public function updateDatosEscolares(Request $request, $num_Cuenta)
    {
        DB::beginTransaction();

        try {
            // Actualizar estudianteBachillerato
            $estudianteBach = estudianteBachillerato::findOrFail($num_Cuenta);
            $estudianteBach->update($request->estudianteBach);

            // Actualizar estudianteUni
            $estudianteUni = estudianteUni::findOrFail($num_Cuenta);
            $estudianteUni->update($request->estudianteUni);

            // Actualizar o crear DatosEstudiantesRequisitosPrograma
            DatosEstudiantesRequisitosPrograma::updateOrCreate(
                ['num_Cuenta' => $num_Cuenta],
                [
                    'id_programa_educativo' => $request->estudianteUni['id_programa_educativo'],
                ]
            );

            // Actualizar o crear DatosEstudiantesRequisitosModalidad
            DatosEstudiantesRequisitosModalidad::updateOrCreate(
                ['num_Cuenta' => $num_Cuenta],
                [
                    'id_modalidad' => $request->estudianteUni['id_modalidad'],
                    'id_programa_educativo' => $request->estudianteUni['id_programa_educativo'],
                ]
            );

            DB::commit();

            return response()->json([
                'message' => 'Datos escolares actualizados correctamente',
                'estudianteBach' => $estudianteBach,
                'estudianteUni' => $estudianteUni
            ]);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['message' => 'Error al actualizar datos escolares: ' . $e->getMessage()], 500);
        }
    }

}

