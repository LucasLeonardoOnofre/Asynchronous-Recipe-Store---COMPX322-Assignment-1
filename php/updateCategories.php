<?php
require "db.php"; // connect to the database

// values sent from the frontend (category id and whether it should be selected or not)
$id = $_POST['id'];
$selected = $_POST['selected'];

// prepared statement to safely update the selected status
$stmt = $conn->prepare("UPDATE menuCategories SET selected=? WHERE idCategory=?");
$stmt->bind_param("ii", $selected, $id); // both values are integers

$stmt->execute(); // run the update query

// send a simple response back to the frontend
if($stmt->error){
    echo json_encode(["status"=>"error","message"=>$stmt->error]);
}else{
    echo json_encode(["status"=>"success"]);
}

$stmt->close(); // close the statement
$conn->close(); // close the database connection
?>