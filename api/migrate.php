<?php
require_once 'config.php';

try {
    $sql = "
    CREATE TABLE IF NOT EXISTS projects (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        category ENUM('Outsourcing', 'Events', 'Procurement', 'Transport', 'Logistics', 'Technical') NOT NULL,
        description TEXT NOT NULL,
        clientName VARCHAR(255) NOT NULL,
        projectDate DATE NOT NULL,
        status ENUM('Published', 'Draft') DEFAULT 'Draft',
        featuredImage LONGTEXT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS contacts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        fullName VARCHAR(255) NOT NULL,
        workEmail VARCHAR(255) NOT NULL,
        serviceRequired VARCHAR(100) NOT NULL,
        message TEXT NOT NULL,
        submittedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS admin_users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(100),
        email VARCHAR(100)
    );

    INSERT INTO admin_users (username, password, name, email) 
    VALUES ('admin', 'admin123', 'Admin User', 'admin@inmarc.id')
    ON DUPLICATE KEY UPDATE username=username;

    INSERT IGNORE INTO projects (title, category, description, clientName, projectDate, status) VALUES
    ('Sales Award Program', 'Events', 'Comprehensive event management for nationwide sales recognition.', 'Microsoft', '2023-12-01', 'Published'),
    ('Enterprise Technical Support', 'Technical', 'Authorized Fuji Xerox service operations and maintenance.', 'Fuji Xerox', '2024-01-15', 'Published'),
    ('Nationwide Logistics Execution', 'Logistics', 'End-to-end delivery coordination for enterprise-level campaigns.', 'Intel', '2023-11-20', 'Published'),
    ('Operational Manpower Outsourcing', 'Outsourcing', 'Strategic staffing and payroll management for tech headquarters.', 'HP', '2024-02-10', 'Published');
    ";
    
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
