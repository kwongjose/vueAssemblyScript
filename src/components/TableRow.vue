<template>
    <tr>
        <td> <input type='button' :value='name' @click='runFuncs'></td>
        <td>{{ jsTime }}</td>
        <td>{{ wasmTime }}</td>
    </tr>
</template>

<script lang='ts'>
export default {
    props: {
        name: {
            type: String,
            required: false
        },
        jsTime: {
            type: Number,
            required: false
        },
        wasmTime: {
            type: Number,
            required: false
        },
        runFuncs: {
            type: Function
        }
    },

    methods: {
        handleInput() {
            this.$emit();
        }
    }
}
</script>