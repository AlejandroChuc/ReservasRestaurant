CREATE DATABASE IF NOT EXISTS reservas_restaurante;
USE reservas_restaurante;

CREATE TABLE Huesped (
  id_huesped INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL,
  apellido_paterno VARCHAR(50) NOT NULL,
  apellido_materno VARCHAR(50) NOT NULL,
  num_habitacion VARCHAR(50) NOT NULL,
  numero_personas INT NOT NULL,
  fecha_llegada DATE NOT NULL,
  fecha_salida DATE NOT NULL,
  correo VARCHAR(50) NOT NULL
);

CREATE TABLE Restaurante (
  id_restaurante INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  capacidad_max INT NOT NULL,
  descripción TEXT
);

CREATE TABLE Horario_Restaurante (
  id_horario INT AUTO_INCREMENT PRIMARY KEY,
  id_restaurante INT NOT NULL,
  bloque_comida ENUM('Desayuno','Comida','Cena') NOT NULL,
  hora_inicio TIME NOT NULL,
  hora_fin TIME NOT NULL,
  FOREIGN KEY (id_restaurante) REFERENCES Restaurante(id_restaurante)
);

CREATE TABLE Reserva (
  id_reserva INT AUTO_INCREMENT PRIMARY KEY,
  id_huesped INT NOT NULL,
  id_horario INT NOT NULL,
  fecha_reserva DATE NOT NULL,
  num_personas INT NOT NULL,
  estado ENUM('Pendiente', 'Confirmada', 'Cancelada') NOT NULL,
  confirmacion BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (id_huesped) REFERENCES Huesped(id_huesped),
  FOREIGN KEY (id_horario) REFERENCES Horario_Restaurante(id_horario)
);

CREATE TABLE Colaborador (
  id_colaborador INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL,
  usuario VARCHAR(30) UNIQUE NOT NULL,
  contraseña VARCHAR(255) NOT NULL
);