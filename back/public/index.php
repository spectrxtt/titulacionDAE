<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: OPTIONS,GET,POST,PUT,DELETE");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = explode('/', $uri);

if ($uri[1] !== 'api') {
    header("HTTP/1.1 404 Not Found");
    exit();
}

require_once __DIR__ . '/../src/controllers/UserController.php';

$resource = $uri[2] ?? null;
$id = $uri[3] ?? null;
$method = $_SERVER["REQUEST_METHOD"];

$controller = new UserController();

switch ($resource) {
    case 'users':
        if ($method === 'GET') {
            if ($id) {
                $response = $controller->getUser($id);
            } else {
                $response = $controller->getAllUsers();
            }
        }
        // Añade más casos según sea necesario
        break;
    default:
        $response = ['error' => 'Resource not found'];
        break;
}

echo json_encode($response);