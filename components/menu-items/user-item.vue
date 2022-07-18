<template>
    <li class="menu-item"
    >
        <div class="menu-item__avatar"
        :style="`background-image :url(http://localhost:3001/${user.avatarUrl}) ;`"
        >
        </div>
        <div class="menu-item__column">
            <div class="menu-item__title">
                {{ user.nickname }}
            </div>
            <div class="menu-item__subtitle">
                {{ user.status }}
            </div>
        </div>

        <img
        v-if="addBtn"
        @click="addFriend(user.id)"
        src="/images/add.png" alt="add" class="menu-item__btn">
    </li>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
    name : 'user-item',
    props : ['user'],
    computed : {
        ...mapState({
            User : 'User'
        }),

        addBtn(){
            let friends = [...this.User.friends.all,...this.User.friends.sent]
            let isYou = this.User.id == this.user.id
            let alreadyFriend = friends.find(item => item.id == this.user.id)
            return !alreadyFriend  && !isYou
        }
    },


    methods : {
        ...mapActions({
            ADD_FRIEND : "User/ADD_FRIEND"
        }),

        addFriend(id) {

            this.$nuxtSocket({name : 'home'}).emit("addFriend", {
                from_id : this.User.id,
                peer_id : id
            })
       }
    }
}
</script>