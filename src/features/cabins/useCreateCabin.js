import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createCabin as createCabinApi } from "../../services/apiCabins";

export function useCreateCabin() {
    const queryClient = useQueryClient();

    const { mutate: createCabin, isPending: isCreating } = useMutation({
        mutationFn: createCabinApi,
        onSuccess: () => {
            queryClient.invalidateQueries("cabins");
            toast.success("Successfully created new cabin");
        },
        onError: (err) => {
            toast.error(err.message);
        }
    });

    return { createCabin, isCreating };
}
