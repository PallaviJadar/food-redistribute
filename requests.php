<?php 
error_reporting(E_ALL);
ini_set('display_errors', 1);
session_start();
include 'db.php';

// Fetch all food requests
$query = "SELECT * FROM food_requests ORDER BY request_date DESC";
$result = $conn->query($query);

if ($result === false) {
    die("SQL Error: " . $conn->error);
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Food Requests</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background: url('https://images.pexels.com/photos/6994982/pexels-photo-6994982.jpeg?auto=compress&cs=tinysrgb&w=600') no-repeat center center fixed;
            background-size: cover;
        }
        .container {
            max-width: 1000px;
            margin: 40px auto;
            padding: 20px;
            background: rgba(255, 255, 255, 0.9); /* Semi-transparent background for readability */
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
        }
        h2 {
            text-align: center;
            color: #444;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            background: #fff;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: center;
        }
        th {
            background-color: #f4a261;
            color: white;
        }
        td {
            background-color: #fff;
        }
        .status {
            font-weight: bold;
            padding: 5px 10px;
            border-radius: 5px;
        }
        .pending {
            background: #ffcc00;
            color: #333;
        }
        .approved {
            background: #2a9d8f;
            color: white;
        }
        .rejected {
            background: #e63946;
            color: white;
        }
        button {
            padding: 8px 12px;
            border: none;
            color: white;
            cursor: pointer;
            font-size: 14px;
            margin: 5px;
            border-radius: 5px;
        }
        .approve {
            background-color: #2a9d8f;
        }
        .reject {
            background-color: #e63946;
        }
        .approve:hover {
            background-color: #21867a;
        }
        .reject:hover {
            background-color: #b21830;
        }
    </style>
</head>
<body>

<div class="container">
    <h2>Food Requests</h2>

    <?php
    if ($result->num_rows > 0) {
        echo "<table>";
        echo "<tr><th>Food Type</th><th>People Served</th><th>Urgency</th><th>Status</th><th>Date</th><th>Action</th></tr>";

        while ($row = $result->fetch_assoc()) {
            // Dynamic status styling
            $statusClass = "";
            if ($row["request_status"] == "Pending") $statusClass = "pending";
            elseif ($row["request_status"] == "Approved") $statusClass = "approved";
            elseif ($row["request_status"] == "Rejected") $statusClass = "rejected";

            echo "<tr>";
            echo "<td>" . htmlspecialchars($row["food_type"]) . "</td>";
            echo "<td>" . htmlspecialchars($row["people_served"]) . "</td>";
            echo "<td>" . htmlspecialchars($row["urgency"]) . "</td>";
            echo "<td><span class='status $statusClass'>" . htmlspecialchars($row["request_status"]) . "</span></td>";
            echo "<td>" . htmlspecialchars($row["request_date"]) . "</td>";
            echo "<td>
                    <form action='update_status.php' method='POST'>
                        <input type='hidden' name='request_id' value='" . $row["id"] . "'>
                        <button type='submit' name='action' value='Approved' class='approve'>Approve</button>
                        <button type='submit' name='action' value='Rejected' class='reject'>Reject</button>
                    </form>
                  </td>";
            echo "</tr>";
        }

        echo "</table>";
    } else {
        echo "<p style='text-align:center; color: #777;'>No food requests available.</p>";
    }
    ?>
</div>

</body>
</html>
