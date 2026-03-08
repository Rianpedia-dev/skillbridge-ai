import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CategoryCard } from "@/components/category-card";
import { ReviewCard } from "@/components/review-card";
import {
  Sparkles,
  ArrowRight,
  Search,
  Shield,
  Zap,
  Calculator,
  Star,
  Users,
  Palette,
  Code,
  Video,
  Camera,
  GraduationCap,
  Wrench,
  CheckCircle,
  MessageSquare,
  CreditCard,
  Rocket,
  TrendingUp,
  Globe,
} from "lucide-react";

const categories = [
  { name: "Design", icon: Palette, count: 234, gradient: "linear-gradient(135deg, #7c3aed, #a78bfa)" },
  { name: "Programming", icon: Code, count: 189, gradient: "linear-gradient(135deg, #2563eb, #60a5fa)" },
  { name: "Tutor & Pendidikan", icon: GraduationCap, count: 145, gradient: "linear-gradient(135deg, #16a34a, #4ade80)" },
  { name: "Home Service", icon: Wrench, count: 320, gradient: "linear-gradient(135deg, #ea580c, #fb923c)" },
  { name: "Event & Fotografi", icon: Camera, count: 156, gradient: "linear-gradient(135deg, #dc2626, #f87171)" },
  { name: "Otomotif & Servis", icon: Wrench, count: 87, gradient: "linear-gradient(135deg, #0891b2, #22d3ee)" },
];

const features = [
  {
    icon: Sparkles,
    title: "AI Smart Matching",
    description: "Sistem AI merekomendasikan freelancer terbaik berdasarkan kebutuhan, skill, rating, dan pengalaman.",
  },
  {
    icon: Calculator,
    title: "AI Price Estimator",
    description: "Dapatkan estimasi harga proyek secara instan menggunakan teknologi AI berdasarkan data ribuan proyek.",
  },
  {
    icon: Shield,
    title: "Escrow Payment",
    description: "Dana ditahan platform sampai pekerjaan selesai. Transaksi aman untuk kedua belah pihak.",
  },
  {
    icon: Star,
    title: "Review & Rating",
    description: "Sistem review transparan untuk membantu Anda menemukan freelancer berkualitas tinggi.",
  },
  {
    icon: Zap,
    title: "Cepat & Efisien",
    description: "Proses pencarian hingga pemesanan hanya dalam beberapa langkah mudah dan cepat.",
  },
  {
    icon: Search,
    title: "Pencarian Canggih",
    description: "Filter layanan berdasarkan kategori, budget, rating, dan lokasi dengan mudah.",
  },
];

const howItWorks = [
  {
    step: "01",
    icon: Search,
    title: "Cari Layanan",
    description: "Jelaskan kebutuhan proyek Anda, AI akan membantu menemukan freelancer yang tepat.",
  },
  {
    step: "02",
    icon: MessageSquare,
    title: "Diskusi & Pesan",
    description: "Diskusikan detail proyek dan pesan layanan yang Anda butuhkan.",
  },
  {
    step: "03",
    icon: CreditCard,
    title: "Bayar dengan Aman",
    description: "Pembayaran menggunakan escrow system — dana aman hingga pekerjaan selesai.",
  },
  {
    step: "04",
    icon: CheckCircle,
    title: "Terima Hasil",
    description: "Terima hasil pekerjaan, berikan review, dan dana otomatis dikirim ke freelancer.",
  },
];

const testimonials = [
  {
    name: "Andi Prasetyo",
    initials: "AP",
    rating: 5,
    date: "2 hari lalu",
    text: "SkillBridge AI membantu saya menemukan developer yang tepat dalam hitungan menit. Fitur AI matching-nya sangat akurat!",
    role: "Founder Startup",
  },
  {
    name: "Sari Dewi",
    initials: "SD",
    rating: 5,
    date: "1 minggu lalu",
    text: "Sebagai freelance designer, saya mendapatkan banyak klien baru melalui platform ini. Sistem escrow-nya bikin tenang.",
    role: "UI/UX Designer",
  },
  {
    name: "Budi Santoso",
    initials: "BS",
    rating: 4,
    date: "2 minggu lalu",
    text: "Estimasi harga dari AI sangat membantu saya sebagai UMKM untuk menentukan budget yang tepat untuk proyek digital.",
    role: "Pemilik UMKM",
  },
];

