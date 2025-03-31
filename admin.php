<?php
session_start();
include 'db.php';

// Check if admin is logged in
if (!isset($_SESSION["user_id"]) || $_SESSION["role"] !== "admin") {
    die("<div class='error'>❌ Access Denied.</div>");
}

// Fetch food requests
$foodRequestsQuery = "SELECT * FROM food_requests ORDER BY request_date DESC";
$foodRequests = $conn->query($foodRequestsQuery);

// Fetch donor requests
$donorRequestsQuery = "SELECT * FROM users WHERE role='donor' ORDER BY id DESC";
$donorRequests = $conn->query($donorRequestsQuery);
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Panel</title>
    <link rel="stylesheet" href="assets/css/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">

    <style>
        body {
            font-family: Arial, sans-serif;
            background: #f4f4f4;
            margin: 0;
            padding: 0;
        }

        .navbar {
            background: #333;
            color: white;
            padding: 15px;
            text-align: center;
            font-size: 20px;
            position: relative;
        }

        .logout-btn {
            position: absolute;
            right: 20px;
            top: 10px;
            background: red;
            color: white;
            padding: 8px 12px;
            text-decoration: none;
            border-radius: 5px;
            font-size: 14px;
        }

        .logout-btn:hover {
            background: darkred;
        }

        .container {
            width: 90%;
            margin: 20px auto;
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
        }

        h2, h3 {
            text-align: center;
            color: #333;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }

        table, th, td {
            border: 1px solid #ddd;
        }

        th, td {
            padding: 12px;
            text-align: center;
        }

        th {
            background: #28a745;
            color: white;
        }

        tr:nth-child(even) {
            background: #f2f2f2;
        }

        .status {
            padding: 5px 10px;
            border-radius: 5px;
            font-weight: bold;
        }

        .status.Pending {
            background: #f39c12;
            color: white;
        }

        .status.Approved {
            background: #28a745;
            color: white;
        }

        .status.Rejected {
            background: #e74c3c;
            color: white;
        }

        .btn {
            padding: 8px 12px;
            text-decoration: none;
            color: white;
            border-radius: 5px;
            font-size: 14px;
            transition: 0.3s;
        }

        .btn-approve {
            background: #28a745;
        }

        .btn-reject {
            background: #e74c3c;
        }

        .btn:hover {
            opacity: 0.8;
        }
    </style>
</head>

<body>

    <div class="navbar">
        📊 Admin Panel - Manage Requests
        <a href="logout.php" class="logout-btn">Logout</a>
    </div>

    <div class="container">
        <h3>🍽️ Food Requests</h3>
        <table>
            <tr>
                <th>Requester</th>
                <th>Food Type</th>
                <th>Status</th>
                <th>Action</th>
            </tr>
            <?php while ($row = $foodRequests->fetch_assoc()) { ?>
                <tr>
                    <td><?= htmlspecialchars($row["requester_name"]) ?></td>
                    <td><?= htmlspecialchars($row["food_type"]) ?></td>
                    <td><span class="status <?= htmlspecialchars($row["request_status"]) ?>"><?= htmlspecialchars($row["request_status"]) ?></span></td>
                    <td>
                        <a href="update_status.php?id=<?= $row['id'] ?>&status=Approved" class="btn btn-approve">Approve</a>
                        <a href="update_status.php?id=<?= $row['id'] ?>&status=Rejected" class="btn btn-reject">Reject</a>
                    </td>
                </tr>
            <?php } ?>
        </table>
    </div>

    <div class="container">
        <h3>🤝 Donor Requests</h3>
        <table>
            <tr>
                <th>Donor Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Action</th>
            </tr>
            <?php while ($row = $donorRequests->fetch_assoc()) { ?>
                <tr>
                    <td><?= htmlspecialchars($row["name"]) ?></td>
                    <td><?= htmlspecialchars($row["email"]) ?></td>
                    <td><?= htmlspecialchars($row["phone"]) ?></td>
                    <td>
                        <a href="approve_donor.php?id=<?= $row['id'] ?>" class="btn btn-approve">Approve</a>
                    </td>
                </tr>
            <?php } ?>
        </table>
    </div>

</body>
</html>
