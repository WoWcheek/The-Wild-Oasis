import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { HiArrowLeftOnRectangle } from "react-icons/hi2";
import { useCheckout } from "../check-in-out/useCheckout";
import { useDeleteBooking } from "./useDeleteBooking";
import { useMoveBack } from "../../hooks/useMoveBack";
import { useBooking } from "./useBooking";
import Row from "../../ui/Row";
import Tag from "../../ui/Tag";
import Modal from "../../ui/Modal";
import Button from "../../ui/Button";
import Spinner from "../../ui/Spinner";
import Heading from "../../ui/Heading";
import ButtonText from "../../ui/ButtonText";
import ButtonGroup from "../../ui/ButtonGroup";
import BookingDataBox from "./BookingDataBox";
import ConfirmDelete from "../../ui/ConfirmDelete";

const HeadingGroup = styled.div`
    display: flex;
    gap: 2.4rem;
    align-items: center;
`;

function BookingDetail() {
    const navigate = useNavigate();
    const { booking, isLoading } = useBooking();
    const { deleteBooking, isDeleting } = useDeleteBooking();
    const { checkout, isCheckingOut } = useCheckout();
    const moveBack = useMoveBack();

    if (isLoading) return <Spinner />;

    const { id, status } = booking;

    const statusToTagName = {
        unconfirmed: "blue",
        "checked-in": "green",
        "checked-out": "silver"
    };

    return (
        <>
            <Row type="horizontal">
                <HeadingGroup>
                    <Heading as="h1">Booking #{id}</Heading>
                    <Tag type={statusToTagName[status]}>
                        {status.replace("-", " ")}
                    </Tag>
                </HeadingGroup>
                <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
            </Row>

            <BookingDataBox booking={booking} />

            <ButtonGroup>
                {status === "unconfirmed" && (
                    <Button onClick={() => navigate(`/checkin/${id}`)}>
                        Check&nbsp;in
                    </Button>
                )}

                {status === "checked-in" && (
                    <Button
                        icon={<HiArrowLeftOnRectangle />}
                        onClick={() => checkout(id)}
                        disabled={isCheckingOut}
                    >
                        Check&nbsp;out
                    </Button>
                )}

                <Modal>
                    <Modal.Open opens="confirm-delete">
                        <Button variation="danger">Delete</Button>
                    </Modal.Open>

                    <Modal.Window name="confirm-delete">
                        <ConfirmDelete
                            resourceName="booking"
                            onConfirm={() =>
                                deleteBooking(id, {
                                    onSettled: () => navigate(-1)
                                })
                            }
                            disabled={isDeleting}
                        />
                    </Modal.Window>
                </Modal>

                <Button variation="secondary" onClick={moveBack}>
                    Back
                </Button>
            </ButtonGroup>
        </>
    );
}

export default BookingDetail;
