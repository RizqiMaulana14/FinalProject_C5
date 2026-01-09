// TODO: Definisikan semua jalur (Route) aplikasi kalian disini (GET, POST, PUT, DELETE)
const express = require('express');
const router = express.Router();
const db = require('../config/database');

// READ - Halaman utama (daftar buku)
router.get('/', async (req, res) => {
  try {
    const [books] = await db.query('SELECT * FROM Books ORDER BY id DESC');
    res.render('index', { books });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error mengambil data buku');
  }
});

// CREATE - Form tambah buku (GET)
router.get('/add', (req, res) => {
  res.render('add');
});

// CREATE - Proses tambah buku (POST)
router.post('/add', async (req, res) => {
  const { judul, penulis, tahun, status } = req.body;
  try {
    await db.query(
      'INSERT INTO Books (judul, penulis, tahun, status) VALUES (?, ?, ?, ?)',
      [judul, penulis, tahun, status]
    );
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error menambah buku');
  }
});

// UPDATE - Form edit buku (GET)
router.get('/edit/:id', async (req, res) => {
  try {
    const [books] = await db.query('SELECT * FROM Books WHERE id = ?', [req.params.id]);
    if (books.length === 0) return res.status(404).send('Buku tidak ditemukan');
    res.render('edit', { book: books[0] });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error mengambil data buku');
  }
});

// UPDATE - Proses edit buku (POST)
router.post('/edit/:id', async (req, res) => {
  const { status } = req.body;

  try {
    await db.query(
      'UPDATE Books SET status = ? WHERE id = ?',
      [status, req.params.id]
    );
    res.redirect('/');
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error mengupdate buku');
  }
});



// DELETE - Hapus buku
router.post('/delete/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM Books WHERE id = ?', [req.params.id]);
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error menghapus buku');
  }
});

// ==================== PEMINJAMAN ROUTES ====================

// READ - Halaman daftar peminjaman
router.get('/peminjaman', async (req, res) => {
  try {
    const [peminjaman] = await db.query(`
      SELECT p.*, b.judul, b.penulis 
      FROM Peminjaman p
      JOIN Books b ON p.buku_id = b.id
      ORDER BY p.tanggal_pinjam DESC
    `);
    res.render('peminjaman', { peminjaman });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error mengambil data peminjaman');
  }
});

// CREATE - Form pinjam buku (GET)
router.get('/pinjam/:id', async (req, res) => {
  try {
    const [books] = await db.query('SELECT * FROM Books WHERE id = ? AND status = "Tersedia"', [req.params.id]);
    if (books.length === 0) {
      return res.status(404).send('Buku tidak tersedia atau tidak ditemukan');
    }
    res.render('pinjam', { book: books[0] });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error mengambil data buku');
  }
});

// CREATE - Proses pinjam buku (POST)
router.post('/pinjam/:id', async (req, res) => {
  const { nama_peminjam, tanggal_pinjam } = req.body;
  const bukuId = req.params.id;
  
  try {
    // Ambil info buku
    const [books] = await db.query('SELECT judul FROM Books WHERE id = ?', [bukuId]);
    if (books.length === 0) {
      return res.status(404).send('Buku tidak ditemukan');
    }

    // Insert peminjaman
    await db.query(
      'INSERT INTO Peminjaman (buku_id, judul, nama_peminjam, tanggal_pinjam) VALUES (?, ?, ?, ?)',
      [bukuId, books[0].judul, nama_peminjam, tanggal_pinjam]
    );

    // Update status buku jadi Dipinjam
    await db.query('UPDATE Books SET status = "Dipinjam" WHERE id = ?', [bukuId]);

    res.redirect('/peminjaman');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error memproses peminjaman');
  }
});

// UPDATE - Kembalikan buku
router.post('/kembalikan/:id', async (req, res) => {
  try {
    // Ambil data peminjaman
    const [peminjaman] = await db.query('SELECT buku_id FROM Peminjaman WHERE id = ?', [req.params.id]);
    if (peminjaman.length === 0) {
      return res.status(404).send('Data peminjaman tidak ditemukan');
    }

    // Update tanggal kembali
    await db.query(
      'UPDATE Peminjaman SET tanggal_kembali = CURDATE() WHERE id = ?',
      [req.params.id]
    );

    // Update status buku jadi Tersedia
    await db.query('UPDATE Books SET status = "Tersedia" WHERE id = ?', [peminjaman[0].buku_id]);

    res.redirect('/peminjaman');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error mengembalikan buku');
  }
});

// DELETE - Hapus riwayat peminjaman
router.post('/peminjaman/delete/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM Peminjaman WHERE id = ?', [req.params.id]);
    res.redirect('/peminjaman');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error menghapus data peminjaman');
  }
});

module.exports = router;