<?php
session_start();

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Food Redistribute</title>
    
    <!-- ✅ Linking External CSS -->
    <link rel="stylesheet" href="assets/css/style.css">
    
    <!-- ✅ FontAwesome for icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">

    <style>
        /* 🔹 General Styles */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Poppins', sans-serif;
        }

        body {
            background-color: #f8f9fa;
            color: #333;
            text-align: center;
        }

        /* 🔹 Header (Navbar) */
        header {
            background: #007bff;
            color: white;
            padding: 15px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: fixed;
            width: 100%;
            top: 0;
            left: 0;
            z-index: 1000;
            box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
        }

        .logo {
            font-size: 22px;
            font-weight: bold;
        }

        nav ul {
            list-style: none;
            display: flex;
        }

        nav ul li {
            margin: 0 15px;
        }

        nav ul li a {
            color: white;
            text-decoration: none;
            font-weight: bold;
            transition: 0.3s;
        }

        nav ul li a:hover {
            color: #ffcc00;
        }

        /* ✅ Background Image Fix */
        .hero {
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            text-align: center;
            background: url('https://images.pexels.com/photos/8931674/pexels-photo-8931674.jpeg?auto=compress&cs=tinysrgb&w=600') no-repeat center center/cover;
            position: relative;
        }
        
        /* 🔹 Overlay Effect */
        .hero::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.3); /* Slightly transparent overlay */
        }

        /* 🔹 Hero Content */
        .hero-content {
            position: relative;
            z-index: 2;
            color: white;
            padding: 20px;
        }

        .hero h1 {
            font-size: 3rem;
            margin-bottom: 10px;
        }

        .hero p {
            font-size: 1.4rem;
            margin-bottom: 20px;
        }

        /* 🔹 Buttons */
        .hero-buttons .btn {
            display: inline-block;
            padding: 12px 25px;
            margin: 10px;
            border-radius: 25px;
            text-decoration: none;
            font-size: 1.2rem;
            font-weight: bold;
            transition: all 0.3s ease;
        }

        .donate {
            background: #28a745;
            color: white;
            border: 2px solid #28a745;
        }

        .donate:hover {
            background: white;
            color: #28a745;
        }

        .request {
            background: #ffc107;
            color: black;
            border: 2px solid #ffc107;
        }

        .request:hover {
            background: white;
            color: #ffc107;
        }

        /* 🔹 Footer */
        footer {
            background: #343a40;
            color: white;
            padding: 15px;
            width: 100%;
            margin-top: 20px;
        }
    </style>
</head>
<body>

    <!-- 🔹 Header (Navigation Bar) -->
    <header>
    <div class="logo">🍽️ Food Redistribute</div>
    <nav>
        <ul>
            <li><a href="home.php">Home</a></li>  <!-- ✅ Corrected Link -->
            <li><a href="donate.php">Donate Food</a></li>
            <li><a href="request_food.php">Request Food</a></li>
            <?php if (isset($_SESSION['user_id'])): ?>
                <li><a href="dashboard.php">Dashboard</a></li>
                <li><a href="logout.php">Logout</a></li>
            <?php else: ?>
                <li><a href="register.php">Register</a></li>
                <li><a href="login.php">Login</a></li>
            <?php endif; ?>
        </ul>
    </nav>
</header>

    <!-- 🔹 Hero Section -->
    <section class="hero">
        <div class="hero-content">
            <h1>Help End Hunger, One Meal at a Time</h1>
            <p>Donate surplus food or request food if in need. Together, we make a difference.</p>
            <div class="hero-buttons">
                <a href="donate.php" class="btn donate">Donate Food</a>
                <a href="request_food.php" class="btn request">Request Food</a>
            </div>
        </div>
    </section>

    <!-- 🔹 Footer -->
    <footer>
        <p>&copy; 2025 Food Redistribute. All rights reserved.</p>
    </footer>

</body>
</html>
