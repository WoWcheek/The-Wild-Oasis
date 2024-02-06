import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBooking } from "../../services/apiBookings";
import toast from "react-hot-toast";

export function useCheckin() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { mutate: checkin, isPending: isCheckingIn } = useMutation({
        mutationFn: ({ id, breakfast }) =>
            updateBooking(id, {
                status: "checked-in",
                is_paid: true,
                ...breakfast
            }),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ active: true });
            toast.success(`Booking #${data.id} successfully checked in`);
            navigate("/dashboard");
        },
        onError: () => {
            toast.error("There was an error while checking in");
        }
    });

    return { checkin, isCheckingIn };
}
