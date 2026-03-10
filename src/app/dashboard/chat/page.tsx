"use client";

import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { useSession } from "@/lib/auth-client";
import { useSearchParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Search,
    Send,
    MessageSquare,
    ArrowLeft,
    Loader2,
    Smile,
    ImageIcon,
    CheckCheck,
    Check,
    Circle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format, isToday, isYesterday, isSameDay } from "date-fns";
import { id as localeId } from "date-fns/locale";

function ChatContent() {
    const { data: session } = useSession();
    const searchParams = useSearchParams();
    const roomIdFromUrl = searchParams.get("room");

    const [rooms, setRooms] = useState<any[]>([]);
    const [selectedRoom, setSelectedRoom] = useState<any>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [isLoadingRooms, setIsLoadingRooms] = useState(true);
    const [isLoadingMessages, setIsLoadingMessages] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [sendError, setSendError] = useState("");

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    useEffect(() => {
        if (session) {
            fetchRooms();
        }
    }, [session]);

    // Auto-select room from URL param
    useEffect(() => {
        if (roomIdFromUrl && rooms.length > 0 && !selectedRoom) {
            const targetRoom = rooms.find((r) => r.id === roomIdFromUrl);
            if (targetRoom) {
                setSelectedRoom(targetRoom);
            }
        }
    }, [roomIdFromUrl, rooms, selectedRoom]);

    useEffect(() => {
        if (selectedRoom) {
            fetchMessages(selectedRoom.id);
            const interval = setInterval(() => {
                fetchMessages(selectedRoom.id, true);
            }, 3000);
            return () => clearInterval(interval);
        }
    }, [selectedRoom]);

    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

    // Focus input when room is selected
    useEffect(() => {
        if (selectedRoom) {
            setTimeout(() => inputRef.current?.focus(), 300);
        }
    }, [selectedRoom]);

    const fetchRooms = async () => {
        setIsLoadingRooms(true);
        try {
            const res = await fetch("/api/chat/rooms");
            const data = await res.json();
            if (data.rooms) {
                setRooms(data.rooms);
            }
        } catch (error) {
            console.error("Failed to fetch rooms:", error);
        } finally {
            setIsLoadingRooms(false);
        }
    };

    const fetchMessages = async (roomId: string, isPolling = false) => {
        if (!isPolling) setIsLoadingMessages(true);
        try {
            const res = await fetch(`/api/chat/rooms/${roomId}/messages`);
            const data = await res.json();
            if (data.messages) {
                setMessages(data.messages);
            }
        } catch (error) {
            console.error("Failed to fetch messages:", error);
        } finally {
            if (!isPolling) setIsLoadingMessages(false);
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedRoom || isSending) return;

        setSendError("");
        setIsSending(true);

        // Optimistic update
        const tempMessage = {
            id: `temp-${Date.now()}`,
            senderId: session?.user?.id,
            content: newMessage,
            createdAt: new Date().toISOString(),
            isRead: false,
            _pending: true,
        };
        setMessages((prev) => [...prev, tempMessage]);
        const msgToSend = newMessage;
        setNewMessage("");

        try {
            const res = await fetch(
                `/api/chat/rooms/${selectedRoom.id}/messages`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ content: msgToSend }),
                }
            );
            const data = await res.json();
            if (data.message) {
                setMessages((prev) =>
                    prev.map((m) =>
                        m.id === tempMessage.id ? data.message : m
                    )
                );
                // Refresh rooms to update last message
                fetchRooms();
            } else {
                throw new Error("Failed to send");
            }
        } catch (error) {
            console.error("Failed to send message:", error);
            setSendError("Gagal mengirim pesan. Coba lagi.");
            // Remove temp message on error
            setMessages((prev) =>
                prev.filter((m) => m.id !== tempMessage.id)
            );
            setNewMessage(msgToSend);
        } finally {
            setIsSending(false);
        }
    };

    const getParticipant = (room: any) => {
        return room.participantOneId === session?.user?.id
            ? room.participantTwo
            : room.participantOne;
    };

    const getUnreadCount = (room: any) => {
        return (room.messages || []).filter(
            (m: any) => !m.isRead && m.senderId !== session?.user?.id
        ).length;
    };

    const filteredRooms = rooms.filter((room) => {
        const participant = getParticipant(room);
        return participant?.name
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase());
    });

    const formatDateSeparator = (dateStr: string) => {
        const date = new Date(dateStr);
        if (isToday(date)) return "Hari ini";
        if (isYesterday(date)) return "Kemarin";
        return format(date, "d MMMM yyyy", { locale: localeId });
    };

    const shouldShowDateSeparator = (
        currentMsg: any,
        prevMsg: any
    ): boolean => {
        if (!prevMsg) return true;
        return !isSameDay(
            new Date(currentMsg.createdAt),
            new Date(prevMsg.createdAt)
        );
    };

    const formatLastMessageTime = (dateStr: string) => {
        const date = new Date(dateStr);
        if (isToday(date)) return format(date, "HH:mm");
        if (isYesterday(date)) return "Kemarin";
        return format(date, "dd/MM/yy");
    };

    if (!session) return null;

    return (
        <div className="flex flex-col h-[calc(100vh-120px)] md:h-[calc(100vh-120px)] overflow-hidden rounded-xl border border-border/50 bg-background shadow-sm mb-16 md:mb-0">
            <div className="flex flex-1 overflow-hidden">
                {/* ==================== ROOMS SIDEBAR ==================== */}
                <div
                    className={cn(
                        "flex flex-col border-r border-border/50 w-full md:w-80 lg:w-96 bg-background",
                        selectedRoom ? "hidden md:flex" : "flex"
                    )}
                >
                    {/* Sidebar Header */}
                    <div className="p-4 border-b border-border/50">
                        <div className="flex items-center justify-between mb-4">
                            <h1 className="text-xl font-bold flex items-center gap-2">
                                <div className="h-8 w-8 rounded-lg gradient-bg flex items-center justify-center">
                                    <MessageSquare className="h-4 w-4 text-white" />
                                </div>
                                Pesan
                            </h1>
                            {rooms.length > 0 && (
                                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                                    {rooms.length} percakapan
                                </span>
                            )}
                        </div>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Cari percakapan..."
                                className="pl-9 bg-muted/50 border-0 h-10 rounded-xl focus-visible:ring-1 focus-visible:ring-primary"
                                value={searchQuery}
                                onChange={(e) =>
                                    setSearchQuery(e.target.value)
                                }
                            />
                        </div>
                    </div>

                    {/* Room List */}
                    <div className="flex-1 overflow-y-auto">
                        {isLoadingRooms ? (
                            <div className="flex flex-col items-center justify-center p-8 gap-3">
                                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                <p className="text-xs text-muted-foreground">
                                    Memuat percakapan...
                                </p>
                            </div>
                        ) : filteredRooms.length > 0 ? (
                            <div className="divide-y divide-border/20">
                                {filteredRooms.map((room) => {
                                    const participant =
                                        getParticipant(room);
                                    const lastMessage =
                                        room.messages?.[0];
                                    const isSelected =
                                        selectedRoom?.id === room.id;
                                    const unreadCount =
                                        getUnreadCount(room);

                                    return (
                                        <button
                                            key={room.id}
                                            onClick={() =>
                                                setSelectedRoom(room)
                                            }
                                            className={cn(
                                                "w-full p-3.5 flex gap-3 text-left transition-all duration-200 relative group",
                                                isSelected
                                                    ? "bg-primary/10 border-l-[3px] border-primary"
                                                    : "hover:bg-muted/50 border-l-[3px] border-transparent"
                                            )}
                                        >
                                            {/* Avatar */}
                                            <div className="relative">
                                                <Avatar className="h-11 w-11 border-2 border-border/30 ring-2 ring-transparent group-hover:ring-primary/20 transition-all">
                                                    <AvatarImage
                                                        src={
                                                            participant?.image
                                                        }
                                                    />
                                                    <AvatarFallback className="gradient-bg text-white text-sm font-semibold">
                                                        {participant?.name?.charAt(
                                                            0
                                                        )}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-green-500 border-2 border-background" />
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-center mb-0.5">
                                                    <span className="font-semibold text-sm truncate">
                                                        {participant?.name}
                                                    </span>
                                                    <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-2">
                                                        {lastMessage
                                                            ? formatLastMessageTime(
                                                                lastMessage.createdAt
                                                            )
                                                            : ""}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <p className="text-xs text-muted-foreground truncate pr-2">
                                                        {lastMessage?.senderId ===
                                                            session?.user?.id
                                                            ? "Anda: "
                                                            : ""}
                                                        {lastMessage
                                                            ? lastMessage.content
                                                            : "Belum ada pesan"}
                                                    </p>
                                                    {unreadCount > 0 && (
                                                        <span className="flex-shrink-0 h-5 min-w-5 px-1.5 rounded-full gradient-bg text-white text-[10px] font-bold flex items-center justify-center">
                                                            {unreadCount}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center p-8 gap-4">
                                <div className="h-16 w-16 rounded-full bg-primary/5 flex items-center justify-center">
                                    <MessageSquare className="h-8 w-8 text-primary/30" />
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-medium mb-1">
                                        Belum ada percakapan
                                    </p>
                                    <p className="text-xs text-muted-foreground max-w-[200px]">
                                        Mulai chat dengan freelancer dari
                                        halaman marketplace
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* ==================== CHAT AREA ==================== */}
                <div
                    className={cn(
                        "flex-1 flex flex-col bg-muted/5",
                        !selectedRoom
                            ? "hidden md:flex items-center justify-center"
                            : "flex"
                    )}
                >
                    {selectedRoom ? (
                        <>
                            {/* Chat Header */}
                            <div className="px-3 py-2.5 md:px-5 md:py-3 border-b border-border/50 bg-background/95 backdrop-blur-md flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="md:hidden h-8 w-8 rounded-lg"
                                        onClick={() =>
                                            setSelectedRoom(null)
                                        }
                                    >
                                        <ArrowLeft className="h-5 w-5" />
                                    </Button>
                                    <div className="relative">
                                        <Avatar className="h-9 w-9 md:h-10 md:w-10 border border-border/30">
                                            <AvatarImage
                                                src={
                                                    getParticipant(
                                                        selectedRoom
                                                    )?.image
                                                }
                                            />
                                            <AvatarFallback className="gradient-bg text-white text-sm">
                                                {getParticipant(
                                                    selectedRoom
                                                )?.name?.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
                                    </div>
                                    <div>
                                        <h2 className="font-semibold text-sm md:text-base leading-none">
                                            {
                                                getParticipant(
                                                    selectedRoom
                                                )?.name
                                            }
                                        </h2>
                                        <span className="text-[10px] md:text-xs text-green-500 font-medium">
                                            Online
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Messages List */}
                            <div className="flex-1 overflow-y-auto px-3 py-4 md:px-6 md:py-5">
                                {isLoadingMessages ? (
                                    <div className="flex items-center justify-center h-full">
                                        <div className="flex flex-col items-center gap-3">
                                            <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                            <p className="text-xs text-muted-foreground">
                                                Memuat pesan...
                                            </p>
                                        </div>
                                    </div>
                                ) : messages.length === 0 ? (
                                    <div className="flex items-center justify-center h-full">
                                        <div className="text-center space-y-3">
                                            <div className="h-16 w-16 rounded-2xl bg-primary/5 flex items-center justify-center mx-auto">
                                                <Send className="h-7 w-7 text-primary/30 -rotate-45" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">
                                                    Mulai percakapan
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-0.5">
                                                    Kirim pesan pertama
                                                    Anda kepada{" "}
                                                    {
                                                        getParticipant(
                                                            selectedRoom
                                                        )?.name
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-1 max-w-3xl mx-auto">
                                        {messages.map(
                                            (msg, idx) => {
                                                const isMe =
                                                    msg.senderId ===
                                                    session?.user?.id;
                                                const showDate =
                                                    shouldShowDateSeparator(
                                                        msg,
                                                        messages[
                                                        idx - 1
                                                        ]
                                                    );
                                                const isPending =
                                                    msg._pending;

                                                // Check if consecutive message from same sender
                                                const prevMsg =
                                                    messages[idx - 1];
                                                const isConsecutive =
                                                    prevMsg &&
                                                    prevMsg.senderId ===
                                                    msg.senderId &&
                                                    !showDate;

                                                return (
                                                    <div
                                                        key={msg.id}
                                                    >
                                                        {/* Date Separator */}
                                                        {showDate && (
                                                            <div className="flex items-center justify-center my-4">
                                                                <div className="bg-muted/80 backdrop-blur-sm text-muted-foreground text-[10px] font-medium px-3 py-1 rounded-full">
                                                                    {formatDateSeparator(
                                                                        msg.createdAt
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Message Bubble */}
                                                        <div
                                                            className={cn(
                                                                "flex w-full",
                                                                isMe
                                                                    ? "justify-end"
                                                                    : "justify-start",
                                                                isConsecutive
                                                                    ? "mt-0.5"
                                                                    : "mt-3"
                                                            )}
                                                        >
                                                            {/* Partner avatar for non-consecutive */}
                                                            {!isMe &&
                                                                !isConsecutive && (
                                                                    <Avatar className="h-7 w-7 mr-2 mt-1 flex-shrink-0">
                                                                        <AvatarImage
                                                                            src={
                                                                                getParticipant(
                                                                                    selectedRoom
                                                                                )
                                                                                    ?.image
                                                                            }
                                                                        />
                                                                        <AvatarFallback className="gradient-bg text-white text-[10px]">
                                                                            {getParticipant(
                                                                                selectedRoom
                                                                            )?.name?.charAt(
                                                                                0
                                                                            )}
                                                                        </AvatarFallback>
                                                                    </Avatar>
                                                                )}
                                                            {!isMe &&
                                                                isConsecutive && (
                                                                    <div className="w-7 mr-2 flex-shrink-0" />
                                                                )}

                                                            <div
                                                                className={cn(
                                                                    "max-w-[80%] md:max-w-[65%] px-3.5 py-2 shadow-sm",
                                                                    isMe
                                                                        ? "bg-primary text-primary-foreground rounded-2xl rounded-br-md"
                                                                        : "bg-background border border-border/40 rounded-2xl rounded-bl-md",
                                                                    isPending &&
                                                                    "opacity-70"
                                                                )}
                                                            >
                                                                <p className="text-[13px] leading-relaxed whitespace-pre-wrap break-words">
                                                                    {
                                                                        msg.content
                                                                    }
                                                                </p>
                                                                <div
                                                                    className={cn(
                                                                        "flex items-center justify-end gap-1 mt-0.5",
                                                                        isMe
                                                                            ? "text-primary-foreground/60"
                                                                            : "text-muted-foreground/60"
                                                                    )}
                                                                >
                                                                    <span className="text-[9px]">
                                                                        {format(
                                                                            new Date(
                                                                                msg.createdAt
                                                                            ),
                                                                            "HH:mm",
                                                                            {
                                                                                locale: localeId,
                                                                            }
                                                                        )}
                                                                    </span>
                                                                    {isMe &&
                                                                        (isPending ? (
                                                                            <Circle className="h-2.5 w-2.5" />
                                                                        ) : msg.isRead ? (
                                                                            <CheckCheck className="h-3 w-3" />
                                                                        ) : (
                                                                            <Check className="h-3 w-3" />
                                                                        ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            }
                                        )}
                                        <div ref={messagesEndRef} />
                                    </div>
                                )}
                            </div>

                            {/* Send Error */}
                            {sendError && (
                                <div className="px-4 py-1.5 bg-red-500/10 border-t border-red-500/20">
                                    <p className="text-xs text-red-500 text-center">
                                        {sendError}
                                    </p>
                                </div>
                            )}

                            {/* Input Area */}
                            <div className="p-3 md:p-4 bg-background border-t border-border/50">
                                <form
                                    onSubmit={handleSendMessage}
                                    className="max-w-3xl mx-auto flex items-end gap-2"
                                >
                                    <div className="flex-1 relative">
                                        <Input
                                            ref={inputRef}
                                            placeholder="Ketik pesan..."
                                            className="bg-muted/40 border-border/30 pr-10 h-11 rounded-xl focus-visible:ring-1 focus-visible:ring-primary/50 text-sm"
                                            value={newMessage}
                                            onChange={(e) => {
                                                setNewMessage(
                                                    e.target.value
                                                );
                                                setSendError("");
                                            }}
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-muted-foreground transition-colors"
                                        >
                                            <Smile className="h-4.5 w-4.5" />
                                        </button>
                                    </div>
                                    <Button
                                        type="submit"
                                        size="icon"
                                        className="gradient-bg text-white border-0 h-11 w-11 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all disabled:opacity-50 disabled:shadow-none"
                                        disabled={
                                            !newMessage.trim() ||
                                            isSending
                                        }
                                    >
                                        {isSending ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <Send className="h-4 w-4" />
                                        )}
                                    </Button>
                                </form>
                            </div>
                        </>
                    ) : (
                        /* Empty State — No Room Selected */
                        <div className="text-center p-8">
                            <div className="relative inline-block mb-6">
                                <div className="h-24 w-24 rounded-3xl bg-primary/5 flex items-center justify-center mx-auto rotate-3">
                                    <MessageSquare className="h-12 w-12 text-primary/30" />
                                </div>
                                <div className="absolute -top-1 -right-1 h-6 w-6 rounded-full gradient-bg flex items-center justify-center">
                                    <Send className="h-3 w-3 text-white -rotate-45" />
                                </div>
                            </div>
                            <h3 className="text-lg font-bold mb-2">
                                Pilih Percakapan
                            </h3>
                            <p className="text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed">
                                Pilih percakapan di samping atau mulai
                                chat baru dari halaman{" "}
                                <a
                                    href="/marketplace"
                                    className="text-primary hover:underline font-medium"
                                >
                                    Marketplace
                                </a>
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function ChatPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center h-[calc(100vh-120px)]">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
        }>
            <ChatContent />
        </Suspense>
    );
}
