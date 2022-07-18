<template>
  <div class="app">

   <modal>
        <edit-user />
        <create-chat />
        <chat-info />
        <set-theme />
   </modal>

  <aside class="menu" :class="theme == 'Dark' ? 'dark' : ''">

    <div class="menu__top">

        <!-- Информация о пользователе -->

        <div class="menu__user">
            <div class="menu__user-avatar"
            :style="`background-image: url('http://localhost:3001/${User.avatarUrl}');`">
            </div>
            <div class="menu__user-info">
                <div class="menu__user-name">
                    {{ User.nickname }}
                </div>
                <div class="menu__user-status">
                    {{ User.status }}
                </div>
            </div>
            <div class="menu__user-edit">
                <img src="/images/edit.png" alt="edit"
                @click="TOGGLE_MODAL('edit-user')">
            </div>
        </div>

        <!-- Навигация -->


        <div class="menu__row">
            <div class="menu__item" 
            :class="{active : selected_menu == 'chats'}"
            @click="SELECT_MENU('chats')">
                <img src="/images/messages.png" alt="users">
            </div>

            <div class="menu__item" 
            :class="{active : selected_menu == 'friends'}"
            @click="SELECT_MENU('friends')">
                <img src="/images/friends.png" alt="users">
            </div>

            <div class="menu__item"
            :class="{active : selected_menu == 'search'}"
            @click="SELECT_MENU('search')">
                <img src="/images/dial.png" alt="dial">
            </div>

            <div class="menu__item"
            :class="{active : selected_menu == 'settings'}"
            @click="SELECT_MENU('settings')">
                <img src="/images/settings.png" alt="settings">
            </div>
        </div>

        <div class="menu__search">
            <input v-if="selected_menu == 'search'" type="text"
            v-model="search_user"
            @keyup.enter="searchUsers(search_user)"
            placeholder="Введите имя">
            <input v-else type="text" placeholder="Поиск" v-model="menu_search">
        </div>

    </div>

    <div class="menu__content">

    <div v-if="selected_menu == 'chats'">
    <ul class="menu__list">
        <chat-item
        v-for="chat in founded_items"
        :key="chat.id"
        :chat="chat"
        @click="selectChat"
        />
    </ul>
        

        <div class="add-new">
            <button class="add-new__btn">
                Создать беседу 
            </button>
            <img class="add-new__icon" src="/images/add.png" alt="add"
            @click="TOGGLE_MODAL('create-chat')"
        ></div>
    </div>

    <div v-if="selected_menu == 'friends'">

    <div class="dropdown-wrapper">
        <dropdown 
        :allValues="Dropdown.friends.values"
        :field="'friends'"
        />
    </div>
        

        <ul class="menu__list">
            <friend-item
            v-for="friend in founded_items"
            :key="friend.id"
            :friend="friend"
            />
        </ul>
    </div>

    <div v-if="selected_menu == 'search'">
        <ul class="menu__list">
            <user-item
            v-for="user in Menu.items"
            :key="user.id"
            :user="user"
            />
        </ul>
    </div>

    <div v-if="selected_menu == 'settings'">
        <div class="setting"
        @click="TOGGLE_MODAL('set-theme')">
            <div class="setting__name">
                Тема
            </div>
            <div class="setting__value">
                {{ theme }}
            </div>
        </div>
    </div>

    <div class="menu__btn exit"
    @click="exit">
        <div class="menu__btn-icon">
            <img class="menu__btn-img" src="/images/exit.png" alt="exit">
        </div>
        <div class="menu__btn-text">
            Выйти
        </div>
    </div>
      
    </div>
  </aside>


    <main class="chat">

        <!-- Информация о чате -->

        <div class="chat__header">
            <div class="selected-messages" v-if="Messages.selected_messages.length">
                <div class="selected-messages__counter">
                    Выбрано: {{ Messages.selected_messages.length }}
                </div>

                <div class="selected-messages__actions">
                    <img class="selected-messages__action"
                    src="/images/dark-delete.png" alt="close"
                    v-if="Messages.selected_messages.every(msg => msg.user_id == User.id)"
                    @click="deleteMessages()"
                    >
                    <img class="selected-messages__action"
                    src="/images/dark-close.png" alt="close"
                    @click="CLEAR_SELECTED_MESSAGES()"
                    >
                </div>
            </div>

            
            

            <div class="chat__header-block" v-if="!Messages.selected_messages.length">
                <div class="chat__info"  >
                <div class="chat__avatar">
                    <img :src="api + Chat.info.avatarUrl" alt="">
                </div>
                <div class="chat__column">
                    <div class="chat__title">
                        {{ Chat.info.name }}
                    </div>
                    <div class="chat__subtitle">
                        {{ Chat.info.description }}
                    </div>
                </div>

                
            </div>
            <div class="chat__invite"
                @click="TOGGLE_MODAL('chat-info')"
                >Пригласить</div>
            </div>
            

            
        </div>
        
        <div class="chat__messages">

            <message 
            v-for="message in Messages.messages"
            :key="message.id"
            :message="message"
            @click="TOGGLE_MESSAGE({
                id : message.id,
                user_id : message.User.id
            })"
            @edit="openMessage(message.id)"
            />

        </div>

        <div class="chat__bottom">

        <div class="emojies"
        v-if="show_emojies"
        >
            <img
            v-for="emoji of emojies"
            :src="emoji.src" 
            :key="emoji.key"
            :alt="emoji.key"
            @click="new_message.text += emoji.key"
            class="emoji">
            <div class="decoration"></div>
        </div>

        <div class="new-message">

            <div class="new-message__edit" v-if="message_mode == 'edit'">
                Редактирование сообщения
                <img src="/images/dark-close.png" alt="close"
                @click="closeMessage()"
                >
            </div>

            <div class="new-message__attachments">
                <div class="new-message__attachment-wrapper" v-if="new_message.img">

                    <img class="new-message__attachment" 
                    :src="`http://localhost:3001/${new_message.img}`">
                    <img class="new-message__close-attachment" 
                    src="/images/close.png" alt="close"
                    @click="new_message.img = ''"
                    >
                </div>
            </div>

            <div class="new-message__block">

            <input type="text" class="new-message__input" 
            v-model="new_message.text" 
            @keyup.enter="messageEvent()"
            placeholder="Сообщение" />

            <div class="new-message__deps">
            <div class="new-message__action emoji">
                <img src="/images/emoji.png" alt="emoji"
                @click="show_emojies = !show_emojies"
                >
            </div>
            <div class="new-message__action clip">
                <img src="/images/clip.png" alt="clip">
                <input type="file" id="attachment" name="photo">
            </div>
            <div class="new-message__action send" @click="messageEvent()">
                <img v-if="theme == 'Dark'" src="/images/paper-plane-dark.png" alt="send">
                <img v-else src="/images/paper-plane.png" alt="send">

            </div>
            </div>

        </div>
        </div>
        </div>
    </main>

  </div>
