<?php
session_start();
include 'db.php';

if (!isset($_SESSION["user_id"])) {
    die("❌ Please login first.");
}

// Fetch donor info
$donor_id = $_SESSION["user_id"];
$donor = $conn->query("SELECT name, email, phone FROM users WHERE id=$donor_id")->fetch_assoc();
if (!$donor) die("❌ Donor not found.");

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $food_name = $_POST["food_name"];
    $quantity = $_POST["quantity"];
    $location = $_POST["location"];
    $expiry_date = $_POST["expiry_date"];

    // Validate quantity
    if ($quantity <= 0) {
        echo "<p style='color:red;'>❌ Quantity must be greater than 0.</p>";
    } else {
        $stmt = $conn->prepare("INSERT INTO food_donations (food_name, quantity, location, expiry_date, donor_id) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("sissi", $food_name, $quantity, $location, $expiry_date, $donor_id);
        $stmt->execute();
        echo "<p style='color:green;'>✅ Donation submitted successfully.</p>";
        header("refresh:2; url=dashboard.php");
        exit();
    }
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Donate Food</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background: #f0f0f0;
            padding: 20px;
        }
        .form-container {
            background: #fff;
            padding: 25px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            max-width: 400px;
            margin: auto;
        }
        h2 {
            text-align: center;
            color: #2c3e50;
        }
        label {
            display: block;
            margin-top: 15px;
            font-weight: bold;
        }
        input, button {
            width: 100%;
            padding: 8px;
            margin-top: 5px;
            border-radius: 5px;
            border: 1px solid #ccc;
        }
        button {
            background: #27ae60;
            color: white;
            border: none;
            margin-top: 20px;
            cursor: pointer;
        }
        button:hover {
            background: #219150;
        }
        .donor-info {
            background: #ecf0f1;
            padding: 10px;
            border-radius: 5px;
            margin-top: 15px;
            font-size: 14px;
        }
    </style>
</head>

<body>
    <div class="form-container">
        <h2>Donate Food</h2>

        <div class="donor-info">
            <p><strong>Donor Name:</strong> <?= htmlspecialchars($donor['name']) ?></p>
            <p><strong>Contact:</strong> <?= htmlspecialchars($donor['phone']) ?></p>
            <p><strong>Email:</strong> <?= htmlspecialchars($donor['email']) ?></p>
        </div>

        <form method="POST">
            <label>Food Name</label>
            <input type="text" name="food_name" placeholder="e.g., Rice, Bread" required>

            <label>Quantity</label>
            <input type="number" name="quantity" min="1" placeholder="e.g., 10 (KGs or Units)" required>

            <label>Location</label>
            <input type="text" name="location" placeholder="e.g., Street, City" required>

            <label>Expiry Date</label>
            <input type="date" name="expiry_date" min="<?= date('Y-m-d') ?>" required>

            <button type="submit">Donate</button>
        </form>
    </div>
</body>

</html>
