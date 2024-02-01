import styled from "styled-components";
import { HiSquare2Stack, HiPencil, HiTrash } from "react-icons/hi2";
import { formatCurrency } from "../../utils/helpers";
import { useCreateCabin } from "./useCreateCabin";
import { useDeleteCabin } from "./useDeleteCabin";
import Modal from "../../ui/Modal";
import Menus from "../../ui/Menus";
import Table from "../../ui/Table";
import EditCabinForm from "./EditCabinForm";
import ConfirmDelete from "../../ui/ConfirmDelete";

const Img = styled.img`
    display: block;
    width: 6.4rem;
    aspect-ratio: 3 / 2;
    object-fit: cover;
    object-position: center;
    transform: scale(1.5) translateX(-7px);
`;

const Cabin = styled.div`
    font-size: 1.6rem;
    font-weight: 600;
    color: var(--color-grey-600);
    font-family: "Sono";
`;

const Price = styled.div`
    font-family: "Sono";
    font-weight: 600;
`;

const Discount = styled.div`
    font-family: "Sono";
    font-weight: 500;
    color: var(--color-green-700);
`;

function CabinRow({ cabin }) {
    const {
        id: cabinId,
        name,
        max_capacity,
        regular_price,
        discount,
        description,
        image
    } = cabin;

    const { createCabin } = useCreateCabin();
    const { isDeleting, deleteCabin } = useDeleteCabin();

    function handleDuplicate() {
        createCabin({
            name: `${name} copy`,
            max_capacity,
            regular_price,
            discount,
            description,
            image
        });
    }

    return (
        <>
            <Table.Row>
                <Img src={image} />
                <Cabin>{name}</Cabin>
                <div>Fits up to {max_capacity} guests</div>
                <Price>{formatCurrency(regular_price)}</Price>
                {discount ? (
                    <Discount>{formatCurrency(discount)}</Discount>
                ) : (
                    <span>&mdash;</span>
                )}
                <div>
                    <Modal>
                        <Menus.Menu>
                            <Menus.Toggle id={cabinId} />

                            <Menus.List id={cabinId}>
                                <Menus.Button
                                    icon={<HiSquare2Stack />}
                                    onClick={handleDuplicate}
                                >
                                    Duplicate
                                </Menus.Button>

                                <Modal.Open opens="edit-form">
                                    <Menus.Button icon={<HiPencil />}>
                                        Edit
                                    </Menus.Button>
                                </Modal.Open>

                                <Modal.Open opens="confirm-delete">
                                    <Menus.Button icon={<HiTrash />}>
                                        Delete
                                    </Menus.Button>
                                </Modal.Open>
                            </Menus.List>

                            <Modal.Window name="edit-form">
                                <EditCabinForm cabinToEdit={cabin} />
                            </Modal.Window>

                            <Modal.Window name="confirm-delete">
                                <ConfirmDelete
                                    resourceName="cabins"
                                    disabled={isDeleting}
                                    onConfirm={() => deleteCabin(cabinId)}
                                />
                            </Modal.Window>
                        </Menus.Menu>
                    </Modal>
                </div>
            </Table.Row>
        </>
    );
}

export default CabinRow;
