<?php

namespace App\Http\Controllers;

use App\Models\modalidadRequisitos;
use Illuminate\Http\Request;
use App\Models\DatosEstudiantesRequisitosObligatorios;
use App\Models\DatosEstudiantesRequisitosPrograma;
use App\Models\DatosEstudiantesRequisitosModalidad;
use App\Models\programaRequisitos;

class DatosRequisitosController extends Controller
{
    public function obtenerRequisitosCompletosEspecificos($num_Cuenta)
    {
        // Obtener los datos del estudiante para el programa educativo
        $datosEstudiantePrograma = DatosEstudiantesRequisitosPrograma::where('num_Cuenta', $num_Cuenta)->first();
        // Obtener los datos del estudiante para la modalidad
        $datosEstudianteModalidad = DatosEstudiantesRequisitosModalidad::where('num_Cuenta', $num_Cuenta)->first();
        // Obtener los datos del estudiante para los requisitos obligatorios
        $estudianteObligatorio = DatosEstudiantesRequisitosObligatorios::where('num_Cuenta', $num_Cuenta)->first();

        // Verificar si se encontró el estudiante en alguno de los casos
        if (!$datosEstudiantePrograma || !$datosEstudianteModalidad || !$estudianteObligatorio) {
            return response()->json(['message' => 'Estudiante no encontrado en alguno de los requisitos'], 404);
        }

        // Obtener los id_programa_educativo y id_modalidad
        $idProgramaEducativo = $datosEstudiantePrograma->id_programa_educativo;
        $idModalidad = $datosEstudianteModalidad->id_modalidad;

        // Obtener los requisitos de programa según el id_programa_educativo
        $requisitosPrograma = programaRequisitos::where('id_programa_educativo', $idProgramaEducativo)
            ->select('id_requisito_programa', 'id_programa_educativo', 'descripcion')
            ->get();

        // Obtener los requisitos de modalidad según el id_programa_educativo y id_modalidad
        $requisitosModalidad = modalidadRequisitos::where('id_programa_educativo', $idProgramaEducativo)
            ->where('id_modalidad', $idModalidad)
            ->select('id_requisito_modalidad', 'id_modalidad', 'id_programa_educativo', 'descripcion')
            ->get();

        // Verificar si no se encontraron requisitos en alguno de los casos
        if ($requisitosPrograma->isEmpty() && $requisitosModalidad->isEmpty()) {
            return response()->json(['message' => 'No se encontraron requisitos para este programa y modalidad'], 404);
        }

        // Retornar toda la información recopilada en un solo objeto
        return response()->json([
            'requisitos_programa' => $requisitosPrograma,
            'requisitos_modalidad' => $requisitosModalidad,
            'requisitos_obligatorios' => $estudianteObligatorio,
            'detalles_programa' => [
                'id_requisito_1' => $datosEstudiantePrograma->id_requisito_1,
                'cumplido_1' => $datosEstudiantePrograma->cumplido_1,
                'fecha_cumplido_1' => $datosEstudiantePrograma->fecha_cumplido_1,
                'id_requisito_2' => $datosEstudiantePrograma->id_requisito_2,
                'cumplido_2' => $datosEstudiantePrograma->cumplido_2,
                'fecha_cumplido_2' => $datosEstudiantePrograma->fecha_cumplido_2,
                'id_requisito_3' => $datosEstudiantePrograma->id_requisito_3,
                'cumplido_3' => $datosEstudiantePrograma->cumplido_3,
                'fecha_cumplido_3' => $datosEstudiantePrograma->fecha_cumplido_3,
                'id_requisito_4' => $datosEstudiantePrograma->id_requisito_4,
                'cumplido_4' => $datosEstudiantePrograma->cumplido_4,
                'fecha_cumplido_4' => $datosEstudiantePrograma->fecha_cumplido_4,
                'id_requisito_5' => $datosEstudiantePrograma->id_requisito_5,
                'cumplido_5' => $datosEstudiantePrograma->cumplido_5,
                'fecha_cumplido_5' => $datosEstudiantePrograma->fecha_cumplido_5,
                'id_requisito_6' => $datosEstudiantePrograma->id_requisito_6,
                'cumplido_6' => $datosEstudiantePrograma->cumplido_6,
                'fecha_cumplido_6' => $datosEstudiantePrograma->fecha_cumplido_6,
                'id_requisito_7' => $datosEstudiantePrograma->id_requisito_7,
                'cumplido_7' => $datosEstudiantePrograma->cumplido_7,
                'fecha_cumplido_7' => $datosEstudiantePrograma->fecha_cumplido_7,
                'id_requisito_8' => $datosEstudiantePrograma->id_requisito_8,
                'cumplido_8' => $datosEstudiantePrograma->cumplido_8,
                'fecha_cumplido_8' => $datosEstudiantePrograma->fecha_cumplido_8,
            ],
            'detalles_modalidad' => [
                'id_requisito_1' => $datosEstudianteModalidad->id_requisito_1,
                'cumplido_1' => $datosEstudianteModalidad->cumplido_1,
                'id_requisito_2' => $datosEstudianteModalidad->id_requisito_2,
                'cumplido_2' => $datosEstudianteModalidad->cumplido_2,
                'id_requisito_3' => $datosEstudianteModalidad->id_requisito_3,
                'cumplido_3' => $datosEstudianteModalidad->cumplido_3,
                'id_requisito_4' => $datosEstudianteModalidad->id_requisito_4,
                'cumplido_4' => $datosEstudianteModalidad->cumplido_4,
            ],
        ], 200);
    }

