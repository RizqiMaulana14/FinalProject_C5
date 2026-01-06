CREATE DATABASE Book;
USE Book;

-- TODO: Tulis query SQL kalian di sini (CREATE TABLE & INSERT) untuk inisialisasi database otomatis
CREATE TABLE Books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    judul VARCHAR(255) NOT NULL,
    penulis VARCHAR(255) NOT NULL,
    tahun INT NOT NULL,
    status ENUM('Tersedia', 'Dipinjam') NOT NULL DEFAULT 'Tersedia'
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
('Animal Farm', 'George Orwell', 1945, 'Tersedia'),
('1984', 'George Orwell', 1949, 'Tersedia');