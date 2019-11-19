<template>
    <div class="LoopCount">
        <input type="button" :value="btnText" @click="handleInput">
        <input type="text" disabled id="timeSpent" :value="result">
    </div>
</template>

<script>
export default {
    props: {
        btnText: {
            type: String,
            required: false
        },
        result: {
            type: String,
            required: false
        },
        calculation: {
            type: Function,
            required: false
        }
    },

    // data() {
    //     return { };
    // },

    methods: {
        handleInput(event) {
            console.log("click");
            this.$emit("click");
        }
    }
}
</script>

<style scoped>

</style>