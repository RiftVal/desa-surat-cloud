const express = require("express");
const router = express.Router();
const fs = require("fs");
const multer = require("multer");

const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage });

/* =========================
   BACA DATABASE
========================= */
function readDB() {

    if (!fs.existsSync("database.json")) {
        fs.writeFileSync("database.json", "[]");
    }

    return JSON.parse(fs.readFileSync("database.json"));
}

/* =========================
   SIMPAN DATABASE
========================= */
function saveDB(data) {
    fs.writeFileSync(
        "database.json",
        JSON.stringify(data, null, 2)
    );
}

/* =========================
   TAMBAH PENGAJUAN
========================= */
router.post(
    "/pengajuan",
    upload.single("file"),
    (req, res) => {

        try {

            let db = readDB();

            const dataBaru = {
                id: Date.now().toString(),
                nama: req.body.nama,
                nik: req.body.nik,
                jenis: req.body.jenis,
                file: req.file ? req.file.filename : null,
                status: "Menunggu Verifikasi"
            };

            db.push(dataBaru);

            saveDB(db);

            res.json({
                success: true,
                message: "Pengajuan berhasil ditambahkan",
                data: dataBaru
            });

        } catch (err) {

            console.log(err);

            res.status(500).json({
                success: false,
                message: "Gagal menambah pengajuan"
            });
        }
    }
);

/* =========================
   AMBIL SEMUA DATA
========================= */
router.get("/pengajuan", (req, res) => {

    try {

        const db = readDB();

        res.json(db);

    } catch (err) {

        res.status(500).json({
            success: false,
            message: "Gagal mengambil data"
        });
    }
});

/* =========================
   UPDATE STATUS
========================= */
router.patch("/pengajuan/:id/status", (req, res) => {

    try {

        let db = readDB();

        const { status } = req.body;

        db = db.map(item => {

            if (item.id == req.params.id) {
                item.status = status;
            }

            return item;
        });

        saveDB(db);

        res.json({
            success: true,
            message: "Status berhasil diupdate"
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            success: false,
            message: "Gagal update status"
        });
    }
});

/* =========================
   DELETE PENGAJUAN
========================= */
router.delete("/pengajuan/:id", (req, res) => {

    try {

        let db = readDB();

        db = db.filter(item => item.id != req.params.id);

        saveDB(db);

        res.json({
            success: true,
            message: "Pengajuan berhasil dihapus"
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            success: false,
            message: "Gagal menghapus pengajuan"
        });
    }
});

/* =========================
   EDIT DATA PENGAJUAN
========================= */
router.put("/pengajuan/:id", (req, res) => {

    try {

        let db = readDB();

        db = db.map(item => {

            if (item.id == req.params.id) {

                item.nama = req.body.nama;
                item.nik = req.body.nik;
                item.jenis = req.body.jenis;
                item.status = req.body.status;
            }

            return item;
        });

        saveDB(db);

        res.json({
            success: true,
            message: "Data berhasil diupdate"
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            success: false,
            message: "Gagal update data"
        });
    }
});

module.exports = router;