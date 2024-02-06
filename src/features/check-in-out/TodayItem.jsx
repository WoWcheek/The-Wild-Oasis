import { Link } from "react-router-dom";
import styled from "styled-components";
import CheckoutButton from "./CheckoutButton";
import { Flag } from "../../ui/Flag";
import Button from "../../ui/Button";
import Tag from "../../ui/Tag";

const StyledTodayItem = styled.li`
    font-size: 1.4rem;
    padding: 0.8rem 0;
    border-bottom: 1px solid var(--color-grey-100);

    display: grid;
    grid-template-columns: 9rem 2rem 1fr 7rem 9rem;
    gap: 1.2rem;
    align-items: center;

    &:first-child {
        border-top: 1px solid var(--color-grey-100);
    }
`;

const Guest = styled.div`
    font-weight: 500;
`;

function TodayItem({ activity }) {
    const { id, status, guests, number_of_nights } = activity;

    return (
        <StyledTodayItem>
            {status === "unconfirmed" && <Tag type="green">Arriving</Tag>}
            {status === "checked-in" && <Tag type="blue">Departing</Tag>}
            <Flag src={guests.country_flag} alt={`Flag of ${guests.country}`} />
            <Guest>{guests.full_name}</Guest>
            <div>{number_of_nights} nights</div>

            {status === "unconfirmed" && (
                <Button
                    size="small"
                    variation="primary"
                    as={Link}
                    to={`/checkin/${id}`}
                >
                    Check in
                </Button>
            )}
            {status === "checked-in" && <CheckoutButton bookingId={id} />}
        </StyledTodayItem>
    );
}

export default TodayItem;
