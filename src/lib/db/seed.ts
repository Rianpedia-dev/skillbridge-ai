import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { config } from "dotenv";
import * as schema from "./schema";
import crypto from "crypto";
import { eq, inArray } from "drizzle-orm";

config({ path: ".env.local" });

const client = postgres(process.env.DATABASE_URL!, { prepare: false });
const db = drizzle(client, { schema });

async function clearData() {
    console.log("🧹 Clearing existing demo data terms...");
    await db.delete(schema.review);
    await db.delete(schema.order);
    await db.delete(schema.service);
    await db.delete(schema.freelancerProfile);
    const usersToDelete = await db.query.user.findMany({
        where: (users, { like }) => like(users.email, "%@example.com")
    });
    if (usersToDelete.length > 0) {
        await db.delete(schema.user).where(inArray(schema.user.id, usersToDelete.map(u => u.id)));
    }
}

async function seed() {
    await clearData();
    console.log("🌱 Seeding comprehensive data...");

    // 1. Categories
    const categoryData = [
        { id: crypto.randomUUID(), name: "Design", slug: "design", description: "Desain grafis, UI/UX, dll", icon: "Palette" },
        { id: crypto.randomUUID(), name: "Programming", slug: "programming", description: "Web, app dev", icon: "Code" },
        { id: crypto.randomUUID(), name: "Video Editing", slug: "video-editing", description: "Edit video, motion", icon: "Video" },
        { id: crypto.randomUUID(), name: "Photography", slug: "photography", description: "Foto produk, event", icon: "Camera" },
        { id: crypto.randomUUID(), name: "Digital Marketing", slug: "marketing", description: "SEO, Ads, Media Sosial", icon: "TrendingUp" },
        { id: crypto.randomUUID(), name: "Writing & Translation", slug: "writing", description: "Artikel, Copywriting, Translator", icon: "PenTool" },
        { id: crypto.randomUUID(), name: "Music & Audio", slug: "music", description: "Voice Over, Mixing, Audio", icon: "Music" },
        { id: crypto.randomUUID(), name: "Business", slug: "business", description: "Konsultasi, Pajak, Bisnis", icon: "Briefcase" },
        { id: crypto.randomUUID(), name: "Education", slug: "education", description: "Tutor, Les Privat, Kursus", icon: "GraduationCap" },
        { id: crypto.randomUUID(), name: "Home Service", slug: "home-service", description: "Maintenance & Repair", icon: "Wrench" }
    ];

    const dbCategories: any[] = [];
    for (const cat of categoryData) {
        const existing = await db.query.serviceCategory.findFirst({
            where: eq(schema.serviceCategory.slug, cat.slug)
        });
        let catId: any = cat.id;
        if (!existing) {
            const [inserted] = await db.insert(schema.serviceCategory).values(cat).returning();
            catId = inserted.id;
        } else {
            catId = existing.id;
        }
        dbCategories.push({ ...cat, id: catId });
    }
    console.log("✅ Categories prepared.");

    const getCatId = (slug: string) => dbCategories.find(c => c.slug === slug)?.id || dbCategories[0].id;

    // 2. Users (Freelancers)
    const freelancers = [
        {
            user: { id: crypto.randomUUID(), name: "Rina Anggraini", email: "f1@example.com", emailVerified: true, role: "freelancer" as const, image: "https://i.pravatar.cc/150?u=f1" },
            profile: { title: "Senior Graphic Designer", bio: "Ahli desain grafis berpengalaman.", location: "Jakarta", skills: ["Figma", "Illustrator"], hourlyRate: 150000, completedProjects: 128 },
            services: [
                { title: "Desain Logo Profesional & Brand Identity", description: "3 konsep desain, unlimited revisi, file master lengkap.", price: 500000, categorySlug: "design", image: "https://images.unsplash.com/photo-1626785774573-4b799315345d" }
            ]
        },
        {
            user: { id: crypto.randomUUID(), name: "Budi Santoso", email: "f2@example.com", emailVerified: true, role: "freelancer" as const, image: "https://i.pravatar.cc/150?u=f2" },
            profile: { title: "Fullstack Web Developer", bio: "Membangun website perusahaan cepat dan aman.", location: "Surabaya", skills: ["Next.js", "Node.js"], hourlyRate: 200000, completedProjects: 85 },
            services: [
                { title: "Pembuatan Website Company Profile", description: "Website cepat, SEO friendly, responsive.", price: 2000000, categorySlug: "programming", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f" }
            ]
        },
        {
            user: { id: crypto.randomUUID(), name: "CreativeMotion", email: "f3@example.com", emailVerified: true, role: "freelancer" as const, image: "https://i.pravatar.cc/150?u=f3" },
            profile: { title: "Video Editor & Motion Designer", bio: "Spesialis video YouTube dan TikTok.", location: "Bandung", skills: ["Premiere Pro"], hourlyRate: 100000, completedProjects: 210 },
            services: [
                { title: "Edit Video YouTube / Podcast", description: "Durasi 10-20 menit, color grading.", price: 300000, categorySlug: "video-editing", image: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d" }
            ]
        },
        {
            user: { id: crypto.randomUUID(), name: "Siska Writers", email: "f4@example.com", emailVerified: true, role: "freelancer" as const, image: "https://i.pravatar.cc/150?u=f4" },
            profile: { title: "Content Writer & SEO", bio: "Menulis artikel ramah SEO.", location: "Yogyakarta", skills: ["SEO", "Copywriting"], hourlyRate: 80000, completedProjects: 156 },
            services: [
                { title: "Jasa Penulisan Artikel SEO 1000 Kata", description: "Artikel original, riset kata kunci.", price: 150000, categorySlug: "writing", image: "https://images.unsplash.com/photo-1455390582262-044cdead277a" }
            ]
        },
        {
            user: { id: crypto.randomUUID(), name: "Arif Tech", email: "f5@example.com", emailVerified: true, role: "freelancer" as const, image: "https://i.pravatar.cc/150?u=f5" },
            profile: { title: "Audio Engineer", bio: "Spesialis Voice Over dan audio mixing.", location: "Malang", skills: ["Mixing", "Voice Acting"], hourlyRate: 120000, completedProjects: 92 },
            services: [
                { title: "Jasa Voice Over Profesional", description: "Suara jernih untuk iklan/YouTube.", price: 250000, categorySlug: "music", image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc" }
            ]
        },
        {
            user: { id: crypto.randomUUID(), name: "Sarah Legal", email: "f6@example.com", emailVerified: true, role: "freelancer" as const, image: "https://i.pravatar.cc/150?u=f6" },
            profile: { title: "Legal Consultant", bio: "Konsultasi hukum kontrak bisnis.", location: "Jakarta", skills: ["Business Law"], hourlyRate: 400000, completedProjects: 35 },
            services: [
                { title: "Drafting & Review Kontrak Bisnis", description: "Pastikan kontrak Anda aman secara hukum.", price: 1500000, categorySlug: "business", image: "https://images.unsplash.com/photo-1505664194779-8beaceb93744" }
            ]
        },
        {
            user: { id: crypto.randomUUID(), name: "Irfan Motion", email: "f7@example.com", emailVerified: true, role: "freelancer" as const, image: "https://i.pravatar.cc/150?u=f7" },
            profile: { title: "2D Animator", bio: "Video animasi explainer menarik.", location: "Semarang", skills: ["Animation"], hourlyRate: 180000, completedProjects: 54 },
            services: [
                { title: "Pembuatan Video Animasi Explainer", description: "Video animasi untuk promosi produk.", price: 2500000, categorySlug: "video-editing", image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f" }
            ]
        },
        {
            user: { id: crypto.randomUUID(), name: "Lina Interior", email: "f8@example.com", emailVerified: true, role: "freelancer" as const, image: "https://i.pravatar.cc/150?u=f8" },
            profile: { title: "Interior Designer", bio: "Desain interior rumah estetik.", location: "Jakarta", skills: ["SketchUp"], hourlyRate: 250000, completedProjects: 38 },
            services: [
                { title: "Desain Layout & Render 3D Interior", description: "Visualisasi 3D fotorealistik.", price: 1500000, categorySlug: "design", image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6" }
            ]
        },
        {
            user: { id: crypto.randomUUID(), name: "Niko Dev", email: "f9@example.com", emailVerified: true, role: "freelancer" as const, image: "https://i.pravatar.cc/150?u=f9" },
            profile: { title: "Mobile App Developer", bio: "Membangun aplikasi mobile cross-platform.", location: "Bandung", skills: ["Flutter"], hourlyRate: 220000, completedProjects: 42 },
            services: [
                { title: "Pembuatan Aplikasi Mobile Android & iOS", description: "Aplikasi custom menggunakan Flutter.", price: 8000000, categorySlug: "programming", image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c" }
            ]
        },
        {
            user: { id: crypto.randomUUID(), name: "Ratna Ads", email: "f10@example.com", emailVerified: true, role: "freelancer" as const, image: "https://i.pravatar.cc/150?u=f10" },
            profile: { title: "Digital Ad Specialist", bio: "Ahli mengelola Meta & Google Ads.", location: "Jakarta", skills: ["Google Ads"], hourlyRate: 150000, completedProjects: 76 },
            services: [
                { title: "Manajemen Iklan Meta (FB/IG)", description: "Setting campaign & riset audience.", price: 2500000, categorySlug: "marketing", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f" }
            ]
        },
        {
            user: { id: crypto.randomUUID(), name: "Hendra Culinary", email: "f11@example.com", emailVerified: true, role: "freelancer" as const, image: "https://i.pravatar.cc/150?u=f11" },
            profile: { title: "Chef & Food Photographer", bio: "Menu restoran dan fotografi premium.", location: "Surabaya", skills: ["Photography"], hourlyRate: 200000, completedProjects: 65 },
            services: [
                { title: "Jasa Foto Menu Makanan & Minuman", description: "Food styling dan photoshoot profesional.", price: 1500000, categorySlug: "photography", image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1" }
            ]
        },
        {
            user: { id: crypto.randomUUID(), name: "Yudi Travel", email: "f12@example.com", emailVerified: true, role: "freelancer" as const, image: "https://i.pravatar.cc/150?u=f12" },
            profile: { title: "Tour Guide Bali", bio: "Panduan wisata lokal Bali.", location: "Bali", skills: ["Tour Guiding"], hourlyRate: 150000, completedProjects: 120 },
            services: [
                { title: "Bali Hidden Gem Day Tour", description: "Jalan-jalan ke lokasi rahasia di Bali.", price: 750000, categorySlug: "home-service", isOnSite: true, location: "Bali", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4" }
            ]
        },
        {
            user: { id: crypto.randomUUID(), name: "Maya Lang", email: "f13@example.com", emailVerified: true, role: "freelancer" as const, image: "https://i.pravatar.cc/150?u=f13" },
            profile: { title: "Translator & Interpreter", bio: "Terjemahan dokumen legal bisnis.", location: "Jakarta", skills: ["English", "Mandarin"], hourlyRate: 200000, completedProjects: 88 },
            services: [
                { title: "Terjemahan Resmi English - Indonesia", description: "Akurat untuk kontrak atau website.", price: 100000, categorySlug: "writing", image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8" }
            ]
        },
        {
            user: { id: crypto.randomUUID(), name: "Yoga Fit", email: "f14@example.com", emailVerified: true, role: "freelancer" as const, image: "https://i.pravatar.cc/150?u=f14" },
            profile: { title: "Fitness Trainer", bio: "Olahraga/diet sehat untuk goals Anda.", location: "Tangerang", skills: ["Fitness"], hourlyRate: 150000, completedProjects: 110 },
            services: [
                { title: "Privat Personal Training (Panggilan)", description: "Work out di rumah atau gym dekat Anda.", price: 300000, categorySlug: "education", isOnSite: true, location: "Tangerang", image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48" }
            ]
        },
        {
            user: { id: crypto.randomUUID(), name: "Dandi Fix", email: "f15@example.com", emailVerified: true, role: "freelancer" as const, image: "https://i.pravatar.cc/150?u=f15" },
            profile: { title: "Gadget Specialist", bio: "Servis laptop & rakit PC.", location: "Depok", skills: ["Hardware correction"], hourlyRate: 100000, completedProjects: 240 },
            services: [
                { title: "Servis Laptop Lemot (Panggilan)", description: "Bikin laptop kencang lagi di rumah.", price: 200000, categorySlug: "home-service", isOnSite: true, location: "Depok", image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea" }
            ]
        },
        {
            user: { id: crypto.randomUUID(), name: "Budi Teknik Medan", email: "f16@example.com", emailVerified: true, role: "freelancer" as const, image: "https://i.pravatar.cc/150?u=f16" },
            profile: { title: "Tukang Bangunan Medan", bio: "Renovasi rumah & pengecatan.", location: "Medan", skills: ["Renovation"], hourlyRate: 120000, completedProjects: 180 },
            services: [
                { title: "Jasa Renovasi Kamar Mandi", description: "Renovasi rapi dan bergaransi.", price: 5000000, categorySlug: "home-service", isOnSite: true, location: "Medan", image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a" }
            ]
        },
        {
            user: { id: crypto.randomUUID(), name: "Andi Palembang", email: "f17@example.com", emailVerified: true, role: "freelancer" as const, image: "https://i.pravatar.cc/150?u=f17" },
            profile: { title: "Teknisi AC Palembang", bio: "Service AC & Elektronik.", location: "Palembang", skills: ["AC Repair"], hourlyRate: 75000, completedProjects: 310 },
            services: [
                { title: "Service & Cuci AC Berkala", description: "Bikin AC makin dingin & hemat listrik.", price: 100000, categorySlug: "home-service", isOnSite: true, location: "Palembang", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e" }
            ]
        },
        {
            user: { id: crypto.randomUUID(), name: "Hasan Mekanik", email: "f18@example.com", emailVerified: true, role: "freelancer" as const, image: "https://i.pravatar.cc/150?u=f18" },
            profile: { title: "Mekanik Mobil Makassar", bio: "Perbaikan mobil darurat.", location: "Makassar", skills: ["Auto Repair"], hourlyRate: 150000, completedProjects: 450 },
            services: [
                { title: "Tune Up & Ganti Oli di Rumah", description: "Rawat mobil tanpa perlu ke bengkel.", price: 350000, categorySlug: "home-service", isOnSite: true, location: "Makassar", image: "https://imgx.gridoto.com/crop/0x0:0x0/700x465/photo/2020/10/13/1157012579.jpeg" }
            ]
        },
        {
            user: { id: crypto.randomUUID(), name: "Toko Taman BPN", email: "f19@example.com", emailVerified: true, role: "freelancer" as const, image: "https://i.pravatar.cc/150?u=f19" },
            profile: { title: "Lanskap Balikpapan", bio: "Taman minimalis & kolam.", location: "Balikpapan", skills: ["Gardening"], hourlyRate: 100000, completedProjects: 95 },
            services: [
                { title: "Pembuatan Taman Dekoratif", description: "Bikin rumah asri dengan taman.", price: 3000000, categorySlug: "home-service", isOnSite: true, location: "Balikpapan", image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae" }
            ]
        },
        {
            user: { id: crypto.randomUUID(), name: "Lestari MUA", email: "f20@example.com", emailVerified: true, role: "freelancer" as const, image: "https://i.pravatar.cc/150?u=f20" },
            profile: { title: "MUA Makassar", bio: "MUA pengantin Makassar.", location: "Makassar", skills: ["MUA"], hourlyRate: 300000, completedProjects: 150 },
            services: [
                { title: "MUA Wedding Makassar", description: "Makeup pengantin tradisional/modern.", price: 2500000, categorySlug: "photography", isOnSite: true, location: "Makassar", image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9" }
            ]
        },
        {
            user: { id: crypto.randomUUID(), name: "Riri Reflexology", email: "f21@example.com", emailVerified: true, role: "freelancer" as const, image: "https://i.pravatar.cc/150?u=f21" },
            profile: { title: "Terapis Pijat Solo", bio: "Pijat tradisional Solo.", location: "Solo", skills: ["Massage"], hourlyRate: 80000, completedProjects: 220 },
            services: [
                { title: "Pijat Tradisional (90 Menit)", description: "Hilangkan lelah dengan teknik Solo.", price: 150000, categorySlug: "home-service", isOnSite: true, location: "Solo", image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874" }
            ]
        },
        {
            user: { id: crypto.randomUUID(), name: "Anto CCTV PNK", email: "f22@example.com", emailVerified: true, role: "freelancer" as const, image: "https://i.pravatar.cc/150?u=f22" },
            profile: { title: "CCTV Pontianak", bio: "Pasang kamera CCTV rumah.", location: "Pontianak", skills: ["CCTV"], hourlyRate: 150000, completedProjects: 140 },
            services: [
                { title: "Pasang 4 Kamera CCTV Pro", description: "Setting online ke HP di lokasi.", price: 3500000, categorySlug: "home-service", isOnSite: true, location: "Pontianak", image: "https://pemasangancctv.com/wp-content/uploads/2019/11/teknisi-cctv-2.jpg" }
            ]
        },
        {
            user: { id: crypto.randomUUID(), name: "Eko WiFi", email: "f23@example.com", emailVerified: true, role: "freelancer" as const, image: "https://i.pravatar.cc/150?u=f23" },
            profile: { title: "Teknisi WiFi Manado", bio: "Setting Router & WiFi lemot.", location: "Manado", skills: ["Networking"], hourlyRate: 100000, completedProjects: 85 },
            services: [
                { title: "Instalasi WiFi Rumah (On-site)", description: "Internet lancar setiap sudut rumah.", price: 300000, categorySlug: "programming", isOnSite: true, location: "Manado", image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8" }
            ]
        },
        {
            user: { id: crypto.randomUUID(), name: "Sakti Moving", email: "f24@example.com", emailVerified: true, role: "freelancer" as const, image: "https://i.pravatar.cc/150?u=f24" },
            profile: { title: "Jasa Pindahan JKT", bio: "Pindahan Jabodetabek aman.", location: "Jakarta", skills: ["Logistics"], hourlyRate: 200000, completedProjects: 520 },
            services: [
                { title: "Jasa Pindahan Rumah + Packing", description: "Truk & tenaga angkut barang.", price: 1200000, categorySlug: "home-service", isOnSite: true, location: "Jakarta", image: "https://yosualogistik.co.id/wp-content/uploads/2025/10/15.Jasa-Angkut-Pindahan-Rumah-Plus-Packing-Relokasi-Praktis.jpeg" }
            ]
        },
        {
            user: { id: crypto.randomUUID(), name: "Gita Music", email: "f25@example.com", emailVerified: true, role: "freelancer" as const, image: "https://i.pravatar.cc/150?u=f25" },
            profile: { title: "Guru Piano Medan", bio: "Les piano di rumah.", location: "Medan", skills: ["Piano"], hourlyRate: 200000, completedProjects: 45 },
            services: [
                { title: "Les Piano Privat Panggilan", description: "4 sesi belajar di rumah Anda.", price: 800000, categorySlug: "education", isOnSite: true, location: "Medan", image: "https://mampirbandung.com/wp-content/uploads/2025/03/LES-PIANO-BANDUNG.jpeg" }
            ]
        },
        {
            user: { id: crypto.randomUUID(), name: "Bambang Pool", email: "f26@example.com", emailVerified: true, role: "freelancer" as const, image: "https://i.pravatar.cc/150?u=f26" },
            profile: { title: "Maintenance Kolam Bali", bio: "Pembersihan kolam villa.", location: "Bali", skills: ["Pool Cleaning"], hourlyRate: 150000, completedProjects: 280 },
            services: [
                { title: "Maintenance Kolam Renang Villa", description: "Pembersihan rutin kolam Bali.", price: 250000, categorySlug: "home-service", isOnSite: true, location: "Bali", image: "https://images.unsplash.com/photo-1544256718-3bcf237f3974" }
            ]
        },
        {
            user: { id: crypto.randomUUID(), name: "Siti Tailor", email: "f27@example.com", emailVerified: true, role: "freelancer" as const, image: "https://i.pravatar.cc/150?u=f27" },
            profile: { title: "Penjahit Pekanbaru", bio: "Jahit baju datang ke rumah.", location: "Pekanbaru", skills: ["Tailoring"], hourlyRate: 100000, completedProjects: 165 },
            services: [
                { title: "Jasa Jahit Baju Panggilan", description: "Ukur & antar hasil jahitan.", price: 250000, categorySlug: "home-service", isOnSite: true, location: "Pekanbaru", image: "https://bisnisukm.com/uploads/2018/08/desain-tanpa-judul-19.jpg" }
            ]
        },
        {
            user: { id: crypto.randomUUID(), name: "Rizki Pest", email: "f28@example.com", emailVerified: true, role: "freelancer" as const, image: "https://i.pravatar.cc/150?u=f28" },
            profile: { title: "Pest Control Lampung", bio: "Usir rayap & hama.", location: "Bandar Lampung", skills: ["Pest Control"], hourlyRate: 150000, completedProjects: 115 },
            services: [
                { title: "Penyemprotan Anti Rayap Rumah", description: "Lindungi furniture dari rayap.", price: 750000, categorySlug: "home-service", isOnSite: true, location: "Bandar Lampung", image: "https://portal-islam.id/wp-content/uploads/2025/08/jasa-anti-rayap-terbaik-768x768.png" }
            ]
        },
        {
            user: { id: crypto.randomUUID(), name: "Joko Plumber", email: "f29@example.com", emailVerified: true, role: "freelancer" as const, image: "https://i.pravatar.cc/150?u=f29" },
            profile: { title: "Tukang Ledeng JKT", bio: "Perbaikan pipa mampet.", location: "Jakarta", skills: ["Plumbing"], hourlyRate: 100000, completedProjects: 380 },
            services: [
                { title: "Atasi Saluran Mampet (Panggilan)", description: "Bereskan air mampet sekejap.", price: 250000, categorySlug: "home-service", isOnSite: true, location: "Jakarta", image: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7" }
            ]
        },
        {
            user: { id: crypto.randomUUID(), name: "Laras Tari", email: "f30@example.com", emailVerified: true, role: "freelancer" as const, image: "https://i.pravatar.cc/150?u=f30" },
            profile: { title: "Pelatih Tari Jogja", bio: "Privat tari Jawa klasik.", location: "Yogyakarta", skills: ["Dance"], hourlyRate: 150000, completedProjects: 55 },
            services: [
                { title: "Privat Tari Jawa di Rumah", description: "Belajar gerakan luwes tari Jawa.", price: 200000, categorySlug: "education", isOnSite: true, location: "Yogyakarta", image: "https://www.belantarabudaya.id/wp-content/uploads/2022/09/206691619_4243830035676716_5845078691528901576_n.jpg" }
            ]
        },
        {
            user: { id: crypto.randomUUID(), name: "Wawan Fogging", email: "f31@example.com", emailVerified: true, role: "freelancer" as const, image: "https://i.pravatar.cc/150?u=f31" },
            profile: { title: "Fogging Semarang", bio: "Fogging anti nyamuk DBD.", location: "Semarang", skills: ["Fogging"], hourlyRate: 100000, completedProjects: 210 },
            services: [
                { title: "Fogging Nyamuk Perumahan", description: "Basmi nyamuk di lingkungan Anda.", price: 400000, categorySlug: "home-service", isOnSite: true, location: "Semarang", image: "https://safencare.co.id/wp-content/uploads/2025/10/fogging-nyamuk-dbd.jpg" }
            ]
        },
        {
            user: { id: crypto.randomUUID(), name: "Bella Decor", email: "f32@example.com", emailVerified: true, role: "freelancer" as const, image: "https://i.pravatar.cc/150?u=f32" },
            profile: { title: "Dekorasi Party BDG", bio: "Dekorasi balon & backdrop.", location: "Bandung", skills: ["Decoration"], hourlyRate: 150000, completedProjects: 140 },
            services: [
                { title: "Dekorasi Ulang Tahun Anak", description: "Paket dekorasi lengkap di rumah.", price: 1000000, categorySlug: "home-service", isOnSite: true, location: "Bandung", image: "https://designcorral.com/wp-content/uploads/2020/01/Dekorasi-Balon-untuk-Nuansa-Semarak.jpg" }
            ]
        },
        {
            user: { id: crypto.randomUUID(), name: "Yono Wall", email: "f33@example.com", emailVerified: true, role: "freelancer" as const, image: "https://i.pravatar.cc/150?u=f33" },
            profile: { title: "Pasang Wallpaper TNG", bio: "Jasa pasang wallpaper rapi.", location: "Tangerang", skills: ["Wallpapering"], hourlyRate: 100000, completedProjects: 190 },
            services: [
                { title: "Jasa Pasang Wallpaper (Panggilan)", description: "Pemasangan presisi di dinding.", price: 50000, categorySlug: "home-service", isOnSite: true, location: "Tangerang", image: "https://images.unsplash.com/photo-1615529151169-7b1ff50dc7f2" }
            ]
        },
        {
            user: { id: crypto.randomUUID(), name: "Pak Slamet", email: "f34@example.com", emailVerified: true, role: "freelancer" as const, image: "https://i.pravatar.cc/150?u=f34" },
            profile: { title: "Tukang Pompa PNK", bio: "Servis pompa air & pipa mampet.", location: "Pontianak", skills: ["Plumbing"], hourlyRate: 100000, completedProjects: 320 },
            services: [
                { title: "Servis Pompa Air On-site", description: "Perbaikan pipa & pompa air.", price: 200000, categorySlug: "home-service", isOnSite: true, location: "Pontianak", image: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7" }
            ]
        },
        {
            user: { id: crypto.randomUUID(), name: "Solo Shoes", email: "f35@example.com", emailVerified: true, role: "freelancer" as const, image: "https://i.pravatar.cc/150?u=f35" },
            profile: { title: "Spesialis Cuci Sepatu Solo", bio: "Cuci sepatu premium panggilan.", location: "Solo", skills: ["Laundry"], hourlyRate: 50000, completedProjects: 410 },
            services: [
                { title: "Deep Clean Sepatu Panggilan", description: "Bikin sepatu bersih kinclong.", price: 75000, categorySlug: "home-service", isOnSite: true, location: "Solo", image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86" }
            ]
        },
        {
            user: { id: crypto.randomUUID(), name: "Sedot Jaya", email: "f36@example.com", emailVerified: true, role: "freelancer" as const, image: "https://i.pravatar.cc/150?u=f36" },
            profile: { title: "Sedot WC Surabaya", bio: "Solusi WC mampet Surabaya.", location: "Surabaya", skills: ["Waste Management"], hourlyRate: 400000, completedProjects: 650 },
            services: [
                { title: "Sedot WC Panggilan 24 Jam", description: "Layanan cepat area Surabaya.", price: 450000, categorySlug: "home-service", isOnSite: true, location: "Surabaya", image: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7" }
            ]
        },
        {
            user: { id: crypto.randomUUID(), name: "Ani Wall Mks", email: "f37@example.com", emailVerified: true, role: "freelancer" as const, image: "https://i.pravatar.cc/150?u=f37" },
            profile: { title: "Wallpaper Makassar Pro", bio: "Pasang wallpaper interior.", location: "Makassar", skills: ["Wallpapering"], hourlyRate: 100000, completedProjects: 110 },
            services: [
                { title: "Pasang Wallpaper Dinding On-site", description: "Dinding rumah makin cantik.", price: 60000, categorySlug: "home-service", isOnSite: true, location: "Makassar", image: "https://images.unsplash.com/photo-1615529151169-7b1ff50dc7f2" }
            ]
        },
        {
            user: { id: crypto.randomUUID(), name: "Kanopi Baja BPN", email: "f38@example.com", emailVerified: true, role: "freelancer" as const, image: "https://i.pravatar.cc/150?u=f38" },
            profile: { title: "Spesialis Kanopi BPN", bio: "Pasang kanopi baja ringan.", location: "Balikpapan", skills: ["Welding"], hourlyRate: 150000, completedProjects: 130 },
            services: [
                { title: "Pasang Kanopi Carport On-site", description: "Atap carport kuat & rapi.", price: 2500000, categorySlug: "home-service", isOnSite: true, location: "Balikpapan", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c" }
            ]
        },
        {
            user: { id: crypto.randomUUID(), name: "Bengkel JKT", email: "f39@example.com", emailVerified: true, role: "freelancer" as const, image: "https://i.pravatar.cc/150?u=f39" },
            profile: { title: "Mekanik Panggilan JKT", bio: "Reparasi mesin mobil lokasi.", location: "Jakarta", skills: ["Auto Repair"], hourlyRate: 150000, completedProjects: 220 },
            services: [
                { title: "Servis Ringan Mobil (Panggilan)", description: "Cek mesin & ganti oli di rumah.", price: 400000, categorySlug: "home-service", isOnSite: true, location: "Jakarta", image: "https://www.mekanikindonesia.com/wp-content/uploads/2022/05/cara-tune-up-mobil.jpeg" }
            ]
        },
        {
            user: { id: crypto.randomUUID(), name: "Cat BDG Pro", email: "f40@example.com", emailVerified: true, role: "freelancer" as const, image: "https://i.pravatar.cc/150?u=f40" },
            profile: { title: "Pengecatan Bandung", bio: "Pengecatan rumah & ruko.", location: "Bandung", skills: ["Painting"], hourlyRate: 100000, completedProjects: 185 },
            services: [
                { title: "Jasa Cat Rumah On-site", description: "Pengecatan rapi & pilihan warna.", price: 1500000, categorySlug: "home-service", isOnSite: true, location: "Bandung", image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f" }
            ]
        },
        {
            user: { id: crypto.randomUUID(), name: "Clean Mks", email: "f41@example.com", emailVerified: true, role: "freelancer" as const, image: "https://i.pravatar.cc/150?u=f41" },
            profile: { title: "Cleaning Service Mks", bio: "Kebersihan rumah & kantor.", location: "Makassar", skills: ["Cleaning"], hourlyRate: 80000, completedProjects: 310 },
            services: [
                { title: "Deep Cleaning Rumah (Panggilan)", description: "Bersih total area Makassar.", price: 300000, categorySlug: "home-service", isOnSite: true, location: "Makassar", image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgIlu8z3KsGbZHcJNL9b9XDccni5it9wadimvcxH5ceEbfNkdgwZU5nSOSG5awiYLCjp1tQCCI6iLeQogxnEQN5ifDj7zf8iIqDVXuuOY1c_XTBCQRpcgRu1Ie9GhMFopVNYoxdTtkUFp3MgbcVjwC7yuZF8lDqds1k9qAJjatHaQFm01R8-3HleC8vVnt7/w546-h363/Desain%20tanpa%20judul%20(25).png" }
            ]
        },
        {
            user: { id: crypto.randomUUID(), name: "Bali Yoga", email: "f42@example.com", emailVerified: true, role: "freelancer" as const, image: "https://i.pravatar.cc/150?u=f42" },
            profile: { title: "Yoga Instructor Bali", bio: "Privat yoga di villa.", location: "Bali", skills: ["Yoga"], hourlyRate: 200000, completedProjects: 115 },
            services: [
                { title: "Private Yoga Session in Villa", description: "Relaksasi & kesehatan di Bali.", price: 500000, categorySlug: "education", isOnSite: true, location: "Bali", image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b" }
            ]
        },
        {
            user: { id: crypto.randomUUID(), name: "Dewi Biz Advisor", email: "f43@example.com", emailVerified: true, role: "freelancer" as const, image: "https://i.pravatar.cc/150?u=f43" },
            profile: { title: "Business Strategy Pro", bio: "Strategi bisnis legal UMKM.", location: "Tangerang", skills: ["Taxation"], hourlyRate: 300000, completedProjects: 45 },
            services: [
                { title: "Konsultasi Pajak UMKM", description: "Pelaporan SPT & optimasi pajak.", price: 750000, categorySlug: "business", image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f" }
            ]
        },
        {
            user: { id: crypto.randomUUID(), name: "Cool Air JKT", email: "f44@example.com", emailVerified: true, role: "freelancer" as const, image: "https://i.pravatar.cc/150?u=f44" },
            profile: { title: "Service AC Jakarta", bio: "Solusi AC dingin lagi.", location: "Jakarta", skills: ["AC Repair"], hourlyRate: 50000, completedProjects: 430 },
            services: [
                { title: "Cuci AC Panggilan JKT", description: "Layanan on-site area Jakarta.", price: 150000, categorySlug: "home-service", isOnSite: true, location: "Jakarta", image: "https://halojasa.com/blog/wp-content/uploads/2024/09/cuci-ac-panggilan-terdekat.png" }
            ]
        },
        {
            user: { id: crypto.randomUUID(), name: "Glow MUA JKT", email: "f45@example.com", emailVerified: true, role: "freelancer" as const, image: "https://i.pravatar.cc/150?u=f45" },
            profile: { title: "Professional MUA JKT", bio: "MUA wisuda & wedding.", location: "Jakarta", skills: ["Makeup"], hourlyRate: 250000, completedProjects: 95 },
            services: [
                { title: "MUA Panggilan Wisuda", description: "Makeup premium tahan lama.", price: 400000, categorySlug: "design", isOnSite: true, location: "Jakarta", image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2" }
            ]
        }
    ];

    const dbFreelancers = [];
    const dbServices = [];

    for (const f of freelancers) {
        const [insertedUser] = await db.insert(schema.user).values(f.user).returning();
        const [insertedProfile] = await db.insert(schema.freelancerProfile).values({
            ...f.profile,
            userId: insertedUser.id
        }).returning();

        dbFreelancers.push({ user: insertedUser, profile: insertedProfile });

        for (const s of f.services) {
            const [insertedSvc] = await db.insert(schema.service).values({
                title: s.title,
                description: s.description,
                price: s.price,
                categoryId: getCatId(s.categorySlug),
                providerId: insertedUser.id,
                isOnSite: ("isOnSite" in s) ? (s as any).isOnSite : false,
                location: ("location" in s) ? (s as any).location : null,
                image: s.image,
                rating: 4.5 + Math.random() * 0.5,
                reviewCount: Math.floor(Math.random() * 50) + 5
            }).returning();
            dbServices.push(insertedSvc);
        }
    }
    console.log("✅ Freelancers and Services created.");

    // 3. Users (Customers)
    const customers = [
        { id: crypto.randomUUID(), name: "Andi Saputra", email: "andi@example.com", emailVerified: true, role: "customer" as const, image: "https://i.pravatar.cc/150?u=c1" },
        { id: crypto.randomUUID(), name: "Siti Aminah", email: "siti@example.com", emailVerified: true, role: "customer" as const, image: "https://i.pravatar.cc/150?u=c2" },
        { id: crypto.randomUUID(), name: "Joko Anwar", email: "joko@example.com", emailVerified: true, role: "customer" as const, image: "https://i.pravatar.cc/150?u=c3" }
    ];

    const dbCustomers = [];
    for (const c of customers) {
        const [insertedCus] = await db.insert(schema.user).values(c).returning();
        dbCustomers.push(insertedCus);
    }
    console.log("✅ Customers created.");

    // 4. Orders & Reviews
    console.log("📦 Creating Orders and Reviews...");
    const generateOrderNum = () => `ORD-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, "0")}`;

    for (const svc of dbServices) {
        const numOrders = Math.floor(Math.random() * 2) + 1;
        for (let i = 0; i < numOrders; i++) {
            const customer = dbCustomers[Math.floor(Math.random() * dbCustomers.length)];
            const isCompleted = Math.random() > 0.3;

            const [order] = await db.insert(schema.order).values({
                orderNumber: generateOrderNum() + `-${i}`,
                serviceId: svc.id,
                customerId: customer.id,
                freelancerId: svc.providerId,
                status: isCompleted ? "completed" : "pending",
                paymentStatus: isCompleted ? "released" : "escrow",
                totalPrice: svc.price,
                requirements: "Tolong kerjakan dengan baik. Terima kasih.",
                createdAt: new Date(Date.now() - Math.floor(Math.random() * 1000000000)),
            }).returning();

            if (isCompleted) {
                await db.insert(schema.review).values({
                    orderId: order.id,
                    reviewerId: customer.id,
                    freelancerId: svc.providerId,
                    rating: 5,
                    comment: "Layanan sangat memuaskan!",
                });
            }
        }
    }

    console.log("✅ Orders and Reviews created.");
    console.log("\n🎉 ALL SEEDING COMPLETED SUCCESSFULLY!");
    await client.end();
    process.exit(0);
}

seed().catch((error) => {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
});
