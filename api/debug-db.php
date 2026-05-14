<?php
require_once 'config.php';

if (!isMaintenanceAllowed()) {
    http_response_code(403);
    echo json_encode(["success" => false, "message" => "Forbidden"]);
    exit;
}

requireAuth();

// Script ini untuk mengecek apakah Vercel sudah membaca data dari Environment Variables dengan benar
// Tenang, password akan disensor demi keamanan.

$debug = [
    "DB_HOST" => [
        "raw" => $_ENV['DB_HOST'] ?? $_SERVER['DB_HOST'] ?? getenv('DB_HOST') ?: "TIDAK TERDETEKSI (Default: localhost)",
        "status" => (isset($_ENV['DB_HOST']) || isset($_SERVER['DB_HOST']) || getenv('DB_HOST')) ? "OK" : "MISSING"
    ],
    "DB_PORT" => [
        "raw" => $_ENV['DB_PORT'] ?? $_SERVER['DB_PORT'] ?? getenv('DB_PORT') ?: "TIDAK TERDETEKSI (Default: 3306)",
        "status" => (isset($_ENV['DB_PORT']) || isset($_SERVER['DB_PORT']) || getenv('DB_PORT')) ? "OK" : "MISSING"
    ],
    "DB_USER" => [
        "raw" => $_ENV['DB_USER'] ?? $_SERVER['DB_USER'] ?? getenv('DB_USER') ?: "TIDAK TERDETEKSI (Default: root)",
        "status" => (isset($_ENV['DB_USER']) || isset($_SERVER['DB_USER']) || getenv('DB_USER')) ? "OK" : "MISSING"
    ],
    "DB_NAME" => [
        "raw" => $_ENV['DB_NAME'] ?? $_SERVER['DB_NAME'] ?? getenv('DB_NAME') ?: "TIDAK TERDETEKSI (Default: inmarc_db)",
        "status" => (isset($_ENV['DB_NAME']) || isset($_SERVER['DB_NAME']) || getenv('DB_NAME')) ? "OK" : "MISSING"
    ],
    "DB_PASS_STATUS" => (isset($_ENV['DB_PASS']) || isset($_SERVER['DB_PASS']) || getenv('DB_PASS')) ? "TERISI (HIDDEN)" : "KOSONG/MISSING",
    "SERVER_SOFTWARE" => $_SERVER['SERVER_SOFTWARE'] ?? "Unknown"
];

echo json_encode($debug, JSON_PRETTY_PRINT);
?>
