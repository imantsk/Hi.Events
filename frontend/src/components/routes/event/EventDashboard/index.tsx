import {useGetEvent} from "../../../../queries/useGetEvent.ts";
import {useParams} from "react-router";
import {PageTitle} from "../../../common/PageTitle";
import {PageBody} from "../../../common/PageBody";
import {StatBoxes} from "../../../common/StatBoxes";
import {useGetMe} from "../../../../queries/useGetMe.ts";
import {t, Trans} from "@lingui/macro";
import {AreaChart} from "@mantine/charts";
import {Card} from "../../../common/Card";
import classes from "./EventDashboard.module.scss";
import {useGetEventStats} from "../../../../queries/useGetEventStats.ts";
import {formatCurrency} from "../../../../utilites/currency.ts";
import {formatDate} from "../../../../utilites/dates.ts";
import {Button, Group, Skeleton} from "@mantine/core";
import {useDisclosure, useMediaQuery} from "@mantine/hooks";
import {IconShare} from "@tabler/icons-react";
import {ShareModal} from "../../../modals/ShareModal";

export const DashBoardSkeleton = () => {
    return (
        <>
            <Skeleton height={120} radius="l" mb="20px"/>
            <Skeleton height={350} radius="l" mb="20px"/>
            <Skeleton height={350} radius="l"/>
        </>
    );
}

export const EventDashboard = () => {
    const {eventId} = useParams();
    const eventQuery = useGetEvent(eventId);
    const {data: me} = useGetMe();
    const event = eventQuery?.data;
    const eventStatsQuery = useGetEventStats(eventId);
    const {data: eventStats} = eventStatsQuery;
    const [opened, {open, close}] = useDisclosure(false);
    const isMobile = useMediaQuery('(max-width: 768px)');

    const dateRange = (eventStats && event)
        ? `${formatDate(eventStats.start_date, 'MMM DD', event?.timezone)} - ${formatDate(eventStats.end_date, 'MMM DD', event?.timezone)}`
        : '';

    return (
        <PageBody>
            <Group justify="space-between" align="center" mb={'5px'}>
                <PageTitle style={{marginBottom: 0}}>
                    {!isMobile && (
                        <Trans>
                            Welcome back{me?.first_name && ', ' + me?.first_name} 👋
                        </Trans>
                    )}

                    {isMobile && (
                        <Trans>
                            Hi {me?.first_name && me?.first_name} 👋
                        </Trans>
                    )}
                </PageTitle>
                {event && (
                    <>
                        <Button
                            onClick={open}
                            variant="transparent"
                            leftSection={<IconShare size={16}/>}
                        >
                            {t`Share Event`}
                        </Button>

                        {event && <ShareModal
                            event={event}
                            opened={opened}
                            onClose={close}
                        />}
                    </>
                )}
            </Group>

            {!event && <DashBoardSkeleton/>}

            {event && (<>
                <StatBoxes/>

                <Card className={classes.chartCard}>
                    <div className={classes.chartCardTitle}>
                        <h2>{t`Product Sales`}</h2>
                        <div className={classes.dateRange}>
                        <span>
                            {dateRange}
                        </span>
                        </div>
                    </div>
                    <AreaChart
                        h={300}
                        data={eventStats?.daily_stats.map(stat => ({
                            date: formatDate(stat.date, 'MMM DD', event.timezone),
                            orders_created: stat.orders_created,
                            products_sold: stat.products_sold,
                            attendees_registered: stat.attendees_registered,
                        })) || []}
                        dataKey="date"
                        withLegend
                        legendProps={{verticalAlign: 'bottom', height: 50}}

                        series={[
                            {name: 'orders_created', color: 'blue.6', label: t`Completed Orders`},
                            {name: 'products_sold', color: 'blue.2', label: t`Products Sold`},
                            {name: 'attendees_registered', color: 'blue.4', label: t`Attendees Registered`},
                        ]}
                        curveType="bump"
                        tickLine="none"
                        areaChartProps={{syncId: 'events'}}
                    />
                </Card>

                <Card className={classes.chartCard}>
                    <div className={classes.chartCardTitle}>
                        <h2>{t`Revenue`}</h2>
                        <div className={classes.dateRange}>
                        <span>
                            {dateRange}
                        </span>
                        </div>
                    </div>

                    <AreaChart
                        h={300}
                        data={eventStats?.daily_stats.map(stat => {
                            return ({
                                date: formatDate(stat.date, 'MMM DD', event.timezone),
                                total_fees: stat.total_fees,
                                total_sales_gross: stat.total_sales_gross,
                                total_tax: stat.total_tax,
                                total_refunded: stat.total_refunded,
                            });
                        }) || []}
                        dataKey="date"
                        valueFormatter={(value) => formatCurrency(value, event.currency)}
                        withLegend
                        legendProps={{verticalAlign: 'bottom', height: 50}}
                        series={[
                            {name: 'total_fees', label: t`Total Fees`, color: 'purple.3'},
                            {name: 'total_sales_gross', label: t`Gross Sales`, color: 'grape.5'},
                            {name: 'total_tax', label: t`Total Tax`, color: 'grape.7'},
                            {name: 'total_refunded', label: t`Total Refunded`, color: 'red.6'},
                        ]}
                        curveType="natural"
                        tickLine="none"
                        areaChartProps={{syncId: 'events'}}
                    />
                </Card>
            </>)}
        </PageBody>
    )
};

export default EventDashboard;
