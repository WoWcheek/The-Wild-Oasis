import { useState } from "react";
import styled from "styled-components";
import { isFuture, isPast, isToday } from "date-fns";
import { subtractDates } from "../utils/helpers";
import supabase from "../services/supabase";
import Button from "../ui/Button";

import { bookings } from "./data-bookings";
import { cabins } from "./data-cabins";
import { guests } from "./data-guests";

// const originalSettings = {
//   min_booking_length: 3,
//   max_booking_length: 30,
//   max_guests_per_booking: 10,
//   breakfast_price: 15,
// };

const StyledUploader = styled.div`
    margin-top: auto;
    background-color: #e0e7ff;
    padding: 8px;
    border-radius: 5px;
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

async function deleteGuests() {
    const { error } = await supabase.from("guests").delete().gt("id", 0);
    if (error) console.error(error.message);
}

async function deleteCabins() {
    const { error } = await supabase.from("cabins").delete().gt("id", 0);
    if (error) console.error(error.message);
}

async function deleteBookings() {
    const { error } = await supabase.from("bookings").delete().gt("id", 0);
    if (error) console.error(error.message);
}

async function createGuests() {
    const { error } = await supabase.from("guests").insert(guests);
    if (error) console.error(error.message);
}

async function createCabins() {
    const { error } = await supabase.from("cabins").insert(cabins);
    if (error) console.error(error.message);
}

async function createBookings() {
    const { data: guestsIds } = await supabase
        .from("guests")
        .select("id")
        .order("id");
    const allGuestIds = guestsIds.map((guest) => guest.id);
    const { data: cabinsIds } = await supabase
        .from("cabins")
        .select("id")
        .order("id");
    const allCabinIds = cabinsIds.map((cabin) => cabin.id);

    const finalBookings = bookings.map((booking) => {
        const cabin = cabins.at(booking.cabin_id - 1);
        const number_of_nights = subtractDates(
            booking.end_date,
            booking.start_date
        );
        const cabin_price =
            number_of_nights * (cabin.regular_price - cabin.discount);
        const extras_price = booking.has_breakfast
            ? number_of_nights * 15 * booking.number_of_guests
            : 0;
        const total_price = cabin_price + extras_price;

        let status;
        if (
            isPast(new Date(booking.end_date)) &&
            !isToday(new Date(booking.end_date))
        )
            status = "checked-out";
        if (
            isFuture(new Date(booking.start_date)) ||
            isToday(new Date(booking.start_date))
        )
            status = "unconfirmed";
        if (
            (isFuture(new Date(booking.end_date)) ||
                isToday(new Date(booking.end_date))) &&
            isPast(new Date(booking.start_date)) &&
            !isToday(new Date(booking.start_date))
        )
            status = "checked-in";

        return {
            ...booking,
            number_of_nights,
            cabin_price,
            extras_price,
            total_price,
            guest_id: allGuestIds.at(booking.guest_id - 1),
            cabin_id: allCabinIds.at(booking.cabin_id - 1),
            status
        };
    });

    const { error } = await supabase.from("bookings").insert(finalBookings);
    if (error) console.error(error.message);
}

function Uploader() {
    const [isPending, setIsPending] = useState(false);

    async function uploadAll() {
        setIsPending(true);

        await deleteBookings();
        await deleteGuests();
        await deleteCabins();

        await createGuests();
        await createCabins();
        await createBookings();

        setIsPending(false);
    }

    async function uploadBookings() {
        setIsPending(true);
        await deleteBookings();
        await createBookings();
        setIsPending(false);
    }

    return (
        <StyledUploader>
            <h3>SAMPLE DATA</h3>

            <Button onClick={uploadAll} disabled={isPending}>
                Upload ALL
            </Button>

            <Button onClick={uploadBookings} disabled={isPending}>
                Upload bookings ONLY
            </Button>
        </StyledUploader>
    );
}

export default Uploader;
