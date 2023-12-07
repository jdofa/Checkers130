<?php 
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "checkers";

// Connect to Database
$dbname = "checkers";
$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 

$sql = "SELECT COUNT(*) FROM GlobalBoard";
$result = $conn -> query($sql);
$total = mysqli_fetch_array($result);
$records = $total[0]; //records is the number of rows in the table

?>
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Global Leaderboards</title>
        <link rel="stylesheet" href="css/leaderboard.css">
    </head>
    <body>
        <header>
            <img class="site-logo" src="img/fresnostate.png" alt="Fresno State Logo">
            <h1>CSCI 130: Checkers Project</h1>
            <img class="site-logo" src="img/bulldog.png" alt="Fresno State Logo">
        </header>
        <nav>
            <a href="index.html">Home</a>
        </nav>
        <div id="leaderboard">
            <h1>Global Leaderboards</h1>
            <table>
                <tr>
                    <th>Username</th>
                    <th>Games Played</th>
                </tr>
                <?php 
                    $sql = "SELECT * FROM GlobalBoard";
                    $result = $conn -> query($sql);
                    //dynamic table from database
                    for ($i = 0; $i < $records; $i++) {
                        $record = mysqli_fetch_array($result);
                        echo "<tr><td> $record[0] </td>";
                        echo "<td> $record[2] </td></tr>";
                    }
                ?>
            </table>
        </div>
    </body>
</html>