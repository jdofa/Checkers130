<?php 
session_start();
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "checkers";
$user = $_SESSION['username'];

// Connect to Database
$dbname = "checkers";
$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 

$sql = "SELECT COUNT(*) FROM LocalBoard WHERE Username = '$user'";
$result = $conn -> query($sql);
$total = mysqli_fetch_array($result);
$records = $total[0]; //records is the number of rows in the table

?>
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Local Leaderboards</title>
        <link rel="stylesheet" href="css/localleaderboard.css">
    </head>
    <body>
        <header>
            <img class="site-logo" src="img/fresnostate.png" alt="Fresno State Logo">
            <h1>CSCI 130: Checkers Project</h1>
            <img class="site-logo" src="img/bulldog.png" alt="Fresno State Logo">
        </header>
        <nav>
            <a href="index.php">Home</a>
        </nav>
        <div id="leaderboard">
            <h1>Game History</h1>
            <table>
                <tr>
                    <th>Game ID</th>
                    <th>Player Name</th>
                    <th>Results</th>
                    <th>Game Time</th>
                </tr>
                <?php 
                    $sql = "SELECT * FROM LocalBoard WHERE Username = '$user'";
                    $result = $conn -> query($sql);
                    //dynamic table from database
                    $id = 0;
                    for ($i = 0; $i < $records; $i++) {
                        $record = mysqli_fetch_array($result);
                        if($i % 2 == 0){
                            $id += 1;
                        }
                        if($id % 2 == 0){
                            echo "<tr>";
                            echo "<td> $id </td>";
                            echo "<td> $record[2] </td>";
                            if ($record[4] == 1){
                                echo "<td> Winner </td>";
                            } else{
                                echo "<td> Loser </td>";
                            
                            }
                            echo "<td> $record[5] </td>";
                            echo "</tr>";
                        }
                        else{
                            echo "<tr style='background-color:#ced1d4;'>";
                            echo "<td style='color:#13284c;'> $id </td>";
                            echo "<td style='color:#13284c;'> $record[2] </td>";
                            if ($record[4] == 1){
                                echo "<td style='color:#13284c;'> Winner </td>";
                            } else{
                                echo "<td style='color:#13284c;'> Loser </td>";
                            
                            }
                            echo "<td style='color:#13284c;'> $record[5] </td>";
                            echo "</tr>";
                        }
                    }
                ?>
            </table>
        </div>
    </body>
</html>