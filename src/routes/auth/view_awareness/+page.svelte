<script lang="ts">
    import * as Table from "$lib/components/ui/table/index.js";
    import Label from "$lib/components/ui/label/label.svelte";
    import * as Select from "$lib/components/ui/select";
    import { useQuery, Query} from '@sveltestack/svelte-query'
    import { endOfDay, format } from 'date-fns';
    import axios, { AxiosError } from "axios";
    import { PUBLIC_API_SERVER } from "$env/static/public";
    import { getCookie } from "$lib/scripts/Cookie.svelte";
    import { toast } from "svelte-sonner";
    import * as Pagination from "$lib/components/ui/pagination";
    import { ChevronLeft, ChevronRight } from "lucide-svelte";
    import type { AWARENESS_SESSION_TYPES } from "../../../types";
    import userStore from "$lib/stores/userStore";
    import selectedOrgStore from "$lib/stores/selectedOrg";
    import Line from "$lib/components/ui/custom/charts/line.svelte";
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
    // import { onMount } from "svelte";

    let loadingMoreItems = false
    const perPage = 50
    let current_page = 1
    let hasMore = false
    let onboarding = $userStore.onBoarding
    $: profileData = $selectedOrgStore
    let orgId = profileData?._id ;

    type AWARENESS_STATS = {
        wasteEntry:{date:string,weight:number}[],
        awarenessEntry: {awareness_session_date:number}[]
    }

    const fetchEntries = async (page:number) => {
        loadingMoreItems = true
        var res = await axios.get<AWARENESS_SESSION_TYPES>(`${PUBLIC_API_SERVER}/auth/awareness/search`, {
            params: {
                orgId: orgId || profileData?._id,
                page: page,
                count: perPage
            },
            headers: {
                "Authorization": `bearer ${getCookie("RECYCLE_TOKEN")}`
            }
        });
        loadingMoreItems = false
        return res
    };

    async function deleteAwareness(ele: EventTarget & HTMLButtonElement, awarenessId: string) {
        try {
            ele.disabled = true;
            const res = await axios.delete(`${PUBLIC_API_SERVER}/auth/awareness/`, {
                params:{
                    awarenessId,
                    orgId: orgId || profileData?._id
                },
                headers: {
                    "Authorization": `bearer ${getCookie("RECYCLE_TOKEN")}`
                }
            });
            if (res.status === 200) {
                toast("Entry deleted");
                document.getElementById(awarenessId)?.remove();
                $awarenessStats.refetch()
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

    const awarenessStats = useQuery(["awarenessStats",orgId || profileData?._id],()=>axios.get<AWARENESS_STATS>(`${PUBLIC_API_SERVER}/auth/awareness/stats`, {
        params:{
            orgId: orgId || profileData?._id
        },
        headers: {
            "Authorization": `bearer ${getCookie("RECYCLE_TOKEN")}`
        }
    }))
    onMount(()=>{
        if($userStore.onBoardingComplete == false){
            toast("First onboard a org")
            goto("/auth/onboarding")
        }
    })
</script>



<header class="sticky top-0 bg-primary bg-opacity-80 flex h-fit py-[1rem] items-center gap-4 border-b px-4 lg:px-6 backdrop-blur-md">
    <div class="w-full flex-1 flex justify-center items-center">
        <div>
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
        </div>
        <div class="flex-1 flex-shrink-0 flex justify-center items-center">
            <span class="capitalize text-3xl tracking-wide font-impact text-white -translate-x-3.5">View Waste Management Training History</span>
        </div>
    </div>
</header>

<div class="w-full py-4 px-6">
    {#if $awarenessStats.isSuccess}
        <Line heading="Waste Quantity" awareness={$awarenessStats.data.data.awarenessEntry.map(_a=>_a.awareness_session_date)} data={$awarenessStats.data.data.wasteEntry.map(_d=>({x: _d.date, y: _d.weight}))} />
    {/if}
    <div>
        <Query options={{
            queryKey: ["getAwareness",orgId],
            queryFn:()=> fetchEntries(current_page),
            keepPreviousData: true,
            refetchOnWindowFocus: false,
            refetchOnMount: true,
            refetchInterval: false,
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
                        <Table.Header>
                            <Table.Row>
                                <Table.Head class="capitalize">instructor</Table.Head>
                                <Table.Head class="capitalize">Area Name</Table.Head>
                                <Table.Head class="capitalize">Training session duration</Table.Head>
                                <Table.Head class="capitalize">Training score</Table.Head>
                                <Table.Head class="capitalize">Training session time</Table.Head>
                                <Table.Head></Table.Head>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {#each queryResult.data.data.entries as entry (entry._id)}
                                <Table.Row id={entry._id}>
                                    <Table.Cell class="capitalize">{entry.instructor}</Table.Cell>
                                    <Table.Cell class="capitalize">{entry.areaName.replace("-", " ")}</Table.Cell>
                                    <Table.Cell class="capitalize">{entry.awareness_min} <span class="lowercase">min</span></Table.Cell>
                                    <Table.Cell class="capitalize">{entry.awareness_score}</Table.Cell>
                                    <Table.Cell class="capitalize">{format(entry.awareness_session_date, "yyyy/MM/dd")}</Table.Cell>
                                    <Table.Cell class="capitalize">
                                        <button on:click={(evt) => deleteAwareness(evt.currentTarget, entry._id)} class="disabled:opacity-30 disabled:pointer-events-none">
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