    public function actualizarRequisitosGenerico(Request $request, $num_Cuenta)
    {
        // Validación de los datos
        $request->validate([
            'requisitos_obligatorios.servicio_social' => 'required|string|max:255',
            'requisitos_obligatorios.practicas_profecionales' => 'required|string|max:255',
            'requisitos_obligatorios.cedai' => 'required|string|max:255',

            'requisitos_modalidad.*.id_requisito' => 'nullable|integer',
            'requisitos_modalidad.*.cumplido' => 'nullable|string|max:255',

            'requisitos_programa.*.id_requisito' => 'nullable|integer',
            'requisitos_programa.*.cumplido' => 'nullable|string|max:255',
            'requisitos_programa.*.fecha_cumplido' => 'nullable|string|max:255',
        ]);

        // Actualizar los requisitos obligatorios
        $estudianteObligatorio = DatosEstudiantesRequisitosObligatorios::where('num_Cuenta', $num_Cuenta)->first();
        if ($estudianteObligatorio) {
            $estudianteObligatorio->update($request->input('requisitos_obligatorios'));
        } else {
            return response()->json(['message' => 'Estudiante de Universidad no encontrado para requisitos obligatorios'], 404);
        }

        // Actualizar los requisitos de modalidad
        $estudianteModalidad = DatosEstudiantesRequisitosModalidad::where('num_Cuenta', $num_Cuenta)->first();
        if ($estudianteModalidad) {
            $modalidadData = [];
            foreach ($request->input('requisitos_modalidad') as $key => $value) {
                $modalidadData["id_requisito_" . ($key + 1)] = $value['id_requisito'];
                $modalidadData["cumplido_" . ($key + 1)] = $value['cumplido'];
            }
            $estudianteModalidad->update($modalidadData);
        } else {
            return response()->json(['message' => 'Estudiante de Universidad no encontrado para requisitos de modalidad'], 404);
        }

        // Actualizar los requisitos de programa
        $estudiantePrograma = DatosEstudiantesRequisitosPrograma::where('num_Cuenta', $num_Cuenta)->first();
        if ($estudiantePrograma) {
            $programaData = [];
            foreach ($request->input('requisitos_programa') as $key => $value) {
                $programaData["id_requisito_" . ($key + 1)] = $value['id_requisito'];
                $programaData["cumplido_" . ($key + 1)] = $value['cumplido'];
                $programaData["fecha_cumplido_" . ($key + 1)] = $value['fecha_cumplido'];
            }
            $estudiantePrograma->update($programaData);
        } else {
            return response()->json(['message' => 'Estudiante de Universidad no encontrado para requisitos de programa'], 404);
        }

        return response()->json(['message' => 'Requisitos actualizados con éxito']);
    }


}

