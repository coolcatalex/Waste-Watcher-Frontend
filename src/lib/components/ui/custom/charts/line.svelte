<script lang="ts">
    import Chart from 'chart.js/auto';
    import { onMount, onDestroy } from 'svelte';
    import 'chartjs-adapter-date-fns';

    let chartELE: HTMLCanvasElement;
    export let data: {x: string,y:number}[];
    export let awareness: number[];
    export let heading: string;

    let chart: any;

    onMount(() => {
        createChart();
    });


    const lineMarker = {
        id: 'lineMarker',
        beforeDatasetsDraw: (chart:any,args:any,plugins:any)=>{
            const {ctx,chartArea:{top,bottom},scales:{x}} = chart
            // console.log(x.getPixelForValue(1699401600000))
            ctx.save()
            plugins.data.forEach((_data:number)=>{
                ctx.beginPath()
                ctx.strokeStyle = '#44B56E'
                ctx.lineWidth = 3
                ctx.setLineDash([15, 15]);
                console.log(_data)
                ctx.moveTo(x.getPixelForValue(_data),top)
                ctx.lineTo(x.getPixelForValue(_data),bottom)
                ctx.stroke()
            })
        }
    }

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
                        },
                        y:{
                            title:{
                                display: true,
                                align: "center",
                                font:{
                                    family: "Poppins",
                                    size: 12,
                                    weight: 500
                                },
                                color:"#00000080",
                                text:"Waste Collected (KG)"
                            }
                        }
                    },
                    plugins:{
                        // @ts-ignore
                        lineMarker:{
                            data: awareness
                        }
                    }
                },
                plugins: [lineMarker]
            });
        } catch (error) {
            console.log(error);
        }
    }
</script>

<div class="h-[400px]">
    <canvas bind:this={chartELE} class="w-full"/>
</div>
