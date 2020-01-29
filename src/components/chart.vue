<template>
    <div class='container'>
        <img class='code-pic'  :src='wasmPic'>
        <div class='chartWraper'>
            <input type="button" :value='btnText' @click="btnEvent">
            <div class='chartSize'>
                <canvas  :id='chartID'></canvas>
            </div>
        </div>
        <img class='code-pic'  :src='jsPic'>
    </div>
</template>
<style>
.chartSize {
    width: 100% !important;
    height: 400px  !important;
    position: relative;
}
.chartWraper {
    width: 50%;
}
.container {
    margin-top: 40px;
    margin-bottom: 20px;
    width: 100%;
    display: inline-flex
}
.code-pic {
  height: 200px;
  width: 24%
}
</style>
<script>
import Chart from 'chart.js';

export default {
    props: {
        btnText: {
            type: String,
            required: false
        },
        btnEvent: {
            type: Function,
            required: false
        },
        chartID: {
            type: String,
            required: false,
        },
        wasmPic: {
            type: String
        },
        jsPic: {
            type: String
        }
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
                            scaleLabel : { display: true, labelString: 'Ops/Sec' },
                            ticks: { beginAtZero: true }
                        } ]
                },
            }
        });
    }
}
</script>