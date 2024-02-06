import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { subDays } from "date-fns";
import { getBookingsAfterDate } from "../../services/apiBookings";

export function useRecentBookings() {
    const [searchParams] = useSearchParams();
    const numDays = !searchParams.get("last") ? 7 : +searchParams.get("last");
    const queryDate = subDays(new Date(), numDays).toISOString();

    const { isPending, data: bookings } = useQuery({
        queryKey: ["bookings", `last-${numDays}`],
        queryFn: () => getBookingsAfterDate(queryDate)
    });

    return { isPending, bookings };
}
