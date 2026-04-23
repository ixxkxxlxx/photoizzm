-- MySQL Schema for Convo Booking

USE convo_booking;

-- Admins table
CREATE TABLE IF NOT EXISTS admins (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Packages table
CREATE TABLE IF NOT EXISTS packages (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  duration VARCHAR(50) NOT NULL,
  includes TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id VARCHAR(36) PRIMARY KEY,
  category VARCHAR(50) DEFAULT 'convocation',
  customer_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  package_name VARCHAR(255) NOT NULL,
  university VARCHAR(255) DEFAULT '',
  booking_date DATE NOT NULL,
  booking_time VARCHAR(20) NOT NULL,
  location TEXT NOT NULL,
  pax INT,
  notes TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  transportation_fee DECIMAL(10,2) DEFAULT 0,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default admin
INSERT INTO admins (id, email, password, name) 
VALUES (UUID(), 'admin@photoizzm.com', '$2a$10$rXKX3WvG9vXKX3WvG9vXKX3WvG9vXKX3WvG9vXKX3WvG9vXKX3WvG', 'Admin')
ON DUPLICATE KEY UPDATE email = email;

-- Insert default packages
INSERT INTO packages (id, name, description, price, duration, includes) VALUES
(UUID(), 'Basic Package', 'Perfect for small convocation groups', 150.00, '1 hour', 'Digital photos, 1 print'),
(UUID(), 'Standard Package', 'Best for medium-sized groups', 250.00, '2 hours', 'Digital photos, 5 prints, album'),
(UUID(), 'Premium Package', 'Complete convocation experience', 400.00, '3 hours', 'Digital photos, 10 prints, album, video');