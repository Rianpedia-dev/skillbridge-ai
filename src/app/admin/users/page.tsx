"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Loader2, Search, MoreVertical, Shield } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AdminUsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        async function fetchUsers() {
            try {
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
        fetchUsers();
    }, []);

    const filteredUsers = users.filter(user =>
        user.name?.toLowerCase().includes(search.toLowerCase()) ||
        user.email?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
                    <p className="text-muted-foreground mt-2">
                        View and manage all registered users on the platform.
                    </p>
                </div>
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search users..."
                        className="pl-10 border-border/50 bg-card/50"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <Card className="border-border/50 shadow-xl shadow-primary/5 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="flex h-64 items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent border-border/50">
                                    <TableHead className="w-[80px]">User</TableHead>
                                    <TableHead>Details</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Joined</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredUsers.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                                            No users found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredUsers.map((user) => (
                                        <TableRow key={user.id} className="group hover:bg-primary/[0.02] border-border/20 transition-colors">
                                            <TableCell>
                                                <Avatar className="h-10 w-10 border border-primary/20 shadow-sm transition-transform group-hover:scale-105">
                                                    <AvatarImage src={user.image || ""} />
                                                    <AvatarFallback className="gradient-bg text-white font-bold text-xs uppercase">
                                                        {user.name?.substring(0, 2)}
                                                    </AvatarFallback>
                                                </Avatar>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-sm group-hover:text-primary transition-colors underline-offset-4 group-hover:underline">
                                                        {user.name}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">{user.email}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="secondary"
                                                    className={cn(
                                                        "text-[10px] font-bold py-0 h-5 px-2",
                                                        user.role === "admin" ? "bg-red-500/10 text-red-600 border-red-500/20" :
                                                            user.role === "freelancer" ? "bg-primary/10 text-primary border-primary/20" :
                                                                "bg-muted text-muted-foreground"
                                                    )}
                                                >
                                                    {user.role === "admin" && <Shield className="h-2.5 w-2.5 mr-1" />}
                                                    {user.role.toUpperCase()}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-xs text-muted-foreground">
                                                {new Date(user.createdAt).toLocaleDateString("id-ID", {
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric"
                                                })}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(" ");
}
