<?php
session_start();
include 'db.php';

if (!isset($_SESSION["user_id"])) {
    die("❌ Please login to view history.");
}

$user_id = $_SESSION["user_id"];
$result = $conn->query("SELECT * FROM food_requests WHERE user_id = $user_id ORDER BY request_date DESC");
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Request History</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #f8f9fa;
            margin: 0;
            padding: 20px;
        }

        h2 {
            color: #333;
            text-align: center;
            margin-bottom: 20px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
            background: #fff;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        th, td {
            padding: 12px 15px;
            text-align: center;
            border: 1px solid #ddd;
        }

        th {
            background-color: #4CAF50;
            color: white;
        }

        tr:nth-child(even) {
            background-color: #f2f2f2;
        }

        a.button {
            display: inline-block;
            padding: 10px 20px;
            background: #4CAF50;
            color: #fff;
            text-decoration: none;
            border-radius: 5px;
            transition: 0.3s;
        }

        a.button:hover {
            background: #45a049;
        }
    </style>
</head>

<body>

    <h2>Request History</h2>

    <table>
        <tr>
            <th>ID</th>
            <th>Food Type</th>
            <th>Preferred Time</th>
            <th>Urgency</th>
            <th>Reason</th>
            <th>Location</th>
            <th>Status</th>
            <th>Document</th>
        </tr>
        <?php while ($row = $result->fetch_assoc()) { ?>
            <tr>
                <td><?= htmlspecialchars($row['id']) ?></td>
                <td><?= htmlspecialchars($row['food_type']) ?></td>
                <td><?= htmlspecialchars($row['preferred_time']) ?></td>
                <td><?= htmlspecialchars($row['urgency']) ?></td>
                <td><?= htmlspecialchars($row['reason']) ?></td>
                <td><?= htmlspecialchars($row['location']) ?></td>
                <td><?= htmlspecialchars($row['request_status']) ?></td>
                <td>
                    <?php if ($row['document']) { ?>
                        <a href="<?= htmlspecialchars($row['document']) ?>" target="_blank">View</a>
                    <?php } else { echo "N/A"; } ?>
                </td>
            </tr>
        <?php } ?>
    </table>

    <div style="text-align:center;">
        <a href="dashboard.php" class="button">⬅ Back to Dashboard</a>
    </div>

</body>
</html>
