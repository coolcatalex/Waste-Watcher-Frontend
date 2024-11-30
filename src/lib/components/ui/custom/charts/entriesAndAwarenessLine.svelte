<script lang="ts">
    import Chart from 'chart.js/auto';
    import { onMount, onDestroy } from 'svelte';
    import 'chartjs-adapter-date-fns';
    import type { ENTRIES_AWARENESS } from '../../../../../types';

    let chartELE: HTMLCanvasElement;
    export let dataset:ENTRIES_AWARENESS;
    // export let awareness: number[];
    export let heading: string;

    let chart: any;

    onMount(() => {
        createChart();
    });

    const lineColors = [
        "#25ced1", // Lighter green
        "#b9fd0d", // Main green color
        "#de17a5", // Sea green
        "#9966ff", // Pastel green
        "#ffcd56", // Teal green
        "#c9cbcf", // Aqua
        "#3498db", // Light blue
        "#1abc9c", // Turquoise
        "#ff6384", // Darker green
        "#9b59b6", // Purple
        "#34495e", // Navy blue
        "#f1c40f", // Yellow
        "#e74c3c", // Red
        "#ecf0f1", // Light gray
        "#95a5a6", // Medium gray
        "#7f8c8d", // Dark gray
        "#2ecc71", // Bright green
        "#8e44ad", // Deep purple
        "#ff7f50", // Coral
    ];

    const processAwarenessData = (entries: ENTRIES_AWARENESS['entries'],awareness: ENTRIES_AWARENESS['awareness']): Record<string, { x: number; y: number }[]> => {
            const awarenessDots: Record<string, { x: number; y: number }[]> = {};

            // Iterate over each awareness line
            Object.entries(awareness).forEach(([lineKey, awarenessPoints]) => {
                // Get the corresponding entries line
                const entryPoints = entries[lineKey];

                if (entryPoints) {
                    // Initialize the lineKey in the record if not already present
                    if (!awarenessDots[lineKey]) {
                        awarenessDots[lineKey] = [];
                    }

                    awarenessPoints.forEach((awarenessPoint) => {
                        // Find the closest entry point for awareness.x
                        const closestEntry = entryPoints.reduce((closest, current) =>
                            Math.abs(current.x - awarenessPoint.x) < Math.abs(closest.x - awarenessPoint.x)
                                ? current
                                : closest
                        );

                        // Push the awareness dot to the record under the appropriate lineKey
                        awarenessDots[lineKey].push({
                            x: awarenessPoint.x,
                            y: closestEntry.y,
                        });
                    });
                }
            });

            return awarenessDots;
        };

    

    $: if (chart) {
        // Prepare your data
        const awarenessDots = processAwarenessData(dataset.entries, dataset.awareness);
        if(Object.keys(dataset.entries).length > 0){
            // Update chart when data or labels change
            chart.data.datasets =  [
                ...Object.entries(dataset.entries).map(([key, value], _index) => ({
                    label: key,
                    data: value,
                    order:2,
                    borderColor: lineColors[_index % 19],
                    backgroundColor: lineColors[_index % 19],
                })),
                ...Object.entries(dataset.entries)
                    .map(([key, value], _index) => {
                        // Filter entries with waste_champion true
                        const filteredData = value.filter(entry => entry.waste_champion);

                        // Only include datasets that have at least one entry after filtering
                        if (filteredData.length > 0) {
                            return {
                                label: `${key} Waste Champian`,
                                data: filteredData,
                                pointStyle: 'rect',
                                order: 1,
                                pointRadius: 8,
                                pointBackgroundColor: '#45b56e90',
                                borderColor: '#45b56e',
                                borderWidth: 1,
                                showLine: false, // Dots only, no lines
                                hoverRadius: 10, 
                                hoverBorderWidth: 1, 
                            };
                        }
                        return null; // Exclude datasets with no waste_champion entries
                    })
                    .filter(dataset => dataset !== null), // Remove null entries
                ...Object.entries(awarenessDots).map(([key,value]) => ({
                    label: `${key} Awareness`,
                    data: value,
                    pointStyle: 'triangle',
                    order: 0,
                    pointRadius: 8,
                    pointBackgroundColor: '#fbdd32',
                    borderColor: '#fbdd32',
                    borderWidth: 1,
                    showLine: false, // Dots only, no lines
                    unit: "",
                    hoverRadius: 10, 
                    hoverBorderWidth: 1, 
                })),
            ]
        }else{
            chart.data.datasets = []
        }
        chart.update();
    }

    

    function createChart() {
        // Prepare your data
        const awarenessDots = processAwarenessData(dataset.entries, dataset.awareness);
        try {
            chart = new Chart(chartELE, {
                type: "line",
                data: {
                    datasets: [
                        ...Object.entries(dataset.entries).map(([key, value], _index) => ({
                            label: key,
                            data: value,
                            order:2,
                            borderColor: lineColors[_index % 19],
                            backgroundColor: lineColors[_index % 19],
                            unit: "kg",
                            // tension: 1
                        })),
                        ...Object.entries(dataset.entries)
                            .map(([key, value], _index) => {
                                // Filter entries with waste_champion true
                                const filteredData = value.filter(entry => entry.waste_champion);

                                // Only include datasets that have at least one entry after filtering
                                if (filteredData.length > 0) {
                                    return {
                                        label: `${key} Waste Champion`,
                                        data: filteredData,
                                        pointStyle: 'rect',
                                        order: 1,
                                        pointRadius: 8,
                                        pointBackgroundColor: '#45b56e90',
                                        borderColor: '#45b56e',
                                        borderWidth: 1,
                                        showLine: false, 
                                        hoverRadius: 10, 
                                        hoverBorderWidth: 1, 
                                        skipTooltip: true,
                                    };
                                }
                                return null; // Exclude datasets with no waste_champion entries
                            })
                            .filter(dataset => dataset !== null), // Remove null entries
                        ...Object.entries(awarenessDots).map(([key,value]) => ({
                                label: `${key} Awareness Score`,
                                data: value,
                                pointStyle: 'triangle',
                                order: 0,
                                pointRadius: 8,
                                pointBackgroundColor: '#fbdd32',
                                borderColor: '#fbdd32',
                                borderWidth: 1,
                                showLine: false, // Dots only, no lines
                                hoverRadius: 10, // Disable hover enlargement
                                hoverBorderWidth: 1, // Disable hover border width change
                                unit: ""
                            })),
                        ],
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
                            },
                            beginAtZero: true, // Ensures the axis starts at zero
                            // ticks: {
                            //     min: 0 // Explicitly set the minimum value
                            // }
                        }
                    },
                    plugins:{
                        legend: {
                            labels:{
                                usePointStyle: true
                            }
                            // display: true, // Ensure legend is displayed
                            // labels: {
                            //     filter: (legendItem) => !legendItem.text.endsWith("Awareness") && !legendItem.text.endsWith("Champion"), // Hide specific label
                            // },
                        },
                        tooltip: {
                            callbacks: {
                                label: function (context) {
                                    const value = context.raw;
                                    // @ts-ignore
                                    const date = new Date(value.x); // Get the date from the x value
                                    const formattedDate = date.toLocaleString().split(", ")[0]; // Use a different format if necessary
                                    // @ts-ignore
                                    return `${formattedDate}: ${value.y}`;
                                },
                            },
                        },
                    }
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
