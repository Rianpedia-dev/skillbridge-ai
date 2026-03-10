import Link from "next/link";
import { Sparkles, Github, Twitter, Instagram, Mail, ShieldCheck, Headphones, CreditCard } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const footerLinks = {
    Platform: [
        { href: "/marketplace", label: "Marketplace" },
        { href: "/ai-matching", label: "AI Matching" },
        { href: "/price-estimator", label: "Price Estimator" },
    ],
    Perusahaan: [
        { href: "#", label: "Tentang Kami" },
        { href: "#", label: "Karir" },
        { href: "#", label: "Blog" },
    ],
    Bantuan: [
        { href: "#", label: "FAQ" },
        { href: "#", label: "Hubungi Kami" },
        { href: "#", label: "Kebijakan Privasi" },
    ],
};

const socialLinks = [
    { href: "#", icon: Github, label: "GitHub" },
    { href: "#", icon: Twitter, label: "Twitter" },
    { href: "#", icon: Instagram, label: "Instagram" },
    { href: "#", icon: Mail, label: "Email" },
];

const trustBadges = [
    { icon: ShieldCheck, label: "Escrow Payment" },
    { icon: Headphones, label: "Support 24/7" },
    { icon: CreditCard, label: "Multi Payment" },
];

export function Footer() {
    return (
        <footer className="border-t bg-card">
            {/* Trust Badges */}
            <div className="border-b border-border/50">
                <div className="container mx-auto px-4 md:px-6 py-6">
                    <div className="grid grid-cols-3 gap-4">
                        {trustBadges.map((badge) => (
                            <div key={badge.label} className="flex flex-col md:flex-row items-center gap-1.5 md:gap-3 text-center md:text-left">
                                <div className="h-9 w-9 md:h-10 md:w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                    <badge.icon className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                                </div>
                                <span className="text-[10px] md:text-sm font-medium">{badge.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                    {/* Brand */}
                    <div className="col-span-2 md:col-span-1">
                        <Link href="/" className="flex items-center gap-2 mb-3">
                            <div className="flex h-7 w-7 items-center justify-center rounded-lg gradient-bg">
                                <Sparkles className="h-3.5 w-3.5 text-white" />
                            </div>
                            <span className="text-base font-bold gradient-text">SkillBridge</span>
                            <span className="text-base font-bold">AI</span>
                        </Link>
                        <p className="text-xs text-muted-foreground mb-4 max-w-xs leading-relaxed">
                            Platform marketplace jasa berbasis AI untuk menghubungkan pencari jasa dengan freelancer terpercaya.
                        </p>
                        <div className="flex gap-2">
                            {socialLinks.map((social) => (
                                <Link
                                    key={social.label}
                                    href={social.href}
                                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-muted-foreground transition-colors hover:text-foreground hover:bg-primary hover:text-primary-foreground"
                                >
                                    <social.icon className="h-3.5 w-3.5" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    {Object.entries(footerLinks).map(([category, links]) => (
                        <div key={category}>
                            <h3 className="font-semibold mb-3 text-xs md:text-sm">{category}</h3>
                            <ul className="space-y-2">
                                {links.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <Separator className="my-6" />

                <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
                    <p>© 2026 SkillBridge AI. All rights reserved.</p>
                    <p>
                        Dibuat dengan ❤️ di Indonesia
                    </p>
                </div>
            </div>
        </footer>
    );
}
