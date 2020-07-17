DROP DATABASE IF EXISTS delilah_resto;
CREATE DATABASE delilah_resto;
USE delilah_resto;

DROP TABLE IF EXISTS users;
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

DROP TABLE IF EXISTS products;
CREATE TABLE products (
    product_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(70) NOT NULL,
    price FLOAT NOT NULL,
    description VARCHAR (255) NOT NULL,
    img_url VARCHAR (255) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

DROP TABLE IF EXISTS orders;
CREATE TABLE orders (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    order_state VARCHAR (50) NOT NULL,
    order_date DATETIME NOT NULL,
    order_description VARCHAR(255) NOT NULL,
    payment_method VARCHAR (70) NOT NULL,
    payment_amount FLOAT NOT NULL,
    updatedAt DATETIME,
    user_id INT NOT NULL
);

DROP TABLE IF EXISTS orders_products;
CREATE TABLE orders_products (
    order_product_id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    product_id INT NOT NULL,
    order_id INT NOT NULL,
    product_price INT NOT NULL,
    product_amount INT NOT NULL,
    total INT NOT NULL
);


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
    "ACDCYoung",
    "Angus Young",
    "backinblack@hotmail.com",
    113123543,
    "Seattle Avenue 123",
    "TNT",
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
    "A simple chesee burger with chesee",
    "https://www.mcdonalds.com/is/image/content/dam/usa/nfl/nutrition/items/hero/desktop/t-mcdonalds-Cheeseburger.jpg"
 ),(
     "Cesar salad",
     130,
    "A salad without meat",
    "https://natashaskitchen.com/wp-content/uploads/2019/01/Caesar-Salad-Recipe-3.jpg"
 ),(
     "Hotdog",
     100,
    "A hotdog with 3 with fries on top",
    "https://images-gmi-pmc.edge-generalmills.com/74e022a5-cbd3-4fb9-86f3-3f3f747ba681.jpg"
 );



 INSERT INTO orders (order_state, order_date, order_description, payment_method, payment_amount , user_id)
 VALUE(
     "delivered",
     NOW(),
     "2x French Fries - 9x Hotdog",
     "cash",
     1100,
     2
 );

