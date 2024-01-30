import { useForm } from "react-hook-form";
import { useCreateCabin } from "./useCreateCabin";
import Form from "../../ui/Form";
import Button from "../../ui/Button";
import Input from "../../ui/Input";
import FileInput from "../../ui/FileInput";
import Textarea from "../../ui/Textarea";
import FormRow from "../../ui/FormRow";

function CreateCabinForm() {
    const { createCabin, isCreating } = useCreateCabin();
    const { register, handleSubmit, reset, getValues, formState } = useForm();
    const { errors } = formState;

    function onSubmit(data) {
        createCabin(data, {
            onSuccess: reset
        });
    }

    function onInvalid(errors) {
        console.error(errors);
    }

    return (
        <Form onSubmit={handleSubmit(onSubmit, onInvalid)}>
            <FormRow label="Cabin name" error={errors?.name?.message}>
                <Input
                    type="text"
                    id="name"
                    disabled={isCreating}
                    {...register("name", {
                        required: "This field is required"
                    })}
                />
            </FormRow>

            <FormRow
                label="Maximum capacity"
                error={errors?.max_capacity?.message}
            >
                <Input
                    type="number"
                    id="max_capacity"
                    disabled={isCreating}
                    {...register("max_capacity", {
                        required: "This field is required",
                        min: {
                            value: 1,
                            message: "Capacity can't be less than 1"
                        }
                    })}
                />
            </FormRow>

            <FormRow
                label="Regular price"
                error={errors?.regular_price?.message}
            >
                <Input
                    type="number"
                    id="regular_price"
                    disabled={isCreating}
                    {...register("regular_price", {
                        required: "This field is required",
                        min: {
                            value: 1,
                            message: "Price can't be less than 1"
                        }
                    })}
                />
            </FormRow>

            <FormRow label="Discount" error={errors?.discount?.message}>
                <Input
                    type="number"
                    id="discount"
                    disabled={isCreating}
                    defaultValue={0}
                    {...register("discount", {
                        required: "This field is required",
                        validate: (value) =>
                            value <= getValues().regular_price ||
                            "Discount can't be greater than regular price"
                    })}
                />
            </FormRow>

            <FormRow
                label="Description for website"
                error={errors?.description?.message}
            >
                <Textarea
                    type="number"
                    id="description"
                    disabled={isCreating}
                    defaultValue=""
                    {...register("description", {
                        required: "This field is required"
                    })}
                />
            </FormRow>

            <FormRow label="Cabin photo">
                <FileInput
                    id="image"
                    accept="image/*"
                    disabled={isCreating}
                    {...register("image", {
                        required: "This field is required"
                    })}
                />
            </FormRow>

            <FormRow>
                <Button
                    variation="secondary"
                    type="reset"
                    disabled={isCreating}
                >
                    Cancel
                </Button>
                <Button disabled={isCreating}>Create cabin</Button>
            </FormRow>
        </Form>
    );
}

export default CreateCabinForm;
