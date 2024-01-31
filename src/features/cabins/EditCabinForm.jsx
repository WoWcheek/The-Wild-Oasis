import { useForm } from "react-hook-form";
import { useEditCabin } from "./useEditCabin";
import Form from "../../ui/Form";
import Button from "../../ui/Button";
import Input from "../../ui/Input";
import FileInput from "../../ui/FileInput";
import Textarea from "../../ui/Textarea";
import FormRow from "../../ui/FormRow";

function EditCabinForm({ cabinToEdit, onCloseModal }) {
    const { id, ...editValues } = cabinToEdit;
    const { editCabin, isEditing } = useEditCabin();
    const { register, handleSubmit, reset, getValues, formState } = useForm({
        defaultValues: editValues
    });
    const { errors } = formState;

    function onSubmit(data) {
        const image =
            typeof data.image === "string" ? data.image : data.image[0];
        editCabin(
            { updatedCabin: { ...data, image }, id },
            {
                onSuccess: () => {
                    reset();
                    onCloseModal?.();
                }
            }
        );
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
                    disabled={isEditing}
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
                    disabled={isEditing}
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
                    disabled={isEditing}
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
                    disabled={isEditing}
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
                    disabled={isEditing}
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
                    disabled={isEditing}
                    {...register("image")}
                />
            </FormRow>

            <FormRow>
                <Button
                    variation="secondary"
                    type="reset"
                    onClick={() => onCloseModal?.()}
                >
                    Cancel
                </Button>
                <Button disabled={isEditing}>Update cabin info</Button>
            </FormRow>
        </Form>
    );
}

export default EditCabinForm;
