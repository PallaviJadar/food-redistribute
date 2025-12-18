<?php
session_start();
include 'db.php';

// Ensure only admin can access
if (!isset($_SESSION["user_id"]) || $_SESSION["role"] !== "admin") {
    die("❌ Access Denied.");
}

// Check if 'id' and 'status' are provided in the URL
if (isset($_GET['id']) && isset($_GET['status'])) {
    $request_id = $_GET['id'];
    $new_status = $_GET['status'];

    // Validate the status value
    $allowed_statuses = ['Approved', 'Rejected', 'Pending'];
    if (!in_array($new_status, $allowed_statuses)) {
        die("❌ Invalid status value.");
    }

    // Update the request status
    $query = "UPDATE food_requests SET request_status=? WHERE id=?";
    $stmt = $conn->prepare($query);

    if ($stmt) {
        $stmt->bind_param("si", $new_status, $request_id);
        if ($stmt->execute()) {
            echo "<script>alert('✅ Request status updated successfully!'); window.location.href='admin.php';</script>";
        } else {
            echo "<script>alert('❌ Error updating request. Please try again.'); window.location.href='admin.php';</script>";
        }
    } else {
        echo "<script>alert('❌ SQL Error: " . $conn->error . "'); window.location.href='admin.php';</script>";
    }
} else {
    echo "<script>alert('❌ Invalid Request - Missing Data'); window.location.href='admin.php';</script>";
}
?>
