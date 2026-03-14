<?php
// Include the database connection file
require "db.php";

// Get the category name from POST request and remove extra spaces
$categoryName = trim($_POST['categoryName']);

// Check if the category name is empty
if (empty($categoryName)) {
    // Return a JSON response indicating the error
    echo json_encode([
        "status" => "error",
        "message" => "Category name cannot be empty"
    ]);
    exit; // Stop executing the script
}

// Step 1: Check if the category already exists in the database
$stmt = $conn->prepare("SELECT * FROM menuCategories WHERE strCategory = ?");
$stmt->bind_param("s", $categoryName); // 's' = string
$stmt->execute();
$result = $stmt->get_result();
$stmt->close(); // Close the SELECT statement

// If a category with the same name exists, return an error
if ($result->num_rows > 0) {
    echo json_encode([
        "status" => "error",
        "message" => "Category already exists"
    ]);
    $conn->close();
    exit;
}

// Step 2: Insert the new category into the database
$stmt = $conn->prepare("INSERT INTO menuCategories (strCategory, selected) VALUES (?, 0)");
$stmt->bind_param("s", $categoryName); // Bind the category name

// Execute the INSERT query
$stmt->execute();

// Check if there was any error while inserting
if ($stmt->error) {
    echo json_encode([
        "status" => "error",
        "message" => $stmt->error
    ]);
} else {
    // Success response
    echo json_encode([
        "status" => "success"
    ]);
}

// Close the statement and database connection
$stmt->close();
$conn->close();
?>