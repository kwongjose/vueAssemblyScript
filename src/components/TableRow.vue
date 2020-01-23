<template>
    <tr>
        <td> <input type='button' :value='name' @click='runFuncs'></td>
        <td>{{ jsOps }}</td>
        <td>{{ jsElaps }}</td>
        <td>{{ wasmOps }}</td>
        <td>{{ wasmElaps }}</td>
        <td>{{ faster }}</td>
    </tr>
</template>

<script lang='ts'>
export default {
    props: {
        name: {
            type: String,
            required: false
        },
        jsOps: {
            type: String,
            required: false
        },
        jsElaps: {
            type: String,
            required: false
        },
        wasmOps: {
            type: String,
            required: false
        },
        wasmElaps: {
            type: String,
            required: false
        },
        faster: {
            type: String,
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