CREATE DATABASE Book;
USE Book;

CREATE USER IF NOT EXISTS 'bukuC5'@'localhost'
IDENTIFIED BY 'kelompokpasswordC5';

GRANT ALL PRIVILEGES ON Book.* TO 'bukuC5'@'localhost';
FLUSH PRIVILEGES;


-- TODO: Tulis query SQL kalian di sini (CREATE TABLE & INSERT) untuk inisialisasi database otomatis
CREATE TABLE Books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    judul VARCHAR(255) NOT NULL,
    penulis VARCHAR(255) NOT NULL,
    tahun INT NOT NULL,
    status ENUM('tersedia', 'dipinjam') NOT NULL DEFAULT 'tersedia'
);

CREATE TABLE Peminjaman (
    id INT AUTO_INCREMENT PRIMARY KEY,
    buku_id INT NOT NULL,
    judul VARCHAR(255) NOT NULL,
    nama_peminjam VARCHAR(255) NOT NULL,
    tanggal_pinjam DATE NOT NULL,
    tanggal_kembali DATE,
    
    CONSTRAINT fk_buku
        FOREIGN KEY (buku_id)
        REFERENCES Books(id)
        ON DELETE CASCADE
);

INSERT INTO Books (judul, penulis, tahun, status) VALUES 
('Animal Farm', 'George Orwell', 1945, 'tersedia'),
('1984', 'George Orwell', 1949, 'tersedia');