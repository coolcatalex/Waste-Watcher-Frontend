<script lang="ts">
    import { PUBLIC_API_SERVER } from "$env/static/public";
    import { getCookie } from "$lib/scripts/Cookie.svelte";
    import userStore from "$lib/stores/userStore";
    import axios, { AxiosError } from "axios";
    import { toast } from "svelte-sonner";
    import Label from "$lib/components/ui/label/label.svelte";
    import Input from "$lib/components/ui/input/input.svelte";
    import * as Select from "$lib/components/ui/select";
    import Datetime from "$lib/components/ui/custom/Datetime.svelte";
    import Switch from "$lib/components/ui/switch/switch.svelte";
    import Button from "$lib/components/ui/button/button.svelte";
    import ViewEntriesMinimal from "$lib/components/ui/custom/View_entries _minimal.svelte";
    import selectedOrgStore from "$lib/stores/selectedOrg";
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";

    $: profileData = $selectedOrgStore
    let onboarding = $userStore.onBoarding
    let areaNumbers: string[] = []
    let entryDate = new Date()
    let awarenessDate = new Date()
    let waste_champion = false
    let form_1:HTMLFormElement
    let loading = false
    let classificationName = "sorted"

    function onAreaChange(area?:string) {
        if(area){
            switch (area) {
                case "classroom":
                    areaNumbers = profileData.classrooms
                    break;
                case "office":
                    areaNumbers = [...Array(profileData.offices).keys()].map(i=>`${i+1}`);
                    break;
                case "cafeteria":
                    areaNumbers = [...Array(profileData.cafeterias).keys()].map(i=>`${i+1}`);
                    break;
            
                default:
                    break;
            }
        }
    }
    // function onAreaChange(data:Selected<unknown>|undefined) {
    //     if(data){
    //         switch (data.value) {
    //             case "classroom":
    //                 areaNumbers = profileData.classrooms
    //                 break;
    //             case "office":
    //                 areaNumbers = [...Array(profileData.offices).keys()].map(i=>`${i+1}`);
    //                 break;
    //             case "cafeteria":
    //                 areaNumbers = [...Array(profileData.cafeterias).keys()].map(i=>`${i+1}`);
    //                 break;
            
    //             default:
    //                 break;
    //         }
    //     }
    // }
    
    async function addEntry() {
        if(!form_1.reportValidity()) return
        var formEntries_1 = new FormData(form_1).entries()
        var data_1 = Object.assign({},...Array.from(formEntries_1, ([name, value]) => ({[name]: value == "undefined" ? null : value})));
         
        try {
            loading = true

            Object.values(data_1).map((v)=>{
                if(!v)throw new Error("Empty")
            })
            

            var data = {
                ...data_1,
                "wasteType": {
                    "paper": data_1['waste_paper'],
                    "plastic": data_1['waste_plastic'],
                    "organic": data_1['waste_organic'],
                    "electronic": data_1['waste_electronic'],
                    "others": data_1['waste_others']
                },
                orgId: profileData._id,
                areaName: `${data_1['area']}-${data_1['areaName']}`,
                timestamp: entryDate.valueOf(),
                // awareness_session_date: awarenessDate.valueOf(),
                waste_champion: waste_champion
            }

            try {
                var res = await axios.post(`${PUBLIC_API_SERVER}/auth/entries`,data,{
                    headers:{
                        "Authorization": `bearer ${getCookie("RECYCLE_TOKEN")}`
                    }
                })
                if(res.status == 200){
                    toast("Entry Added")
                }else{
                    toast("Try Again")
                }
            } catch (error) {
                if(error instanceof AxiosError){
                    toast.error(error.response?.data || error.response?.data.message || "Error")
                }else{
                    console.log(error)
                }
            }
        } catch (error) {
            toast.error("Some fields are empty")
        }finally{
            loading = false
        }

    }


    onMount(()=>{
        if($userStore.onBoardingComplete == false){
            toast("First onboard a org")
            goto("/auth/onboarding")
        }
    })

