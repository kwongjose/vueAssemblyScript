<template>
<div class='chartSize'>
    <canvas  :id='chartID'></canvas>
</div>
</template>
<style>
    .chartSize {
        align-self: c;
        width: 60% !important;
        height: 400px  !important;
        margin-left: 20%;
        position: relative;
    }
</style>
<script>
import Chart from 'chart.js';

export default {
    props: {
        data: {
            type: Array,
            required: false
        },
        chartID: {
            type: String,
            required: false,
        },
    },

    data() {
        return { 
            chart: {}, 
            idText: '', 
            dataValue: [],
        }
    },

    methods: {
        run() {
            this.$emit();
        }
    },
    mounted() {
        this.idText = this.chartID;
        var ctx = document.getElementById(this.idText);
        this.chart = new Chart(ctx, {
            type: 'bar',
            data: { 
                labels: ['WASM', 'JS' ],
                datasets: [{
                    labels: 'JS vs WASM',
                    data: this.dataValue,
                    backgroundColor: ["rgba(255, 99, 132, 0.2)", "rgba(255, 159, 64, 0.2)"]
                }],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                legend: { display: false },
                scales: { 
                    yAxes: [ 
                        { 
                            ticks: { beginAtZero: true }
                        } ]
                },
            }
        });
    }
}
</script>