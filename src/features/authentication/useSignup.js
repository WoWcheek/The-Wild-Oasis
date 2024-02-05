import { useMutation } from "@tanstack/react-query";
import { signup as signupApi } from "../../services/apiAuth";
import toast from "react-hot-toast";

export function useSignup() {
    const { mutate: signup, isPending } = useMutation({
        mutationFn: signupApi,
        onSuccess: () => {
            toast.success(
                "Account was created successfully. Please verify it using the email address you provided"
            );
        }
    });

    return { signup, isPending };
}
