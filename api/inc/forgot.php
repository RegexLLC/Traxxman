<?php

        $con=mysqli_connect($dbhost,$dbuser,$dbpass,$dbname);


        if (!$link = mysql_connect($dbhost, $dbuser, $dbpass)) {
            echo $_GET['callback'] . '(' . "{'status' : 'Could not connect to mysql'}" . ')';
            exit;
        }

        if (!mysql_select_db($db, $link)) {
            echo $_GET['callback'] . '(' . "{'status' : 'Could not select database'}" . ')';
            exit;
        }
        if (filter_var($em, FILTER_VALIDATE_EMAIL)) {
            $sql    = 'SELECT * FROM users WHERE email = "'.$em.'"';
            $result = mysql_query($sql, $link);
            $num_rows = mysql_num_rows($result);

                //if no email exist display error
              if ($num_rows<1) {

               echo $_GET['callback'] . '(' . "{'status' : 'Sorry we are not currently tracking $em.'}" . ')';

            }
                //Else if email exist then send email and display success message
              else{
                echo $_GET['callback'] . '(' . "{'status' : 'Your password resset instructions have been sent to $em'}" . ')';

              }
        }
        else{
            echo $_GET['callback'] . '(' . "{'status' : 'Sorry invalid email address'}" . ')';
          
        }