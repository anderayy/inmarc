<?php
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
    requireAuth();
    $stmt = $conn->prepare("SELECT * FROM contacts ORDER BY submittedAt DESC");
    $stmt->execute();
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
} else if ($method === 'POST') {
    $data = getJsonInput() ?? [];
    if (
        empty($data['fullName']) ||
        empty($data['workEmail']) ||
        empty($data['serviceRequired']) ||
        empty($data['message'])
    ) {
        http_response_code(422);
        echo json_encode(["success" => false, "message" => "Invalid contact payload"]);
        exit;
    }

    $stmt = $conn->prepare("INSERT INTO contacts (fullName, workEmail, serviceRequired, message) VALUES (?, ?, ?, ?)");
    $stmt->execute([
        $data['fullName'],
        $data['workEmail'],
        $data['serviceRequired'],
        $data['message']
    ]);
    echo json_encode(["success" => true, "message" => "Inquiry received"]);
} else {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
}
?>
