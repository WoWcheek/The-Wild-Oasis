import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBooking } from "../../services/apiBookings";
import toast from "react-hot-toast";

export function useCheckout() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { mutate: checkout, isLoading: isCheckingOut } = useMutation({
        mutationFn: (id) =>
            updateBooking(id, {
                status: "checked-out"
            }),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ active: true });
            toast.success(`Booking #${data.id} successfully checked out`);
            navigate("/bookings");
        },
        onError: () => {
            toast.error("There was an error while checking out");
        }
    });

    return { checkout, isCheckingOut };
}
