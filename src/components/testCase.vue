<template>
    <div class="table-container">
        <table v-if="solved!==-1" class="table table-responsive">
            <tr v-for="(row, i) in data"
                :class="">
                <td v-for="(col, j) in row"
                    :class="[j === data.length / 2 ? 'middleHorizontal' : '', i === data.length / 2 ? 'middleVertical' : '']">
                    <span class="font-weight-bold display-1">
                        {{data[i][j] || 0}}
                    </span>
                </td>
            </tr>
        </table>
        <span v-else class="display-1">Bad Day for the hunters...Not Solvable</span>
    </div>
</template>

<script>

    export default {
        name:  'test-case',
        props: {
            data:   {type: Array, default: null},
            solved: {type: Number, default: 1},
        },
    }
</script>

<style scoped>
    .table-container {
        display: inline-table;
    }

    table td {
        text-align: center;
        padding:    10px;
        border:     3px solid black;
    }

    table {
        border-collapse:  collapse;
        display:          inline-table;
        border:           5px solid black;
        margin:           10px;
        background-color: yellow;
    }

    /*td:nth-child(n) {*/
    /*    background-color: yellow;*/
    /*}*/

    .middleVertical {
        border-top: 8px solid black;
    }

    .middleHorizontal {
        border-left: 8px solid black;
    }
</style>
