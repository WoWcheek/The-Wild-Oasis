import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { format, isToday } from "date-fns";
import {
    HiArrowLeftOnRectangle,
    HiCalendarDays,
    HiTrash,
    HiEye
} from "react-icons/hi2";
import { formatCurrency } from "../../utils/helpers";
import { formatDistanceFromNow } from "../../utils/helpers";
import { useDeleteBooking } from "./useDeleteBooking";
import { useCheckout } from "../check-in-out/useCheckout";
import ConfirmDelete from "../../ui/ConfirmDelete";
import Tag from "../../ui/Tag";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";
import Modal from "../../ui/Modal";

const Cabin = styled.div`
    font-size: 1.6rem;
    font-weight: 600;
    color: var(--color-grey-600);
    font-family: "Sono";
`;

const Stacked = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.2rem;

    & span:first-child {
        font-weight: 500;
    }

    & span:last-child {
        color: var(--color-grey-500);
        font-size: 1.2rem;
    }
`;

const Amount = styled.div`
    font-family: "Sono";
    font-weight: 500;
`;

function BookingRow({
    booking: {
        id: booking_id,
        start_date,
        end_date,
        number_of_nights,
        total_price,
        status,
        guests: { full_name: guest_name, email },
        cabins: { name: cabin_name }
    }
}) {
    const navigate = useNavigate();
    const { checkout, isCheckingOut } = useCheckout();
    const { deleteBooking, isDeleting } = useDeleteBooking();

    const statusToTagName = {
        unconfirmed: "blue",
        "checked-in": "green",
        "checked-out": "silver"
    };

    return (
        <Table.Row>
            <Cabin>{cabin_name}</Cabin>

            <Stacked>
                <span>{guest_name}</span>
                <span>{email}</span>
            </Stacked>

            <Stacked>
                <span>
                    {isToday(new Date(start_date))
                        ? "Today"
                        : formatDistanceFromNow(start_date)}{" "}
                    &rarr; {number_of_nights} night stay
                </span>
                <span>
                    {format(new Date(start_date), "MMM dd yyyy")} &mdash;{" "}
                    {format(new Date(end_date), "MMM dd yyyy")}
                </span>
            </Stacked>

            <Tag type={statusToTagName[status]}>{status.replace("-", " ")}</Tag>

            <Amount>{formatCurrency(total_price)}</Amount>

            <Modal>
                <Menus.Menu>
                    <Menus.Toggle id={booking_id}></Menus.Toggle>
                    <Menus.List id={booking_id}>
                        <Menus.Button
                            icon={<HiEye />}
                            onClick={() => navigate(`/bookings/${booking_id}`)}
                        >
                            Details
                        </Menus.Button>

                        {status === "unconfirmed" && (
                            <Menus.Button
                                icon={<HiCalendarDays />}
                                onClick={() =>
                                    navigate(`/checkin/${booking_id}`)
                                }
                            >
                                Check&nbsp;in
                            </Menus.Button>
                        )}

                        {status === "checked-in" && (
                            <Menus.Button
                                icon={<HiArrowLeftOnRectangle />}
                                onClick={() => checkout(booking_id)}
                                disabled={isCheckingOut}
                            >
                                Check&nbsp;out
                            </Menus.Button>
                        )}

                        <Modal.Open opens="confirm-delete">
                            <Menus.Button icon={<HiTrash />}>
                                Delete
                            </Menus.Button>
                        </Modal.Open>
                    </Menus.List>
                </Menus.Menu>

                <Modal.Window name="confirm-delete">
                    <ConfirmDelete
                        resourceName="booking"
                        onConfirm={() => deleteBooking(booking_id)}
                        disabled={isDeleting}
                    />
                </Modal.Window>
            </Modal>
        </Table.Row>
    );
}

export default BookingRow;
