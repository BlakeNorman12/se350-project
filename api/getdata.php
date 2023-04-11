<?php

$CN=mysqli_connect("localhost","root","");
$DB=mysqli_select_db($CN, "postdata");

$EncodedData=file_get_contents('php://input');
$DecodedData=json_decode($EncodedData, true);
//$_POST
$FindCharacter = $DecodedData["FindCharacter"];
$SQ="select * from postinfo where Username=$FindCharacter";

$TABLE=mysqli_query($CN,$SQ);

if(mysqli_num_rows($TABLE)>0)
{
    $Row = mysqli_fetch_assoc($TABLE);
    
    $Username = $Row["Username"];
    $Subject = $Row["Subject"];
    $Body = $Row["Body"];
}
else{
    $Username = "None";
    $Subject = "None";
    $Body = "None";

}
$Response[]=array("Username"=>$Username, "Subject"=>$Subject, "Body"=>$Body);
echo json_encode($Response);
?>