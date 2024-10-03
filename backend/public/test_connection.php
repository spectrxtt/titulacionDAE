<?php
// Parámetros de conexión
$serverName = "localhost"; // Cambia 'localhost' si te conectas a un servidor remoto
$connectionOptions = [
    "Database" => "titulacionPrueba",  // Cambia el nombre de tu base de datos
    "Uid" => "",  // Deja vacío para autenticación de Windows
    "PWD" => "",  // Deja vacío para autenticación de Windows
    "TrustServerCertificate" => true  // Si usas un certificado no confiable
];

// Conexión con autenticación de Windows
$conn = sqlsrv_connect($serverName, $connectionOptions);

// Verifica si la conexión fue exitosa
if ($conn === false) {
    echo "Conexión fallida.<br />";
    die(print_r(sqlsrv_errors(), true));
} else {
    echo "Conexión exitosa a la base de datos.<br />";
}

// Cerrar la conexión
sqlsrv_close($conn);
?>
