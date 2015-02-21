<html><body>
<?php

$registrationIDs = array('APA91bGmy-_QJamz2_aYYtFpVaV2ZLsyJ7NB3zTesHMIF-IjIMQDF8mkXPLR8Y9N4ENxEwf-tfIAy8mz6nQfHyi4IiYUgCa-GABeJWrjXl9xGMa_l3Z-njQy_IPKaStVpw_R2dcyHmTBAV4rvtKnfJuaQNzBjMfdow');
$message = $_POST['message'];
$url = 'http://android.googleapis.com/gcm/send';

$fields = array(
                'registration_ids'  => $registrationIDs,
                'data'              => array( "message" => $message, "title" => "Traxxman - New Message", "vibrate" => 1, "type" => "inbox"),
                );

$headers = array( 
                    'Authorization: key=AIzaSyDN9ScLD3nXbFDYg0dzyCg9PM4uLeXzexk',
                    'Content-Type: application/json'
                );

$ch = curl_init();
curl_setopt( $ch, CURLOPT_URL, $url );
curl_setopt( $ch, CURLOPT_POST, true );
curl_setopt( $ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt( $ch, CURLOPT_RETURNTRANSFER, true );
curl_setopt( $ch, CURLOPT_POSTFIELDS, json_encode( $fields ) );
$result = curl_exec($ch);
curl_close($ch);
echo $result;


?>
</body></html>
