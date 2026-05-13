<?php
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            $stmt = $conn->prepare("SELECT * FROM projects WHERE id = ?");
            $stmt->execute([$_GET['id']]);
            echo json_encode($stmt->fetch(PDO::FETCH_ASSOC));
        } else {
            $stmt = $conn->prepare("SELECT * FROM projects ORDER BY createdAt DESC");
            $stmt->execute();
            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        }
        break;

    case 'POST':
        try {
            $data = getJsonInput();
            if (!$data) throw new Exception("Invalid JSON input");
            
            $stmt = $conn->prepare("INSERT INTO projects (title, category, description, clientName, projectDate, status, featuredImage) VALUES (?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $data['title'] ?? '',
                $data['category'] ?? '',
                $data['description'] ?? '',
                $data['clientName'] ?? '',
                $data['projectDate'] ?? date('Y-m-d'),
                $data['status'] ?? 'Draft',
                $data['featuredImage'] ?? ''
            ]);
            echo json_encode(["success" => true, "message" => "Project created", "id" => $conn->lastInsertId()]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["success" => false, "error" => $e->getMessage()]);
        }
        break;

    case 'PUT':
        try {
            $data = getJsonInput();
            $id = $_GET['id'] ?? null;
            if (!$id) throw new Exception("Project ID is required");
            
            $stmt = $conn->prepare("UPDATE projects SET title=?, category=?, description=?, clientName=?, projectDate=?, status=?, featuredImage=? WHERE id=?");
            $stmt->execute([
                $data['title'],
                $data['category'],
                $data['description'],
                $data['clientName'],
                $data['projectDate'],
                $data['status'],
                $data['featuredImage'],
                $id
            ]);
            echo json_encode(["success" => true, "message" => "Project updated"]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["success" => false, "error" => $e->getMessage()]);
        }
        break;

    case 'DELETE':
        try {
            $id = $_GET['id'] ?? null;
            if (!$id) throw new Exception("Project ID is required");
            
            $stmt = $conn->prepare("DELETE FROM projects WHERE id = ?");
            $stmt->execute([$id]);
            echo json_encode(["success" => true, "message" => "Project deleted"]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["success" => false, "error" => $e->getMessage()]);
        }
        break;
}
?>
