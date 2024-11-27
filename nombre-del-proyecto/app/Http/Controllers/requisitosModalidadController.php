<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\modalidadRequisitos;
use App\Models\DatosEstudiantesRequisitosModalidad;
use Illuminate\Support\Facades\DB;

class requisitosModalidadController extends Controller
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
                '*.id_modalidad' => 'required|integer',
                '*.id_programa_educativo' => 'required|integer',
                '*.descripcion' => 'required|string|max:255',
            ]);

            // Crear y guardar los nuevos registros
            foreach ($request->all() as $requisito_modalidad) {
                modalidadRequisitos::create([
                    'id_modalidad' => $requisito_modalidad['id_modalidad'],
                    'id_programa_educativo' => $requisito_modalidad['id_programa_educativo'],
                    'descripcion' => $requisito_modalidad['descripcion'],
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
        $programaR = modalidadRequisitos::all('id_requisito_modalidad', 'id_modalidad','id_programa_educativo','descripcion');  // Obtener todos los programas educativos
        return response()->json($programaR , 200);
    }

    public function getRequisitosPorModalidadYPrograma($idPrograma, $idModalidad)
    {
        $requisitos = modalidadRequisitos::where('id_programa_educativo', $idPrograma)
            ->where('id_modalidad', $idModalidad)
            ->get(['id_requisito_modalidad', 'descripcion']);
        return response()->json($requisitos, 200);
    }
    public function update(Request $request, $id_requisito_modalidad)
    {
        try {
            // Validar los datos recibidos
            $request->validate([
                'descripcion' => 'required|string|max:255',
            ]);

            // Buscar el requisito de modalidad por su id
            $requisitoModalidad = modalidadRequisitos::findOrFail($id_requisito_modalidad);

            // Actualizar el requisito de modalidad
            $requisitoModalidad->update([
                'descripcion' => $request->input('descripcion'),
            ]);

            // Respuesta exitosa
            return response()->json(['message' => 'Requisito de Modalidad actualizado con éxito.'], 200);
        } catch (\Exception $e) {
            // Registrar el error y devolver un mensaje de error
            \Log::error($e->getMessage());
            return response()->json(['error' => 'No se pudo actualizar el Requisito de Modalidad.'], 500);
        }
    }

    public function deleteRequisito(Request $request)
    {
        try {
            // Validar que se proporcionen los IDs de los requisitos a eliminar
            $request->validate([
                'requisitos_a_eliminar' => 'required|array',
                'requisitos_a_eliminar.*' => 'integer|exists:requisitos_modalidad,id_requisito_modalidad'
            ]);

            // Obtener los IDs de los requisitos a eliminar
            $requisitosAEliminar = $request->input('requisitos_a_eliminar');

            // Iniciar transacción de base de datos
            DB::beginTransaction();

            // Eliminar de datos_estudiantes_requisitos_modalidad
            $this->eliminarDeEstudiantesRequisitosModalidad($requisitosAEliminar);

            // Eliminar de requisitos_modalidad
            modalidadRequisitos::whereIn('id_requisito_modalidad', $requisitosAEliminar)->delete();

            // Confirmar la transacción
            DB::commit();

            return response()->json([
                'message' => 'Requisitos eliminados exitosamente.',
                'requisitos_eliminados' => $requisitosAEliminar
            ], 200);

        } catch (\Exception $e) {
            // Revertir la transacción en caso de error
            DB::rollBack();

            // Registrar el error
            \Log::error('Error al eliminar requisitos: ' . $e->getMessage());

            return response()->json([
                'error' => 'No se pudieron eliminar los requisitos.',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    private function eliminarDeEstudiantesRequisitosModalidad(array $requisitosAEliminar)
    {
        // Definir las columnas de requisitos en la tabla de datos de estudiantes en modalidad
        $columnasRequisitos = [
            'id_requisito_1', 'id_requisito_2', 'id_requisito_3',
            'id_requisito_4'
        ];

        // Crear una consulta para actualizar los registros
        $query = DatosEstudiantesRequisitosModalidad::query();

        // Iterar sobre las columnas de requisitos
        foreach ($columnasRequisitos as $columnaRequisito) {
            $columnaCumplido = str_replace('id_requisito', 'cumplido', $columnaRequisito);

            // Añadir condición para eliminar registros de requisitos específicos
            $query->where(function ($q) use ($columnaRequisito, $requisitosAEliminar) {
                $q->whereIn($columnaRequisito, $requisitosAEliminar);
            });

            // Actualizar los registros, estableciendo el requisito, cumplido y fecha a null
            $updateData = [
                $columnaRequisito => null,
                $columnaCumplido => null,
            ];

            $query->update($updateData);

            // Reiniciar la consulta para la siguiente iteración
            $query = DatosEstudiantesRequisitosModalidad::query();
        }
    }



}
