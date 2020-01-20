<template>
    <tr>
        <td> <input type='button' :value='name' @click='runFuncs'></td>
        <td>{{ jsResult }}</td>
        <td>{{ jsTime }}</td>
        <td>{{ wasmResult }}</td>
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
        jsResult: {
            type: Number,
            required: false
        },
        jsTime: {
            type: Number,
            required: false
        },
        wasmResult: {
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