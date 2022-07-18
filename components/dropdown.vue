<template>
    <div class="dropdown">
        <div class="dropdown__top"
        @click="opened = !opened"
        >
            <div class="dropdown__selected">
                {{ defaultSelected.alias }}
            </div>
            <img class="dropdown__icon" src="/images/dropdown.png" alt="dropdown"
            >
        </div>
        <div class="dropdown__body" v-if="opened">
            <div class="dropdown__value"
            v-for="item in values"
            :key="item.value"
            @click="select(item)"
            >
            {{ item.alias }}
            </div>
        </div>
    </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'

export default {
    props : ["allValues",'field'],
    data(){
        return ({
            selected : '',
            opened : false
        })
    },
    methods : {
        ...mapMutations({
            DROPDOWN_SELECT : "Dropdown/DROPDOWN_SELECT"
        }),

        select(item){
            this.DROPDOWN_SELECT({
                field : this.field,
                item : item
            })
            this.opened = false
            this.$emit('select',item.value)
        }
    },
    computed : {
        ...mapState(['Dropdown']),

        values(){
            return this.allValues.filter(item => item.value != this.defaultSelected.value)
        },

        defaultSelected(){
            return this.Dropdown[this.field]?.selected || this.allValues[0]
        }
    }
}
</script>

<style lang="scss">
    @import "~/assets/scss/special/dropdown.scss";
</style>