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
  { name: "Tutor", icon: GraduationCap, count: 145, gradient: "linear-gradient(135deg, #16a34a, #4ade80)" },
  { name: "Home Service", icon: Wrench, count: 320, gradient: "linear-gradient(135deg, #ea580c, #fb923c)" },
  { name: "Fotografi", icon: Camera, count: 156, gradient: "linear-gradient(135deg, #dc2626, #f87171)" },
  { name: "Otomotif", icon: Wrench, count: 87, gradient: "linear-gradient(135deg, #0891b2, #22d3ee)" },
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
  { value: "10K+", label: "Freelancer", icon: Users },
  { value: "25K+", label: "Proyek Selesai", icon: CheckCircle },
  { value: "4.8", label: "Rating Rata-rata", icon: Star },
  { value: "99%", label: "Kepuasan", icon: TrendingUp },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section with Search */}
      <section className="relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
        </div>

        <div className="container mx-auto px-4 md:px-6 py-12 md:py-24">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            <Badge variant="secondary" className="mb-4 gap-2 px-3 py-1">
              <Sparkles className="h-3 w-3 text-primary" />
              <span className="text-xs">AI-Powered Marketplace</span>
            </Badge>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
              Temukan{" "}
              <span className="gradient-text">Freelancer Terbaik</span>
              <br className="hidden sm:block" />
              {" "}dengan Kekuatan{" "}
              <span className="gradient-text">AI</span>
            </h1>

            <p className="mt-4 text-sm md:text-lg text-muted-foreground max-w-xl leading-relaxed">
              Platform marketplace jasa yang menghubungkan Anda dengan penyedia jasa profesional menggunakan teknologi AI.
            </p>

            {/* Search Bar - Prominent */}
            <div className="mt-6 md:mt-8 w-full max-w-lg">
              <Link href="/marketplace" className="block">
                <div className="flex items-center gap-2 px-4 py-3 md:py-3.5 rounded-xl bg-secondary/80 hover:bg-secondary border border-border/50 text-muted-foreground transition-all hover:shadow-md cursor-pointer">
                  <Search className="h-5 w-5 shrink-0" />
                  <span className="text-sm md:text-base">Mau cari jasa apa hari ini?</span>
                  <Button size="sm" className="ml-auto gradient-bg text-white border-0 hover:opacity-90 shrink-0 h-8 px-4 text-xs">
                    Cari
                  </Button>
                </div>
              </Link>
            </div>

            {/* Quick action buttons */}
            <div className="mt-4 flex flex-wrap gap-2 justify-center">
              <Link href="/ai-matching">
                <Badge variant="secondary" className="cursor-pointer hover:bg-primary/10 gap-1.5 py-1.5 px-3">
                  <Sparkles className="h-3 w-3 text-primary" />
                  AI Matching
                </Badge>
              </Link>
              <Link href="/price-estimator">
                <Badge variant="secondary" className="cursor-pointer hover:bg-primary/10 gap-1.5 py-1.5 px-3">
                  <Calculator className="h-3 w-3 text-primary" />
                  Estimasi Harga
                </Badge>
              </Link>
              <Link href="/register">
                <Badge variant="secondary" className="cursor-pointer hover:bg-primary/10 gap-1.5 py-1.5 px-3">
                  <Rocket className="h-3 w-3 text-primary" />
                  Gabung Freelancer
                </Badge>
              </Link>
            </div>

            {/* Stats inline */}
            <div className="mt-10 md:mt-14 grid grid-cols-4 gap-4 md:gap-10 w-full max-w-lg">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-lg md:text-2xl font-bold gradient-text">{stat.value}</p>
                  <p className="text-[10px] md:text-xs text-muted-foreground mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-8 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg md:text-2xl font-bold">
              Kategori <span className="gradient-text">Populer</span>
            </h2>
            <Link href="/marketplace" className="text-xs md:text-sm text-primary font-medium hover:underline flex items-center gap-1">
              Lihat Semua
              <ArrowRight className="h-3 w-3 md:h-4 md:w-4" />
            </Link>
          </div>

          <div className="flex gap-6 md:gap-8 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-6 md:overflow-visible">
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

      {/* Promo Banner */}
      <section className="py-4 md:py-8">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <Card className="overflow-hidden border-0 promo-gradient group cursor-pointer card-marketplace">
              <CardContent className="p-5 md:p-8 text-white relative">
                <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
                <Badge className="bg-white/20 text-white border-0 text-[10px] md:text-xs mb-2">Fitur Unggulan</Badge>
                <h3 className="text-lg md:text-xl font-bold mb-1">AI Smart Matching</h3>
                <p className="text-white/70 text-xs md:text-sm mb-3 max-w-xs">Temukan freelancer terbaik dengan teknologi AI</p>
                <Link href="/ai-matching">
                  <Button size="sm" className="bg-white text-primary hover:bg-white/90 h-8 text-xs font-semibold gap-1">
                    Coba Sekarang <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
            <Card className="overflow-hidden border-0 bg-gradient-to-br from-emerald-600 to-teal-700 group cursor-pointer card-marketplace">
              <CardContent className="p-5 md:p-8 text-white relative">
                <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
                <Badge className="bg-white/20 text-white border-0 text-[10px] md:text-xs mb-2">Gratis</Badge>
                <h3 className="text-lg md:text-xl font-bold mb-1">Estimasi Harga AI</h3>
                <p className="text-white/70 text-xs md:text-sm mb-3 max-w-xs">Dapatkan perkiraan harga proyek Anda secara instan</p>
                <Link href="/price-estimator">
                  <Button size="sm" className="bg-white text-emerald-700 hover:bg-white/90 h-8 text-xs font-semibold gap-1">
                    Estimasi Sekarang <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-10 md:py-20 bg-card/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-8 md:mb-12">
            <Badge variant="secondary" className="mb-3 gap-2">
              <Zap className="h-3 w-3 text-primary" />
              <span className="text-xs">Fitur</span>
            </Badge>
            <h2 className="text-xl md:text-3xl font-bold">
              Kenapa Memilih{" "}
              <span className="gradient-text">SkillBridge AI</span>?
            </h2>
            <p className="text-muted-foreground mt-2 max-w-md mx-auto text-xs md:text-sm">
              Platform marketplace jasa yang didukung teknologi AI terdepan.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="group border-border/50 card-marketplace"
              >
                <CardContent className="p-4 md:p-6">
                  <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-xl md:rounded-2xl bg-primary/10 mb-3 md:mb-4 transition-transform group-hover:scale-110">
                    <feature.icon className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-sm md:text-lg mb-1 md:mb-2">{feature.title}</h3>
                  <p className="text-[11px] md:text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-10 md:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-8 md:mb-12">
            <Badge variant="secondary" className="mb-3 gap-2">
              <Rocket className="h-3 w-3 text-primary" />
              <span className="text-xs">Cara Kerja</span>
            </Badge>
            <h2 className="text-xl md:text-3xl font-bold">
              Mudah, Cepat, dan{" "}
              <span className="gradient-text">Aman</span>
            </h2>
            <p className="text-muted-foreground mt-2 max-w-md mx-auto text-xs md:text-sm">
              Hanya 4 langkah sederhana untuk mendapatkan layanan yang Anda butuhkan.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {howItWorks.map((item, index) => (
              <div key={item.step} className="relative">
                {/* Connector line */}
                {index < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-[calc(50%+40px)] w-[calc(100%-80px)] h-0.5 bg-gradient-to-r from-primary/30 to-primary/10" />
                )}
                <Card className="border-border/50 text-center card-marketplace h-full">
                  <CardContent className="p-4 md:p-6">
                    <div className="relative mx-auto mb-3 md:mb-4">
                      <div className="flex h-12 w-12 md:h-16 md:w-16 mx-auto items-center justify-center rounded-xl md:rounded-2xl gradient-bg transition-transform hover:scale-110">
                        <item.icon className="h-6 w-6 md:h-7 md:w-7 text-white" />
                      </div>
                      <span className="absolute -top-1 -right-1 md:-top-2 md:-right-2 flex h-5 w-5 md:h-7 md:w-7 items-center justify-center rounded-full bg-background border-2 border-primary text-[10px] md:text-xs font-bold text-primary">
                        {item.step}
                      </span>
                    </div>
                    <h3 className="font-semibold text-sm md:text-lg mb-1 md:mb-2">{item.title}</h3>
                    <p className="text-[11px] md:text-sm text-muted-foreground leading-relaxed">
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
      <section className="py-10 md:py-20 bg-card/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-8 md:mb-12">
            <Badge variant="secondary" className="mb-3 gap-2">
              <MessageSquare className="h-3 w-3 text-primary" />
              <span className="text-xs">Testimoni</span>
            </Badge>
            <h2 className="text-xl md:text-3xl font-bold">
              Apa Kata{" "}
              <span className="gradient-text">Pengguna Kami</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 max-w-5xl mx-auto">
            {testimonials.map((t) => (
              <ReviewCard key={t.name} {...t} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-10 md:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <Card className="relative overflow-hidden border-0">
            <div className="absolute inset-0 gradient-bg opacity-90" />
            <div className="absolute inset-0">
              <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
              <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
            </div>
            <CardContent className="relative p-6 md:p-16 text-center">
              <h2 className="text-xl md:text-3xl font-bold text-white mb-3">
                Siap Menemukan Freelancer Terbaik?
              </h2>
              <p className="text-white/80 max-w-lg mx-auto mb-6 text-xs md:text-base">
                Bergabung dengan ribuan pengguna yang sudah merasakan kemudahan marketplace jasa berbasis AI.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <Link href="/register">
                  <Button
                    size="lg"
                    className="bg-white text-primary hover:bg-white/90 gap-2 h-10 md:h-12 px-6 md:px-8 text-sm md:text-base font-semibold"
                  >
                    Mulai Sekarang — Gratis
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/marketplace">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10 gap-2 h-10 md:h-12 px-6 md:px-8 text-sm md:text-base"
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
