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
    // let entryDate = new Date()
    let awarenessDate = new Date()
    // let waste_champion = false
    let form_1:HTMLFormElement
    let loading = false
    // let classificationName = "sorted"

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
                orgId: profileData._id,
                areaName: `${data_1['area']}-${data_1['areaName']}`,
                awareness_session_date: awarenessDate.valueOf(),
            }

            try {
                var res = await axios.post(`${PUBLIC_API_SERVER}/auth/awareness`,data,{
                    headers:{
                        "Authorization": `bearer ${getCookie("RECYCLE_TOKEN")}`
                    }
                })
                if(res.status == 200){
                    toast("Session Added")
                }else{
                    toast("Try Again")
                }
            } catch (error) {
                if(error instanceof AxiosError){
                    if(typeof(error.response?.data) == "string"){
                        toast.error(error.response?.data)
                    }else{
                        toast.error(error.response?.data.message.replace("body/","").replaceAll("_"," ") || "Error")
                    }
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
            <span class="capitalize text-3xl tracking-wide font-impact text-white">Add Waste Management Training Details</span>
        </div>
    </div>
</header>

<div class="flex justify-center items-center flex-col pb-4 px-8 h-full">
    <!-- <span class="capitalize font-semibold mb-8 text-2xl"></span> -->
    <div class="w-full flex gap-6 justify-center items-center">
        <form bind:this={form_1} class="flex flex-col gap-4 shadow px-6 py-5 rounded">
            <span class="text-black text-opacity-60 text-[0.7rem] mb-2">This section captures the details of waste awareness sessions conducted.</span>
            <div class="grid w-full max-w-sm items-center gap-1.5">
                <Label>Select Organisation</Label>
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
            </div>
            <div class="grid w-full max-w-sm items-center gap-1.5">
                <Label>Instructor</Label>
                <Input required name="instructor" placeholder="Instructor name" value={$userStore.username} />
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
                <Label for="awareness">Training Date</Label>
                <Datetime bind:startDate={awarenessDate} />
            </div>
            <div class="grid w-full max-w-sm items-center gap-1.5">
                <Label for="awareness">Duration of Training</Label>
                <Input name="awareness_min" required type="number" class="" placeholder="Minutes" />
            </div>
            <div class="grid w-full max-w-sm items-center gap-1.5">
                <Label for="awareness">Waste Management Awareness Score</Label>
                <Input name="awareness_score" required type="number" class="" step="0.01" placeholder="1 - 5" />
            </div>
            <!-- <div class="flex gap-2">
                <div class="flex-1">
                </div>
            </div> -->
            
            <div>
                <Button class="w-full" on:click={addEntry}>Add Training</Button>
            </div>
        </form>
    </div>
</div>