</script>

<style>
    #waste-table .waste-table-row:nth-child(even){
        @apply bg-slate-200
    }
    .waste-table-row:hover{
        @apply bg-slate-100
    }
</style>

<header class="sticky top-0 bg-primary bg-opacity-80 flex h-fit py-[1rem] items-center gap-4 border-b px-4 lg:px-6 backdrop-blur-md">
    <div class="w-full flex-1 flex justify-center items-center">
        <div class="flex-1 flex justify-center items-center">
            <span class="capitalize text-3xl tracking-wide font-impact text-white">add entries</span>
        </div>
    </div>
</header>

<div class="flex justify-center items-center flex-col my-6 px-8">
    <!-- <span class="capitalize font-light font-impact text-3xl my-4 mb-6"></span> -->
    <div class="w-full h-full flex gap-6 justify-center items-center">
        <form bind:this={form_1} class="flex flex-col gap-4">
            <div class="grid w-full max-w-sm items-center gap-1.5 flex-1">
                <Label>Select Organisation</Label>
                <div class="flex justify-center items-center gap-2">
                    <Select.Root onSelectedChange={(d)=>{
                        if(d?.value){
                            // @ts-ignore
                            $selectedOrgStore = onboarding[d.value]
                        }
                    }} selected={{
                        label: profileData?.schoolName,
                        value: profileData?._id
                    }}>
                        <Select.Trigger class="w-full">
                            <Select.Value placeholder="Organisations" />
                        </Select.Trigger>
                        <Select.Content>
                            {#each Object.entries(onboarding) as [key, value]}
                                <Select.Item value={key}>{value.schoolName}</Select.Item>
                            {/each}
                        </Select.Content>
                        <Select.Input name="area" required />
                    </Select.Root>
                    <div class="flex items-center space-x-2">
                        <Switch id="waste_champion" bind:checked={waste_champion} />
                        <Label for="waste_champion">Waste Champion</Label>
                    </div>
                </div>
            </div>
            <div class="grid w-full max-w-sm items-center gap-1.5">
                <Label for="area">Area</Label>
                <div class="flex gap-2">
                    <div class="flex-1">
                        <Select.Root onSelectedChange={(d)=>{
                            if(d?.value){
                                // @ts-ignore
                                onAreaChange(d.value)
                            }
                        }}>
                            <Select.Trigger class="w-full">
                                <Select.Value placeholder="Area" />
                            </Select.Trigger>
                            <Select.Content>
                                {#each ['classroom' , 'office' , 'cafeteria'] as _type}
                                    <Select.Item value={_type} class="capitalize">{_type}</Select.Item>
                                {/each}
                            </Select.Content>
                            <Select.Input name="area" required />
                        </Select.Root>
                    </div>
                    <div class="flex-1">
                        <Select.Root selected={{
                            label: areaNumbers[0],
                            value: areaNumbers[0]
                        }}>
                            <Select.Trigger class="w-full">
                                <Select.Value placeholder="Area Number" />
                            </Select.Trigger>
                            <Select.Content>
                                {#each areaNumbers as num}
                                    <Select.Item value={num} class="capitalize">{num}</Select.Item>
                                {/each}
                            </Select.Content>
                            <Select.Input name="areaName" required />
                        </Select.Root>
                    </div>
                </div>
            </div>
            <div class="grid w-full max-w-sm items-center gap-1.5">
                <Label>Entry Date</Label>
                <Datetime bind:startDate={entryDate} />
            </div>
            <div class="grid w-full max-w-sm items-center gap-1.5">
                <Label for="unit">Waste</Label>
                <div class="flex gap-2">
                    <div class="flex-1">
                        <Select.Root selected={{value:"kg",label:"kg"}}>
                            <Select.Trigger class="w-full">
                                <Select.Value placeholder="Unit" class="capitalize" />
                            </Select.Trigger>
                            <Select.Content>
                                {#each ['KG' , 'litre'] as _type}
                                    <Select.Item value={_type} class="capitalize">{_type}</Select.Item>
                                {/each}
                            </Select.Content>
                            <Select.Input name="unit" required />
                        </Select.Root>
                    </div>
                    <div class="flex-1">
                        <Select.Root onSelectedChange={(evt)=>{classificationName = evt?.label || ""}} selected={{value:classificationName,label:classificationName}}>
                            <Select.Trigger class="w-full">
                                <Select.Value placeholder="Classification" class="capitalize" />
                            </Select.Trigger>
                            <Select.Content>
                                {#each ['sorted' , 'semi_sorted' , 'unsorted'] as _type}
                                    <Select.Item value={_type} class="capitalize">{_type.replaceAll("_"," ")}</Select.Item>
                                {/each}
                            </Select.Content>
                            <Select.Input name="classification" required />
                        </Select.Root>
                    </div>
                    <div>
                        <Input name="weight" type="number" step="0.01" class="w-[10ch]" placeholder="Weight" required />
                    </div>
                    <!-- <div class="flex-1">
                        <Select.Root>
                            <Select.Trigger class="w-full">
                                <Select.Value placeholder="Waste Type" class="capitalize" />
                            </Select.Trigger>
                            <Select.Content>
                                {#each ['paper' , 'plastic' , 'organic' , 'electronic' , 'others'] as _type}
                                    <Select.Item value={_type} class="capitalize">{_type}</Select.Item>
                                {/each}
                            </Select.Content>
                            <Select.Input name="wasteType" />
                        </Select.Root>
                    </div> -->
                </div>
                <div class="w-full basis-full flex gap-2 py-2">
                    <table class="w-full rounded overflow-hidden" id="waste-table">
                        <tr class="bg-primary text-white">
                            <th class="text-left pl-2 py-1 pt-1.5 m-0 text-sm">Type</th>
                            <th class="text-left pl-2 py-1 pt-1.5 m-0 text-sm capitalize">{classificationName} Waste Amount (%)</th>
                        </tr>
                        {#each ['paper' , 'plastic' , 'organic' , 'electronic' , 'others'] as _type}
                            <tr class="waste-table-row">
                                <td class="text-left font-semibold capitalize px-2 py-1">{_type}</td>
                                <td class="px-2 py-1">
                                    <input name={`waste_${_type}`} required type="text" class="bg-transparent border-primary border-b border-dashed w-full px-2 py-0.5" >
                                </td>
                            </tr>
                        {/each}
                    </table>
                </div>
                
            </div>
            <!-- <div class="grid w-full max-w-sm items-center gap-1.5">
                <Label for="awareness">Awareness Program</Label>
                <div class="flex gap-2">
                    <Input name="awareness_score" type="number" class="w-[10ch]" placeholder="Score" value={0} />
                    <div class="flex-1">
                        <Datetime bind:startDate={awarenessDate} />
                    </div>
                </div>
            </div>
            <div class="grid w-full max-w-sm items-center gap-1.5">
                <Label for="avgStudentInClass">Average Student In Class</Label>
                <div class="flex gap-2">
                    <Input name="avgStudentInClass" type="number" class="flex-1" placeholder="Average" value={profileData?.avgStudentInClass} />
                    <div class="flex items-center space-x-2">
                        <Switch id="waste_champion" bind:checked={waste_champion} />
                        <Label for="waste_champion">Waste Champion</Label>
                    </div>
                </div>
            </div> -->
            <div>
                <Button class="w-full" on:click={addEntry}>Add Entry</Button>
            </div>
        </form>
        <div class="flex-1">
            {#if profileData._id}
                <ViewEntriesMinimal orgId={profileData._id}/>
            {/if}
        </div>
    </div>
</div>