<script lang="ts">
    import Chart from 'chart.js/auto';
    import { onMount, onDestroy } from 'svelte';

    let chartELE: HTMLCanvasElement;
    export let labels: string[];
    export let data: number[];
    export let heading: string;
    export let subText: string[];

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
    const lineMarker = {
        id: 'lineMarker',
        beforeDatasetsDraw: (chart:any,args:any,plugins:any)=>{
            const {ctx,chartArea:{top,bottom,left,right},scales:{x}} = chart
            // console.log(x.getPixelForValue(1699401600000))
            ctx.save()
            ctx.font = "600 28px Poppins"; 
            ctx.fillStyle = "black"; 
            const textWidth = ctx.measureText(plugins.data).width
            ctx.fillText(plugins.data, (right/2) - (textWidth/2),(bottom/2) + (bottom/3)); // Draw the text at the specified position

            // ctx.font = "400 18px Poppins"; 
            // const headingWidth = ctx.measureText(plugins.heading).width
            // ctx.fillText(plugins.heading, (right/2) - (headingWidth/2),20); // Draw the text at the specified position

        }
    }
    function createChart() {
        try {
            chart = new Chart(chartELE, {
                type: "doughnut",
                data: {
                    labels,
                    datasets: [{
                        label: "Total",
                        data,
                        backgroundColor: ["#4ac0c1", "#1d1d1d10"],
                        circumference: 180,
                        rotation: 270
                    }],
                },
                options: {
                    animation: true,
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                        title:{
                            display: true,
                            color: "#00000090",
                            font: {
                                family: "Poppins",
                                weight: "normal",
                                size: 14
                            },
                            // text:subText.match(/.{1,60}/g)!,
                            text:subText,
                            position: "bottom"
                        },
                        legend: {
                            display: false
                        },
                        tooltip: {
                            enabled: false
                        },
                        // @ts-ignore
                        lineMarker:{
                            data: data[0]/10,
                            heading: heading,
                        }
                    },
                },
                plugins:[lineMarker]

            });
        } catch (error) {
            console.log(error);
        }
    }
</script>

<div>
    <h1 class="text-center text-lg underline underline-offset-2">{heading}</h1>
    <div class="h-[400px]">
        <canvas bind:this={chartELE} class="h-full w-full "/>
    </div>
</div>
