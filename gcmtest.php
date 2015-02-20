<?php

// Message to send
$message      = "the test message";
$tickerText   = "Hello there sailor";
$contentTitle = "Test Push";
$contentText  = "Test Content";

$registrationId = 'device_id';
$apiKey = "yourkey";

$response = sendNotification(
               $apiKey,
               array($registrationId),
               array('message' => $message, 'tickerText' => $tickerText, 'contentTitle' => $contentTitle, "contentText" => $contentText) );

echo $response;


/**
 * The following function will send a GCM notification using curl.
 *
 * @param $apiKey        [string]                   The Browser API key string for your GCM account
 * @param $registrationIdsArray [array]          An array of registration ids to send this notification to
 * @param $messageData [array] A named array of data to send as the notification payload
 */

function sendNotification( $apiKey, $registrationIdsArray, $messageData )

{ 
   $headers = array("Content-Type:" . "application/json", "Authorization:" . "key=" . $apiKey);
   $data = array(
       'data' => $messageData,
       'registration_ids' => $registrationIdsArray
   );

   $ch = curl_init();

   curl_setopt( $ch, CURLOPT_HTTPHEADER, $headers );
   curl_setopt( $ch, CURLOPT_URL, "https://android.googleapis.com/gcm/send" );
   curl_setopt( $ch, CURLOPT_SSL_VERIFYHOST, 0 );
   curl_setopt( $ch, CURLOPT_SSL_VERIFYPEER, 0 );
   curl_setopt( $ch, CURLOPT_RETURNTRANSFER, true );
   curl_setopt( $ch, CURLOPT_POSTFIELDS, json_encode($data) );

   $response = curl_exec($ch);
   curl_close($ch);

   return $response;

}

?>