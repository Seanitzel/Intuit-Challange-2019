<template>
    <v-app>
        <v-content>
            <demo/>
        </v-content>
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