</template>

<script>
import {mapState, mapMutations, mapActions, mapGetters} from 'vuex'
import Message from '~/components/message/message.vue'
import Modal from '~/components/modal/modal.vue'
import chatItem from '~/components/menu-items/chat-item.vue'
import friendItem from '~/components/menu-items/friend-item.vue'
import userItem from '~/components/menu-items/user-item.vue'
import createChat from '~/components/modal/content/create-chat.vue'
import editUser from '~/components/modal/content/edit-user.vue'
import setTheme from '~/components/modal/content/set-theme.vue'
import chatInfo from '~/components/modal/content/chat-info.vue'
import dropdown from "~/components/dropdown.vue"
import chat from "~/mixins/chat.js"
import messages from '~/mixins/messages'
import emojies from "~/components/message/emojies.json"
import initUser from '~/middleware/initUser'
import socket from "~/mixins/socket.js"

export default {
  components: { Message, Modal, 

    createChat,
    editUser,
    setTheme,
    chatInfo,
    dropdown,
    chatItem,
    friendItem,
    userItem,
},
  name: 'IndexPage',
  data(){
      return ({
          offset : 0,
          search_user : '',
          show_emojies : false,
          menu_search : '',
          emojies : emojies
      })
  },
    mixins : [chat,messages,socket],
    middleware : [initUser],
computed : {
    ...mapState({
        User : 'User',
        Chat : "Chat",
        Menu : "Menu",
        Messages : "Messages",
        Dropdown : "Dropdown",
        modals : "modals",
        theme : "theme",
        api : 'api',
    }),

    friends_list(){
        return this.Dropdown.friends.selected.value
    },

    selected_ids(){
        return this.Messages.selected_messages.map(item => item.id)
    },

    selected_menu(){
        return this.$store.state.Menu.selected_menu
    },

    // selected_chat(){
    //     let data = this.Chat.info
    //     return {
    //         id : (data.id ? data.id : null),
    //         name : (data.name ? data.name : null),
    //         description : (data.description ? data.description : null),
    //         avararUrl : (data.avararUrl ? data.avararUrl : null)
    //     }
    // },

    founded_items(){
        let keys = {
            'chats' : 'name',
            'friends' : "nickname"
        }
        let key = keys[this.selected_menu]
        return this.Menu.items.filter(item => item[key].match(this.menu_search))
    }
  },

  methods : {
      ...mapMutations({
        TOGGLE_MODAL : "TOGGLE_MODAL",
        SET_THEME : "SET_THEME",
        TOGGLE_MESSAGE : 'Messages/TOGGLE_MESSAGE',
        CLEAR_SELECTED_MESSAGES : 'Messages/CLEAR_SELECTED_MESSAGES',
        SET_EDIT : "Messages/SET_EDIT",
        SELECT_MENU : "Menu/SELECT_MENU",
        SET_ITEMS : "Menu/SET_ITEMS",
        SET_CHAT : "Chat/SET_CHAT"
      }),
      ...mapActions({
        SELECT_CHAT : "Chat/SELECT_CHAT",
        FETCH_MESSAGES : "Messages/FETCH_MESSAGES",
        SEARCH_USER : "User/SEARCH_USER",
        FETCH_USER : "User/FETCH_USER",
        FETCH_CHATS : "Chat/FETCH_CHATS",
        FETCH_FRIENDS : "User/FETCH_FRIENDS",
      }),


      exit(){
        localStorage.setItem('user_id','')
        document.location = "/auth"
      },


    searchUsers(text){
        this.SEARCH_USER(text)
        .then((data) => this.SET_ITEMS(data))
    },


      selectCategory(category,value){
        if(this[category]){
            this[category] = value
        } else {
            console.error(`Не существует категории ${category}`)
        }
      },

    scrollToBottom(){
        setTimeout(()=>{
            let chat_el = document.querySelector('.chat__messages')
            chat_el.scrollTo(0,chat_el.scrollHeight)
        },50)
    }
  },
    watch : {
        friends_list(list){
            console.log(list)
            this.SET_ITEMS(this.User.friends[list])
        },

        selected_menu(menu){
            let data = {
                'chats' : this.Chat.chats,
                'friends' : this.User.friends[this.friends_list],
                'search' : []
            }

            this.SET_ITEMS(data[menu])
        },

        Chat(chat) {
            setTimeout(()=>{
                this.socket.emit('setRoom',this.Chat.info.id)
            },500)
        }
    },

async mounted(){
    let el = document.querySelector("#attachment")
    el.onchange = () => {
        this.$store.dispatch("UPLOAD_FILE",el.files[0])
        .then(res => {
            this.new_message.img = res
        })
    }

    let chat_el = document.querySelector(".chat__messages")
    
    chat_el.addEventListener('wheel',(e)=>{
        if(chat_el.scrollTop < 100){

            this.offset += 10
            this.FETCH_MESSAGES({
                room : this.Chat.info.id,
                offset : this.offset
            })
            
        }
    })

    this.socket.on('addMemberBack',(res) => console.log(res))
    this.socket.on('getInvation',(res) => console.log(res))


    this.scrollToBottom()
  }
}
</script>

<style lang="scss">
  @import "assets/scss/index.scss";
</style>
