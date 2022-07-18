<template>
    <li class="menu-item"
    :class="{selected : isSelected}"
    @click="$emit('click',chat)"
    >
        <div class="menu-item__avatar"
        :style="`background-image :url(http://localhost:3001/${chat.avatarUrl}) ;`"
        >
        </div>
        <div class="menu-item__column">
            <div class="menu-item__title">
                {{ chat.name }}
            </div>
            <div class="menu-item__subtitle">
                {{ chat.description }}
            </div>
        </div>
    </li>
</template>

<script>
import { mapState } from 'vuex'

export default {
    name : 'chat-item',
    props : ['chat'],
    computed : {
        ...mapState({
            Chat : "Chat"
        }),

        isSelected(){
            return this.Chat.info.id == this.chat.id
        }
    }
}
</script>