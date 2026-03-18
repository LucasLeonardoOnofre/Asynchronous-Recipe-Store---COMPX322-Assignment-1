<?php
require "db.php"; // Include database connection

// Check if required POST parameters are provided
if(!isset($_POST['id']) || !isset($_POST['selected'])){
    echo json_encode([
        "status" => "error",
        "message" => "Missing parameters"
    ]);
    exit; // Stop execution if parameters are missing
}

// Get values from POST and ensure they are integers
$id = (int)$_POST['id'];          // Category ID to update
$selected = (int)$_POST['selected']; // New selected status (0 or 1)

// Prepare SQL statement to update the 'selected' column
$stmt = $conn->prepare("UPDATE menuCategories SET selected=? WHERE idCategory=?");

// Bind parameters: both are integers
$stmt->bind_param("ii", $selected, $id);

// Execute the statement and check for success
if($stmt->execute()){
    // Send success response as JSON
    echo json_encode(["status" => "success"]);
} else {
    // Send error response with database error message
    echo json_encode([
        "status" => "error",
        "message" => $stmt->error
    ]);
}

// Close statement and database connection
$stmt->close();
$conn->close();
?>