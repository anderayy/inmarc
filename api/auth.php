<?php
require_once 'config.php';

$data = getJsonInput();
$username = $data['username'];
$password = $data['password'];

$stmt = $conn->prepare("SELECT * FROM admin_users WHERE username = ?");
$stmt->execute([$username]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

// For demo: comparing plain text. In production, use password_verify()
if ($user && $user['password'] === $password) {
    unset($user['password']); 
    echo json_encode(["success" => true, "user" => $user]);
} else {
    echo json_encode(["success" => false, "message" => "Invalid username or password"]);
}
?>
