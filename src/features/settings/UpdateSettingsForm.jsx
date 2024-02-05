import { useSettings } from "./useSettings";
import { useUpdateSetting } from "./useUpdateSetting";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import Spinner from "../../ui/Spinner";

function UpdateSettingsForm() {
    const { isPending, settings = {} } = useSettings();
    const {
        min_booking_length,
        max_booking_length,
        max_guests_per_booking,
        breakfast_price
    } = settings;
    const { updateSetting, isUpdating } = useUpdateSetting();

    if (isPending) return <Spinner />;

    function handleUpdate(e, settingName) {
        if (!e.target.value) return;

        updateSetting({ [settingName]: e.target.value });
    }

    return (
        <Form>
            <FormRow label="Minimum nights/booking">
                <Input
                    type="number"
                    id="min-nights"
                    defaultValue={min_booking_length}
                    disabled={isPending || isUpdating}
                    onBlur={(e) => handleUpdate(e, "min_booking_length")}
                />
            </FormRow>
            <FormRow label="Maximum nights/booking">
                <Input
                    type="number"
                    id="max-nights"
                    defaultValue={max_booking_length}
                    disabled={isPending || isUpdating}
                    onBlur={(e) => handleUpdate(e, "max_booking_length")}
                />
            </FormRow>
            <FormRow label="Maximum guests/booking">
                <Input
                    type="number"
                    id="max-guests"
                    defaultValue={max_guests_per_booking}
                    disabled={isPending || isUpdating}
                    onBlur={(e) => handleUpdate(e, "max_guests_per_booking")}
                />
            </FormRow>
            <FormRow label="Breakfast price">
                <Input
                    type="number"
                    id="breakfast-price"
                    defaultValue={breakfast_price}
                    disabled={isPending || isUpdating}
                    onBlur={(e) => handleUpdate(e, "breakfast_price")}
                />
            </FormRow>
        </Form>
    );
}

export default UpdateSettingsForm;
