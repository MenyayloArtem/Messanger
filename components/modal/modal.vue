<template>
    <div class="modal" v-if="modal">
        
        <div class="modal__wrapper">
            <div class="modal__body">
                <div class="modal__title">
                    {{ title }}
                </div>
                <slot></slot>
            </div>
            <div class="modal__close">
                <img src="/images/close.png" alt="close modal"
                @click="TOGGLE_MODAL(modal)">
            </div>
        </div>
    </div>

</template>

<script>
import {mapState,mapMutations} from 'vuex'
import titles from './titles.js'
export default {
    name : "Modal",
    computed : {
        ...mapState({
            modal : 'modal'
        }),
        isVisible(){
            return this.$store.state.modal == this.type
        },
        title(){
            return titles[this.modal]
        }
    },
    methods : {
        ...mapMutations([
          'TOGGLE_MODAL'
        ])
    }
}
</script>