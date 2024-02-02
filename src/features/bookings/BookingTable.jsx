import { useBookings } from "./useBookings";
import Empty from "../../ui/Empty";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";
import Spinner from "../../ui/Spinner";
import BookingRow from "./BookingRow";
import Pagination from "../../ui/Pagination";

function BookingTable() {
    const { isLoading, bookings, count } = useBookings();

    if (isLoading) return <Spinner />;
    if (!count) return <Empty resourceName="bookings" />;

    return (
        <Menus>
            <Table columns="0.6fr 2fr 2.4fr 1.4fr 1fr 3.2rem">
                <Table.Header>
                    <div>Cabin</div>
                    <div>Guest</div>
                    <div>Dates</div>
                    <div>Status</div>
                    <div>Amount</div>
                    <div></div>
                </Table.Header>

                <Table.Body
                    items={bookings}
                    render={(x) => <BookingRow key={x.id} booking={x} />}
                />

                <Table.Footer>
                    <Pagination count={count} />
                </Table.Footer>
            </Table>
        </Menus>
    );
}

export default BookingTable;
