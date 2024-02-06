import {
    HiOutlineBanknotes,
    HiOutlineBriefcase,
    HiOutlineCalendarDays,
    HiOutlineChartBar
} from "react-icons/hi2";
import { formatCurrency } from "../../utils/helpers";
import Stat from "./Stat";

function Stats({ bookings, confirmedStays, numDays, numCabins }) {
    const numBookings = bookings?.length;
    const sales = bookings?.reduce((acc, cur) => acc + cur.total_price, 0);
    const checkins = confirmedStays?.length;

    const occupiedNights = confirmedStays?.reduce(
        (acc, cur) => acc + cur.number_of_nights,
        0
    );
    const availableNights = numDays * numCabins;
    const occupancyRate = occupiedNights / availableNights;

    return (
        <>
            <Stat
                title="Bookings"
                color="blue"
                icon={<HiOutlineBriefcase />}
                value={numBookings}
            />
            <Stat
                title="Sales"
                color="green"
                icon={<HiOutlineBanknotes />}
                value={formatCurrency(sales)}
            />
            <Stat
                title="Check ins"
                color="indigo"
                icon={<HiOutlineCalendarDays />}
                value={checkins}
            />
            <Stat
                title="Occupancy rate"
                color="yellow"
                icon={<HiOutlineChartBar />}
                value={Math.round(occupancyRate * 100) + "%"}
            />
        </>
    );
}

export default Stats;
