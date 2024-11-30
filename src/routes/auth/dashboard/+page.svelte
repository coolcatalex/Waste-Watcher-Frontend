<script lang="ts">
    import userStore from "$lib/stores/userStore";
    import HalfDougnt from "$lib/components/ui/custom/charts/Half_dougnt.svelte";
    import * as Select from "$lib/components/ui/select";
    import selectedOrgStore from "$lib/stores/selectedOrg";
    import { useQuery } from "@sveltestack/svelte-query";
    import {ChartNoAxesColumn} from 'lucide-svelte/icons'
    import axios from "axios";
    import { PUBLIC_API_SERVER } from "$env/static/public";
    import { getCookie } from "$lib/scripts/Cookie.svelte";
    import Label from "$lib/components/ui/label/label.svelte";
    import Radar from "$lib/components/ui/custom/charts/radar.svelte";
    import type { ENTRIES_TYPES } from "../../../types";
    import DashboardLine from "$lib/components/ui/custom/charts/dashboard_line.svelte";
    import DashboardPie from "$lib/components/ui/custom/charts/dashboard_pie.svelte";

    let onboardOrgs = $userStore.onBoarding;
    $: selectedOrg = $selectedOrgStore
    $: console.log(selectedOrg)
    $: areas = [
        ...selectedOrg.classrooms.map(num=>`classroom-${num}`),
        ...[...Array(selectedOrg.offices).keys()].map(num=>`office-${num+1}`),
        ...[...Array(selectedOrg.cafeterias).keys()].map(num=>`cafeteria-${num+1}`)
    ] 
    $: areaname = areas[0]
    // $: areaname = "classroom-8"

    const stats = useQuery(["stats",selectedOrg?._id],()=>{
        return axios.get<{
            wasteClassPerDay: string
            wasteStudentDay: string
            wasteStudentMonth: string
            wasteStudentYear: string
            totalWasteBySchoolYear: string
            radarData: {
                Policy: number
                Training: number
                Infrastructure: number
                Administration: number
                Monitoring: number
            }
            weightedScorePercentage: number
        }>(`${PUBLIC_API_SERVER}/auth/stats`, {
            params:{
                orgId: selectedOrg?._id 
            },
            headers: {
                "Authorization": `bearer ${getCookie("RECYCLE_TOKEN")}`
            }
        });
    },{
        refetchInterval: false
    })
    
    const entries = useQuery(["dashboard_entries",selectedOrg?._id],()=>axios.post<ENTRIES_TYPES>(`${PUBLIC_API_SERVER}/auth/entries/search`,{
            page: 1,
            count: 5000,
            orgId: selectedOrg?._id,
            // fromLastAwareness: true,
            areaname: [areaname]
        }, {
        headers: {
            "Authorization": `bearer ${getCookie("RECYCLE_TOKEN")}`
        }
    }))

</script>


