<template>
    <div 
    class="message"
    :class="{your : isYour,
    selected : isSelected}"
    @click="$emit('click')"
    >
        <div class="message__wrapper"
        :class="{dark : isYour && theme == 'Dark'}"
        >
            <img src="/images/edit.png" alt="edit" class="message__edit"
            v-if="isYour"
            @click="$emit('edit',message.id)"
            >

            
            <div class="message__top">
                <div class="message__avatar"
        :style="`background-image: url('http://localhost:3001/${message.User.avatarUrl}');`">
        
                </div>
                
                <div class="message__sender">
                    {{ message.User.nickname }}
                </div>

                <div class="message__time">
                    {{ parsed_time }}
                </div>
            </div>
            <div class="message__body">
                <div class="message__text" v-html="adapted_text">
                </div>
                <div class="message__attachments" v-if="message.img">
                    <img :src="'http://localhost:3001/' + message.img">
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {mapState} from 'vuex'
import emojies from "./emojies.json"

function img(src){
    return `<img class="emoji" src="${src}">`
}

export default {
    name : "chat-message",
    props : ["message"],
        computed : {
            ...mapState({
                User : 'User',
                theme : 'theme',
                Messages : 'Messages',
                edit_id : 'Messages/edit_id'
        }), 

            parsed_time(){
                let date = new Date(this.message.time)
                let h = date.getHours()
                let m = date.getMinutes()

                if(m < 10) {
                    m = '0' + m
                }
                return `${h}:${m}`
            },

            isYour(){
                return this.User.id == this.message.User.id
            },

            isSelected(){
                return this.Messages.selected_messages.find(msg => this.message.id == msg.id) || 
                this.Messages.edit_id == this.message.id
            },

            adapted_text(){
                let text = this.message.text
                text = text.replaceAll(/\</g,'&lt;')
                text = text.replaceAll('>','&gt;')
                for(let emoji of emojies){
                    text = text.replaceAll(emoji.key,img(emoji.src))
                }
                return text
            }
        },
    }
</script>
