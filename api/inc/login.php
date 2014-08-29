<?php
function str_baseconvert($str, $frombase=10, $tobase=36) { 
    $str = trim($str); 
    if (intval($frombase) != 10) { 
        $len = strlen($str); 
        $q = 0; 
        for ($i=0; $i<$len; $i++) { 
            $r = base_convert($str[$i], $frombase, 10); 
            $q = bcadd(bcmul($q, $frombase), $r); 
        } 
    } 
    else $q = $str; 

    if (intval($tobase) != 10) { 
        $s = ''; 
        while (bccomp($q, '0', 0) > 0) { 
            $r = intval(bcmod($q, $tobase)); 
            $s = base_convert($r, 10, $tobase) . $s; 
            $q = bcdiv($q, $tobase, 0); 
        } 
    } 
    else $s = $q; 

    return $s; 
} 
function generateRandStr($length){ 
      $randstr = ""; 
      for($i=0; $i<$length; $i++){ 
         $randnum = mt_rand(0,61); 
         if($randnum < 10){ 
            $randstr .= chr($randnum+48); 
         }else if($randnum < 36){ 
            $randstr .= chr($randnum+55); 
         }else{ 
            $randstr .= chr($randnum+61); 
         } 
      } 
      return $randstr; 
   } 
        
        if (!$link = mysql_connect($host, $user, $pass)) {
            echo $_GET['callback'] . '(' . "{'status' : 'Could not connect to mysql'}" . ')';
            exit;
        }

        if (!mysql_select_db($db, $link)) {
            echo $_GET['callback'] . '(' . "{'status' : 'Could not select database'}" . ')';
            exit;
        }
        
        $sql    = 'SELECT * FROM users WHERE username = "'.$un.'" AND password = "'.$saltedHash.'"';
        $result = mysql_query($sql, $link);
        $num_rows = mysql_num_rows($result);

        //if no user exist then report error
          if ($num_rows<1) {
            
           echo $_GET['callback'] . '(' . "{'status' : 'Invalid username or password'}" . ')';
          
        }
          //Else Say we're logged in
          else{
            $sql    = 'SELECT * FROM users WHERE username = "'.$un.'" AND privilege = 1';
            $result = mysql_query($sql, $link);
            $num_rows = mysql_num_rows($result);
             if ($num_rows<1) {
                 echo $_GET['callback'] . '(' . "{'status' : 'The account $un has not been activated yet. Please check your email for activation link.'}" . ')';
             }
             else {
				 
				 $uuid = generateRandStr(32);
				 $apikey = str_baseconvert($uuid, 16, 36);
				 $sql    = 'UPDATE users SET apikey="'.$apikey.'" WHERE username="'.$un.'"';
            	 $result = mysql_query($sql, $link);
				 echo $_GET['callback'] . '(' . "{'status' : 'success', 'api' : '" . $apikey . "'}" . ')';
             }
          }