<script lang="ts">
    import { page } from "$app/stores";
    import { PUBLIC_API_SERVER } from "$env/static/public";
    import { getCookie } from "$lib/scripts/Cookie.svelte";
    import axios from "axios";
    import { onMount } from "svelte";
    import type { ONBOARDING_DEATILS, QUESTIONS_TYPE } from "../../../types";
    import Label from "$lib/components/ui/label/label.svelte";
    import Input from "$lib/components/ui/input/input.svelte";
    import * as Select from "$lib/components/ui/select";
    import Checkbox from "$lib/components/ui/checkbox/checkbox.svelte";
    import Button from "$lib/components/ui/button/button.svelte";
    import type { userStoreType } from "$lib/stores/userStore";
    import userStore from "$lib/stores/userStore";
    import { toast } from "svelte-sonner";
    const slug = "66b77d758d6a5d4736f0f0b1"
    import selectedOrgStore from "$lib/stores/selectedOrg";
    import { goto } from "$app/navigation";
    import { Info } from "lucide-svelte";

    var questions: QUESTIONS_TYPE = null
    

    let formEle_1: HTMLFormElement
    var questions: QUESTIONS_TYPE = null
    let loading = false

    let onboardOrgs = $userStore.onBoarding;

    
    async function update_onboard(){
        var formEntries_1 = new FormData(formEle_1).entries()   
        var _data_1 = Array.from(formEntries_1, ([name, value]) => ({qId:name,aId: value == "undefined" ? null : value}))

        // check if data is null
        try {
            loading = true
            
            Object.values(_data_1).map((v)=>{
                if(!v.aId)throw new Error("Empty")
            })

            var data = {
                orgId: $selectedOrgStore._id,
                query: _data_1
            }

            try {
                var res = await axios.put(`${PUBLIC_API_SERVER}/auth/onboarding`,data,{
                    headers:{
                        "Authorization": `bearer ${getCookie("RECYCLE_TOKEN")}`
                    }
                })
                if(res.status == 200){
                    var profile = await axios.get<userStoreType>(`${PUBLIC_API_SERVER}/auth/user`,{
                        headers:{
                            "Authorization": `bearer ${getCookie("RECYCLE_TOKEN")}`
                        }
                    })
                    userStore.set(profile.data)
                    toast(`${$selectedOrgStore.schoolName} waste maturity score updated`)
                }else{
                    toast("Try Again")
                }
            } catch (error) {}
        } catch (error) {
            toast.error("Some fields are empty")
        }finally{
            loading = false
        }
        
        
    }

    onMount(async ()=>{
        if($userStore.onBoardingComplete == false){
            toast("First onboard a org")
            goto("/auth/onboarding")
        }else{
            var res_ques = await axios.get<QUESTIONS_TYPE>(`${PUBLIC_API_SERVER}/auth/questions`,{
                headers:{
                    "Authorization": `bearer ${getCookie("RECYCLE_TOKEN")}`
                }
            })
            questions = res_ques.data
        }
    })

</script>





<header class="sticky top-0 bg-primary bg-opacity-80 flex h-fit py-[1rem] items-center gap-4 border-b px-4 lg:px-6 backdrop-blur-md">
    <div class="w-full flex-1 flex justify-center items-center">
        <Select.Root onSelectedChange={(d) => {
            if(d?.value){
                // @ts-ignore
                if(d.value) selectedOrgStore.set(onboardOrgs[d.value])
                // $stats.refetch()
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
            <span class="capitalize text-3xl tracking-wide font-impact text-white -translate-x-1/4">Update Waste Maturity Score</span>
        </div>
    </div>

</header>
<div class="w-full flex justify-center items-center pt-4 flex-col gap-6">
    <div class="w-full flex flex-col justify-center items-center gap-8">
        {#if questions}
            <div class="min-w-[320px] w-9/12 text-[0.7rem] text-black text-opacity-50">
                <span>The Waste Management Maturity Score evaluates the effectiveness of a school's waste management system by assessing key domains like policy, training, infrastructure, administration, and monitoring, with each domain weighted and scored to produce an overall maturity rating.</span>
            </div>
            <div class="flex flex-col gap-4 w-fit pb-4">
                <form bind:this={formEle_1} class="flex flex-col gap-4">
                    {#each questions.query as query}
                        <div class="grid w-full max-w-sm items-center gap-1.5">
                            <Label for={query._id}>{query.question}</Label>
                            <Select.Root>
                                <Select.Trigger class="w-full">
                                  <Select.Value placeholder="Select" />
                                </Select.Trigger>
                                <Select.Content>
                                    {#each query.options as option}
                                        <Select.Item value={option._id}>{option.option}</Select.Item>
                                    {/each}
                                </Select.Content>
                                <Select.Input required name={query._id} />
                            </Select.Root>
                        </div>
                    {/each}
                </form>
                <div class="flex justify-center items-center">
                    <Button disabled={loading} type="button" on:click={update_onboard}>Update Deatils</Button>
                </div>
            </div>
        {/if}
    </div>
</div>