const stats = [
  { value: "10,000+", label: "Freelancer Terdaftar", icon: Users },
  { value: "25,000+", label: "Proyek Selesai", icon: CheckCircle },
  { value: "4.8/5", label: "Rating Rata-rata", icon: Star },
  { value: "99%", label: "Tingkat Kepuasan", icon: TrendingUp },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        {/* Background effects */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
        </div>

        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-6 gap-2 px-4 py-1.5">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span>Powered by Artificial Intelligence</span>
            </Badge>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
              Temukan{" "}
              <span className="gradient-text">Freelancer Terbaik</span>
              <br />
              dengan Kekuatan{" "}
              <span className="gradient-text">AI</span>
            </h1>

            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
              SkillBridge AI menghubungkan Anda dengan penyedia jasa profesional
              menggunakan teknologi AI untuk rekomendasi yang lebih akurat, estimasi harga
              yang transparan, dan transaksi yang aman.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link href="/marketplace">
                <Button size="lg" className="gradient-bg text-white border-0 gap-2 h-12 px-8 text-base hover:opacity-90">
                  Jelajahi Marketplace
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/register">
                <Button size="lg" variant="outline" className="gap-2 h-12 px-8 text-base">
                  <Rocket className="h-4 w-4" />
                  Daftar sebagai Freelancer
                </Button>
              </Link>
            </div>

            {/* Stats inline */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-2xl md:text-3xl font-bold gradient-text">{stat.value}</p>
                  <p className="text-xs md:text-sm text-muted-foreground mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4 gap-2">
              <Globe className="h-3.5 w-3.5 text-primary" />
              Kategori
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold">
              Temukan Layanan yang Anda{" "}
              <span className="gradient-text">Butuhkan</span>
            </h2>
            <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
              Berbagai kategori layanan profesional tersedia untuk memenuhi kebutuhan bisnis Anda.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <CategoryCard
                key={cat.name}
                href={`/marketplace?category=${cat.name.toLowerCase()}`}
                icon={cat.icon}
                name={cat.name}
                count={cat.count}
                gradient={cat.gradient}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-card/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4 gap-2">
              <Zap className="h-3.5 w-3.5 text-primary" />
              Fitur
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold">
              Kenapa Memilih{" "}
              <span className="gradient-text">SkillBridge AI</span>?
            </h2>
            <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
              Platform marketplace jasa yang didukung teknologi AI terdepan.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="group border-border/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1"
              >
                <CardContent className="p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 mb-4 transition-transform group-hover:scale-110">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4 gap-2">
              <Rocket className="h-3.5 w-3.5 text-primary" />
              Cara Kerja
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold">
              Mudah, Cepat, dan{" "}
              <span className="gradient-text">Aman</span>
            </h2>
            <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
              Hanya 4 langkah sederhana untuk mendapatkan layanan yang Anda butuhkan.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((item, index) => (
              <div key={item.step} className="relative">
                {/* Connector line */}
                {index < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-[calc(50%+40px)] w-[calc(100%-80px)] h-0.5 bg-gradient-to-r from-primary/30 to-primary/10" />
                )}
                <Card className="border-border/50 text-center transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                  <CardContent className="p-6">
                    <div className="relative mx-auto mb-4">
                      <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl gradient-bg transition-transform hover:scale-110">
                        <item.icon className="h-7 w-7 text-white" />
                      </div>
                      <span className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-background border-2 border-primary text-xs font-bold text-primary">
                        {item.step}
                      </span>
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24 bg-card/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4 gap-2">
              <MessageSquare className="h-3.5 w-3.5 text-primary" />
              Testimoni
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold">
              Apa Kata{" "}
              <span className="gradient-text">Pengguna Kami</span>
            </h2>
            <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
              Ribuan pengguna sudah merasakan kemudahan SkillBridge AI.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((t) => (
              <ReviewCard key={t.name} {...t} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <Card className="relative overflow-hidden border-0">
            <div className="absolute inset-0 gradient-bg opacity-90" />
            <div className="absolute inset-0">
              <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
              <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
            </div>
            <CardContent className="relative p-8 md:p-16 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Siap Menemukan Freelancer Terbaik?
              </h2>
              <p className="text-white/80 max-w-lg mx-auto mb-8 text-lg">
                Bergabung dengan ribuan pengguna yang sudah merasakan kemudahan
                marketplace jasa berbasis AI.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/register">
                  <Button
                    size="lg"
                    className="bg-white text-primary hover:bg-white/90 gap-2 h-12 px-8 text-base font-semibold"
                  >
                    Mulai Sekarang — Gratis
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/marketplace">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10 gap-2 h-12 px-8 text-base"
                  >
                    Lihat Marketplace
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
