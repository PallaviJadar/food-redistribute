<?php
session_start();
include 'db.php';

if (!isset($_SESSION["user_id"]) || $_SESSION["role"] !== "admin") {
    die("<div class='error'>❌ Unauthorized access.</div>");
}

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST["request_id"], $_POST["action"])) {
    $request_id = $_POST["request_id"];
    $new_status = $_POST["action"];

    $query = "UPDATE food_requests SET request_status = ? WHERE id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("si", $new_status, $request_id);

    if ($stmt->execute()) {
        echo "<div class='success'>✅ Request updated successfully!</div>";
        header("refresh:2; url=all_requests.php");
        exit();
    } else {
        echo "<div class='error'>❌ Error updating request.</div>";
    }
}
?>
