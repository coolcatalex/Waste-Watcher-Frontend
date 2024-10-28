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
        try {
            chart = new Chart(chartELE, {
                type: "radar",
                data: {
                    labels,
                    datasets: [{
                        label: heading,
                        data,
                        backgroundColor: ["#4ac0c140"],
                        // circumference: 180,
                        // rotation: 270
                    }],
                },
                options: {
                    // animation: true,
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                        legend: {
                            display: false
                        },
                        // tooltip: {
                        //     enabled: false
                        // }
                    },
                }
            });
        } catch (error) {
            console.log(error);
        }
    }
</script>

<div>
    <h1 class="text-center text-lg underline underline-offset-2">{heading}</h1>
    <div class="h-[400px]">
        <canvas bind:this={chartELE} class="w-full h-full"/>
    </div>
</div>
