import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { editCabin as editCabinApi } from "../../services/apiCabins";

export function useEditCabin() {
    const queryClient = useQueryClient();

    const { mutate: editCabin, isPending: isEditing } = useMutation({
        mutationFn: ({ updatedCabin, id }) => editCabinApi(updatedCabin, id),
        onSuccess: () => {
            queryClient.invalidateQueries("cabins");
            toast.success("Successfully edited cabin info");
        },
        onError: (err) => {
            toast.error(err.message);
        }
    });

    return { editCabin, isEditing };
}
