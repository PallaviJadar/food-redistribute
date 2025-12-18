<?php
session_start();
include 'db.php';

// Check if admin is logged in
if (!isset($_SESSION["user_id"]) || $_SESSION["role"] !== "admin") {
    die("❌ Access Denied.");
}

// Get donor ID from URL
if (isset($_GET['id'])) {
    $donor_id = $_GET['id'];

    // Update user role to 'approved_donor'
    $query = "UPDATE users SET role='approved_donor' WHERE id=?";
    $stmt = $conn->prepare($query);

    if ($stmt) {
        $stmt->bind_param("i", $donor_id);
        if ($stmt->execute()) {
            echo "<script>alert('✅ Donor approved successfully!'); window.location.href='admin.php';</script>";
        } else {
            echo "<script>alert('❌ Error approving donor. Please try again.'); window.location.href='admin.php';</script>";
        }
    } else {
        echo "<script>alert('❌ SQL Error: " . $conn->error . "'); window.location.href='admin.php';</script>";
    }
} else {
    echo "<script>alert('❌ Invalid request.'); window.location.href='admin.php';</script>";
}
?>
