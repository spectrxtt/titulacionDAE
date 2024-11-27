<?php

namespace App\Http\Controllers;

use App\Models\Cita;
use App\Models\Estudiante;
use App\Models\estudianteBachillerato; // Importa el modelo estudianteBachillerato
use App\Models\estudianteUni; // Importa el modelo estudianteUni
use App\Models\DatosEstudiantesRequisitosModalidad; // Importa el modelo estudianteUni
use App\Models\DatosEstudiantesRequisitosPrograma; // Importa el modelo estudianteUni
use App\Models\Bachillerato; // Importa el modelo estudianteUni
use App\Models\programaEducativo; // Importa el modelo estudianteUni
use App\Models\modalidad; // Importa el modelo estudianteUni
use App\Models\tituloOtorgado; // Importa el modelo estudianteUni
use App\Models\Usuario; // Importa el modelo estudianteUni
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

    // Primero, agregamos la relación en el modelo estudianteBachillerato

// En el archivo estudianteBachillerato.php
    public function bachillerato()
    {
        return $this->belongsTo(Bachillerato::class, 'id_bach', 'id_bach');
    }

    public function busquedaExcel(Request $request) {
        $num_Cuenta = $request->query('cuenta');
        $nombre = $request->query('nombre');
        $fecha_inicio = $request->query('fecha_inicio');
        $fecha_fin = $request->query('fecha_fin');
        $estadoCita = $request->query('estado');
        $observaciones = $request->query('observaciones');

        \Log::info('Parámetros recibidos - Cuenta: ' . $num_Cuenta .
            ', Nombre: ' . $nombre .
            ', Fecha inicio: ' . $fecha_inicio .
            ', Fecha fin: ' . $fecha_fin .
            ', Estado: ' . $estadoCita .
            ', Observaciones: ' . $observaciones);
        try {
            $citas = Cita::with('usuario')
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
                ->when($observaciones, function ($query, $observaciones) {
                    return $query->where('observaciones', 'like', '%' . $observaciones . '%');
                })
                ->get();

            $citasTransformadas = $citas->map(function ($cita) {
                $citaArray = $cita->toArray();
                $citaArray['nombre_usuario'] = $cita->usuario ? $cita->usuario->nombre_usuario : null;
                unset($citaArray['id_usuario']);
                unset($citaArray['usuario']);
                return $citaArray;
            });

            if ($citas->isEmpty()) {
                return response()->json(['message' => 'No se encontraron citas'], 404);
            }

            $numerosCuenta = $citas->pluck('num_Cuenta')->unique();
            $datosEstudiantes = [];

            foreach ($numerosCuenta as $numCuenta) {
                $estudiante = Estudiante::with(['citas'])
                    ->where('num_Cuenta', $numCuenta)
                    ->first();

                if ($estudiante) {
                    $bachilleratoData = estudianteBachillerato::where('num_Cuenta', $numCuenta)->first();
                    $bachilleratoTransformado = null;

                    if ($bachilleratoData) {
                        $bachilleratoInfo = Bachillerato::find($bachilleratoData->id_bach);

                        $bachilleratoTransformado = [
                            'fecha_inicio_bach' => $bachilleratoData->fecha_inicio_bach,
                            'fecha_fin_bach' => $bachilleratoData->fecha_fin_bach,
                            'nombre_bach' => $bachilleratoInfo ? $bachilleratoInfo->nombre_bach : null,
                            'bach_entidad' => $bachilleratoInfo ? $bachilleratoInfo->bach_entidad : null,
                            'num_Cuenta' => $bachilleratoData->num_Cuenta
                        ];
                    }

                    $uniData = estudianteUni::where('num_Cuenta', $numCuenta)->first();
                    $uniDataTransformado = null;

                    if ($uniData) {
                        $modalidadInfo = modalidad::find($uniData->id_modalidad);
                        $programaInfo = programaEducativo::find($uniData->id_programa_educativo);

                        // Obtener el título otorgado usando el id_titulo_otorgado
                        $tituloInfo = tituloOtorgado::find($uniData->id_titulo_otorgado);

                        $uniDataTransformado = [
                            'num_Cuenta' => $uniData->num_Cuenta,
                            'fecha_inicio_uni' => $uniData->fecha_inicio_uni,
                            'fecha_fin_uni' => $uniData->fecha_fin_uni,
                            'periodo_pasantia' => $uniData->periodo_pasantia,
                            'modalidad_titulacion' => $modalidadInfo ? $modalidadInfo->modalidad_titulacion : null,
                            'programa_educativo' => $programaInfo ? $programaInfo->programa_educativo : null,
                            'titulo_otorgado' => $tituloInfo ? $tituloInfo->titulo_otorgado : null,
                        ];
                    }

                    $datosEstudiantes[$numCuenta] = [
                        'personal_data' => $estudiante,
                        'bachillerato_data' => $bachilleratoTransformado,
                        'university_data' => $uniDataTransformado
                    ];
                }
            }

            $respuesta = [
                'citas' => $citasTransformadas,
                'datos_estudiantes' => $datosEstudiantes
            ];

            return response()->json($respuesta);

        } catch (\Exception $e) {
            \Log::error('Error en busquedaCombinada: ' . $e->getMessage());
            return response()->json([
                'error' => 'Error al buscar datos: ' . $e->getMessage()
            ], 500);
        }
    }
}
