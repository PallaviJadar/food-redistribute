<?php 
session_start();
include 'db.php';

// Check if user is logged in
if (!isset($_SESSION["user_id"]) || !isset($_SESSION["role"])) {
    die("<div class='error'>❌ Access Denied. Please log in.</div>");
}

// Allow only donors and admins to access this page
$role = $_SESSION["role"];
if ($role !== "donor" && $role !== "admin") {
    die("<div class='error'>❌ Unauthorized access.</div>");
}

// Fetch all food requests
$query = "SELECT * FROM food_requests ORDER BY request_date DESC";
$result = $conn->query($query);

if ($result === false) {
    die("<div class='error'>❌ SQL Error: " . $conn->error . "</div>");
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>All Food Requests</title>
    <link rel="stylesheet" href="assets/css/style.css">
    <style>
        body {
            font-family: Arial, sans-serif;
            background: url('https://images.pexels.com/photos/6994982/pexels-photo-6994982.jpeg?auto=compress&cs=tinysrgb&w=600') no-repeat center center fixed;
            background-size: cover;
            color: #333;
            text-align: center;
        }
        .container {
            width: 90%;
            margin: 50px auto;
            background: rgba(255, 255, 255, 0.95);
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
        }
        h2 {
            color: #007bff;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: center;
        }
        th {
            background: #f4a261;
            color: white;
        }
        .status {
            font-weight: bold;
            padding: 5px 10px;
            border-radius: 5px;
        }
        .pending { background: #ffcc00; color: #333; }
        .approved { background: #28a745; color: white; }
        .rejected { background: #dc3545; color: white; }
        .btn {
            padding: 8px 12px;
            border: none;
            cursor: pointer;
            border-radius: 5px;
            color: white;
            font-size: 14px;
        }
        .approve { background: #28a745; }
        .reject { background: #dc3545; }
        .approve:hover { background: #218838; }
        .reject:hover { background: #b21830; }
    </style>
</head>
<body>

<div class="container">
    <h2>All Food Requests</h2>

    <?php
    if ($result->num_rows > 0) {
        echo "<table>";
        echo "<tr>
                <th>Food Type</th>
                <th>People Served</th>
                <th>Preferred Time</th>
                <th>Urgency</th>
                <th>Location</th>
                <th>Status</th>
                <th>Requester</th>
                <th>Action</th>
              </tr>";

        while ($row = $result->fetch_assoc()) {
            $statusClass = strtolower($row["request_status"]);

            echo "<tr>";
            echo "<td>" . htmlspecialchars($row["food_type"]) . "</td>";
            echo "<td>" . htmlspecialchars($row["people_served"]) . "</td>";
            echo "<td>" . htmlspecialchars($row["preferred_time"]) . "</td>";
            echo "<td>" . htmlspecialchars($row["urgency"]) . "</td>";
            echo "<td>" . htmlspecialchars($row["location"]) . "</td>";
            echo "<td><span class='status $statusClass'>" . htmlspecialchars($row["request_status"]) . "</span></td>";
            echo "<td>" . htmlspecialchars($row["requester_name"]) . "<br>" . htmlspecialchars($row["requester_email"]) . "</td>";

            if ($role === "admin") {
                echo "<td>
                        <form action='update_request_status.php' method='POST'>
                            <input type='hidden' name='request_id' value='" . $row["id"] . "'>
                            <button type='submit' name='action' value='Approved' class='btn approve'>Approve</button>
                            <button type='submit' name='action' value='Rejected' class='btn reject'>Reject</button>
                        </form>
                      </td>";
            } else {
                echo "<td>-</td>"; // Donors can only view, no buttons
            }

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
