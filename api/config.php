<?php
// api/config.php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

$host = getenv('DB_HOST') ?: "localhost";
$port = getenv('DB_PORT') ?: "3306";
$db_name = getenv('DB_NAME') ?: "inmarc_db";
$username = getenv('DB_USER') ?: "root";
$password = getenv('DB_PASS') ?: ""; 

try {
    $conn = new PDO("mysql:host=" . $host . ";port=" . $port . ";dbname=" . $db_name, $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $exception) {
    echo json_encode(["error" => "Connection error: " . $exception->getMessage()]);
    exit;
}

function getJsonInput() {
    return json_decode(file_get_contents("php://input"), true);
}
?>
