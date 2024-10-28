<script lang="ts">
    import { goto } from "$app/navigation";
    import ViewEntries from "$lib/components/ui/custom/View_entries .svelte";
    import userStore from "$lib/stores/userStore";
    import { onMount } from "svelte";
    import { toast } from "svelte-sonner";
    
    onMount(()=>{
        if($userStore.onBoardingComplete == false){
            toast("First onboard a org")
            goto("/auth/onboarding")
        }
    })
</script>




<div class="flex justify-center items-center flex-col">
    <ViewEntries />
</div>