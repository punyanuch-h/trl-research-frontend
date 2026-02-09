import { ScrollArea } from "@/components/ui/scroll-area";
import { AppointmentResponse } from "@/hooks/client/type";
import { format, isValid } from "date-fns";
import { th } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface NotificationOverlayProps {
    notifications: AppointmentResponse[];
    onNotificationClick: (notification: AppointmentResponse) => void;
    onMarkAllAsRead?: () => void;
}

export function NotificationOverlay({
    notifications,
    onNotificationClick,
    onMarkAllAsRead,
}: NotificationOverlayProps) {
    const unreadCount = notifications.filter(n => !n.is_read).length;

    return (
        <div className="flex flex-col w-[350px]"> {/* Removed overflow-y-auto */}
            <div className="p-4 border-b flex justify-between items-center">
                <h3 className="font-semibold text-lg">การแจ้งเตือน</h3>
                {onMarkAllAsRead && unreadCount > 0 && (
                    <button
                        onClick={onMarkAllAsRead}
                        className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
                    >
                        อ่านแล้วทั้งหมด
                    </button>
                )}
            </div>

            <ScrollArea className="h-[400px] w-full"> {/* Changed max-h to h */}
                {notifications.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground italic">
                        ไม่มีการแจ้งเตือน
                    </div>
                ) : (
                    <div className="flex flex-col">
                        {notifications.map((notif) => (
                            <button
                                key={notif.id}
                                onClick={() => onNotificationClick(notif)}
                                className={cn(
                                    "flex flex-col gap-1 p-4 text-left hover:bg-muted transition-colors border-b last:border-0",
                                    !notif.is_read && "bg-blue-50/50"
                                )}
                            >
                                <div className="flex justify-between items-start gap-2">
                                    <span className={cn(
                                        "text-sm flex-1",
                                        !notif.is_read ? "font-bold text-blue-700" : "font-semibold"
                                    )}>
                                        {notif.case?.title || notif.summary || "นัดหมายใหม่"}
                                    </span>
                                    {!notif.is_read && (
                                        <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                                    )}
                                </div>

                                {notif.detail && (
                                    <span className="text-xs text-muted-foreground line-clamp-2">
                                        {notif.detail}
                                    </span>
                                )}

                                <div className="flex flex-col gap-1 mt-1">
                                    <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-medium">
                                        📅 {(() => {
                                            const d = new Date(notif.date);
                                            return isValid(d) ? format(d, "dd MMM yyyy - HH:mm", { locale: th }) : "ไม่ระบุวันที่";
                                        })()}
                                    </span>
                                    {notif.location && (
                                        <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-medium">
                                            📍 {notif.location}
                                        </span>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </ScrollArea>
        </div>
    );
}