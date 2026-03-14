<?php
require "db.php"; // connect to the database

// Get the category ID from the frontend
$id = $_POST['id'];

// Prepare SQL query to delete the category
$stmt = $conn->prepare("DELETE FROM menuCategories WHERE idCategory = ?");
$stmt->bind_param("i", $id); // 'i' means integer

$stmt->execute();

// Check for errors
if($stmt->error){
    echo json_encode(["status"=>"error","message"=>$stmt->error]);
} else {
    echo json_encode(["status"=>"success"]);
}

$stmt->close(); // close the statement
$conn->close(); // close the database connection
?>