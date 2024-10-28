<script lang="ts">
    import { goto } from "$app/navigation";
    import { PUBLIC_API_SERVER } from "$env/static/public";
    import { getCookie } from "$lib/scripts/Cookie.svelte";
    import userStore, { type userStoreType } from "$lib/stores/userStore";
    import axios from "axios";
    import { onMount } from "svelte";
    import { toast } from "svelte-sonner";
    import { Input } from "$lib/components/ui/input/index.js";
    import { Label } from "$lib/components/ui/label/index.js";
    import * as Select from "$lib/components/ui/select";
    import Button from "$lib/components/ui/button/button.svelte";
    import Checkbox from "$lib/components/ui/checkbox/checkbox.svelte";
    import type { QUESTIONS_TYPE } from "../../../types";

    

    
    // const classTypeDict = {
    //     "kg": "primary",
    //     "1": "primary",
    //     "2": "primary",
    //     "3": "primary",
    //     "4": "primary",
    //     "5": "primary",
    //     "6": "secondary",
    //     "7": "secondary",
    //     "8": "secondary",
    //     "9": "highschool",
    //     "10": "highschool",
    //     "11": "highschool",
    //     "12": "highschool"
    // }

    const classTypeList = ["KG","1","2","3","4","5","6","7","8","9","10","11","12"]
    

    let formEle_1: HTMLFormElement
    let formEle_2: HTMLFormElement
    var questions: QUESTIONS_TYPE = null
    let loading = false
    let classrooms = new Set()
    let classroomCheckAll:boolean | "indeterminate" = false

    onMount(async ()=>{
        var res = await axios.get<QUESTIONS_TYPE>(`${PUBLIC_API_SERVER}/auth/questions`,{
            headers:{
                "Authorization": `bearer ${getCookie("RECYCLE_TOKEN")}`
            }
        })
        questions = res.data
    })


    function toggleClassroom(checked:boolean | "indeterminate",value:string){
        if(checked){
            classrooms.add(value)
        }else{
            classrooms.delete(value)
        }
    }


    async function onboard() {
        if(!formEle_1.reportValidity()) return
        if(!formEle_2.reportValidity()) return

        var formEntries_1 = new FormData(formEle_1).entries()
        var _data_1 = Object.assign({},...Array.from(formEntries_1, ([name, value]) => ({[name]: value == "undefined" ? null : value})));
        
        var formEntries_2 = new FormData(formEle_2).entries()   
        var _data_2 = Array.from(formEntries_2, ([name, value]) => ({qId:name,aId: value == "undefined" ? null : value}))
        
        // check if data is null
        try {
            loading = true
            if(classrooms.size <= 0){
                throw new Error("Empty")
            }

            Object.values(_data_1).map((v)=>{
                if(!v)throw new Error("Empty")
            })

            Object.values(_data_2).map((v)=>{
                if(!v)throw new Error("Empty")
            })

            var data = {
                ..._data_1,
                classrooms: Array.from(classrooms),
                query: _data_2
            }

            try {
                var res = await axios.post(`${PUBLIC_API_SERVER}/auth/onboarding`,data,{
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
                    toast("Organization onboarded")
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

</script>


<div class="w-full flex justify-center items-center pt-4 flex-col gap-6">
    <h1 class="text-2xl font-semibold">Onboarding</h1>
    <div>
        {#if questions}
            <div class="flex flex-col gap-4 w-fit pb-4">
                <form bind:this={formEle_1} class="flex flex-col gap-4">
                    <div class="grid w-full max-w-sm items-center gap-1.5">
                        <Label for="schoolName">School Name</Label>
                        <Input required type="text" name="schoolName" placeholder="School Name" />
                        <!-- <p class="text-muted-foreground text-sm">Enter your email address.</p> -->
                    </div>
                    <div class="grid w-full max-w-sm items-center gap-1.5">
                        <Label for="schoolAddress">School Address</Label>
                        <Input required type="text" name="schoolAddress" placeholder="Address" />
                        <!-- <p class="text-muted-foreground text-sm">Enter your email address.</p> -->
                    </div>
                    <div class="grid w-full max-w-sm items-center gap-1.5">
                        <Label for="schoolAdminContact">School Administrator Contact</Label>
                        <Input required type="number" name="schoolAdminContact" placeholder="Contact Number" />
                        <!-- <p class="text-muted-foreground text-sm">Enter your email address.</p> -->
                    </div>
                    <div class="grid w-full max-w-sm items-center gap-1.5">
                        <Label for="offices" class="capitalize">Total Number of offices</Label>
                        <Input required type="number" name="offices" placeholder="Offices" />
                        <!-- <p class="text-muted-foreground text-sm">Enter your email address.</p> -->
                    </div>
                    <div class="grid w-full max-w-sm items-center gap-1.5">
                        <Label for="cafeterias" class="capitalize">Total Number of cafeterias</Label>
                        <Input required type="number" name="cafeterias" placeholder="Cafeterias" />
                        <!-- <p class="text-muted-foreground text-sm">Enter your email address.</p> -->
                    </div>
                    <div class="grid w-full max-w-sm items-center gap-1.5">
                        <div class="flex justify-start items-center gap-3">
                            <Label>Select your classrooms</Label>
                            <div class="flex justify-center items-center w-fit gap-2">
                                <Checkbox onCheckedChange={(v)=>{
                                    if(v){
                                        classTypeList.forEach(k=>classrooms.add(k))
                                        classroomCheckAll = v
                                    }else{
                                        classTypeList.forEach(k=>classrooms.delete(k))
                                        classroomCheckAll = v
                                    }
                                }} />
                                <Label>All</Label>
                            </div>
                        </div>
                        <div class="flex flex-wrap justify-center items-center gap-x-4 gap-y-3 mt-2 mb-2">
                            {#each classTypeList as _class}
                                <div class="flex justify-center items-center w-fit gap-2">
                                    <Checkbox checked={classroomCheckAll} onCheckedChange={(v)=>toggleClassroom(v,_class)} />
                                    <Label>{_class}</Label>
                                </div>
                            {/each}
                        </div>
                        <!-- <Input type="text" name="classrooms" placeholder="School Name" /> -->
                        <!-- <p class="text-muted-foreground text-sm">Enter your email address.</p> -->
                    </div>
                    <div class="grid w-full max-w-sm items-center gap-1.5">
                        <Label for="avgStudentInClass">Average Student In Class</Label>
                        <Input required type="number" name="avgStudentInClass" placeholder="Average Students" />
                        <!-- <p class="text-muted-foreground text-sm">Enter your email address.</p> -->
                    </div>
                    <!-- <div class="grid w-full max-w-sm items-center gap-1.5">
                        <Label for="unitOfMeasure">Unit for measuring waste</Label>
                        <Select.Root>
                            <Select.Trigger class="w-full">
                              <Select.Value placeholder="Unit" />
                            </Select.Trigger>
                            <Select.Content>
                              <Select.Item value="kg">Kg</Select.Item>
                              <Select.Item value="litre">Litre</Select.Item>
                            </Select.Content>
                            <Select.Input name="unitOfMeasure" />
                        </Select.Root>
                    </div> -->
                </form>
                <form bind:this={formEle_2} class="flex flex-col gap-4">
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
                                  <!-- <Select.Item value="kg">Kg</Select.Item>
                                  <Select.Item value="litre">Litre</Select.Item> -->
                                </Select.Content>
                                <Select.Input required name={query._id} />
                            </Select.Root>
                            <!-- <p class="text-muted-foreground text-sm">Enter your email address.</p> -->
                        </div>
                        <!-- <span>{query.question}</span> -->
                    {/each}
                </form>
                <div class="flex justify-center items-center">
                    <Button disabled={loading} type="button" on:click={onboard}>Complete Onboarding</Button>
                </div>
            </div>
        {/if}
    </div>
</div>