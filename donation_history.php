<?php 
session_start();
include 'db.php';

// Check if the user is logged in
if (!isset($_SESSION["user_id"])) {
    die("<div class='error'>❌ Access Denied. Please <a href='login.php'>Login</a></div>");
}

$user_id = $_SESSION["user_id"];

// Fetch donations made by this donor
$query = "SELECT * FROM food_donations WHERE donor_id = ? ORDER BY donation_date DESC";
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
    <title>Donation History - Food Redistribute</title>
    <link rel="stylesheet" href="assets/css/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">

    <style>
        body {
            font-family: 'Arial', sans-serif;
            background: url('https://images.pexels.com/photos/6646903/pexels-photo-6646903.jpeg?auto=compress&cs=tinysrgb&w=600') no-repeat center center/cover;
            background-size: cover;
            margin: 0;
            padding: 0;
        }

        .container {
            width: 90%;
            max-width: 900px;
            margin: auto;
            margin-top: 50px;
            background: rgba(255, 255, 255, 0.95);
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.2);
            text-align: center;
        }

        h2 {
            color: #333;
            margin-bottom: 20px;
        }

        .back-btn {
            display: inline-block;
            padding: 10px 20px;
            background: #007bff;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin-bottom: 20px;
            transition: 0.3s;
        }

        .back-btn:hover {
            background: #0056b3;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            background: white;
        }

        table, th, td {
            border: 1px solid #ddd;
            text-align: center;
            padding: 12px;
        }

        th {
            background-color: #28a745;
            color: white;
        }

        tr:nth-child(even) {
            background-color: #f2f2f2;
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

        .no-donations {
            color: #d9534f;
            font-weight: bold;
            font-size: 18px;
            margin-top: 20px;
        }

        /* Mobile Optimization */
        @media (max-width: 768px) {
            table, th, td {
                font-size: 14px;
                padding: 8px;
            }
        }
    </style>
</head>
<body>

    <div class="container">
        <h2>📜 Your Donation History</h2>
        <a href="dashboard.php" class="back-btn"><i class="fas fa-arrow-left"></i> Back to Dashboard</a>

        <?php if ($result->num_rows > 0): ?>
            <table>
                <tr>
                    <th>Food Name</th>
                    <th>Quantity</th>
                    <th>Donation Date</th>
                    <th>Status</th>
                </tr>
                <?php while ($row = $result->fetch_assoc()): ?>
                    <tr>
                        <td><?= htmlspecialchars($row["food_name"]); ?></td>
                        <td><?= $row["quantity"]; ?></td>
                        <td><?= $row["donation_date"]; ?></td>
                        <td>
                            <span class="status <?= $row["status"]; ?>">
                                <?= ucfirst($row["status"]); ?>
                            </span>
                        </td>
                    </tr>
                <?php endwhile; ?>
            </table>
        <?php else: ?>
            <p class="no-donations">😞 No donations found.</p>
        <?php endif; ?>
    </div>

</body>
</html>
