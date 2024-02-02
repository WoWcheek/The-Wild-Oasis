import { useSearchParams } from "react-router-dom";
import { useCabins } from "./useCabins";
import Spinner from "../../ui/Spinner";
import CabinRow from "./CabinRow";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";
import Empty from "../../ui/Empty";

function CabinTable() {
    const { isLoading, cabins } = useCabins();
    const [searchParams] = useSearchParams();

    if (isLoading) return <Spinner />;
    if (!cabins.length) return <Empty resourceName="bookings" />;

    const filterValue = searchParams.get("discount") || "all";
    let filteredCabins = [];
    if (filterValue === "all") filteredCabins = cabins;
    else if (filterValue === "no-discount")
        filteredCabins = cabins.filter((x) => x.discount === 0);
    else if (filterValue === "with-discount")
        filteredCabins = cabins.filter((x) => x.discount !== 0);

    const sortByValue = searchParams.get("sortBy") || "name-asc";
    const [field, direction] = sortByValue.split("-");
    const modifier = direction === "asc" ? 1 : -1;
    const sortedCabins = filteredCabins.sort(
        (a, b) => (a[field] - b[field]) * modifier
    );

    return (
        <Menus>
            <Table columns="0.8fr 1.7fr 2.1fr 1fr 1fr 1fr">
                <Table.Header>
                    <div></div>
                    <div>Cabin</div>
                    <div>Capacity</div>
                    <div>Price</div>
                    <div>Discount</div>
                    <div></div>
                </Table.Header>
                <Table.Body
                    items={sortedCabins}
                    render={(cabin) => (
                        <CabinRow cabin={cabin} key={cabin.id} />
                    )}
                />
            </Table>
        </Menus>
    );
}

export default CabinTable;
