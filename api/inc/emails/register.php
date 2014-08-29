<?php

$url = 'https://api.madmimi.com/mailer';
$data = array(
'username'=>'william@fairhopecomputers.com',
  'api_key'=>'f8cc2f6a1be2dca68ecba115193e622c',
  'promotion_name'=>'Traxxman Activate Account',
  'recipient'=>$em,
  'subject'=>'Traxxman - Activate your account',
  'from'=>'no-reply@traxxman.com',
  'reply_to'=>'no-reply@traxxman.com',
  'raw_html'=>'<html>
<head>
  <title>Activate your Traxxman account</title>
</head>
<body>
  <p>Hello '.$un.',</p>
  <p>Please click the following link to activate your Traxxman account:<p>
  <p>Click to Activate: <a href="https://'.$domain.'/api/activate.php?un='.$un.'&key='.$key.'"> https://'.$domain.'/api/activate.php?un='.$un.'&key='.$key.'</a></p>
  [[tracking_beacon]]
</body>
</html>'


	);

$options = array(
    'http' => array(
        'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
        'method'  => 'POST',
        'content' => http_build_query($data),
    ),
);
$context  = stream_context_create($options);
$result = file_get_contents($url, false, $context);

