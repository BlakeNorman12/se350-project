<?php
    $connect=mysqli_connect("localhost", "root", "");
    $database = mysqli_select_db($connect, "chirpclicks");

    $EncodedData =file_get_contents('php://input');
    $DecodedData =json_decode($EncodedData, true);

    $surveyClicks=$DecodedData['SurveyClicks'];
    $feedClicks=$DecodedData['FeedClicks'];
    $postClicks=$DecodedData['PostClicks'];
    $profileClicks=$DecodedData['ProfileClicks'];

    $IQ = "insert into numclicks(SurveyClicks, FeedClicks, PostClicks, ProfileClicks) values($surveyClicks, $feedClicks, $postClicks, $profileClicks)";

    $R = mysqli_query($connect, $IQ);

    if ($R) {
        $Message = "Value has been registered successfully into database";
    }else{
        $Message= "Value was not registered";
    }

    echo($Message);
?>