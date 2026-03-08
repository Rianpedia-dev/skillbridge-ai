import Link from "next/link";
import { Sparkles, Github, Twitter, Instagram, Mail } from "lucide-react";
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

export function Footer() {
    return (
        <footer className="border-t bg-card">
            <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="col-span-2 md:col-span-1">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-bg">
                                <Sparkles className="h-4 w-4 text-white" />
                            </div>
                            <span className="text-lg font-bold gradient-text">SkillBridge</span>
                            <span className="text-lg font-bold">AI</span>
                        </Link>
                        <p className="text-sm text-muted-foreground mb-4 max-w-xs">
                            Platform marketplace jasa berbasis AI untuk menghubungkan pencari jasa dengan freelancer terpercaya.
                        </p>
                        <div className="flex gap-3">
                            {socialLinks.map((social) => (
                                <Link
                                    key={social.label}
                                    href={social.href}
                                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-muted-foreground transition-colors hover:text-foreground hover:bg-primary hover:text-primary-foreground"
                                >
                                    <social.icon className="h-4 w-4" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    {Object.entries(footerLinks).map(([category, links]) => (
                        <div key={category}>
                            <h3 className="font-semibold mb-3 text-sm">{category}</h3>
                            <ul className="space-y-2">
                                {links.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <Separator className="my-8" />

                <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
                    <p>© 2026 SkillBridge AI. All rights reserved.</p>
                    <p>
                        Dibuat dengan ❤️ di Indonesia
                    </p>
                </div>
            </div>
        </footer>
    );
}
