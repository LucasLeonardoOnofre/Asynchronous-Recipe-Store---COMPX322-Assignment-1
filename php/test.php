<?php
// Connect to the database
require "db.php";

// SQL query to get all categories
$sql = "SELECT * FROM menuCategories";

// Execute the query
$result = $conn->query($sql);

// Check if the query returned any results
if ($result->num_rows > 0) {
    // Loop through each category and display its ID and name
    while ($row = $result->fetch_assoc()) {
        echo "ID: " . $row['idCategory'] . " - Name: " . $row['strCategory'] . "<br>";
    }
} else {
    // If no categories are found, show a friendly message
    echo "No categories found in the database.";
}

// Close the database connection
$conn->close();
?>