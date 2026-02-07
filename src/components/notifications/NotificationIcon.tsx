import { useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { useGetNotifications } from "@/hooks/notifications/useGetNotifications";
import { useMarkAsRead } from "@/hooks/notifications/useMarkAsRead";
import { useMarkAllAsRead } from "@/hooks/notifications/useMarkAllAsRead";
import { NotificationOverlay } from "./NotificationOverlay";
import { AppointmentModal } from "./AppointmentModal";
import { AppointmentResponse } from "@/hooks/client/type";

export function NotificationIcon() {
    const { data: notifications = [] } = useGetNotifications();
    const { mutate: markAsRead } = useMarkAsRead();
    const { mutate: markAllAsRead } = useMarkAllAsRead();

    const [selectedAppointment, setSelectedAppointment] = useState<AppointmentResponse | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);

    const unreadCount = notifications.filter(n => !n.is_read).length;

    const handleNotificationClick = (notif: AppointmentResponse) => {
        setSelectedAppointment(notif);
        setIsModalOpen(true);
        setIsPopoverOpen(false); // Close dropdown when opening modal

        if (!notif.is_read) {
            markAsRead(notif.id);
        }
    };

    return (
        <>
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative h-9 w-9">
                        <Bell className="h-5 w-5" />
                        {unreadCount > 0 && (
                            <Badge
                                variant="destructive"
                                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] bg-blue-600 border-2 border-white"
                            >
                                {unreadCount > 9 ? "9+" : unreadCount}
                            </Badge>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end" sideOffset={8}>
                    <NotificationOverlay
                        notifications={notifications}
                        onNotificationClick={handleNotificationClick}
                        onMarkAllAsRead={() => markAllAsRead()}
                    />
                </PopoverContent>
            </Popover>

            <AppointmentModal
                appointment={selectedAppointment}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
}
