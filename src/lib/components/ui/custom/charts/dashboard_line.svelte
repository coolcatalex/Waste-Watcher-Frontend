<script lang="ts">
    import Chart from 'chart.js/auto';
    import { onMount, onDestroy } from 'svelte';
    import 'chartjs-adapter-date-fns';

    let chartELE: HTMLCanvasElement;
    export let data: {x: string | number,y:number}[];
    export let heading: string;

    let chart: any;

    onMount(() => {
        createChart();
    });


    $: if (chart && data) {
        // Update chart when data or labels change
        console.log("Update chart when data or labels change")
        chart.data.datasets[0].data = data;
        chart.update();
    }

    function createChart() {
        try {
            chart = new Chart(chartELE, {
                type: "line",
                data: {
                    datasets: [{
                        label: heading,
                        data,
                        backgroundColor: ["#4ac0c1"],
                    }],
                },
                options: {
                    // animation: true,
                    responsive: true,
                    maintainAspectRatio: false,
                    scales:{
                        x: {
                            type: "time",
                            time:{
                                unit: "day"
                            }
                        }
                    },
                },
            });
        } catch (error) {
            console.log(error);
        }
    }
</script>

<div class="h-[400px]">
    <canvas bind:this={chartELE} class="w-full"/>
</div>
