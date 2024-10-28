<script lang="ts">
    import * as Table from "$lib/components/ui/table/index.js";
    import { useQuery, Query} from '@sveltestack/svelte-query'
    import * as Select from "$lib/components/ui/select";
    import userStore from "$lib/stores/userStore";
    import Datetime from "./Datetime.svelte";
    import { endOfDay, format } from 'date-fns';
    import axios, { AxiosError } from "axios";
    import type { ENTRIES_TYPES } from "../../../../types";
    import { PUBLIC_API_SERVER } from "$env/static/public";
    import { getCookie } from "$lib/scripts/Cookie.svelte";
    import { toast } from "svelte-sonner";
    import {startOfToday} from 'date-fns'
    import * as Pagination from "$lib/components/ui/pagination";
    import { da } from "date-fns/locale";
    import { ChevronLeft, ChevronRight } from "lucide-svelte";
    // import { onMount } from "svelte";
    import selectedOrgStore from "$lib/stores/selectedOrg";
    
    let onboarding = $userStore.onBoarding
    $: profileData = $selectedOrgStore
    let orgId = profileData?._id ;
    let timestamp = new Date();
    let prevDayTimestamp = startOfToday();
    let loadingMoreItems = false
    const perPage = 50
    let current_page = 1
    let hasMore = false
    
    const fetchEntries = async (page:number) => {
        loadingMoreItems = true
        var res = await axios.get<ENTRIES_TYPES>(`${PUBLIC_API_SERVER}/auth/entries/search`, {
            params: {
                startDate: typeof prevDayTimestamp === 'number' ? prevDayTimestamp : prevDayTimestamp.getTime(),
                endDate: typeof timestamp === 'number' ? timestamp : timestamp.getTime(),
                page: page,
                orgId: orgId || profileData?._id,
                count: perPage
            },
            headers: {
                "Authorization": `bearer ${getCookie("RECYCLE_TOKEN")}`
            }
        });
        loadingMoreItems = false
        return res
    };

    // This is how we trigger refetching based on a reactive dependency
    // $: getEntries = useQuery(["getEntries", timestamp, prevDayTimestamp], fetchEntries, {
    //     refetchOnMount: false,
    //     refetchOnWindowFocus: false,
    //     refetchInterval: 5000
    // });

    async function deleteEntry(ele: EventTarget & HTMLButtonElement, entryId: string) {
        try {
            ele.disabled = true;
            const res = await axios.delete(`${PUBLIC_API_SERVER}/auth/entries/`, {
                params:{
                    entryId,
                    orgId: orgId || profileData?._id
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
<!-- 
<header class="sticky top-0 bg-primary bg-opacity-80 flex h-fit py-[1rem] items-center gap-4 border-b px-4 lg:px-6 backdrop-blur-md">
    <div class="w-full flex-1 flex justify-center items-center">
        <div class="flex-1 flex justify-center items-center">
            <span class="capitalize text-3xl tracking-wide font-impact text-white">Add Awareness Session Deatils</span>
        </div>
    </div>
</header> -->

<header class="sticky top-0 bg-primary py-[1rem] h-fit bg-opacity-80 w-full flex items-center gap-4 border-b px-4 lg:px-6 backdrop-blur-md">
    <!-- <div class="w-full flex-1 flex justify-center items-center"> -->
            <Select.Root onSelectedChange={(d)=>{
                if(d?.value){
                    // @ts-ignore
                    orgId = onboarding[d.value]._id
                    // @ts-ignore
                    selectedOrgStore.set(onboarding[d.value])
                }
            }} selected={{
                label: profileData?.schoolName,
                value: profileData?._id
            }}>
                <Select.Trigger class="w-[180px] bg-white">
                    <Select.Value placeholder="Organisations" />
                </Select.Trigger>
                <Select.Content>
                    {#each Object.entries(onboarding) as [key, value]}
                        <Select.Item value={key}>{value.schoolName}</Select.Item>
                    {/each}
                </Select.Content>
                <Select.Input name="area" required />
            </Select.Root>
        <!-- <div class="flex-1 flex-shrink-0 flex justify-center items-center">
            <span class="capitalize text-3xl tracking-wide font-impact text-white -translate-x-1/4">view waste audits</span>
        </div> -->
    <!-- </div> -->
    <div class="flex justify-center">
        <div class="w-fit flex justify-center items-center gap-6">
            <div class="flex gap-2 items-center justify-center">
                <span class="text-white">From:</span>
                <div class="bg-white rounded-md">
                    <Datetime bind:startDate={prevDayTimestamp} />
                </div>
            </div>
            <div class="flex gap-2 items-center justify-center">
                <span class="text-white">To:</span>
                <div class="bg-white rounded-md">
                    <Datetime bind:startDate={timestamp} />
                </div>
            </div>
        </div>
    </div>
    <!-- <div class="flex-1 flex-shrink-0 flex justify-end items-center">
        <span class="capitalize text-3xl tracking-wide font-impact text-white -translate-x-1/4">view waste audits</span>
    </div> -->
</header>

<div class="w-full">

    <div>
        <Query options={{
            queryKey: ["getEntries", timestamp, prevDayTimestamp,current_page,orgId || profileData?._id],
            queryFn:()=> fetchEntries(current_page),
            keepPreviousData: true,
            refetchOnWindowFocus: false,
            refetchOnMount: false,
            refetchInterval: 5000,
            onSuccess(data) {
                hasMore = data.data.entries.length > 0
                return true
            },
            // enabled: false
        }}>
        <div class="mt-4 px-4" slot="query" let:queryResult>
            {#if queryResult.isSuccess}
                {#if queryResult.data.data.totalDocuments}
                    <Table.Root>
                        <!-- <Table.Caption class="text-[0.7rem]">Entries for {format(timestamp, "yyyy/MM/dd")}</Table.Caption> -->
                        <Table.Header>
                            <Table.Row>
                                <!-- <Table.Head>Org.</Table.Head> -->
                                <Table.Head>Date of Audit</Table.Head>
                                <Table.Head>Area Name</Table.Head>
                                <Table.Head>Classification</Table.Head>
                                <!-- <Table.Head>Waste Type</Table.Head> -->
                                <!-- <Table.Head>Category</Table.Head> -->
                                <Table.Head>Waste Quantity</Table.Head>
                                <!-- <Table.Head>Awareness Session</Table.Head>
                                <Table.Head>Awareness Score</Table.Head> -->
                                <Table.Head>Maturity Score</Table.Head>
                                <!-- <Table.Head>Avg. Student In Class</Table.Head> -->
                                <Table.Head>Waste Champion</Table.Head>
                                <!-- <Table.Head>Created At</Table.Head> -->
                                <Table.Head></Table.Head>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {#each queryResult.data.data.entries as entry (entry._id)}
                                <Table.Row id={entry._id}>
                                    <!-- <Table.Cell class="capitalize">{entry.orgName}</Table.Cell> -->
                                    <Table.Cell class="capitalize">{format(entry.timestamp, "dd/MM/yyyy")}</Table.Cell>
                                    <Table.Cell class="capitalize">{entry.areaName.replace("-", " ")}</Table.Cell>
                                    <Table.Cell class="capitalize">{entry.classification.replaceAll("_"," ")}</Table.Cell>
                                    <Table.Cell class="capitalize">{`${Number.isInteger(entry.weight) ? entry.weight : entry.weight.toFixed(2)} ${entry.unit}`}</Table.Cell>
                                    <!-- <Table.Cell class="capitalize">{format(entry.awareness_session_date, "yyyy/MM/dd")}</Table.Cell>
                                    <Table.Cell class="capitalize">{entry.awareness_score}</Table.Cell> -->
                                    <Table.Cell class="capitalize">{entry.maturity_score}</Table.Cell>
                                    <!-- <Table.Cell class="capitalize">{entry.avgStudentInClass}</Table.Cell> -->
                                    <Table.Cell class="capitalize">{entry.waste_champion ? "Appointed" : "NA"}</Table.Cell>
                                    <!-- <Table.Cell class="capitalize">{format(entry.createdAt, "yyyy/MM/dd p")}</Table.Cell> -->
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
                        </Table.Body>
                    </Table.Root>

                    <Pagination.Root class="mt-4" count={queryResult.data.data.totalDocuments} perPage={perPage} bind:page={current_page} let:pages let:currentPage>
                        <Pagination.Content>
                        <Pagination.Item>
                            <Pagination.PrevButton>
                            <ChevronLeft class="h-4 w-4" />
                            <span class="hidden sm:block">Previous</span>
                            </Pagination.PrevButton>
                        </Pagination.Item>
                        {#each pages as page (page.key)}
                            {#if page.type === "ellipsis"}
                            <Pagination.Item>
                                <Pagination.Ellipsis />
                            </Pagination.Item>
                            {:else}
                            <Pagination.Item>
                                <Pagination.Link {page} isActive={currentPage === page.value}>
                                {page.value}
                                </Pagination.Link>
                            </Pagination.Item>
                            {/if}
                        {/each}
                        <Pagination.Item>
                            <Pagination.NextButton>
                            <span class="hidden sm:block">Next</span>
                            <ChevronRight class="h-4 w-4" />
                            </Pagination.NextButton>
                        </Pagination.Item>
                        </Pagination.Content>
                    </Pagination.Root>    
                {:else}
                    <div class="flex justify-center items-center">
                        <span>No data found</span>
                    </div>
                {/if}
            
            {/if}
        </div>
        
        </Query>
    </div>
    <!-- {/if} -->
</div>

