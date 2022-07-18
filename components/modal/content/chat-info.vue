<template>
    <div class="modal__content" v-if="modal == 'chat-info'">

    <div class="chat-info__leave"
    @click="leave"
    >
        Покинуть беседу
    </div>

        <div class="chat-info" >
            <div class="chat-info__menu">
                <div class="chat-info__item"
                @click="selected_menu = 'main'"
                >
                    Главная
                </div>
                <div class="chat-info__item"
                @click="selected_menu = 'members'"
                >
                    Участники
                </div>
            </div>
            <div class="chat-info__body">
                <!-- Главная -->

                <div class="chat-info__content main"
                v-if="selected_menu == 'main'"
                >
                    <div class="chat-info__main-info" v-if="!edit">
                        <div class="chat-info__avatar"
                        :style="`background-image: url(${api + Chat.info.avatarUrl});`"
                        >
                        </div>
                        <div class="chat-info__column">
                            <div class="chat-info__name">
                            {{ Chat.info.name }}
                            </div>
                            <div class="chat-info__description">
                                {{ Chat.info.description }}
                            </div>
                        </div>
                        <img src="/images/dark-edit.png" alt="edit" class="chat-info__edit"
                        @click="edit = true"
                        >
                    </div>
                    <modal-form v-if="edit"
                    :image="Chat.info.avatarUrl"
                    :dispatchUrl="'http://localhost:3001/editChat'"
                    :deps="{
                        chat_id : Chat.info.id
                    }"
                    @response="res"
                    >
                    <input name="name" type="text" placeholder="Название" :value="Chat.info.name">
                    <input name="description" type="text" placeholder="Описание" :value="Chat.info.description">

                    </modal-form>
                </div>

                <!-- Участники -->

                <div class="chat-info__content members"
                v-if="selected_menu == 'members'"
                >
                    <div class="chat-info__user"
                    v-for="member in Chat.members"
                    >
                        <div class="chat-info__user-avatar"
                        :style="`background-image: url('${api + member.avatarUrl}');`"
                        ></div>
                        <div class="chat-info__column">
                            <div class="chat-info__user-name">
                                {{ member.nickname }}
                            </div>
                            <div class="chat-info__user-status">
                                {{ member.status }}
                            </div>
                        </div>
                    </div>

                    <div class="chat-info__add-new">
                        Добавить <img src="/images/darkAdd.png" alt="add"
                        @click="selected_menu = 'invite'"
                        >
                    </div>
                </div>

                <!-- Пригласить -->

                <div class="chat-info__content invite"
                v-if="selected_menu == 'invite'"
                >
                    <div class="chat-info__user"
                    v-for="user in User.friends.all"
                    >
                        <div class="chat-info__user-avatar"
                        :style="`background-image: url('${api + user.avatarUrl}');`"
                        ></div>
                        <div class="chat-info__column">
                            <div class="chat-info__user-name">
                                {{ user.nickname }}
                            </div>
                            <div class="chat-info__user-status">
                                {{ user.status }}
                            </div>
                        </div>
                        <img  class="chat-info__add"
                        v-if="!members_ids.includes(user.id)"
                        @click="addMember(user.id)"
                        src="/images/darkAdd.png" alt="add" >
                    </div>
                </div>
            </div>
        </div>
    </div>
    
</template>

<style lang="scss">
    @import "assets/scss/chat/chat-info.scss";
</style>

<script>
import {mapState, mapActions} from 'vuex'
import ModalForm from '../modal-form.vue'
export default {
    name: "chat-info",
    components : {ModalForm},
    data() {
        return ({
            api: process.env.api,
            selected_menu: "main",
            edit: false
        });
    },
    computed: {
        ...mapState({
            User: "User",
            Chat: "Chat",
            modal: "modal"
        }),
        members_ids() {
            return this.Chat.members.map(item => item.id);
        }
    },
    methods: {
        ...mapActions({
            "FETCH_MEMBERS": "Chat/FETCH_MEMBERS",
            LEAVE_CHAT : "Chat/LEAVE_CHAT"
        }),

        addMember(id) {
            this.$nuxtSocket({name : 'home'})
            .emit('addMember',{
                chat_id : this.Chat.info.id,
                user_id : id
            })
        },

        res(data){
            this.$store.commit("Chat/UPDATE_CHAT",data)
            this.$store.commit("Menu/SET_ITEMS",this.Chat.chats)
            this.$store.commit("Chat/SET_CHAT",data)
            this.edit = false
        },
        leave(){
            this.LEAVE_CHAT(+this.User.id)
        }
    },
    mounted() {
        this.FETCH_MEMBERS(this.Chat.info.id);
    },
    components: { ModalForm }
}
</script>