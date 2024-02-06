import styled from "styled-components";
import { eachDayOfInterval, format, isSameDay, subDays } from "date-fns";
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";
import { useDarkMode } from "../../contexts/DarkModeContext";
import DashboardBox from "./DashboardBox";
import Heading from "../../ui/Heading";

const StyledSalesChart = styled(DashboardBox)`
    grid-column: 1 / -1;

    & .recharts-cartesian-grid-horizontal line,
    & .recharts-cartesian-grid-vertical line {
        stroke: var(--color-grey-300);
    }
`;

function SalesChart({ bookings, numDays }) {
    const { isDarkMode } = useDarkMode();

    const colors = isDarkMode
        ? {
              totalSales: { stroke: "#4f46e5", fill: "#4f46e5" },
              extrasSales: { stroke: "#22c55e", fill: "#22c55e" },
              text: "#e5e7eb",
              background: "#18212f"
          }
        : {
              totalSales: { stroke: "#4f46e5", fill: "#c7d2fe" },
              extrasSales: { stroke: "#16a34a", fill: "#dcfce7" },
              text: "#374151",
              background: "#fff"
          };

    const allDays = eachDayOfInterval({
        start: subDays(new Date(), numDays - 1),
        end: new Date()
    });

    const data = allDays.map((day) => {
        const label = format(day, "MMM dd");

        const bookingsDay = bookings.filter((booking) =>
            isSameDay(day, new Date(booking.created_at))
        );
        const totalSales = bookingsDay.reduce(
            (acc, cur) => acc + cur.total_price,
            0
        );
        const extrasSales = bookingsDay.reduce(
            (acc, cur) => acc + cur.extras_price,
            0
        );

        return { label, totalSales, extrasSales };
    });

    return (
        <StyledSalesChart>
            <Heading as="h2">
                Sales during {format(allDays[0], "MMM dd yyyy")} &mdash;{" "}
                {format(allDays[allDays.length - 1], "MMM dd yyyy")}
            </Heading>

            <ResponsiveContainer height={300} width="100%">
                <AreaChart data={data}>
                    <XAxis
                        dataKey="label"
                        tick={{ fill: colors.text }}
                        stroke={{ stroke: colors.text }}
                    />
                    <YAxis
                        unit="$"
                        tick={{ fill: colors.text }}
                        stroke={{ stroke: colors.text }}
                    />
                    <CartesianGrid strokeDasharray="4" />
                    <Tooltip
                        contentStyle={{ backgroundColor: colors.background }}
                    />
                    <Area
                        dataKey="totalSales"
                        type="monotone"
                        stroke={colors.totalSales.stroke}
                        fill={colors.totalSales.fill}
                        strokeWidth={2}
                        name="Total sales"
                        unit="$"
                    />
                    <Area
                        dataKey="extrasSales"
                        type="monotone"
                        stroke={colors.extrasSales.stroke}
                        fill={colors.extrasSales.fill}
                        strokeWidth={2}
                        name="Extras sales"
                        unit="$"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </StyledSalesChart>
    );
}

export default SalesChart;
