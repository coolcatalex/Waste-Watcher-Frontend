<script lang="ts">
    import * as Dialog from "$lib/components/ui/dialog";
    import {Info} from "lucide-svelte/icons";
</script>

<Dialog.Root>
    <Dialog.Trigger>
        <div class="text-white hover:underline flex items-center gap-3 rounded-lg px-3 py-2 transition-all" >
            <div><Info class="h-4 w-4" /></div>
            <span class="block text-left">Waste Management Maturity Score</span>
        </div>
    </Dialog.Trigger>
    <Dialog.Content>
      <Dialog.Header>
        <Dialog.Title>What is Waste Management Maturity Score ?</Dialog.Title>
        <Dialog.Description>
          <div class="flex flex-col gap-4 my-1 h-[80svh] overflow-auto">
            <span>The Waste Management Maturity Score (WMMS) is a benchmark parameter designed to evaluate and quantify the efficiency and effectiveness of an organization's waste management practices across key domains. It provides a systematic way to assess the current state of waste management practices and identify areas for improvement. The score is computed based on several parameters, each associated with a specific domain such as Policy, Training, Infrastructure. Administration, and Monitoring.</span>
            <div class="flex flex-col gap-1.5">
                <h1 class="text-black font-semibold underline text-lg underline-offset-2">Domains and Parameters:</h1>
                <ol class="list-decimal flex flex-col gap-1">
                    <li>
                        <div class="text-black text-opacity-80">
                            1. Policy (15% total weightage):
                            <div class="ml-2 flex flex-col text-black text-opacity-50">
                                <span>- Existence of a waste management policy and plan.</span>
                                <span>- Definition of roles and responsibilities.</span>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div class="text-black text-opacity-80">
                            2. Training (30% total weightage):
                            <div class="ml-2 flex flex-col text-black text-opacity-50">
                                <span>- Adequacy and placement of bins.</span>
                                <span>- Types of bins (classified or unclassified).</span>
                                <span>- Marking of bin locations..</span>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div class="text-black text-opacity-80">
                            3. Administration (10% total weightage):
                            <div class="ml-2 flex flex-col text-black text-opacity-50">
                                <span>- Frequency of clearing and cleaning bins.</span>
                                <span>- Existence of a recycling process.</span>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div class="text-black text-opacity-80">
                            4. Monitoring (15% total weightage):
                            <div class="ml-2 flex flex-col text-black text-opacity-50">
                                <span>- Systems in place for monitoring and reporting waste management.</span>
                            </div>
                        </div>
                    </li>
                </ol>
            </div>
            <div>
                <h1 class="text-black font-semibold underline text-lg underline-offset-2">Scoring:</h1>
                <span>Each parameter is assigned a score based on different levels of maturity, typically from "No" implementation (score 0) to "Comprehensive" implementation (score 10). Intermediate levels such as "Limited" or "Somewhat Adequate" are also scored proportionately (e.g., 3 or 5 points).</span>
            </div>
          </div>
        </Dialog.Description>
      </Dialog.Header>
    </Dialog.Content>
</Dialog.Root>