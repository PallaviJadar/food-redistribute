<?php
session_start();
include 'db.php';

// Ensure user is logged in
if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit();
}

$user_id = $_SESSION['user_id'];

// Fetch user details
$query = "SELECT name, email, role FROM users WHERE id = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

// Handle password update
$updateMessage = "";
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $new_password = $_POST["new_password"];
    $confirm_password = $_POST["confirm_password"];

    if ($new_password !== $confirm_password) {
        $updateMessage = "❌ Passwords do not match!";
    } else {
        $hashed_password = password_hash($new_password, PASSWORD_DEFAULT);
        $updateQuery = "UPDATE users SET password = ? WHERE id = ?";
        $stmt = $conn->prepare($updateQuery);
        $stmt->bind_param("si", $hashed_password, $user_id);

        if ($stmt->execute()) {
            $updateMessage = "✅ Password updated successfully!";
        } else {
            $updateMessage = "❌ Error updating password!";
        }
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Profile</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .container {
            max-width: 600px;
            margin: 40px auto;
            padding: 20px;
            background: #fff;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
            text-align: center;
        }
        h2 {
            color: #444;
        }
        .info {
            font-size: 18px;
            margin: 10px 0;
        }
        .update-section {
            margin-top: 20px;
            padding: 15px;
            background: #fdf6ec;
            border-radius: 8px;
        }
        .message {
            font-weight: bold;
            color: red;
            margin-bottom: 10px;
        }
        input {
            width: 90%;
            padding: 10px;
            margin: 8px 0;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 16px;
        }
        button {
            padding: 10px 15px;
            background: #2a9d8f;
            color: white;
            border: none;
            font-size: 16px;
            border-radius: 5px;
            cursor: pointer;
        }
        button:hover {
            background: #21867a;
        }
        .back-btn {
            display: block;
            width: 150px;
            margin: 20px auto;
            text-align: center;
            padding: 10px;
            background: #f4a261;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            font-size: 16px;
        }
        .back-btn:hover {
            background: #e76f51;
        }
    </style>
</head>
<body>

<div class="container">
    <h2>My Profile</h2>
    <p class="info"><strong>Name:</strong> <?= htmlspecialchars($user["name"]) ?></p>
    <p class="info"><strong>Email:</strong> <?= htmlspecialchars($user["email"]) ?></p>
    <p class="info"><strong>Role:</strong> <?= ucfirst($user["role"]) ?></p>

    <div class="update-section">
        <h3>Change Password</h3>
        <p class="message"><?= $updateMessage ?></p>
        <form method="POST" action="">
            <input type="password" name="new_password" placeholder="New Password" required><br>
            <input type="password" name="confirm_password" placeholder="Confirm Password" required><br>
            <button type="submit">Update Password</button>
        </form>
    </div>

    <a href="dashboard.php" class="back-btn">Back to Dashboard</a>
</div>

</body>
</html>
