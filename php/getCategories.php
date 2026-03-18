<?php
require "db.php"; // Include database connection

// Query all categories from the menuCategories table, ordered by name
$result = $conn->query("SELECT * FROM menuCategories ORDER BY strCategory");

// Initialize an empty array to store categories
$categories = [];

// Loop through each row in the result set
while($row = $result->fetch_assoc()){
    $categories[] = $row; // Add each category as an associative array
}

// Return all categories as a JSON response
echo json_encode($categories);

// Close the database connection
$conn->close();
?>