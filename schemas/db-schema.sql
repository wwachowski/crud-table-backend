CREATE DATABASE crudTableApp;
USE crudTableApp;

CREATE table Users (
	id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
	name VARCHAR(50) NOT NULL,
    email VARCHAR(70) NOT NULL,
    password VARCHAR(255) NOT NULL,
    last_login DATETIME DEFAULT NULL, 
	registration_time DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL, 
    status ENUM ('active','blocked') NOT NULL
);