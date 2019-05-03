<template>
    <v-app id="inspire">
        <v-container fluid grid-list-xs text-xs-center>
            <v-flex xs12>
                <v-switch v-model="solve"
                          label="Solve?"
                ></v-switch>
            </v-flex>
            <v-pagination v-model="page"
                          :length="Math.ceil(cases.length/casesPerPage)"
            ></v-pagination>
            <v-layout xs12 overflow-y-hidden py-3 justify-center align-center
                      v-for="(carpet, i) in magicCarpets"
                      :key="carpet.toString() + i"
                      :class="i%2?'odd':'even'">
                <v-flex xs1>
                    <span class="title">Test Case #{{(page-1)*casesPerPage+i+1}}: </span>
                    <span v-if="solve" class="title">Solution: {{solvedMagicCarpets[i].answer}}</span>
                </v-flex>
                <v-flex xs11>
                    <test-case :data="carpet"></test-case>
                    <test-case v-if="solve" :data="solvedMagicCarpets[i].carpet"></test-case>
                </v-flex>
            </v-layout>
        </v-container>
    </v-app>
</template>

<script>
    import {formatTaskFile} from '../setupTestCases'
    import testCase         from './testCase'
    import {CaseSolver}     from '../CaseSolver'

    const file = require('raw-loader!../../public/task-1.txt')


    export default {
        name:       'intuit',
        components: {testCase},
        data() {
            const cases = formatTaskFile(file.default).filter(testCase => testCase.n < 70)
            return {
                cases,
                page:         1,
                casesPerPage: 10,
                solve:        false,
            }
        },

        computed: {
            magicCarpets: function () {
                return this.cases.slice((this.page - 1) * this.casesPerPage, this.page * this.casesPerPage).map(testCase =>
                    new CaseSolver(testCase).magicCarpet)
            },

            solvedMagicCarpets: function () {
                return this.solve ? this.cases.slice((this.page - 1) * this.casesPerPage, this.page *
                    this.casesPerPage).map(testCase =>
                    CaseSolver.solve(testCase)) : null
            },
        },
    }
</script>

<style scoped>
    .odd {
        background-color: mediumspringgreen;
    }

    .even {
        background-color: aqua;
    }
</style>
