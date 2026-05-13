<?php
require_once 'config.php';

try {
    $sqlFile = '../database.sql';
    if (!file_exists($sqlFile)) {
        throw new Exception("File database.sql tidak ditemukan!");
    }

    $sql = file_get_contents($sqlFile);
    
    // Hapus komentar SQL agar tidak mengganggu proses eksekusi
    $sql = preg_replace('/--.*?\n/', '', $sql);
    $sql = preg_replace('/\/\*.*?\*\//s', '', $sql);
    
    // Pisahkan berdasarkan titik koma (;)
    $queries = explode(';', $sql);
    
    $successCount = 0;
    foreach ($queries as $query) {
        $query = trim($query);
        if (!empty($query)) {
            $conn->exec($query);
            $successCount++;
        }
    }

    echo json_encode([
        "success" => true,
        "message" => "Migrasi Berhasil!",
        "queries_executed" => $successCount,
        "database" => getenv('DB_NAME') ?: "inmarc_db"
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => $e->getMessage()
    ]);
}
?>
