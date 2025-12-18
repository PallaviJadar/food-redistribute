<?php 
session_start();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>About | Food Redistribute</title>
    
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
            color: white;
            text-align: center;
        }

        /* 🔹 Header (Navbar) */
        header {
            background: rgba(0, 123, 255, 0.9);
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

        /* 🔹 Hero Section - Full Screen Background with Dark Overlay */
        .hero {
            width: 100vw;
            height: 100vh; /* Full screen height */
            background: url('https://images.pexels.com/photos/6646981/pexels-photo-6646981.jpeg') no-repeat center center/cover;
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            text-align: center;
            color: white;
        }

        /* 🔹 Overlay Effect */
        .hero::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.6); /* Dark overlay */
        }

        /* 🔹 Hero Content */
        .hero h1, .hero p {
            position: relative;
            z-index: 2; /* Bring text above overlay */
        }

        .hero h1 {
            font-size: 3rem;
            color: #ffcc00; /* Yellow for contrast */
        }

        .hero p {
            font-size: 1.2rem;
            margin-top: 10px;
        }

        /* 🔹 Features Section */
        .features {
            display: flex;
            justify-content: center;
            gap: 30px;
            padding: 50px;
            flex-wrap: wrap;
        }

        .feature-box {
            background: rgba(255, 255, 255, 0.9);
            padding: 20px;
            border-radius: 8px;
            width: 250px;
            text-align: center;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
            color: black;
        }

        .feature-box i {
            font-size: 3rem;
            color: #007bff;
            margin-bottom: 10px;
        }

        .feature-box h3 {
            font-size: 1.4rem;
            margin-bottom: 10px;
        }

        /* 🔹 Footer */
        footer {
            background: #343a40;
            color: white;
            padding: 15px;
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
                <li><a href="index.php">Home</a></li>
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
        <h1>About Food Redistribute</h1>
        <p>We aim to eliminate food waste and feed the hungry by connecting food donors with those in need.</p>
    </section>

    <!-- 🔹 Features Section -->
    <section class="features">
        <div class="feature-box">
            <i class="fas fa-hand-holding-heart"></i>
            <h3>Easy Donations</h3>
            <p>Donate surplus food in just a few clicks.</p>
        </div>

        <div class="feature-box">
            <i class="fas fa-users"></i>
            <h3>Helping Communities</h3>
            <p>We connect donors with needy communities.</p>
        </div>

        <div class="feature-box">
            <i class="fas fa-truck"></i>
            <h3>Delivery Tracking</h3>
            <p>Track food deliveries in real-time.</p>
        </div>

        <div class="feature-box">
            <i class="fas fa-map-marker-alt"></i>
            <h3>Location Based</h3>
            <p>Find food donations near you with Google Maps.</p>
        </div>

        <div class="feature-box">
            <i class="fas fa-bell"></i>
            <h3>Notifications</h3>
            <p>Get notified about new food donations instantly.</p>
        </div>
    </section>

    <!-- 🔹 Footer -->
    <footer>
        <p>&copy; 2025 Food Redistribute. All rights reserved.</p>
    </footer>

</body>
</html>
