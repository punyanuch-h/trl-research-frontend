import { useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { useGetAppointmentNotifications, useMarkAppointmentNotificationAsRead, useMarkAllAppointmentNotificationsAsRead } from "@/hooks/index";
import { NotificationOverlay } from "./NotificationOverlay";
import { AppointmentModal } from "./AppointmentModal";
import { AppointmentResponse } from "@/types/type";

export function NotificationIcon() {
    const {
        data,
        isLoading,
        isError,
        refetch,
    } = useGetAppointmentNotifications();
    const isOffline = !navigator.onLine;
    const showError = isError || isOffline;

    const { mutate: markAsRead } = useMarkAppointmentNotificationAsRead();
    const { mutate: markAllAsRead } = useMarkAllAppointmentNotificationsAsRead();

    const [selectedAppointment, setSelectedAppointment] = useState<AppointmentResponse | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);

    const notifications = data?.data || [];
    const unreadCount = data?.unread_count ?? 0;

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
                        loading={isLoading}
                        error={showError}
                        onRetry={refetch}
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
