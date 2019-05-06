<template>
    <v-app id="inspire">
        <v-container fluid grid-list-xs text-xs-center class="blue lighten-5">
            <v-layout row wrap justify-center>
                <v-flex xs12>
                        <span class="display-2 blue--text">
                            Intuit Challenge Solution
                        </span>
                    <span class="title blue--text">
                        By Sean Dvir
                    </span>
                </v-flex>
                <v-flex xs12 pt-4 offset-xs1>
                    <span class="title">
                    <a href="https://intuit.app.box.com/s/nicki9h5ra2qw0p8f1xzs5vzdlwzw70s">The Challenge</a>
                    </span>
                    <span class="black--text caption">
                        &emsp; *Only test cases where N < 70 were implemented.
                    </span>
                </v-flex>
                <v-flex xs12>
                    <v-switch style="justify-content:center"
                              v-model="solve"
                              label="Solve?">
                    </v-switch>
                </v-flex>
                <v-flex xs12 my-0>
                    <v-pagination circle style="justify-content: center"
                                  v-model="page"
                                  @mousedown="$emit('changePage', page)"
                                  :length="Math.ceil(cases.length/casesPerPage)">
                    </v-pagination>
                </v-flex>
            </v-layout>
        </v-container>
        <v-tabs v-model="active"
                color="blue lighten-3"
                dark
                centered
                grow
                slider-color="black">
            <v-tab v-for="n in sets.length"
                   :key="n"
                   @change="set=sets[n-1]"
                   class="cyan black--text font-weight-bold title"
                   ripple>
                Task {{ n }} - {{setTypes[n-1]}}
            </v-tab>
            <v-tab-item
                    v-for="n in sets.length"
                    :key="n">
                <v-container pa-0 fluid grid-list-xs text-xs-center>
                    <v-layout xs12overflow-y-hidden my-0 align-center column
                              v-for="(carpet, i) in magicCarpets"
                              :key="carpet.toString() + i"
                              :class="i%2?'odd':'even'">
                        <v-flex py-4>
                            <span class="title">Test Case #{{(page-1)*casesPerPage+i+1}}: </span>
                        </v-flex>
                        <v-flex>
                    <span v-if="solve" class="title">Solution: {{solvedMagicCarpets[i].answer}}
                        <v-icon>done</v-icon></span>
                        </v-flex>
                        <v-flex xs12 py-4>
                            <test-case :data="carpet"></test-case>
                            <span v-if="solve">
                        <v-icon class="icon">arrow_forward</v-icon>
                        <test-case :data="solvedMagicCarpets[i].carpet"
                                   :solved="solvedMagicCarpets[i].answer">
                        </test-case>
                    </span>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-tab-item>
        </v-tabs>
    </v-app>
</template>

<script>
    import {formatTaskFile} from '../lib/setupTestCases'
    import testCase         from './testCase'
    import {CaseSolver}     from '../lib/CaseSolver'

    const firstSet  = require('raw-loader!../../public/task-1.txt')
    const secondSet = require('raw-loader!../../public/task-2.txt')

    export default {
        name:       'intuit',
        components: {testCase},
        data() {
            return {
                active:       null,
                sets:         [firstSet, secondSet],
                setTypes:     ['Even', 'Odd'],
                set:          firstSet,
                page:         1,
                casesPerPage: 10,
                solve:        false,
            }
        },

        computed: {
            cases:        function () {
                return formatTaskFile(this.set.default).filter(testCase => testCase.n < 70)
            },
            magicCarpets: function () {
                return this.cases.slice((this.page - 1) * this.casesPerPage, this.page * this.casesPerPage).map(testCase =>
                    new CaseSolver(testCase).magicCarpet)
            },

            solvedMagicCarpets: function () {
                return this.solve ?
                       this.cases.slice((this.page - 1) * this.casesPerPage, this.page *
                           this.casesPerPage).map(testCase => CaseSolver.solve(testCase))
                                  :
                       null
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

    .icon {
        font-size: 50px;
    }
</style>
