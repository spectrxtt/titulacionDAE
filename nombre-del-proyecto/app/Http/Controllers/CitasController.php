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
                    'fecha' => $citaData['fecha'] ?? null,
                    'nombre' => $citaData['nombre'] ?? null,
                    'observaciones' => $citaData['observaciones'] ?? null,
                    'estado_cita' => $citaData['estado_cita'] ?? null,
                    'id_usuario' => $citaData['id_usuario'] ?? null,
                    'num_Cuenta' => $citaData['num_Cuenta'] ?? null,
                    'programa_educativo' => $citaData['programa_educativo'] ?? null, // Agregado aquí
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
                // Incluir la modalidad usando 'estudiante'
                $citas = Cita::with(['usuario:nombre_usuario,id_usuario', 'estudiante.modalidad'])->get();
            } elseif ($role === 'integrador') {
                // Incluir la modalidad para un integrador
                $citas = Cita::where('id_usuario', $user->id_usuario)
                    ->with(['usuario:nombre_usuario,id_usuario', 'estudiante.modalidad'])
                    ->get(); // Solo citas asignadas al integrador
            } else {
                return response()->json(['error' => 'Rol no autorizado'], 403);
            }

            // Retornar citas con el nombre de usuario y modalidad
            return response()->json($citas);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al obtener citas: ' . $e->getMessage()], 500);
        }
    }

    public function indexExpedientes(Request $request)
    {
        try {
            $user = Auth::user(); // Obtener el usuario autenticado

            if (!$user) {
                return response()->json(['error' => 'Usuario no autenticado'], 401);
            }

            $role = $user->rol;

            if ($role === 'admin' || $role === 'impresion') {
                // Incluir la modalidad usando 'estudiante'
                $citas = Cita::with(['usuario:nombre_usuario,id_usuario', 'estudiante.modalidad'])
                    ->where(function ($query) {
                        $query->where('estado_cita', 'Integrado')
                            ->orWhere('estado_cita', 'Rechazado');
                    })
                    ->orderByDesc('id_cita')
                    ->take(10)
                    ->get();
            } elseif ($role === 'integrador') {
                // Incluir la modalidad para un integrador
                $citas = Cita::where('id_usuario', $user->id_usuario)
                    ->where(function ($query) {
                        $query->where('estado_cita', 'Integrado')
                            ->orWhere('estado_cita', 'Rechazado');
                    })
                    ->with(['usuario:nombre_usuario,id_usuario', 'estudiante.modalidad'])
                    ->orderByDesc('id_cita')
                    ->take(10)
                    ->get(); // Solo citas asignadas al integrador
            } else {
                return response()->json(['error' => 'Rol no autorizado'], 403);
            }

            // Retornar citas con el nombre de usuario y modalidad
            return response()->json($citas);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al obtener citas: ' . $e->getMessage()], 500);
        }
    }


    public function buscar(Request $request)
    {
        $num_Cuenta = $request->query('cuenta');
        $nombre = $request->query('nombre');
        $fecha_inicio = $request->query('fecha_inicio');
        $fecha_fin = $request->query('fecha_fin');
        $estadoCita = $request->query('estado');

        \Log::info('Parámetros recibidos - Cuenta: ' . $num_Cuenta .
            ', Nombre: ' . $nombre .
            ', Fecha inicio: ' . $fecha_inicio .
            ', Fecha fin: ' . $fecha_fin .
            ', Estado: ' . $estadoCita);

        try {
            $citas = Cita::with(['usuario', 'estudiante.modalidad']) // Cargar las relaciones usuario y modalidad
            ->when($num_Cuenta, function ($query, $num_Cuenta) {
                return $query->where('num_Cuenta', $num_Cuenta);
            })
                ->when($nombre, function ($query, $nombre) {
                    return $query->where('nombre', 'like', '%' . $nombre . '%');
                })
                ->when($fecha_inicio || $fecha_fin, function ($query) use ($fecha_inicio, $fecha_fin) {
                    if ($fecha_inicio && $fecha_fin) {
                        return $query->whereBetween('fecha', [$fecha_inicio, $fecha_fin]);
                    } elseif ($fecha_inicio) {
                        return $query->whereDate('fecha', '=', $fecha_inicio);
                    } elseif ($fecha_fin) {
                        return $query->whereDate('fecha', '=', $fecha_fin);
                    }
                })
                ->when($estadoCita, function ($query, $estadoCita) {
                    return $query->where('estado_cita', '=', $estadoCita);
                })
                ->get();

            // Transformar las citas manteniendo la relación usuario y añadiendo la modalidad titulacion
            $citasTransformadas = $citas->map(function ($cita) {
                // Si no hay usuario, se asigna un objeto usuario vacío o con 'N/A'
                $cita->usuario = $cita->usuario ?: (object)['nombre_usuario' => 'N/A'];
                // Si no hay modalidad, se asigna 'N/A'
                $cita->estudiante->modalidad = $cita->estudiante->modalidad ?: (object)['modalidad_titulacion' => 'N/A'];
                return $cita;
            });

            if ($citasTransformadas->isEmpty()) {
                return response()->json(['message' => 'No se encontraron citas'], 404);
            }

            return response()->json($citasTransformadas);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al buscar citas: ' . $e->getMessage()], 500);
        }
    }


    public function destroy($id_cita)
    {
        try {
            // Busca la cita por su id_cita
            $cita = Cita::where('id_cita', $id_cita)->firstOrFail();

            // Elimina la cita
            $cita->delete();

            // Retorna una respuesta exitosa
            return response()->json(['message' => 'Cita eliminada exitosamente.'], 200);
        } catch (\Exception $e) {
            // En caso de error, captura el mensaje y devuelve una respuesta de error
            \Log::error($e->getMessage());
            return response()->json(['error' => 'No se pudo eliminar la cita.'], 500);
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
    public function actualizarEstadoCitafECHA(Request $request, $id_cita)
    {
        // Buscar la cita por su id
        $cita = Cita::find($id_cita);

        // Verificar si la cita existe
        if (!$cita) {
            return response()->json(['message' => 'Cita no encontrada'], 404);
        }

        // Validar los datos recibidos, incluyendo la fecha
        $validatedData = $request->validate([
            'estado_cita' => 'nullable|string|max:255',
            'observaciones' => 'nullable|string|max:255',
            'fecha' => 'nullable|date' // Añadir validación para la fecha
        ]);

        // Actualizar la cita con los datos validados
        $cita->update($validatedData);

        // Retornar la respuesta con la cita actualizada
        return response()->json(['message' => 'Datos actualizados correctamente', 'cita' => $cita]);
    }

}
