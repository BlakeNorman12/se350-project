<?php

$connect=mysqli_connect("localhost", "root", "");
$database = mysqli_select_db($connect, "users");

$EncodedData =file_get_contents('php://input');
$DecodedData =json_decode($EncodedData, true);

$Username=$DecodedData['Username'];
$Password=$DecodedData['Password'];



$sql = "SELECT * from userinfo WHERE username ='$Username' AND password = '$Password'";
$result = $connect->query($sql);

if ($result->num_rows > 0) {
    echo "successful login.";
} else {
    echo "unsuccessful login.";
};


?>