<template>
    <div class="modal__content" v-if="modal == 'create-chat'">
        <modal-form
        :reqImage="true"
        :dispatchUrl="'http://localhost:3001/createConv'"
        @response="(res) => closeModal(res)"
        >
            <input name="name" placeholder="Название" type="text">
            <input name="description" placeholder="Описание" type="text">
        </modal-form>
    </div>
</template>

<script>

import { mapActions, mapMutations, mapState } from 'vuex'

export default {
    name : 'create-chat',
    computed : {
        ...mapState({
            modal : 'modal'
        })
    },

    methods : {
        ...mapMutations({
            TOGGLE_MODAL : "TOGGLE_MODAL",
            ADD_CHAT : "Chat/ADD_CHAT"
        }),

        ...mapActions({
            SELECT_CHAT : "Chat/SELECT_CHAT"
        }),

        closeModal(res) {
            this.TOGGLE_MODAL("create-chat")
            this.ADD_CHAT(res)
            this.SELECT_CHAT(res)
        }
    }
}
</script>