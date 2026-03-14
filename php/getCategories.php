<?php
require "db.php"; // connect to the database

// get only the categories that are marked as selected
$sql = "SELECT * FROM menuCategories ";//WHERE selected = 1";
$result = $conn->query($sql);

if(!$result){
    echo json_encode(["error"=>"Database query failed"]);
    exit;
}

$categories = [];

// loop through each row returned from the query
while ($row = $result->fetch_assoc()) {
    $categories[] = $row; // add row to the categories array
}

// return the data as JSON (useful for frontend / API requests)
echo json_encode($categories);

// close the database connection
$conn->close();
?>