<header class="sticky top-0 bg-primary bg-opacity-80 flex h-fit py-[1rem] items-center gap-4 border-b px-4 lg:px-6 backdrop-blur-md">
    <div class="w-full flex-1 flex justify-center items-center">
        {#if selectedOrg}
            <Select.Root onSelectedChange={(d) => {
                if(d?.value){
                    // @ts-ignore
                    if(d.value) selectedOrgStore.set(onboardOrgs[d.value])
                    $stats.refetch()
                    setTimeout(()=>$entries.refetch(),1000)
                    
                }
            }} selected={{
                label: $selectedOrgStore?.schoolName,
                value: $selectedOrgStore?._id
            }}>
                <Select.Trigger class="w-[180px] bg-white">
                    <Select.Value placeholder="Select Your Organization" />
                </Select.Trigger>
                <Select.Content>
                    {#each Object.entries(onboardOrgs) as [key, value]}
                        <Select.Item value={key}>{value.schoolName}</Select.Item>
                    {/each}
                </Select.Content>
            </Select.Root>
            <div class="flex-1 flex justify-center items-center">
                <span class="capitalize text-3xl tracking-wide font-impact text-white -translate-x-1/2">dashboard</span>
            </div>
        {/if}
    </div>

</header>

<div class="flex justify-center items-center flex-col py-6 gap-6">
    {#if !!selectedOrg?._id}
        {#if $stats.isSuccess}
            <div class="flex justify-center items-center gap-4 flex-wrap">
                <div class="px-4 py-3 shadow rounded flex justify-center items-center gap-4">
                    <div>
                        <ChartNoAxesColumn class="h-6 w-auto text-primary" />
                    </div>
                    <div class="flex justify-center items-start flex-col gap-1">
                        <Label class="text-lg font-semibold">Waste Per School/Year</Label>
                        <Label class="text-[1.01rem]">{$stats.data.data.totalWasteBySchoolYear} Kg</Label>
                    </div>
                </div>
                <div class="px-4 py-3 shadow rounded flex justify-center items-center gap-4">
                    <div>
                        <ChartNoAxesColumn class="h-6 w-auto text-primary" />
                    </div>
                    <div class="flex justify-center items-start flex-col gap-1">
                        <Label class="text-lg font-semibold">Waste Per Student/Year</Label>
                        <Label class="text-[1.01rem]">{$stats.data.data.wasteStudentYear} Kg</Label>
                    </div>
                </div>
                <!-- <div class="px-4 py-3 shadow rounded flex justify-center items-center gap-4">
                    <div>
                        <ChartNoAxesColumn class="h-6 w-auto text-primary" />
                    </div>
                    <div class="flex justify-center items-start flex-col gap-1">
                        <Label class="text-lg font-semibold">Waste Per Student/Month</Label>
                        <Label class="text-[1.01rem]">{$stats.data.data.wasteStudentMonth} Kg</Label>
                    </div>
                </div> -->
                <div class="px-4 py-3 shadow rounded flex justify-center items-center gap-4">
                    <div>
                        <ChartNoAxesColumn class="h-6 w-auto text-primary" />
                    </div>
                    <div class="flex justify-center items-start flex-col gap-1">
                        <Label class="text-lg font-semibold">Waste Per Classroom/Day</Label>
                        <Label class="text-[1.01rem]">{$stats.data.data.wasteClassPerDay} Kg</Label>
                    </div>
                </div>
                <div class="px-4 py-3 shadow rounded flex justify-center items-center gap-4">
                    <div>
                        <ChartNoAxesColumn class="h-6 w-auto text-primary" />
                    </div>
                    <div class="flex justify-center items-start flex-col gap-1">
                        <Label class="text-lg font-semibold">Waste Per Student/Day</Label>
                        <Label class="text-[1.01rem]">{$stats.data.data.wasteStudentDay} Kg</Label>
                    </div>
                </div>
            </div>
            <hr class="w-11/12 border border-dashed mx-auto mb-2"/>
            <div class="flex justify-center items-center gap-4 w-full">
                <div class="w-1/2 flex justify-center items-center">
                    <HalfDougnt labels={["", ""]} data={[
                            $stats.data.data.weightedScorePercentage, 
                            100 - $stats.data.data.weightedScorePercentage
                        ]} heading={"Waste Management Maturity Score"}
                        subText={[
                            "The Waste Management Maturity Score evaluates the",
                            "effectiveness of a school's waste management system by",
                            "assessing key domains like policy, training, infrastructure,",
                            "administration, and monitoring, with each domain weighted and",
                            "scored to produce an overall maturity rating."
                        ]} 
                    />
                </div>
                <div class="w-1/2 flex justify-center items-center">
                    <Radar labels={Object.keys($stats.data.data.radarData)} data={Object.values($stats.data.data.radarData)} heading="Waste Distribution" />
                </div>
            </div>
        {/if}

        <div class="w-full px-4 mt-6">
            <Select.Root onSelectedChange={(d) => {
                if(d?.value){
                   areaname = d.value
                   $entries.refetch()
                }
            }} selected={{
                label: areas[0].replace("-"," "),
                value: areas[0]
            }}>
                <Select.Trigger class="w-[180px] bg-white">
                    <Select.Value class="capitalize" placeholder="Select Your Organization" />
                </Select.Trigger>
                <Select.Content>
                    {#each areas as area}
                        <Select.Item class="capitalize" value={area}>{area.replace("-"," ")}</Select.Item>
                    {/each}
                </Select.Content>
            </Select.Root>
            <div class="flex justify-center items-center gap-6">
               {#if $entries.isSuccess}

                {#if $entries.data.data.entries.length > 0}
                    {@const pieData = $entries.data.data.entries.reduce((acc,cur)=>{
                            acc['Paper'] += cur.wasteType.paper
                            acc['Plastic'] += cur.wasteType.plastic
                            acc['Organic'] += cur.wasteType.organic
                            acc['Electronic'] += cur.wasteType.electronic
                            acc['Others'] += cur.wasteType.others
                            return acc
                        },{
                            Paper: 0,
                            Plastic: 0,
                            Organic: 0,
                            Electronic: 0,
                            Others: 0,
                    })}
                        <div class="w-2/3">
                            <DashboardLine heading="Waste Quantity" data={$entries.data.data.entries.map(e=>({x:e.timestamp,y:e.weight}))} />
                        </div>
                        <div class="w-1/3">
                            <DashboardPie heading="" data={Object.values(pieData)} labels={Object.keys(pieData)}  />
                        </div>
                {:else}
                    <div>
                        <span>No Data Found</span>
                    </div>
                {/if}
            {/if} 

            </div>
        </div>
        
    {/if}

</div>
