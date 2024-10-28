<script lang="ts">
    import Button from "$lib/components/ui/button/button.svelte";
    import userStore from "$lib/stores/userStore";
    import { Plus,Pen } from "lucide-svelte/icons";

</script>





<div class="flex justify-center items-center flex-col">
    <!-- <span class="capitalize font-semibold">settings</span> -->
    <div class="w-full px-4 py-4">
        <div class="flex flex-col gap-4">
            <a href="/auth/onboarding">
                <Button class="w-fit p-2">
                    <Plus/> 
                    <span>Add School/Organisation</span>
                </Button>
            </a>
            <div class="flex justify-start items-center gap-2">
                {#each Object.values($userStore.onBoarding) as onboard}
                    <div class="flex flex-col px-3 py-1.5 shadow rounded w-fit min-w-[200px] gap-1">
                        <div class="flex justify-between items-center">
                            <h1 class="font-bold text-xl">{onboard.schoolName}</h1>
                            <a href={`/auth/onboarding/${onboard._id}`}>
                                <Pen class="h-4 w-auto opacity-70 transition-opacity hover:opacity-100" />
                            </a>
                        </div>
                        <div>
                            <div class="text-[0.8rem] text-gray-500">
                                <span>Maturity Score: </span>
                                <span>{Number(onboard.weightedScorePercentage)/10}</span>
                            </div>
                            <div class="text-[0.8rem] text-gray-500">
                                <span>Average Students: </span>
                                <span>{onboard.avgStudentInClass}</span>
                            </div>
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    </div>
   
</div>
