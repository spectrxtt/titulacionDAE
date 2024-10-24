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
    // Función para obtener requisitos obligatorios por número de cuenta
    public function obtenerObligatoriosPorNumeroCuenta($num_Cuenta)
    {
        $estudianteObligatorio = DatosEstudiantesRequisitosObligatorios::where('num_Cuenta', $num_Cuenta)->first();

        if (!$estudianteObligatorio) {
            return response()->json(['message' => 'Estudiante de Universidad no encontrado'], 404);
        }

        return response()->json($estudianteObligatorio);
    }

    // Función para actualizar los requisitos obligatorios
    public function actualizarRequisitos(Request $request, $num_Cuenta)
    {
        // Validar la solicitud
        $request->validate([
            'servicio_social' => 'required|string|max:255',
            'practicas_profecionales' => 'required|string|max:255',
            'cedai' => 'required|string|max:255',
        ]);

        // Buscar el registro por número de cuenta
        $estudianteObligatorio = DatosEstudiantesRequisitosObligatorios::where('num_Cuenta', $num_Cuenta)->first();

        if (!$estudianteObligatorio) {
            return response()->json(['message' => 'Estudiante de Universidad no encontrado'], 404);
        }

        // Actualizar los datos
        $estudianteObligatorio->update($request->only(['servicio_social', 'practicas_profecionales', 'cedai']));

        return response()->json(['message' => 'Requisitos actualizados con éxito']);
    }

    public function obtenerRequisitosPrograma($num_Cuenta)
    {
        // Obtiene el id_programa_educativo según el num_Cuenta
        $datosEstudiante = DatosEstudiantesRequisitosPrograma::where('num_Cuenta', $num_Cuenta)->first();

        if (!$datosEstudiante) {
            return response()->json(['message' => 'No se encontró el estudiante'], 404);
        }

        $idProgramaEducativo = $datosEstudiante->id_programa_educativo;

        // Obtiene los requisitos de programa según el id_programa_educativo
        $requisitos = programaRequisitos::where('id_programa_educativo', $idProgramaEducativo)
            ->select('id_requisito_programa', 'id_programa_educativo', 'descripcion')
            ->get();

        if ($requisitos->isEmpty()) {
            return response()->json(['message' => 'No se encontraron requisitos para este programa'], 404);
        }

        return response()->json($requisitos, 200);
    }

    public function obtenerRequisitosModalidad($num_Cuenta)
    {
        // Obtiene el id_programa_educativo y id_modalidad según el num_Cuenta
        $datosEstudiante = DatosEstudiantesRequisitosModalidad::where('num_Cuenta', $num_Cuenta)->first();

        if (!$datosEstudiante) {
            return response()->json(['message' => 'No se encontró el estudiante'], 404);
        }

        $idProgramaEducativo = $datosEstudiante->id_programa_educativo;
        $idModalidad = $datosEstudiante->id_modalidad;

        // Obtiene los requisitos de modalidad según el id_programa_educativo y id_modalidad
        $requisitos = modalidadRequisitos::where('id_programa_educativo', $idProgramaEducativo)
            ->where('id_modalidad', $idModalidad)
            ->select('id_requisito_modalidad', 'id_modalidad', 'id_programa_educativo', 'descripcion')
            ->get();

        if ($requisitos->isEmpty()) {
            return response()->json(['message' => 'No se encontraron requisitos para este programa y modalidad'], 404);
        }

        return response()->json($requisitos, 200);
    }

    // Función para obtener requisitos por número de cuenta
    public function obtenerRequisitosProgramaPorNumeroCuenta($num_Cuenta)
    {
        $estudiantePrograma = DatosEstudiantesRequisitosPrograma::where('num_Cuenta', $num_Cuenta)->first();

        if (!$estudiantePrograma) {
            return response()->json(['message' => 'Estudiante de Universidad no encontrado'], 404);
        }

        // Retornar todos los datos necesarios incluyendo cumplido_x y fecha_cumplido_x
        return response()->json([
            'id_requisito_1' => $estudiantePrograma->id_requisito_1,
            'cumplido_1' => $estudiantePrograma->cumplido_1,
            'fecha_cumplido_1' => $estudiantePrograma->fecha_cumplido_1,
            'id_requisito_2' => $estudiantePrograma->id_requisito_2,
            'cumplido_2' => $estudiantePrograma->cumplido_2,
            'fecha_cumplido_2' => $estudiantePrograma->fecha_cumplido_2,
            'id_requisito_3' => $estudiantePrograma->id_requisito_3,
            'cumplido_3' => $estudiantePrograma->cumplido_3,
            'fecha_cumplido_3' => $estudiantePrograma->fecha_cumplido_3,
            'id_requisito_4' => $estudiantePrograma->id_requisito_4,
            'cumplido_4' => $estudiantePrograma->cumplido_4,
            'fecha_cumplido_4' => $estudiantePrograma->fecha_cumplido_4,
            'id_requisito_5' => $estudiantePrograma->id_requisito_5,
            'cumplido_5' => $estudiantePrograma->cumplido_5,
            'fecha_cumplido_5' => $estudiantePrograma->fecha_cumplido_5,
            'id_requisito_6' => $estudiantePrograma->id_requisito_6,
            'cumplido_6' => $estudiantePrograma->cumplido_6,
            'fecha_cumplido_6' => $estudiantePrograma->fecha_cumplido_6,
            'id_requisito_7' => $estudiantePrograma->id_requisito_7,
            'cumplido_7' => $estudiantePrograma->cumplido_7,
            'fecha_cumplido_7' => $estudiantePrograma->fecha_cumplido_7,
            'id_requisito_8' => $estudiantePrograma->id_requisito_8,
            'cumplido_8' => $estudiantePrograma->cumplido_8,
            'fecha_cumplido_8' => $estudiantePrograma->fecha_cumplido_8,

        ]);
    }


    public function actualizarRequisitosPrograma(Request $request, $num_Cuenta)
    {
        // Define una regla de validación común para los requisitos
        $requisitoRules = [
            'id_requisito' => 'nullable|INTEGER',
            'cumplido' => 'nullable|string|max:255',
            'fecha_cumplido' => 'nullable|string|max:255',
        ];

        // Recoger el número de requisitos dinámicamente
        $numRequisitos = 8; // O el número dinámico que desees manejar

        // Generar las reglas de validación dinámicamente
        $rules = [];
        for ($i = 1; $i <= $numRequisitos; $i++) {
            $rules["id_requisito_{$i}"] = $requisitoRules['id_requisito'];
            $rules["cumplido_{$i}"] = $requisitoRules['cumplido'];
            $rules["fecha_cumplido_{$i}"] = $requisitoRules['fecha_cumplido'];
        }

        // Validar la solicitud con las reglas dinámicas
        $request->validate($rules);

        // Buscar el registro por número de cuenta
        $estudiantePrograma = DatosEstudiantesRequisitosPrograma::where('num_Cuenta', $num_Cuenta)->first();

        if (!$estudiantePrograma) {
            return response()->json(['message' => 'Estudiante de Universidad no encontrado'], 404);
        }

        // Actualizar dinámicamente solo los campos presentes en la solicitud
        $dataToUpdate = [];
        for ($i = 1; $i <= $numRequisitos; $i++) {
            if ($request->has("id_requisito_{$i}")) {
                $dataToUpdate["id_requisito_{$i}"] = $request->input("id_requisito_{$i}");
            }
            if ($request->has("cumplido_{$i}")) {
                $dataToUpdate["cumplido_{$i}"] = $request->input("cumplido_{$i}");
            }
            if ($request->has("fecha_cumplido_{$i}")) {
                $dataToUpdate["fecha_cumplido_{$i}"] = $request->input("fecha_cumplido_{$i}");
            }
        }

        // Actualizar el registro con los datos válidos
        $estudiantePrograma->update($dataToUpdate);

        return response()->json(['message' => 'Requisitos actualizados con éxito']);
    }

    // Función para obtener requisitos por número de cuenta
    public function obtenerRequisitosModalidadPorNumeroCuenta($num_Cuenta)
    {
        $estudianteModalidad = DatosEstudiantesRequisitosModalidad::where('num_Cuenta', $num_Cuenta)->first();

        if (!$estudianteModalidad ) {
            return response()->json(['message' => 'Estudiante de Universidad no encontrado'], 404);
        }

        // Retornar todos los datos necesarios incluyendo cumplido_x y fecha_cumplido_x
        return response()->json([
            'id_requisito_1' => $estudianteModalidad ->id_requisito_1,
            'cumplido_1' => $estudianteModalidad ->cumplido_1,
            'id_requisito_2' => $estudianteModalidad ->id_requisito_2,
            'cumplido_2' => $estudianteModalidad ->cumplido_2,
            'id_requisito_3' => $estudianteModalidad ->id_requisito_3,
            'cumplido_3' => $estudianteModalidad ->cumplido_3,
            'id_requisito_4' => $estudianteModalidad ->id_requisito_4,
            'cumplido_4' => $estudianteModalidad ->cumplido_4,

        ]);
    }


    public function actualizarRequisitosModalidad(Request $request, $num_Cuenta)
    {
        // Define una regla de validación común para los requisitos
        $requisitoRules = [
            'id_requisito' => 'nullable|INTEGER',
            'cumplido' => 'nullable|string|max:255',
        ];

        // Recoger el número de requisitos dinámicamente
        $numRequisitos = 4; // O el número dinámico que desees manejar

        // Generar las reglas de validación dinámicamente
        $rules = [];
        for ($i = 1; $i <= $numRequisitos; $i++) {
            $rules["id_requisito_{$i}"] = $requisitoRules['id_requisito'];
            $rules["cumplido_{$i}"] = $requisitoRules['cumplido'];
        }

        // Validar la solicitud con las reglas dinámicas
        $request->validate($rules);

        // Buscar el registro por número de cuenta
        $estudianteModalidad = DatosEstudiantesRequisitosModalidad::where('num_Cuenta', $num_Cuenta)->first();

        if (!$estudianteModalidad) {
            return response()->json(['message' => 'Estudiante de Universidad no encontrado'], 404);
        }

        // Actualizar dinámicamente solo los campos presentes en la solicitud
        $dataToUpdate = [];
        for ($i = 1; $i <= $numRequisitos; $i++) {
            if ($request->has("id_requisito_{$i}")) {
                $dataToUpdate["id_requisito_{$i}"] = $request->input("id_requisito_{$i}");
            }
            if ($request->has("cumplido_{$i}")) {
                $dataToUpdate["cumplido_{$i}"] = $request->input("cumplido_{$i}");
            }
        }

        // Actualizar el registro con los datos válidos
        $estudianteModalidad->update($dataToUpdate);

        return response()->json(['message' => 'Requisitos actualizados con éxito']);
    }


}

