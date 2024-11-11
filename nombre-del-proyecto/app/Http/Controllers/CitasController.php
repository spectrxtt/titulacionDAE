<?php

namespace App\Http\Controllers;

use App\Models\Cita;
use App\Models\Estudiante;
use App\Models\estudianteBachillerato;
use App\Models\estudianteUni;
use App\Models\DatosEstudiantesRequisitosObligatorios;
use App\Models\DatosEstudiantesRequisitosPrograma;
use App\Models\DatosEstudiantesRequisitosModalidad;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;


class CitasController extends Controller
{
    public function cargarCitas(Request $request)
    {
        set_time_limit(120);
        $validator = Validator::make($request->all(), [
            'citas' => 'required|array',
            'estudiantes' => 'required|array',
            'estudiantesBach' => 'required|array',
            'estudiantesUni' => 'required|array',
            'requisitosObligatorios' => 'required|array',
            'requisitosPrograma' => 'required|array',
            'requisitosModalidad' => 'required|array',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }

        try {
            // Maneja las citas
            foreach ($request->input('citas') as $citaData) {
                Cita::create([
                    'id_cita' => $citaData['id_cita'],
                    'fecha' => $citaData['fecha'],
                    'nombre' => $citaData['nombre'],
                    'observaciones' => $citaData['observaciones'],
                    'estado_cita' => $citaData['estado_cita'],
                    'id_usuario' => $citaData['id_usuario'],
                    'num_Cuenta' => $citaData['num_Cuenta'],
                ]);
            }

            // Maneja los estudiantes
            foreach ($request->input('estudiantes') as $estudianteData) {
                Estudiante::updateOrCreate(
                    ['num_Cuenta' => $estudianteData['num_Cuenta']],
                    [
                        'nombre_estudiante' => $estudianteData['nombre_estudiante'],
                        'ap_paterno' => $estudianteData['ap_paterno'],
                        'ap_materno' => $estudianteData['ap_materno'],
                    ]
                );
            }

            // Maneja los estudiantesBach
            foreach ($request->input('estudiantesBach') as $estudianteBachData) {
                // Asegúrate de que el modelo esté bien definido
                estudianteBachillerato::updateOrCreate(
                    [
                        'num_Cuenta' => $estudianteBachData['num_Cuenta'], // Aquí se establece el num_Cuenta
                        'id_bach' => $estudianteBachData['id_bach'] ?? null // Puedes establecer id_bach si es necesario, o pasarlo como null si no se proporciona
                    ],
                    [
                        'fecha_inicio_bach' => $estudianteBachData['fecha_inicio_bach'] ?? null, // Puedes establecer esto si tienes información
                        'fecha_fin_bach' => $estudianteBachData['fecha_fin_bach'] ?? null // También puedes establecer esto si es necesario
                    ]
                );
            }

            // Maneja los estudiantesUni
            foreach ($request->input('estudiantesUni') as $estudianteUniData) {
                // Asegúrate de que el modelo esté bien definido
                estudianteUni::updateOrCreate(
                    [
                        'num_Cuenta' => $estudianteUniData['num_Cuenta'], // Aquí se establece el num_Cuenta
                    ]
                );
            }


            foreach ($request->input('requisitosObligatorios') as $requisitosObligatoriosData) {
                // Asegúrate de que el modelo esté bien definido
                DatosEstudiantesRequisitosObligatorios::updateOrCreate(
                    [
                        'num_Cuenta' => $requisitosObligatoriosData['num_Cuenta'],
                    ]
                );
            }

            foreach ($request->input('requisitosPrograma') as $requisitosProgramaData) {
                // Asegúrate de que el modelo esté bien definido
                DatosEstudiantesRequisitosPrograma::updateOrCreate(
                    [
                        'num_Cuenta' => $requisitosProgramaData['num_Cuenta'],
                    ]
                );
            }

            foreach ($request->input('requisitosModalidad') as $requisitosModalidadData) {
                // Asegúrate de que el modelo esté bien definido
                DatosEstudiantesRequisitosModalidad::updateOrCreate(
                    [
                        'num_Cuenta' => $requisitosModalidadData['num_Cuenta'],
                    ]
                );
            }

            return response()->json(['message' => 'Datos cargados correctamente']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al procesar las citas: ' . $e->getMessage()], 500);
        }
    }


    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    public function index(Request $request)
    {
        try {
            $user = Auth::user(); // Obtener el usuario autenticado

            if (!$user) {
                return response()->json(['error' => 'Usuario no autenticado'], 401);
            }

            $role = $user->rol;

            if ($role === 'admin' || $role === 'impresion') {
                $citas = Cita::with('usuario:nombre_usuario,id_usuario')->get();
            } elseif ($role === 'integrador') {
                $citas = Cita::where('id_usuario', $user->id_usuario)
                    ->with('usuario:nombre_usuario,id_usuario')
                    ->get(); // Solo citas asignadas al integrador
            } else {
                return response()->json(['error' => 'Rol no autorizado'], 403);
            }

            // Retornar citas con el nombre de usuario en la respuesta
            return response()->json($citas);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al obtener citas: ' . $e->getMessage()], 500);
        }
    }


    public function buscar(Request $request)
    {
        $num_Cuenta = $request->query('cuenta');
        $nombre = $request->query('nombre');
        $fecha = $request->query('fecha');
        $estadoCita = $request->query('estado');

        \Log::info('Parámetros recibidos - Cuenta: ' . $num_Cuenta . ', Nombre: ' . $nombre .', Fecha: ' . $fecha . ', Estado: ' . $estadoCita);

        try {
            // Inicializa la consulta con el filtro condicionalmente
            $citas = Cita::when($num_Cuenta, function ($query, $num_Cuenta) {
                return $query->where('num_Cuenta', $num_Cuenta);
            })
                ->when($nombre, function ($query, $nombre) {
                    return $query->where('nombre', 'like', '%' . $nombre . '%');
                })
                ->when($fecha, function ($query, $fecha) {
                    return $query->where('fecha', 'like', '%' . $fecha . '%');
                })
                ->when($estadoCita, function ($query, $estadoCita) {
                    // Asegúrate de que el estado_cita sea exactamente igual al valor proporcionado
                    return $query->where('estado_cita', '=', $estadoCita);
                })
                // Cargar la relación 'usuario' con el campo 'nombre_usuario'
                ->with('usuario:nombre_usuario,id_usuario')
                ->get();

            // Si no se encuentran citas, devuelve un mensaje
            if ($citas->isEmpty()) {
                return response()->json(['message' => 'No se encontraron citas'], 404);
            }

            // Retornar las citas con el nombre del usuario cargado
            return response()->json($citas);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al buscar citas: ' . $e->getMessage()], 500);
        }
    }


    public function actualizarEstadoCita(Request $request, $id_cita)
    {
        // Buscar el estudiante por número de cuenta
        $cita = Cita::find($id_cita);

        // Verificar si el estudiante existe
        if (!$cita) {
            return response()->json(['message' => 'Cita no encontrada'], 404);
        }

        // Validar los datos recibidos
        $validatedData = $request->validate([
            'estado_cita' => 'nullable|string|max:255',
            'observaciones'=> 'nullable|string|max:255',
        ]);

        // Actualizar los datos del estudiante con los datos validados
        $cita->update($validatedData);

        // Retornar la respuesta con el estudiante actualizado
        return response()->json(['message' => 'Datos actualizados correctamente', 'cita' => $cita]);
    }
}
