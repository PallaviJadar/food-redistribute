<?php 
session_start();
include 'db.php';

if (!isset($_SESSION["user_id"])) {
    die("❌ Please login first.");
}

$requester_id = $_SESSION["user_id"];
$requester = $conn->query("SELECT name, email, phone FROM users WHERE id=$requester_id")->fetch_assoc();
if (!$requester) die("❌ User not found.");

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $food_type = $_POST["food_type"];
    $preferred_time = $_POST["preferred_time"];
    $urgency = $_POST["urgency"];
    $reason = $_POST["reason"];
    $location = $_POST["location"];
    $document = NULL;

    if (!empty($_FILES["document"]["name"])) {
        $targetDir = "uploads/";
        $fileName = basename($_FILES["document"]["name"]);
        $targetFilePath = $targetDir . $fileName;
        $fileType = strtolower(pathinfo($targetFilePath, PATHINFO_EXTENSION));
        $allowed = ["jpg", "png", "pdf", "docx"];
        if (in_array($fileType, $allowed)) {
            if (move_uploaded_file($_FILES["document"]["tmp_name"], $targetFilePath)) {
                $document = $targetFilePath;
            } else die("❌ File upload failed.");
        } else die("❌ Invalid file type.");
    }

    $stmt = $conn->prepare("INSERT INTO food_requests (food_type, preferred_time, urgency, reason, location, user_id, document, request_status, requester_name, requester_email, requester_phone) VALUES (?, ?, ?, ?, ?, ?, ?, 'Pending', ?, ?, ?)");
    $stmt->bind_param("ssssisssss", $food_type, $preferred_time, $urgency, $reason, $location, $requester_id, $document, $requester["name"], $requester["email"], $requester["phone"]);
    $stmt->execute();

    echo "<p style='color:green;'>✅ Request submitted successfully!</p>";
    header("refresh:2; url=dashboard.php");
    exit();
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Request Food</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background: #f7f7f7;
            padding: 20px;
        }
        .form-container {
            background: #ffffff;
            padding: 30px;
            border-radius: 10px;
            max-width: 500px;
            margin: auto;
            box-shadow: 0 0 15px rgba(0,0,0,0.1);
        }
        h2 {
            text-align: center;
            color: #2c3e50;
        }
        label {
            display: block;
            margin-top: 15px;
            font-weight: bold;
            color: #34495e;
        }
        input, select, textarea, button {
            width: 100%;
            padding: 8px;
            margin-top: 5px;
            border: 1px solid #ccc;
            border-radius: 5px;
        }
        input[readonly] {
            background: #eaeaea;
        }
        textarea {
            resize: vertical;
        }
        button {
            background: #2980b9;
            color: white;
            border: none;
            margin-top: 20px;
            cursor: pointer;
            transition: 0.3s;
        }
        button:hover {
            background: #21618c;
        }
        .note {
            font-size: 12px;
            color: #7f8c8d;
        }
    </style>
</head>

<body>
    <div class="form-container">
        <h2>Request Food</h2>
        <form method="POST" enctype="multipart/form-data">

            <label>Contact Information</label>
            <input type="text" value="<?= htmlspecialchars($requester['name']) ?>" readonly>
            <input type="email" value="<?= htmlspecialchars($requester['email']) ?>" readonly>
            <input type="text" value="<?= htmlspecialchars($requester['phone']) ?>" readonly>

            <label>Food Type</label>
            <input type="text" name="food_type" placeholder="e.g., Vegetarian, Non-Vegetarian" required>

            <label>Preferred Time</label>
            <input type="time" name="preferred_time" required>

            <label>Urgency</label>
            <select name="urgency" required>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
            </select>

            <label>Reason for Request</label>
            <textarea name="reason" placeholder="Briefly explain the reason" required></textarea>

            <label>Location</label>
            <input type="text" name="location" placeholder="e.g., Street, City" required>

            <label>Upload Supporting Document (Optional)</label>
            <input type="file" name="document">
            <span class="note">Allowed types: jpg, png, pdf, docx</span>

            <button type="submit">Submit Request</button>
        </form>
    </div>
</body>

</html>
