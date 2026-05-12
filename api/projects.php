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
        $data = getJsonInput();
        $stmt = $conn->prepare("INSERT INTO projects (title, category, description, clientName, projectDate, status, featuredImage) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $data['title'],
            $data['category'],
            $data['description'],
            $data['clientName'],
            $data['projectDate'],
            $data['status'],
            $data['featuredImage']
        ]);
        echo json_encode(["message" => "Project created", "id" => $conn->lastInsertId()]);
        break;

    case 'PUT':
        $data = getJsonInput();
        $id = $_GET['id'];
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
        echo json_encode(["message" => "Project updated"]);
        break;

    case 'DELETE':
        $id = $_GET['id'];
        $stmt = $conn->prepare("DELETE FROM projects WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(["message" => "Project deleted"]);
        break;
}
?>
