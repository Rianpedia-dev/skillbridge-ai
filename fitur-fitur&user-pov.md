# Dokumentasi SkillBridge AI: User POV, Fitur, & UML

Dokumen ini menjelaskan perspektif pengguna (User POV), kapabilitas masing-masing peran, dan struktur hubungan antar pengguna dalam platform SkillBridge AI.

---

## 1. User POV (Point of View)

| Peran | Pernyataan POV |
| :--- | :--- |
| **Pencari Jasa (Customer)** | *"Sebagai individu atau pemilik bisnis yang membutuhkan bantuan profesional, saya ingin menemukan penyedia jasa yang kompeten, terpercaya, dan sesuai budget dengan dukungan AI agar proyek saya selesai tepat waktu tanpa risiko penipuan."* |
| **Penyedia Jasa (Service Provider)** | *"Sebagai tenaga ahli atau freelancer, saya ingin membangun reputasi profesional dan mendapatkan akses ke klien yang tepat secara efisien agar saya dapat meningkatkan pendapatan dan fokus pada kualitas pekerjaan saya."* |
| **Administrator** | *"Sebagai pengelola sistem, saya ingin memastikan seluruh transaksi aman, data pengguna terlindungi, dan ekosistem marketplace tetap sehat melalui monitoring fitur bertenaga AI."* |

---

## 2. Fitur Utama Per Role

Berikut adalah daftar kemampuan yang dimiliki oleh masing-masing tipe pengguna:

### A. Pencari Jasa (Customer)
- **Manajemen Akun:** Registrasi, login, dan optimasi profil pencari jasa.
- **Pencarian Cerdas:** Menjelajahi kategori jasa dan mencari layanan spesifik.
- **AI Smart Matching:** Mendapatkan rekomendasi freelancer terbaik berdasarkan kebutuhan proyek.
- **AI Price Estimator:** Mendapatkan estimasi biaya proyek berdasarkan deskripsi kebutuhan.
- **Transaksi:** Melakukan pemesanan (booking), pembayaran melalui Payment Gateway, dan konfirmasi penyelesaian.
- **Feedback:** Memberikan rating dan ulasan (review) kepada penyedia jasa.

### B. Penyedia Jasa (Service Provider)
- **Profil Profesional:** Membuat profil, menyusun portofolio, dan mengatur daftar keahlian (skills).
- **Layanan Jasa:** Menambahkan dan mengelola layanan jasa yang ditawarkan (harga, deskripsi, durasi).
- **Manajemen Pesanan:** Menerima, menolak, dan melacak status pekerjaan yang sedang berjalan.
- **AI Proposal Generator:** Membuat proposal penawaran otomatis untuk menarik minat klien.
- **Pembayaran:** Menerima pencairan dana (payout) setelah pekerjaan dikonfirmasi selesai oleh klien.

---

## 3. Rute Sistem Pembayaran (Escrow Flow)

Sistem pembayaran **SkillBridge AI** menggunakan model **Escrow (Rekening Bersama)** untuk memastikan transaksi antara **Customer** dan **Provider** aman. Dana yang dibayarkan oleh Customer tidak langsung diterima oleh Provider, tetapi akan ditahan sementara oleh sistem sampai pekerjaan selesai dan disetujui oleh Customer. Proses ini diintegrasikan dengan **Payment Gateway (Mayan.id)**.

**1. Checkout**
Customer memilih layanan yang diinginkan dan membuat pesanan melalui endpoint `POST /api/checkout`. Setelah pesanan dibuat, sistem akan menghasilkan **link pembayaran** yang terhubung dengan payment gateway.

**2. Pembayaran**
Customer kemudian melakukan pembayaran melalui halaman pembayaran eksternal yang disediakan oleh **Mayan.id** menggunakan metode pembayaran yang tersedia (transfer bank, e-wallet, dll).

**3. Webhook Pembayaran**
Setelah pembayaran berhasil, payment gateway akan mengirimkan **notifikasi otomatis (webhook)** ke endpoint `POST /api/webhooks/payment`. Sistem kemudian memperbarui status pesanan menjadi **PAID** dan dana akan disimpan sementara di dalam sistem **escrow**.

**4. Pengerjaan Pesanan**
Provider mulai mengerjakan pesanan yang telah dibayar. Selama proses ini, Provider dapat memperbarui status pesanan melalui endpoint `PATCH /api/orders/[id]/status`, misalnya dari **IN_PROGRESS** hingga **COMPLETED**.

**5. Rilis Dana**
Setelah pekerjaan selesai, Customer akan memeriksa hasil pekerjaan tersebut. Jika sudah sesuai, Customer mengonfirmasi penyelesaian melalui endpoint `POST /api/orders/[id]/release`. Setelah konfirmasi ini, sistem akan **melepaskan dana dari escrow ke saldo Provider**.

**6. Penarikan Dana (Withdrawal)**
Provider yang telah menerima saldo dari pekerjaan yang selesai dapat menarik dana tersebut ke rekening bank pribadi melalui endpoint `POST /api/payouts`.

Dengan sistem ini, **Customer terlindungi karena dana hanya diberikan jika pekerjaan selesai**, dan **Provider juga terlindungi karena dana sudah diamankan di sistem sejak awal pembayaran**.


---

## 4. UML Diagram (Role, Relationships, & Payment Flow)

Diagram berikut menggambarkan hubungan antar aktor dan fungsionalitas utama menggunakan standar Mermaid:

```mermaid
graph TD
    %% Define Actors
    User((User))
    Customer((Customer/Seeker))
    Provider((Provider/Freelancer))
    Admin((Administrator))

    %% Inheritances
    User <|-- Customer
    User <|-- Provider
    User <|-- Admin

    subgraph "Sistem SkillBridge AI"
        %% Common Features
        F1[Register/Login]
        F2[Profile Management]
        
        %% Customer Specific
        F3[Browse Services]
        F4[AI Matching & Recommendations]
        F5[AI Price Estimation]
        F6[Make Order & Payment]
        F7[Review & Rating]
        F15[Confirm Completion/Release Escrow]

        %% Provider Specific
        F8[Setup Service Listing]
        F9[Portfolio Management]
        F10[Accept/Manage Orders]
        F11[AI Proposal Generator]
        F12[Receive Payouts]

        %% Payment/Escrow Logic
        P1{Payment Gateway}
        P2[Escrow Account]
    end

    %% Mapping Actions
    User --> F1
    User --> F2
    
    Customer --> F3
    Customer --> F4
    Customer --> F5
    Customer --> F6
    F6 --> P1
    P1 -->|Success| P2
    Customer --> F15
    F15 -->|Release| F12
    Customer --> F7

    Provider --> F8
    Provider --> F9
    Provider --> F10
    Provider --> F11
    F12 --> Provider

    Admin --> F13
    Admin --> F14
```

---

*Dokumen ini merupakan bagian dari spesifikasi teknis SkillBridge AI.*
