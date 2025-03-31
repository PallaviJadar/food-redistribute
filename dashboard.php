<?php 
session_start();
include 'db.php';

if (!isset($_SESSION["user_id"])) {
    header("Location: login.php");
    exit();
}

$user_id = $_SESSION["user_id"];
$user_name = $_SESSION["user_name"];
$role = $_SESSION["role"];

// Fetch food donations with donor contact details
$donationsQuery = "SELECT f.id, f.food_name, f.quantity, f.expiry_date, f.location, u.name AS donor_name, u.email AS donor_email, u.phone AS donor_phone 
                   FROM food_donations f
                   JOIN users u ON f.donor_id = u.id
                   ORDER BY f.expiry_date ASC";
$donationsResult = $conn->query($donationsQuery);

// Fetch food request history for requesters
$requestsQuery = "SELECT * FROM food_requests WHERE requester_id = ?";
$requestsStmt = $conn->prepare($requestsQuery);
$requestsStmt->bind_param("i", $user_id);
$requestsStmt->execute();
$requestsResult = $requestsStmt->get_result();

?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - Food Redistribute</title>
    <link rel="stylesheet" href="assets/css/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">

    <style>
        body {
            font-family: Arial, sans-serif;
            background: url('https://images.pexels.com/photos/6646903/pexels-photo-6646903.jpeg?auto=compress&cs=tinysrgb&w=600') no-repeat center center/cover;
            background-size: cover;
            margin: 0;
            padding: 0;
        }

        .dashboard-container {
            width: 80%;
            margin: auto;
            margin-top: 50px;
            background: rgba(255, 255, 255, 0.9);
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.2);
            text-align: center;
        }

        h2 {
            color: #333;
            margin-bottom: 20px;
        }

        .dashboard-menu {
            display: flex;
            justify-content: space-around;
            margin-bottom: 20px;
            flex-wrap: wrap;
        }

        .menu-item {
            background: #28a745;
            color: white;
            padding: 15px;
            border-radius: 10px;
            width: 200px;
            margin: 10px;
            text-align: center;
            font-size: 18px;
            font-weight: bold;
            text-decoration: none;
            transition: 0.3s;
        }

        .menu-item:hover {
            background: #218838;
        }

        .menu-item i {
            margin-right: 10px;
        }

        .logout-btn {
            display: inline-block;
            padding: 10px 20px;
            background: #dc3545;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            transition: 0.3s;
        }

        .logout-btn:hover {
            background: #c82333;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            background: #fff;
        }

        table, th, td {
            border: 1px solid #ddd;
            text-align: center;
            padding: 10px;
        }

        th {
            background-color: #f4a261;
            color: white;
        }

        td {
            background-color: #fdf6ec;
        }
    </style>
</head>

<body>

    <div class="dashboard-container">
        <h2>👋 Welcome, <?= htmlspecialchars($user_name); ?>!</h2>
        <p>Your Role: <strong><?= ucfirst($role); ?></strong></p>

        <div class="dashboard-menu">
            <a href="donate.php" class="menu-item"><i class="fas fa-hand-holding-heart"></i> Donate Food</a>
            <a href="request_food.php" class="menu-item"><i class="fas fa-utensils"></i> Request Food</a>
            <a href="profile.php" class="menu-item"><i class="fas fa-user"></i> My Profile</a>
            <a href="donation_history.php" class="menu-item"><i class="fas fa-history"></i> Donation History</a>
            <a href="request_history.php" class="menu-item"><i class="fas fa-list"></i> Request History</a>
        </div>

        <!-- Available Food Donations -->
        <h3>📦 Available Food Donations</h3>
        <?php if ($donationsResult->num_rows > 0): ?>
            <table>
                <tr>
                    <th>Food Name</th>
                    <th>Quantity</th>
                    <th>Expiry Date</th>
                    <th>Location</th>
                    <th>Donor Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                </tr>
                <?php while ($row = $donationsResult->fetch_assoc()): ?>
                    <tr>
                        <td><?= htmlspecialchars($row["food_name"]); ?></td>
                        <td><?= htmlspecialchars($row["quantity"]); ?></td>
                        <td><?= htmlspecialchars($row["expiry_date"]); ?></td>
                        <td><?= htmlspecialchars($row["location"]); ?></td>
                        <td><?= htmlspecialchars($row["donor_name"]); ?></td>
                        <td><?= htmlspecialchars($row["donor_email"]); ?></td>
                        <td><?= htmlspecialchars($row["donor_phone"]); ?></td>
                    </tr>
                <?php endwhile; ?>
            </table>
        <?php else: ?>
            <p>No food donations available.</p>
        <?php endif; ?>

        <!-- Request History -->
        <h3>📜 Your Food Request History</h3>
        <?php if ($requestsResult->num_rows > 0): ?>
            <table>
                <tr>
                    <th>Food Type</th>
                    <th>People Served</th>
                    <th>Request Date</th>
                    <th>Status</th>
                </tr>
                <?php while ($row = $requestsResult->fetch_assoc()): ?>
                    <tr>
                        <td><?= htmlspecialchars($row["food_type"]); ?></td>
                        <td><?= isset($row["people_served"]) ? htmlspecialchars($row["people_served"]) : 'N/A'; ?></td>
                        <td><?= htmlspecialchars($row["request_date"]); ?></td>
                        <td><?= htmlspecialchars($row["request_status"]); ?></td>
                    </tr>
                <?php endwhile; ?>
            </table>
        <?php else: ?>
            <p>No food requests found.</p>
        <?php endif; ?>

        <br>
        <a href="logout.php" class="logout-btn"><i class="fas fa-sign-out-alt"></i> Logout</a>
    </div>

</body>
</html>
