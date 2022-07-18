<template>
    <li class="menu-item"
    @click="$emit('click',friend)"
    >
        <div class="menu-item__avatar"
        :style="`background-image :url(http://localhost:3001/${friend.avatarUrl}) ;`"
        >
        </div>
        <div class="menu-item__column">
            <div class="menu-item__title">
                {{ friend.nickname }}
            </div>
            <div class="menu-item__subtitle">
                {{ friend.status }}
            </div>
        </div>

        <img
        v-if="Dropdown.friends.selected.value == 'incoming'"
        @click="addFriend(friend.id)"
        src="/images/add.png" alt="add" class="menu-item__btn">
    </li>
</template>

<script>
import {  mapActions, mapState } from 'vuex';

export default {
    name : 'friend-item',
    props : ['friend'],
    computed : {
        ...mapState({
            "Dropdown" : "Dropdown",
            User : "User"
        })
    },
    methods : {
       addFriend(id) {

            this.$nuxtSocket({name : 'home'}).emit("addFriend", {
                from_id : this.User.id,
                peer_id : id
            })
       }
    }
}
</script>