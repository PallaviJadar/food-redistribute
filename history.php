<?php
session_start();
include 'db.php';

if (!isset($_SESSION["user_id"])) {
    die("<div class='error'>❌ Please log in to view your request history.</div>");
}

$user_id = $_SESSION["user_id"];

// Fetch user's request history
$query = "SELECT id, food_type, people_served, preferred_time, urgency, reason, location, request_status, request_date 
          FROM food_requests WHERE requester_id = ? ORDER BY request_date DESC";

$stmt = $conn->prepare($query);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Request History</title>
    <link rel="stylesheet" href="assets/css/style.css">
    <style>
        body {
            font-family: Arial, sans-serif;
            background: url('https://images.pexels.com/photos/6994982/pexels-photo-6994982.jpeg') no-repeat center center fixed;
            background-size: cover;
            color: #333;
        }
        .container {
            max-width: 1000px;
            margin: 40px auto;
            padding: 20px;
            background: rgba(255, 255, 255, 0.9);
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
    </style>
</head>
<body>

<div class="container">
    <h2>Your Food Request History</h2>

    <?php
    if ($result->num_rows > 0) {
        echo "<table>";
        echo "<tr><th>Food Type</th><th>People Served</th><th>Preferred Time</th><th>Urgency</th><th>Reason</th><th>Location</th><th>Status</th><th>Date</th></tr>";

        while ($row = $result->fetch_assoc()) {
            $statusClass = "";
            if ($row["request_status"] == "Pending") $statusClass = "pending";
            elseif ($row["request_status"] == "Approved") $statusClass = "approved";
            elseif ($row["request_status"] == "Rejected") $statusClass = "rejected";

            echo "<tr>";
            echo "<td>" . htmlspecialchars($row["food_type"]) . "</td>";
            echo "<td>" . htmlspecialchars($row["people_served"]) . "</td>";
            echo "<td>" . htmlspecialchars($row["preferred_time"]) . "</td>";
            echo "<td>" . htmlspecialchars($row["urgency"]) . "</td>";
            echo "<td>" . htmlspecialchars($row["reason"]) . "</td>";
            echo "<td>" . htmlspecialchars($row["location"]) . "</td>";
            echo "<td><span class='status $statusClass'>" . htmlspecialchars($row["request_status"]) . "</span></td>";
            echo "<td>" . htmlspecialchars($row["request_date"]) . "</td>";
            echo "</tr>";
        }

        echo "</table>";
    } else {
        echo "<p style='text-align:center; color: #777;'>No food requests found.</p>";
    }
    ?>
</div>

</body>
</html>
