import supabase from "./supabase";
import { getToday } from "../utils/helpers";
import { PAGE_SIZE } from "../utils/constants";

export async function getBookings({ filter, sortBy, page }) {
    let query = supabase
        .from("bookings")
        .select("*, cabins(name), guests(full_name, email)", {
            count: "exact",
            head: false
        });

    if (filter) {
        query = query[filter.method || "eq"](filter.field, filter.value);
    }

    if (sortBy) {
        query = query.order(sortBy.field, {
            ascending: sortBy.direction === "asc"
        });
    }

    if (page) {
        const from = (page - 1) * PAGE_SIZE;
        const to = from + PAGE_SIZE - 1;
        query = query.range(from, to);
    }

    const { data, error, count } = await query;

    if (error) {
        console.error(error);
        throw new Error("Could not load the bookings data");
    }

    return { data, count };
}

export async function getBooking(id) {
    const { data, error } = await supabase
        .from("bookings")
        .select("*, cabins(*), guests(*)")
        .eq("id", id)
        .single();

    if (error) {
        console.error(error);
        throw new Error("Booking not found");
    }

    return data;
}

export async function getBookingsAfterDate(date) {
    const { data, error } = await supabase
        .from("bookings")
        .select("created_at, total_price, extras_price")
        .gte("created_at", date)
        .lte("created_at", getToday({ end: true }));

    if (error) {
        console.error(error);
        throw new Error("Could not load the bookings data");
    }

    return data;
}

export async function getStaysAfterDate(date) {
    const { data, error } = await supabase
        .from("bookings")
        .select("*, guests(full_name)")
        .gte("start_date", date)
        .lte("start_date", getToday());

    if (error) {
        console.error(error);
        throw new Error("Could not load the bookings data");
    }

    return data;
}

export async function getStaysTodayActivity() {
    const { data, error } = await supabase
        .from("bookings")
        .select("*, guests(full_name, nationality, country_flag)")
        .or(
            `and(status.eq.unconfirmed,start_date.eq.${getToday()}),and(status.eq.checked-in,endDate.eq.${getToday()})`
        )
        .order("created_at");

    if (error) {
        console.error(error);
        throw new Error("Could not load the bookings data");
    }

    return data;
}

export async function updateBooking(id, obj) {
    const { data, error } = await supabase
        .from("bookings")
        .update(obj)
        .eq("id", id)
        .select()
        .single();

    if (error) {
        console.error(error);
        throw new Error("Could not update the booking info");
    }

    return data;
}

export async function deleteBooking(id) {
    const { data, error } = await supabase
        .from("bookings")
        .delete()
        .eq("id", id);

    if (error) {
        console.error(error);
        throw new Error("Could not delete the booking");
    }

    return data;
}
