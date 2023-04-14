<?php

$connect=mysqli_connect("localhost", "root", "");
$database = mysqli_select_db($connect, "postdata");
//$_POST
$EncodedData =file_get_contents('php://input');
$DecodedData =json_decode($EncodedData, true);

$Username=$DecodedData['PostUser'];
$Subject=$DecodedData['PostSubject'];
$Body=$DecodedData['PostBody'];

$IQ = "insert into postinfo(Username, Subject, Body) values('$Username', '$Subject', '$Body')";

$R = mysqli_query($connect, $IQ);

if ($R) {
    $Message = "Value has been registered successfully into database";
}else{
    $Message= "Value was not registered";
}

echo($Message);



?>