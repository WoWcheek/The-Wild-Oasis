import { useEffect, useState } from "react";
import styled from "styled-components";
import { formatCurrency } from "../../utils/helpers";
import { useMoveBack } from "../../hooks/useMoveBack";
import { useSettings } from "../settings/useSettings";
import { useBooking } from "../bookings/useBooking";
import { useCheckin } from "./useCheckin";
import Row from "../../ui/Row";
import Spinner from "../../ui/Spinner";
import Button from "../../ui/Button";
import Heading from "../../ui/Heading";
import Checkbox from "../../ui/Checkbox";
import ButtonText from "../../ui/ButtonText";
import ButtonGroup from "../../ui/ButtonGroup";
import BookingDataBox from "../bookings/BookingDataBox";

const Box = styled.div`
    background-color: var(--color-grey-0);
    border: 1px solid var(--color-grey-100);
    border-radius: var(--border-radius-md);
    padding: 2.4rem 4rem;
`;

function CheckinBooking() {
    const [addBreakfast, setAddBreakfast] = useState(false);
    const [confirmPaid, setConfirmPaid] = useState(false);
    const { booking, isPending } = useBooking();
    const { settings, isPending: isPendingSettings } = useSettings();

    useEffect(
        () => setConfirmPaid(booking?.is_paid ?? false),
        [booking?.is_paid]
    );

    const moveBack = useMoveBack();
    const { checkin, isCheckingIn } = useCheckin();

    if (isPending || isPendingSettings) return <Spinner />;

    const {
        id,
        guests,
        total_price,
        has_breakfast,
        number_of_nights,
        number_of_guests
    } = booking;

    const totalBreakfastPrice =
        settings.breakfast_price * number_of_nights * number_of_guests;

    function handleCheckin() {
        if (!confirmPaid) return;

        if (addBreakfast) {
            const breakfast = {
                has_breakfast: true,
                extras_price: totalBreakfastPrice,
                total_price: total_price + totalBreakfastPrice
            };

            checkin({ id, breakfast });
        } else {
            checkin({ id, breakfast: {} });
        }
    }

    return (
        <>
            <Row type="horizontal">
                <Heading as="h1">Check in booking #{id}</Heading>
                <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
            </Row>

            <BookingDataBox booking={booking} />

            {!has_breakfast && (
                <Box>
                    <Checkbox
                        checked={addBreakfast}
                        onChange={() => {
                            setAddBreakfast((x) => !x);
                            setConfirmPaid(false);
                        }}
                        id="breakfast"
                    >
                        Want to add breakfast for{" "}
                        {formatCurrency(totalBreakfastPrice)}?
                    </Checkbox>
                </Box>
            )}

            <Box>
                <Checkbox
                    checked={confirmPaid}
                    disabled={confirmPaid || isCheckingIn}
                    onChange={() => setConfirmPaid((x) => !x)}
                    id="confirm"
                >
                    I confirm that {guests.full_name} has paid the total amount
                    of{" "}
                    {!addBreakfast
                        ? formatCurrency(total_price)
                        : `${formatCurrency(total_price + totalBreakfastPrice)} 
                        (${formatCurrency(total_price)} + 
                        ${formatCurrency(totalBreakfastPrice)})`}
                </Checkbox>
            </Box>
            <ButtonGroup>
                <Button
                    disabled={!confirmPaid || isCheckingIn}
                    onClick={handleCheckin}
                >
                    Check in booking #{id}
                </Button>
                <Button variation="secondary" onClick={moveBack}>
                    Back
                </Button>
            </ButtonGroup>
        </>
    );
}

export default CheckinBooking;
