<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class estudianteBachillerato extends Model
{
    use HasFactory;

    protected $table = 'datos_estudiantes_bach';
    protected $primaryKey = 'num_Cuenta';
    public $incrementing = false; // Indica que la clave primaria no es autoincremental
    protected $keyType = 'string'; // Indica que la clave primaria es de tipo string


    protected $fillable = [
        'fecha_inicio_bach',
        'fecha_fin_bach',
        'id_bach',
        'num_Cuenta',
    ];
    public $timestamps = false; // Desactiva los timestamps
    public function citas()
    {
        return $this->hasMany(Cita::class, 'num_Cuenta', 'num_Cuenta');
    }
}
