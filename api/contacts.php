<?php
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = $conn->prepare("SELECT * FROM contacts ORDER BY submittedAt DESC");
    $stmt->execute();
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
} else if ($method === 'POST') {
    $data = getJsonInput();
    $stmt = $conn->prepare("INSERT INTO contacts (fullName, workEmail, serviceRequired, message) VALUES (?, ?, ?, ?)");
    $stmt->execute([
        $data['fullName'],
        $data['workEmail'],
        $data['serviceRequired'],
        $data['message']
    ]);
    echo json_encode(["message" => "Inquiry received"]);
}
?>
