<script lang="ts">
    import Chart from 'chart.js/auto';
    import { onMount, onDestroy } from 'svelte';

    let chartELE: HTMLCanvasElement;
    export let labels: string[];
    export let data: number[];
    export let heading: string;

    let chart: any;

    onMount(() => {
        createChart();

    });

    $: if (chart && data && labels) {
        // Update chart when data or labels change
        console.log("Update chart when data or labels change")
        chart.data.labels = labels;
        chart.data.datasets[0].data = data;
        chart.update();
    }

    function createChart() {
        console.log(labels)
        try {
            chart = new Chart(chartELE, {
                type: "pie",
                data: {
                    labels,
                    datasets: [{
                        label: "Total",
                        data,
                        backgroundColor: ["#84DCC6", "#D6EDFF","#ACD7EC","#8B95C9","#478978"],
                    }],
                },
                options: {
                    animation: true,
                    responsive: true,
                    maintainAspectRatio: false,
                },
            });
            console.log(chart.data)
        } catch (error) {
            console.log(error);
        }
    }
</script>

<div class="h-full">
    <div class="relative h-[400px]">
        <h1 class="absolute top-2 left-1/2 -translate-x-1/2 whitespace-nowrap">{heading}</h1>
        <canvas bind:this={chartELE}/>
    </div>
</div>
