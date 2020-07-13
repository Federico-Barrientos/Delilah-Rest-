CREATE DATABASE IF NOT EXISTS delilah_resto;
USE delilah_resto;

-- Eliminate tables if they exists

--  DROP TABLE users;
--  DROP TABLE products;
--  DROP TABLE orders;
--  DROP TABLE orders_products;

-- Table creation
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(70) NOT NULL,
    fullname VARCHAR (120) NOT NULL,
    email VARCHAR (120) NOT NULL,
    phoneNumber INT(20) NOT NULL,
    user_address VARCHAR(255) NOT NULL,
    password VARCHAR(70) NOT NULL,
    is_admin BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE products (
    product_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(70) NOT NULL,
    price FLOAT NOT NULL,
    description VARCHAR (255) NOT NULL,
    img_url VARCHAR (255) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE orders (
    order_id INT PRIMARY KEY,
    order_state VARCHAR (50) NOT NULL,
    order_date DATETIME NOT NULL,
    order_description VARCHAR(255) NOT NULL,
    payment_method VARCHAR (70) NOT NULL,
    payment_amount FLOAT NOT NULL,
    user_id INT NOT NULL DEFAULT "0",
    FOREIGN KEY (user_id) REFERENCES users (user_id)
);

CREATE TABLE orders_products (
    order_product_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT,
    product_id INT,
    product_amount INT NOT NULL,
    product_price FLOAT NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders (order_id),
    FOREIGN KEY (product_id) REFERENCES products (product_id)
);

-- populate tables
INSERT INTO users
  (user_id, username, fullname, email, phoneNumber, user_address, password, is_admin)
VALUE
  (
   1,
   "FedeBarrientos",
   "Federico Barrientos",
   "fgbarrientos@gmail.com",
   156625975,
   "San Lorenzo 4570",
   "sarasa123",
   TRUE
   ),
   (
    2,
    "MartuForchino",
    "Martina Forchino",
    "martona@hotmail.com",
    153123543,
    "Callao 14??",
    "LOSRaules2126",
    FALSE
   );
 
 INSERT INTO products (name, price, description, img_url)
 VALUE(
     "French Fries",
     100,
    "100gr of the best french fries",
    "https://www.seriouseats.com/2018/04/20180309-french-fries-vicky-wasik-15-1500x1125.jpg"
 ),(
     "Chesee Burger",
     150,
    "A simple chesee burger with chesee (?)",
    "https://www.mcdonalds.com/is/image/content/dam/usa/nfl/nutrition/items/hero/desktop/t-mcdonalds-Cheeseburger.jpg"
 );