<template>
    <v-app>
        <v-content>
            <demo/>
        </v-content>
        <v-footer app height="auto" color="">
            <v-layout justify-center row wrap>
                <v-flex xs2 blue lighten-4 py-3
                        text-xs-center black--text xs12>
                    ---Contact me at <strong>seandvir12@gmail.com</strong>---<a
                        href="https://github.com/Seanitzel">My Github</a>---
                </v-flex>
            </v-layout>
        </v-footer>
    </v-app>

</template>

<script>
    import demo from './components/demo'

    export default {
        name:       'App',
        components: {
            demo,
        },
    }
</script>
