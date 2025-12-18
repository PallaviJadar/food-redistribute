<?php
session_start();
include 'db.php';

error_reporting(E_ALL);
ini_set('display_errors', 1);

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST["name"];
    $email = $_POST["email"];
    $phone = $_POST["phone"]; 
    $password = password_hash($_POST["password"], PASSWORD_DEFAULT);
    $role = $_POST["role"];

    // Validate phone number (must be exactly 10 digits)
    if (!preg_match('/^\d{10}$/', $phone)) {
        echo "<div class='error'>❌ Error: Phone number must be exactly 10 digits.</div>";
        exit();
    }

    // Validate email domain (@gmail.com or @yahoo.com only)
    if (!preg_match('/@(gmail|yahoo)\.com$/', $email)) {
        echo "<div class='error'>❌ Error: Only @gmail.com or @yahoo.com emails are allowed.</div>";
        exit();
    }

    // Check if email already exists
    $checkQuery = "SELECT * FROM users WHERE email = ?";
    $stmt = $conn->prepare($checkQuery);
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        echo "<div class='error'>❌ Error: This email is already registered.</div>";
    } else {
        // Insert new user
        $query = "INSERT INTO users (name, email, phone, password, role) VALUES (?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("sssss", $name, $email, $phone, $password, $role);

        if ($stmt->execute()) {
            echo "<div class='success'>✅ Registration successful! Redirecting to login...</div>";
            header("refresh:2; url=login.php");
            exit();
        } else {
            echo "<div class='error'>❌ Error: " . $conn->error . "</div>";
        }
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Register</title>
    <link rel="stylesheet" href="assets/css/style.css">
    <style>
        body {
            font-family: Arial, sans-serif;
            background: url('https://i.pinimg.com/474x/e0/e0/4d/e0e04d8a43217e88e4111a14121c69b2.jpg') no-repeat center center/cover;
            background-size: cover;
            text-align: center;
        }

        .container {
            width: 40%;
            margin: 50px auto;
            background: rgba(255, 255, 255, 0.9);
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
        }

        h2 {
            color: #007bff;
        }

        label {
            font-weight: bold;
            display: block;
            margin-top: 10px;
        }

        input, select, button {
            width: 100%;
            padding: 10px;
            margin: 5px 0;
            border-radius: 5px;
            border: 1px solid #ccc;
        }

        button {
            background: #28a745;
            color: white;
            font-size: 16px;
            cursor: pointer;
        }

        button:hover {
            background: #218838;
        }

        .success {
            background: #d4edda;
            color: #155724;
            padding: 10px;
            margin-bottom: 10px;
            border-radius: 5px;
        }

        .error {
            background: #f8d7da;
            color: #721c24;
            padding: 10px;
            margin-bottom: 10px;
            border-radius: 5px;
        }
    </style>
</head>
<body>

    <div class="container">
        <h2>Register</h2>
        <form method="POST" action="">
            <label>Full Name:</label>
            <input type="text" name="name" placeholder="Enter your full name" required>

            <label>Email:</label>
            <input type="email" name="email" placeholder="Enter your email (@gmail.com or @yahoo.com only)" required>

            <label>Phone Number:</label>
            <input type="text" name="phone" placeholder="Enter your 10-digit phone number" required pattern="\d{10}" title="Phone number must be exactly 10 digits">

            <label>Password:</label>
            <input type="password" name="password" placeholder="Enter a strong password" required>

            <label>Select Role:</label>
            <select name="role" required>
                <option value="donor">Donor</option>
                <option value="receiver">Receiver</option>
                <option value="admin">Admin</option>
            </select>

            <button type="submit">Register</button>
        </form>
    </div>

</body>
</html>
