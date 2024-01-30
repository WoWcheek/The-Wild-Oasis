import { useState } from "react";
import { HiSquare2Stack, HiPencil, HiTrash } from "react-icons/hi2";
import styled from "styled-components";
import { formatCurrency } from "../../utils/helpers";
import EditCabinForm from "./EditCabinForm";
import { useDeleteCabin } from "./useDeleteCabin";
import { useCreateCabin } from "./useCreateCabin";

const TableRow = styled.div`
    display: grid;
    grid-template-columns: 0.6fr 1.8fr 2.2fr 1fr 1fr 1fr;
    column-gap: 2.4rem;
    align-items: center;
    padding: 1.4rem 2.4rem;

    &:not(:last-child) {
        border-bottom: 1px solid var(--color-grey-100);
    }
`;

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
    const [showForm, setShowForm] = useState(false);

    const {
        id: cabinId,
        name,
        max_capacity,
        regular_price,
        discount,
        image
    } = cabin;

    const { isCreating, createCabin } = useCreateCabin();
    const { isDeleting, deleteCabin } = useDeleteCabin();

    function handleDuplicate() {
        createCabin({
            name: `${name} copy`,
            max_capacity,
            regular_price,
            discount,
            image
        });
    }

    return (
        <>
            <TableRow role="row">
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
                    <button onClick={handleDuplicate}>
                        <HiSquare2Stack />
                    </button>
                    <button onClick={() => setShowForm((x) => !x)}>
                        <HiPencil />
                    </button>
                    <button
                        onClick={() => deleteCabin(cabinId)}
                        disabled={isDeleting || isCreating}
                    >
                        <HiTrash />
                    </button>
                </div>
            </TableRow>
            {showForm && <EditCabinForm cabinToEdit={cabin} />}
        </>
    );
}

export default CabinRow;
