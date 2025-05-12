<!-- archivo: procesar_registro.php -->
<?php
// Conexión a la base de datos
$conexion = new mysqli("localhost", "root", "", "iberic cars");

// Verificar conexión
if ($conexion->connect_error) {
    die("Error de conexión: " . $conexion->connect_error);
}

// Obtener datos del formulario
$nombre = $_POST['Nombre'];
$email = $_POST['Correo'];
$password = password_hash($_POST['Password'], PASSWORD_DEFAULT); // Encriptar contraseña

// Insertar en la base de datos
$sql = "INSERT INTO usuario (Nombre, Correo, Password) VALUES (?, ?, ?)";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("sss", $nombre, $email, $password);

if ($stmt->execute()) {
    // ✅ Redireccionar al inicio (login.html) si el registro fue exitoso
    header("Location: login.html");
    exit();
} else {
    echo "Error: " . $stmt->error;
}

$stmt->close();
$conexion->close();
?>
