<script lang="ts">
    import {Sprout,NotebookPen,Home,PowerIcon,SettingsIcon,EyeIcon,PlusIcon} from "lucide-svelte/icons";
    import { goto } from "$app/navigation";
    import { setCookie } from "$lib/scripts/Cookie.svelte";
    import userStore from "$lib/stores/userStore";
    import {
        QueryClient,
        QueryClientProvider,
    } from "@sveltestack/svelte-query";
    import MaturityScoreInfo from "$lib/components/ui/custom/Maturity_score_info.svelte";
    const queryClient = new QueryClient();

    export function logout() {
        setCookie("RECYCLE_TOKEN", null, -1);
        userStore.set({
            email: {
                mail: "",
                verified: false,
            },
            _id: "",
            username: "",
            role: "",
            awareness_score: 0,
            onBoardingComplete: false,
            onBoarding: [],
            token: "",
        });
        goto("/login", { replaceState: true });
    }
</script>

<div class="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[295px_1fr]">
    <div class="bg-primary bg-opacity-80 hidden border-r md:block">
        <div class="flex h-full max-h-screen flex-col gap-2">
            <div class="flex h-fit w-fit items-center border-b px-4  py-4 " >
                <a href="/" class="flex items-center gap-2 font-semibold text-white">
                    <div><Sprout class="h-8 w-auto " /></div>
                    <span class="font-impact text-2xl font-normal">Waste Watch Wizard</span>
                </a>
            </div>
            <div class="flex-1">
                <nav class="grid items-start px-2 text-sm font-medium lg:px-4">
                    <a href="/auth/dashboard" class="text-white hover:underline flex items-center gap-3 rounded-lg px-3 py-2 transition-all">
                        <div><Home class="h-4 w-4" /></div>
                        Dashboard
                    </a>
                    <a href="/auth/addEntries" class="text-white hover:underline flex items-center gap-3 rounded-lg px-3 py-2 transition-all">
                        <div><PlusIcon class="h-4 w-4" /></div>
                        Conduct Waste Audit
                    </a>
                    <a href="/auth/view" class="text-white hover:underline flex items-center gap-3 rounded-lg px-3 py-2 transition-all" >
                        <div><EyeIcon class="h-4 w-4" /></div>
                        Waste Audit Report
                    </a>
                    <MaturityScoreInfo />
                    <a href="/auth/update" class="text-white hover:underline flex items-center gap-3 rounded-lg px-3 py-2 transition-all" >
                        <div><NotebookPen class="h-4 w-4" /></div>
                        Assess Waste Management Maturity
                    </a>
                    <a href="/auth/add_awareness" class="text-white hover:underline flex items-center gap-3 rounded-lg px-3 py-2 transition-all" >
                        <div><PlusIcon class="h-4 w-4" /> </div>
                        Conduct Waste Management Training
                    </a>
                    <a href="/auth/view_awareness" class="text-white hover:underline flex items-center gap-3 rounded-lg px-3 py-2 transition-all" >
                        <div><EyeIcon class="h-4 w-4" /></div>
                        Training Program History
                    </a>
                </nav>
            </div>
            <div class="mt-auto pl-4">
                <a href="/auth/add_school" class="text-white hover:underline flex items-center gap-3 rounded-lg px-3 py-2 transition-all">
                    <div><SettingsIcon class="h-4 w-4" /></div>
                    Add new school/organization
                </a>
                <button on:click={logout} class="text-white hover:underline flex items-center gap-3 rounded-lg px-3 py-2 transition-all">
                    <div><PowerIcon class="h-4 w-4" /></div>
                    Logout
                </button>
            </div>
        </div>
    </div>
    <div class="flex flex-col h-[100svh] overflow-auto">
        <QueryClientProvider client={queryClient}>
            <slot></slot>
        </QueryClientProvider>
    </div>
</div>



