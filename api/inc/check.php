<?php

        $con=mysqli_connect($dbhost,$dbuser,$dbpass,$dbname);


        if (!$link = mysql_connect($dbhost, $dbuser, $dbpass)) {
            echo $_GET['callback'] . '(' . "{'status' : 'Could not connect to mysql'}" . ')';
            exit;
        }

        if (!mysql_select_db($dbname, $link)) {
            echo $_GET['callback'] . '(' . "{'status' : 'Could not select database'}" . ')';
            exit;
        }
        
        $sql    = 'SELECT * FROM users WHERE username = "'.$un.'"';
        $result = mysql_query($sql, $link);
        $num_rows = mysql_num_rows($result);
        
          if ($num_rows<1) {
            
           echo $_GET['callback'] . '(' . "{'status' : ' is available'}" . ')';
          
        }
          else{
            echo $_GET['callback'] . '(' . "{'status' : ' is not available'}" . ')';
              
          }