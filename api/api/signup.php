<?php

$connect=mysqli_connect("localhost", "root", "");
$database = mysqli_select_db($connect, "users");
//$_POST
$EncodedData =file_get_contents('php://input');
$DecodedData =json_decode($EncodedData, true);

$Username=$DecodedData['Username'];
$Password=$DecodedData['Password'];

$IQ = "insert into userinfo(Username, Password) values('$Username', '$Password')";

$R = mysqli_query($connect, $IQ);

if ($R) {
    $Message = "Value has been registered successfully into database";
}else{
    $Message= "Value was not registered";
}

echo($Message);



?>