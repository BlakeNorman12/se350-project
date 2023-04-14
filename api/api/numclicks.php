<?php
    $connect=mysqli_connect("localhost", "root", "");
    $database = mysqli_select_db($connect, "p02db");

    $EncodedData =file_get_contents('php://input');
    $DecodedData =json_decode($EncodedData, true);

    $NumClicks=$DecodedData['NumClicks'];

    $IQ = "insert into numberclicks(NumClicks) values($NumClicks)";

    $R = mysqli_query($connect, $IQ);

    if ($R) {
        $Message = "Value has been registered successfully into database";
    }else{
        $Message= "Value was not registered";
    }

    echo($Message);
?>