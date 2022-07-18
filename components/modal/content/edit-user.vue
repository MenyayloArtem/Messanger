<template>
    <div class="modal__content" v-if="modal == 'edit-user'">
        <modal-form
        :image="User.avatarUrl"
        :dispatchUrl="'http://localhost:3001/editUser'"
        @response="(res)=>UPDATE_USER(res)"
        >

        <input name="nickname" 
        :value="User.nickname"
        placeholder="Имя" type="text">
        <input name="status" 
        :value="User.status"
        placeholder="Статус" type="text">
            
        </modal-form>
    </div>
</template>

<script>
import {mapState, mapMutations} from 'vuex'

export default {
    name : 'modal-edit-user',
    computed : {
        ...mapState({
            User : 'User',
            modal : "modal"
        })
    },
    methods : {
        ...mapMutations({
            UPDATE_USER : "User/UPDATE_USER"
        })
    }
}
</script>