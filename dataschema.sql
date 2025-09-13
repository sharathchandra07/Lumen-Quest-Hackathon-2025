-- Users table
CREATE TABLE Users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('end-user', 'admin') NOT NULL
);

-- Plans table
CREATE TABLE Plans (
    plan_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    quota INT NOT NULL CHECK (quota >= 0),
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    duration_months INT DEFAULT 1 CHECK (duration_months >= 1),
    status ENUM('active', 'inactive') DEFAULT 'active'
);

-- Subscriptions table
CREATE TABLE Subscriptions (
    sub_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    plan_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status ENUM('active', 'cancelled', 'expired') DEFAULT 'active',
    auto_renew BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (plan_id) REFERENCES Plans(plan_id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT chk_dates CHECK (end_date > start_date)
);

-- Discounts table
CREATE TABLE Discounts (
    discount_id INT PRIMARY KEY AUTO_INCREMENT,
    plan_id INT NOT NULL,
    type ENUM('percentage', 'fixed') NOT NULL,
    value DECIMAL(10,2) NOT NULL CHECK (value >= 0),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    FOREIGN KEY (plan_id) REFERENCES Plans(plan_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT chk_discount_dates CHECK (end_date > start_date)
);

-- Usage History table
CREATE TABLE UsageHistory (
    usage_id INT PRIMARY KEY AUTO_INCREMENT,
    sub_id INT NOT NULL,
    data_used DECIMAL(10,2) NOT NULL CHECK (data_used >= 0),
    month INT NOT NULL CHECK (month BETWEEN 1 AND 12),
    year INT NOT NULL CHECK (year >= 2000),
    FOREIGN KEY (sub_id) REFERENCES Subscriptions(sub_id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- Audit Logs table
CREATE TABLE AuditLog (
    log_id INT PRIMARY KEY AUTO_INCREMENT,
    actor_id INT NOT NULL,
    action VARCHAR(255) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (actor_id) REFERENCES Users(user_id)
        ON DELETE CASCADE ON UPDATE CASCADE
);
