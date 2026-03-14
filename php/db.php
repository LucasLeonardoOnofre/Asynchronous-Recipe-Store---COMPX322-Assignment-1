<?php
// DATABASE CONFIGURATION - Update these for UoW lab MySQL server
$host = "localhost";        // MySQL server host
$user = "root";             // Database username
$password = "";             // Database password (blank for local)
$db = "recipe_store";          // Database name from assignment SQL dump

// CREATE DB CONNECTION using MySQLi
$conn = new mysqli($host, $user, $password, $db);

// CHECK CONNECTION - Stop execution if failed
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);  // Assignment requires error handling
}
?>
