<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\programaRequisitos;
use App\Models\DatosEstudiantesRequisitosPrograma;
use Illuminate\Support\Facades\DB;

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
            return response()->json(['message' => 'Requisito de Programa educativo  creado exitosamente.'], 201);

        } catch (\Exception $e) {
            // Registrar el error y devolver un mensaje de error
            \Log::error($e->getMessage());
            return response()->json(['error' => 'No se pudo crear el Requisito de Programa educativo.'], 500);
        }
    }

    public function index()
    {
        $programaR = programaRequisitos::all('id_requisito_programa', 'id_programa_educativo','descripcion');  // Obtener todos los programas educativos
        return response()->json($programaR , 200);
    }
    // Obtener los requisitos de un programa educativo
    public function getRequisitos($id)
    {
        $requisitos = programaRequisitos::where('id_programa_educativo', $id)
            ->get(['id_requisito_programa', 'descripcion']);
        return response()->json($requisitos, 200);
    }


    public function update(Request $request, $id_requisito_programa)
    {
        try {
            // Validar los datos recibidos
            $request->validate([
                'descripcion' => 'required|string|max:255',
            ]);

            // Buscar el programa educativo por su id
            $requisitoPrograma = programaRequisitos::findOrFail($id_requisito_programa);

            // Actualizar el programa educativo
            $requisitoPrograma->update([
                'descripcion' => $request->input('descripcion'),
            ]);

            // Respuesta exitosa
            return response()->json(['message' => 'Requisito de Programa Educativo actualizado con éxito.'], 200);
        } catch (\Exception $e) {
            // Registrar el error y devolver un mensaje de error
            \Log::error($e->getMessage());
            return response()->json(['error' => 'No se pudo actualizar el Requisito de Programa Educativo.'], 500);
        }
    }
    public function deleteRequisito(Request $request)
    {
        try {
            // Validar que se proporcionen los IDs de los requisitos a eliminar
            $request->validate([
                'requisitos_a_eliminar' => 'required|array',
                'requisitos_a_eliminar.*' => 'integer|exists:requisitos_programa,id_requisito_programa'
            ]);

            // Obtener los IDs de los requisitos a eliminar
            $requisitosAEliminar = $request->input('requisitos_a_eliminar');

            // Iniciar transacción de base de datos
            DB::beginTransaction();

            // Eliminar de datos_estudiantes_requisitos_programa
            $this->eliminarDeEstudiantesRequisitos($requisitosAEliminar);

            // Eliminar de requisitos_programa
            programaRequisitos::whereIn('id_requisito_programa', $requisitosAEliminar)->delete();

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

    private function eliminarDeEstudiantesRequisitos(array $requisitosAEliminar)
    {
        // Obtener las columnas de requisitos en la tabla de datos de estudiantes
        $columnasRequisitos = [
            'id_requisito_1', 'id_requisito_2', 'id_requisito_3',
            'id_requisito_4', 'id_requisito_5', 'id_requisito_6',
            'id_requisito_7', 'id_requisito_8'
        ];

        // Crear una consulta para actualizar los registros
        $query = DatosEstudiantesRequisitosPrograma::query();

        // Iterar sobre las columnas de requisitos
        foreach ($columnasRequisitos as $index => $columnaRequisito) {
            $columnaCumplido = str_replace('id_requisito', 'cumplido', $columnaRequisito);
            $columnaFecha = str_replace('id_requisito', 'fecha_cumplido', $columnaRequisito);

            // Añadir condición para eliminar registros de requisitos específicos
            $query->where(function ($q) use ($columnaRequisito, $requisitosAEliminar) {
                $q->whereIn($columnaRequisito, $requisitosAEliminar);
            });

            // Actualizar los registros, estableciendo el requisito, cumplido y fecha a null
            $updateData = [
                $columnaRequisito => null,
                $columnaCumplido => null,
                $columnaFecha => null
            ];

            $query->update($updateData);

            // Reiniciar la consulta para la siguiente iteración
            $query = DatosEstudiantesRequisitosPrograma::query();
        }
    }


}
