<?php

return [
    'paths' => ['api/*'], // Rutas donde se aplicará CORS
    'allowed_methods' => ['*'], // Métodos permitidos
    'allowed_origins' => ['*'], // Orígenes permitidos
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'], // Encabezados permitidos
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => false, // Si soporta credenciales
];

