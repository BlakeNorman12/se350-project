<?php


$connect=mysqli_connect("localhost", "root", "");
$database = mysqli_select_db($connect, "postdata");

$sql = "SELECT * FROM postinfo";
$result = $conn->query($sql);


if ($result->num_rows > 0) {
  
$data = array();
while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}


header('Content-Type: application/json');
echo json_encode($data);
} else {
  
  echo "[]";
}



?>