import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getBooking } from "../../services/apiBookings";

export function useBooking() {
    const { bookingId } = useParams("bookingId");

    const {
        isPending,
        data: booking,
        error
    } = useQuery({
        queryKey: ["bookings", bookingId],
        queryFn: () => getBooking(bookingId),
        retry: false
    });

    return { isPending, booking, error };
}
