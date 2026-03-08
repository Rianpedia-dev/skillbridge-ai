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
    // We don't delete categories to avoid breaking references if any exist outside this script
    await db.delete(schema.review);
    await db.delete(schema.order);
    await db.delete(schema.service);
    await db.delete(schema.freelancerProfile);
    // Only delete users that we are about to create (those ending with @example.com)
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
        { id: crypto.randomUUID(), name: "Tutor", slug: "tutor", description: "Les privat", icon: "GraduationCap" },
        { id: crypto.randomUUID(), name: "Home Service", slug: "home-service", description: "Servis AC, listrik", icon: "Wrench" },
        { id: crypto.randomUUID(), name: "Event & Fotografi", slug: "event", description: "Event organizer, photo booth", icon: "PartyPopper" },
        { id: crypto.randomUUID(), name: "Otomotif", slug: "otomotif", description: "Servis motor, mobil", icon: "Wrench" }
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

    // Helpers to get category ID
    const getCatId = (slug: string) => dbCategories.find(c => c.slug === slug)?.id || dbCategories[0].id;

    // 2. Users (Freelancers)
    const freelancers = [
        {
            user: { id: crypto.randomUUID(), name: "Rina Anggraini", email: "rina@example.com", emailVerified: true, role: "freelancer" as const, image: "https://i.pravatar.cc/150?u=a042581f4e29026704d" },
            profile: { title: "Senior Graphic Designer", bio: "Ahli desain grafis dengan pengalaman 5 tahun menangani brand besar.", location: "Jakarta", skills: ["Figma", "Illustrator", "Photoshop"], hourlyRate: 150000, completedProjects: 128 },
            services: [
                { title: "Desain Logo Profesional & Brand Identity", description: "3 konsep desain, unlimited revisi, file master lengkap.", price: 500000, categorySlug: "design", image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=600&auto=format&fit=crop" },
                { title: "Desain UI/UX Bikin Aplikasi Menarik", description: "Desain modern dan user friendly, wireframe & prototype.", price: 1500000, categorySlug: "design", image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=600&auto=format&fit=crop" }
            ]
        },
        {
            user: { id: crypto.randomUUID(), name: "Budi Santoso", email: "budi@example.com", emailVerified: true, role: "freelancer" as const, image: "https://i.pravatar.cc/150?u=a042581f4e29026704b" },
            profile: { title: "Fullstack Web Developer", bio: "Membangun website perusahaan yang cepat dan aman menggunakan Next.js.", location: "Surabaya", skills: ["Next.js", "React", "Node.js", "PostgreSQL"], hourlyRate: 200000, completedProjects: 85 },
            services: [
                { title: "Pembuatan Website Company Profile", description: "Website cepat, SEO friendly, responsive 4-5 halaman.", price: 2000000, categorySlug: "programming", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop" },
                { title: "E-Commerce Web Custom", description: "Toko online lengkap dengan payment gateway & dashboard.", price: 5000000, categorySlug: "programming", image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=600&auto=format&fit=crop" }
            ]
        },
        {
            user: { id: crypto.randomUUID(), name: "CreativeMotion", email: "creative@example.com", emailVerified: true, role: "freelancer" as const, image: "https://i.pravatar.cc/150?u=a04258114e29026702d" },
            profile: { title: "Video Editor & Motion Grapher", bio: "Spesialis video YouTube dan TikTok yang engaging.", location: "Bandung", skills: ["Premiere Pro", "After Effects", "Final Cut Pro"], hourlyRate: 100000, completedProjects: 210 },
            services: [
                { title: "Edit Video YouTube / Podcast", description: "Durasi 10-20 menit, color grading, sound mixing, text anim.", price: 300000, categorySlug: "video-editing", image: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=600&auto=format&fit=crop" },
                { title: "Paket Video TikTok & Reels", description: "Edit 5 video pendek per bulan, sangat engaging.", price: 450000, categorySlug: "video-editing", image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=600&auto=format&fit=crop" }
            ]
        },
        {
            user: { id: crypto.randomUUID(), name: "CoolAir Teknik", email: "coolair@example.com", emailVerified: true, role: "freelancer" as const, image: "https://i.pravatar.cc/150?u=a04258114e29026705d" },
            profile: { title: "Teknisi AC Berpengalaman", bio: "Layanan perbaikan dan cuci AC area Jakarta dan sekitarnya.", location: "Jakarta Selatan", skills: ["Reparasi AC", "Instalasi", "Freon"], hourlyRate: 50000, completedProjects: 430 },
            services: [
                { title: "Cuci AC & Tambah Freon", description: "Layanan panggilan. Bikin AC dingin lagi. On-site service.", price: 150000, categorySlug: "home-service", isOnSite: true, location: "Jakarta", image: "https://images.unsplash.com/photo-1581092926214-ee8e67140134?q=80&w=600&auto=format&fit=crop" }
            ]
        },
        {
            user: { id: crypto.randomUUID(), name: "Glow Beauty", email: "glow@example.com", emailVerified: true, role: "freelancer" as const, image: "https://i.pravatar.cc/150?u=a042581f4e29026024d" },
            profile: { title: "Professional Makeup Artist", bio: "Melayani MUA untuk wisuda, lamaran, dan pernikahan.", location: "Jakarta Pusat", skills: ["Makeup", "Hair Do", "Hijab Styling"], hourlyRate: 250000, completedProjects: 95 },
            services: [
                { title: "MUA Wisuda / Party", description: "Makeup tahan lama 12 jam, termasuk hairdo/hijab. Datang ke lokasi.", price: 400000, categorySlug: "event", isOnSite: true, location: "Jakarta Pusat", image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?q=80&w=600&auto=format&fit=crop" }
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
                rating: 4.5 + Math.random() * 0.5, // Fake initial rating between 4.5 - 5.0
                reviewCount: Math.floor(Math.random() * 50) + 5
            }).returning();
            dbServices.push(insertedSvc);
        }
    }
    console.log("✅ Freelancers and Services created.");

    // 3. Users (Customers)
    const customers = [
        { id: crypto.randomUUID(), name: "Andi Saputra", email: "andi@example.com", emailVerified: true, role: "customer" as const, image: "https://i.pravatar.cc/150?u=a042581f4e29026704c" },
        { id: crypto.randomUUID(), name: "Siti Aminah", email: "siti@example.com", emailVerified: true, role: "customer" as const, image: "https://i.pravatar.cc/150?u=a042581f4e29026704a" },
        { id: crypto.randomUUID(), name: "Joko Anwar", email: "joko@example.com", emailVerified: true, role: "customer" as const, image: "https://i.pravatar.cc/150?u=a042581f4e29026701c" }
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
        // Each service gets 2-3 random orders and reviews
        const numOrders = Math.floor(Math.random() * 2) + 2;
        for (let i = 0; i < numOrders; i++) {
            const customer = dbCustomers[Math.floor(Math.random() * dbCustomers.length)];

            const isCompleted = Math.random() > 0.3; // 70% chance of completed

            const [order] = await db.insert(schema.order).values({
                orderNumber: generateOrderNum() + `-${i}`,
                serviceId: svc.id,
                customerId: customer.id,
                freelancerId: svc.providerId,
                status: isCompleted ? "completed" : (Math.random() > 0.5 ? "in_progress" : "pending"),
                paymentStatus: isCompleted ? "released" : "escrow",
                totalPrice: svc.price,
                requirements: "Tolong kerjakan sesuai style inspirasi yang saya kirimkan lampirannya ya. Terima kasih banyak.",
                createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)), // random date in past
            }).returning();

            if (isCompleted) {
                const reviewTexts = [
                    "Hasilnya sangat memuaskan, sesuai ekspektasi!",
                    "Kerjanya cepat dan komunikatif. Recommended.",
                    "Bagus banget, revisi juga dilayani dengan sabar",
                    "Kualitas wahid harga terjangkau. Terima kasih!"
                ];
                await db.insert(schema.review).values({
                    orderId: order.id,
                    reviewerId: customer.id,
                    freelancerId: svc.providerId,
                    rating: Math.floor(Math.random() * 2) + 4, // 4 or 5 stars
                    comment: reviewTexts[Math.floor(Math.random() * reviewTexts.length)],
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
