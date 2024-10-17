<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class tituloOtorgado extends Model
{
    use HasFactory;

    protected $table = 'titulos_otorgados';

    protected $primaryKey = 'id_titulo_otorgado';

    protected $fillable = [
        'titulo_otorgado',
    ];


    public $timestamps = false;


}
