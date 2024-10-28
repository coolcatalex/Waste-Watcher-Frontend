<script lang="ts">
    import { page } from "$app/stores";
    import { PUBLIC_API_SERVER } from "$env/static/public";
    import { getCookie } from "$lib/scripts/Cookie.svelte";
    import axios from "axios";
    import { onMount } from "svelte";
    import type { ONBOARDING_DEATILS, QUESTIONS_TYPE } from "../../../../types";
    import Label from "$lib/components/ui/label/label.svelte";
    import Input from "$lib/components/ui/input/input.svelte";
    import * as Select from "$lib/components/ui/select";
    import Checkbox from "$lib/components/ui/checkbox/checkbox.svelte";
    import Button from "$lib/components/ui/button/button.svelte";
    import type { userStoreType } from "$lib/stores/userStore";
    import userStore from "$lib/stores/userStore";
    import { toast } from "svelte-sonner";
    const slug = $page.data.slug
    var questions: QUESTIONS_TYPE = null
    

    let formEle_1: HTMLFormElement
    var questions: QUESTIONS_TYPE = null
    let loading = false
    let onboardData: ONBOARDING_DEATILS

    let schoolName = ""
    let schoolAddress = ""
    let schoolAdminContact = 0

    async function update_onboard(){
        var formEntries_1 = new FormData(formEle_1).entries()   
        var _data_1 = Array.from(formEntries_1, ([name, value]) => ({qId:name,aId: value == "undefined" ? null : value}))

        // check if data is null
        try {
            loading = true
            
            Object.values(_data_1).map((v)=>{
                if(!v)throw new Error("Empty")
            })

            var data = {
                orgId: slug,
                schoolName: schoolName,
                schoolAddress: schoolAddress,
                schoolAdminContact: schoolAdminContact,
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
                    toast("Organization updated")
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
        var res_onboard = await axios.get<ONBOARDING_DEATILS>(`${PUBLIC_API_SERVER}/auth/onboarding/org`,{
            params:{
                orgId: slug
            },
            headers:{
                "Authorization": `bearer ${getCookie("RECYCLE_TOKEN")}`
            }
        })
        var res_ques = await axios.get<QUESTIONS_TYPE>(`${PUBLIC_API_SERVER}/auth/questions`,{
            headers:{
                "Authorization": `bearer ${getCookie("RECYCLE_TOKEN")}`
            }
        })
        questions = res_ques.data
        onboardData = res_onboard.data
        schoolName = onboardData.schoolName
        schoolAddress = onboardData.schoolAddress
        schoolAdminContact = onboardData.schoolAdminContact

    })

</script>



<div class="w-full flex justify-center items-center pt-4 flex-col gap-6">
    <h1 class="text-2xl font-semibold">Onboarding</h1>
    <div>
        {#if questions}
            <div class="flex flex-col gap-4 w-fit pb-4">
                <form class="flex flex-col gap-4">
                    <div class="grid w-full max-w-sm items-center gap-1.5">
                        <Label for="schoolName">School Name</Label>
                        <Input required type="text" name="schoolName" bind:value={schoolName} placeholder="School Name" />
                        <!-- <p class="text-muted-foreground text-sm">Enter your email address.</p> -->
                    </div>
                    <div class="grid w-full max-w-sm items-center gap-1.5">
                        <Label for="schoolAddress">School Address</Label>
                        <Input required type="text" bind:value={schoolAddress} name="schoolAddress" placeholder="Address" />
                        <!-- <p class="text-muted-foreground text-sm">Enter your email address.</p> -->
                    </div>
                    <div class="grid w-full max-w-sm items-center gap-1.5">
                        <Label for="schoolAdminContact">School Administrator Contact</Label>
                        <Input required type="number" bind:value={schoolAdminContact} name="schoolAdminContact" placeholder="Contact Number" />
                        <!-- <p class="text-muted-foreground text-sm">Enter your email address.</p> -->
                    </div>
                    <div class="grid w-full max-w-sm items-center gap-1.5">
                        <Label for="offices" class="capitalize">Total Number of offices</Label>
                        <Input required type="number" name="offices" value={onboardData.offices} placeholder="Offices" disabled />
                        <!-- <p class="text-muted-foreground text-sm">Enter your email address.</p> -->
                    </div>
                    <div class="grid w-full max-w-sm items-center gap-1.5">
                        <Label for="cafeterias" class="capitalize">Total Number of cafeterias</Label>
                        <Input required type="number" name="cafeterias" value={onboardData.cafeterias} placeholder="Cafeterias" disabled />
                        <!-- <p class="text-muted-foreground text-sm">Enter your email address.</p> -->
                    </div>
                    <div class="grid w-full max-w-sm items-center gap-1.5">
                        <Label>Your classrooms</Label>
                        <div class="flex flex-wrap justify-center items-center gap-x-4 gap-y-3 mt-2 mb-2">
                            {#each onboardData.classrooms as _class}
                                <div class="flex justify-center items-center w-fit gap-2">
                                    <Checkbox checked={true} disabled />
                                    <Label>{_class}</Label>
                                </div>
                            {/each}
                        </div>
                        <!-- <Input type="text" name="classrooms" placeholder="School Name" /> -->
                        <!-- <p class="text-muted-foreground text-sm">Enter your email address.</p> -->
                    </div>
                    <div class="grid w-full max-w-sm items-center gap-1.5">
                        <Label for="avgStudentInClass">Average Student In Class</Label>
                        <Input required type="number" value={onboardData.avgStudentInClass} disabled name="avgStudentInClass" placeholder="Average Students" />
                        <!-- <p class="text-muted-foreground text-sm">Enter your email address.</p> -->
                    </div>
                </form>
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
