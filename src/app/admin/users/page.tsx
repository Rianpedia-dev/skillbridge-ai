"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Loader2,
    Search,
    MoreVertical,
    Shield,
    Pencil,
    Trash2,
    UserCog,
    Ban,
    CheckCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export default function AdminUsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [editUser, setEditUser] = useState<any>(null);
    const [deleteUser, setDeleteUser] = useState<any>(null);
    const [isSaving, setIsSaving] = useState(false);

    const [editName, setEditName] = useState("");
    const [editEmail, setEditEmail] = useState("");
    const [editRole, setEditRole] = useState("");

    useEffect(() => {
        fetchUsers();
    }, []);

    async function fetchUsers() {
        try {
            setIsLoading(true);
            const res = await fetch("/api/admin/users");
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            }
        } catch (error) {
            console.error("Failed to fetch admin users:", error);
        } finally {
            setIsLoading(false);
        }
    }

    const filteredUsers = users.filter(user =>
        user.name?.toLowerCase().includes(search.toLowerCase()) ||
        user.email?.toLowerCase().includes(search.toLowerCase())
    );

    function openEditDialog(u: any) {
        setEditUser(u);
        setEditName(u.name || "");
        setEditEmail(u.email || "");
        setEditRole(u.role || "customer");
    }

    async function handleUpdateUser() {
        if (!editUser) return;
        setIsSaving(true);
        try {
            const res = await fetch(`/api/admin/users/${editUser.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: editName, email: editEmail, role: editRole }),
            });
            if (res.ok) {
                await fetchUsers();
                setEditUser(null);
            }
        } catch (error) {
            console.error("Failed to update user:", error);
        } finally {
            setIsSaving(false);
        }
    }

    async function handleDeleteUser() {
        if (!deleteUser) return;
        setIsSaving(true);
        try {
            const res = await fetch(`/api/admin/users/${deleteUser.id}`, { method: "DELETE" });
            if (res.ok) {
                await fetchUsers();
                setDeleteUser(null);
            }
        } catch (error) {
            console.error("Failed to delete user:", error);
        } finally {
            setIsSaving(false);
        }
    }

    async function handleToggleBan(u: any) {
        try {
            await fetch(`/api/admin/users/${u.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ banned: !u.banned, bannedReason: u.banned ? null : "Diblokir oleh admin" }),
            });
            await fetchUsers();
        } catch (error) {
            console.error("Failed to toggle ban:", error);
        }
    }

    async function handleChangeRole(userId: string, newRole: string) {
        try {
            await fetch(`/api/admin/users/${userId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ role: newRole }),
            });
            await fetchUsers();
        } catch (error) {
            console.error("Failed to change role:", error);
        }
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Manajemen User</h1>
                    <p className="text-muted-foreground mt-2">Kelola semua pengguna yang terdaftar di platform.</p>
                </div>
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Cari user..." className="pl-10 border-border/50 bg-card/50" value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="border-border/50 bg-card/50"><CardContent className="p-4 text-center"><p className="text-2xl font-bold">{users.length}</p><p className="text-xs text-muted-foreground">Total Users</p></CardContent></Card>
                <Card className="border-border/50 bg-card/50"><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-primary">{users.filter(u => u.role === "freelancer").length}</p><p className="text-xs text-muted-foreground">Freelancer</p></CardContent></Card>
                <Card className="border-border/50 bg-card/50"><CardContent className="p-4 text-center"><p className="text-2xl font-bold">{users.filter(u => u.role === "customer").length}</p><p className="text-xs text-muted-foreground">Customer</p></CardContent></Card>
                <Card className="border-border/50 bg-card/50"><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-red-500">{users.filter(u => u.banned).length}</p><p className="text-xs text-muted-foreground">Diblokir</p></CardContent></Card>
            </div>

            <Card className="border-border/50 shadow-xl shadow-primary/5 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
                    ) : (
                        <div className="overflow-x-auto w-full">
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent border-border/50">
                                        <TableHead className="w-[80px]">User</TableHead>
                                        <TableHead>Detail</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Bergabung</TableHead>
                                        <TableHead className="text-right">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredUsers.length === 0 ? (
                                        <TableRow><TableCell colSpan={6} className="text-center py-12 text-muted-foreground">Tidak ada user ditemukan.</TableCell></TableRow>
                                    ) : (
                                        filteredUsers.map((u) => (
                                            <TableRow key={u.id} className="group hover:bg-primary/[0.02] border-border/20 transition-colors">
                                                <TableCell>
                                                    <Avatar className="h-10 w-10 border border-primary/20 shadow-sm transition-transform group-hover:scale-105">
                                                        <AvatarImage src={u.image || ""} />
                                                        <AvatarFallback className="gradient-bg text-white font-bold text-xs uppercase">{u.name?.substring(0, 2)}</AvatarFallback>
                                                    </Avatar>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col min-w-[150px]">
                                                        <span className="font-semibold text-sm group-hover:text-primary transition-colors">{u.name}</span>
                                                        <span className="text-xs text-muted-foreground">{u.email}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="secondary" className={cn("text-[10px] font-bold py-0 h-5 px-2 whitespace-nowrap", u.role === "admin" ? "bg-red-500/10 text-red-600 border-red-500/20" : u.role === "freelancer" ? "bg-primary/10 text-primary border-primary/20" : "bg-muted text-muted-foreground")}>
                                                        {u.role === "admin" && <Shield className="h-2.5 w-2.5 mr-1" />}
                                                        {u.role.toUpperCase()}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {u.banned ? (
                                                        <Badge className="bg-red-500/10 text-red-600 text-[10px] font-bold h-5"><Ban className="h-2.5 w-2.5 mr-1" />DIBLOKIR</Badge>
                                                    ) : (
                                                        <Badge className="bg-green-500/10 text-green-600 text-[10px] font-bold h-5"><CheckCircle className="h-2.5 w-2.5 mr-1" />AKTIF</Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                                                    {new Date(u.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" />}>
                                                            <MoreVertical className="h-4 w-4" />
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-48">
                                                            <DropdownMenuItem onClick={() => openEditDialog(u)} className="gap-2">
                                                                <Pencil className="h-3.5 w-3.5" /> Edit User
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem onClick={() => handleChangeRole(u.id, u.role === "freelancer" ? "customer" : "freelancer")} className="gap-2">
                                                                <UserCog className="h-3.5 w-3.5" /> Ubah ke {u.role === "freelancer" ? "Customer" : "Freelancer"}
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleToggleBan(u)} className="gap-2">
                                                                {u.banned ? (<><CheckCircle className="h-3.5 w-3.5 text-green-500" /><span className="text-green-600">Aktifkan Kembali</span></>) : (<><Ban className="h-3.5 w-3.5 text-yellow-500" /><span className="text-yellow-600">Blokir User</span></>)}
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem onClick={() => setDeleteUser(u)} className="gap-2 text-red-600 focus:text-red-600">
                                                                <Trash2 className="h-3.5 w-3.5" /> Hapus User
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Edit Dialog */}
            <Dialog open={!!editUser} onOpenChange={(open: boolean) => { if (!open) setEditUser(null); }}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit User</DialogTitle>
                        <DialogDescription>Perbarui informasi user. Klik simpan setelah selesai.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-name">Nama</Label>
                            <Input id="edit-name" value={editName} onChange={(e) => setEditName(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-email">Email</Label>
                            <Input id="edit-email" type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-role">Role</Label>
                            <Select value={editRole} onValueChange={(v) => setEditRole(v ?? "customer")}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="customer">Customer</SelectItem>
                                    <SelectItem value="freelancer">Freelancer</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditUser(null)}>Batal</Button>
                        <Button onClick={handleUpdateUser} disabled={isSaving} className="gradient-bg text-white">
                            {isSaving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                            Simpan
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <AlertDialog open={!!deleteUser} onOpenChange={(open: boolean) => { if (!open) setDeleteUser(null); }}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus User?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus user <strong>{deleteUser?.name}</strong>? Tindakan ini tidak dapat dibatalkan dan semua data terkait akan ikut terhapus.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteUser} className="bg-red-600 hover:bg-red-700 text-white">
                            {isSaving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                            Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
