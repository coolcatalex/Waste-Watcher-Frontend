<script lang="ts">
    import * as Table from "$lib/components/ui/table/index.js";
    import { useQuery } from "@sveltestack/svelte-query";
    import Datetime from "./Datetime.svelte";
    import { startOfDay, endOfDay, format } from 'date-fns';
    import axios, { AxiosError } from "axios";
    import type { ENTRIES_TYPES } from "../../../../types";
    import { PUBLIC_API_SERVER } from "$env/static/public";
    import { getCookie } from "$lib/scripts/Cookie.svelte";
    import { toast } from "svelte-sonner";
    // import { onMount } from "svelte";

    let createdAt_Date = new Date();
    export let orgId:string;

    const fetchEntries = async () => {
        const response = await axios.post<ENTRIES_TYPES>(`${PUBLIC_API_SERVER}/auth/entries/search`,{
                createdAtstartDate: startOfDay(createdAt_Date).getTime(),
                createdAtendDate: endOfDay(createdAt_Date).getTime(),
                page: 1,
                orgId,
                count: 50
            }, {
            headers: {
                "Authorization": `bearer ${getCookie("RECYCLE_TOKEN")}`
            }
        });
        return response.data;
    };

    // This is how we trigger refetching based on a reactive dependency
    $: getEntries = useQuery(["getEntries_min", createdAt_Date,orgId], fetchEntries, {
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchInterval: 5000
    });

    async function deleteEntry(ele: EventTarget & HTMLButtonElement, entryId: string) {
        try {
            ele.disabled = true;
            const res = await axios.delete(`${PUBLIC_API_SERVER}/auth/entries/`, {
                params:{
                    entryId,
                    orgId
                },
                headers: {
                    "Authorization": `bearer ${getCookie("RECYCLE_TOKEN")}`
                }
            });
            if (res.status === 200) {
                toast("Entry deleted");
                document.getElementById(entryId)?.remove();
            } else {
                toast("Try Again");
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data || error.response?.data.message || "Error");
            } else {
                console.log(error);
            }
        } finally {
            ele.disabled = false;
        }
    }
</script>

<div class="w-full">
    <div class="flex justify-center">
        <div class="w-fit">
            <Datetime bind:startDate={createdAt_Date} />
        </div>
    </div>
    <div class="h-[80svh] overflow-auto px-2 relative">
        <Table.Root>
            <Table.Caption class="text-[0.7rem]">Entries for {format(createdAt_Date, "yyyy/MM/dd")}</Table.Caption>
            <Table.Header>
                <Table.Row>
                    <Table.Head>Org.</Table.Head>
                    <Table.Head>Area Name</Table.Head>
                    <Table.Head>Classification</Table.Head>
                    <!-- <Table.Head>Waste Type</Table.Head> -->
                    <Table.Head>Weight</Table.Head>
                    <!-- <Table.Head>Awareness Score</Table.Head> -->
                    <!-- <Table.Head>Maturity Score</Table.Head> -->
                    <Table.Head>Entry Date</Table.Head>
                    <Table.Head></Table.Head>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {#if $getEntries.isSuccess}
                    {#each $getEntries.data.entries as entry (entry._id)}
                        <Table.Row id={entry._id}>
                            <Table.Cell class="capitalize">{entry.orgName}</Table.Cell>
                            <Table.Cell class="capitalize">{entry.areaName.replace("-", " ")}</Table.Cell>
                            <Table.Cell class="capitalize">{entry.classification.replaceAll("_"," ")}</Table.Cell>
                            <!-- <Table.Cell class="capitalize">{entry.wasteType}</Table.Cell> -->
                            <Table.Cell class="capitalize">{`${Number.isInteger(entry.weight) ? entry.weight : entry.weight.toFixed(2)} ${entry.unit}`}</Table.Cell>
                            <!-- <Table.Cell class="capitalize">{entry.awareness_score}</Table.Cell> -->
                            <!-- <Table.Cell class="capitalize">{entry.maturity_score}</Table.Cell> -->
                            <Table.Cell class="capitalize">{format(entry.timestamp, "yyyy/MM/dd p")}</Table.Cell>
                            <Table.Cell class="capitalize">
                                <button on:click={(evt) => deleteEntry(evt.currentTarget, entry._id)} class="disabled:opacity-30 disabled:pointer-events-none">
                                    <svg class="h-5 w-auto stroke-[#1C1C1C] hover:stroke-destructive" width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M5.73708 6.54391V18.9857C5.73708 19.7449 6.35257 20.3604 7.11182 20.3604H16.8893C17.6485 20.3604 18.264 19.7449 18.264 18.9857V6.54391M2.90906 6.54391H21.0909" stroke-width="1.7" stroke-linecap="round"/>
                                        <path d="M8 6V4.41421C8 3.63317 8.63317 3 9.41421 3H14.5858C15.3668 3 16 3.63317 16 4.41421V6" stroke-width="1.7" stroke-linecap="round"/>
                                    </svg>
                                </button>
                            </Table.Cell>
                        </Table.Row>
                    {/each}
                {/if}
            </Table.Body>
        </Table.Root>
    </div>
</div>
