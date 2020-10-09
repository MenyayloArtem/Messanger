const Messanger = {
    data() {
      return {
          blackTheme : true,
          newMessage : '',
          selected : 'chats',
          selectedItem : {},
          searchValue : "",
          user : {
              editSeen : false,
              avatarUrl : "https://cdn0.iconfinder.com/data/icons/set-ui-app-android/32/8-512.png",
              name : "Пользователь",
              status : "Статус*",
              email : 'example@email.com',
              id : Math.random()
          },
          editedUser : {},
        messages : [
            {
                avatarUrl : 'https://cm1.narvii.com/7113/9c1dbcec5765ef821fd3cda8e87f1f7173234739_00.jpg',
                sender : 'Кто-то',
                senderId : 1,
                text : 'Сообщение*'
            }
        ],
        chats : {
            options : {
                active : true
            },
            allChats : [
                {
    avatarUrl : 'https://sun9-76.userapi.com/ZGeclmvivsjkMdnMMTBFcngE1VWtlZMFnokKqQ/GLW2Wv76gZM.jpg?ava=1',
    name : 'Разработчики',
    lastMessage : 'Разрабатываем мессeнджер'.length >= 24 ? 'Разрабатываем мессeнджер'.slice(0,22) + '...' : 'Разрабатываем мессeнджер'
                },
                {
                avatarUrl : 'https://cm1.narvii.com/7113/9c1dbcec5765ef821fd3cda8e87f1f7173234739_00.jpg',
                name : 'Пользователь',
                lastMessage : 'Гыгы'
                }
            ],
            visibleChats : [

            ]
        },
        contacts : {
            options : {
                active : false
            },
           allContacts : [
            {
                avatarUrl : 'https://cm1.narvii.com/7113/9c1dbcec5765ef821fd3cda8e87f1f7173234739_00.jpg',
                name : 'Пользователь',
                lastMessage : 'Что-то',
                id : Math.random()
            }
           ],
           visibleContacts : [

           ]
      }
      }
    },
    computed : {
        // selectedItem(){
        // return this.chats.allChats[1]
        // }
    },
    methods : {
      sendMessage(){
          let message = {
                  avatarUrl : this.user.avatarUrl,
                  sender : this.user.name,
                  senderId : this.user.id,
                  text : this.newMessage.trim()
              }
        if(message.text && message.text.length < 300){
            console.log(this.selectedItem)
            this.newMessage = ''
            this.messages.push(message)
            let messages = document.getElementById("messages")
            setTimeout(()=>{
            messages.scrollTo(0,messages.scrollHeight)
            },0)
        }
      },
      Save(){
        for(let key in this.editedUser){
            this.user[key] = this.editedUser[key]
            this.user.editSeen = false
        }
      },
      Search(){
        let pattern = new RegExp(`${this.searchValue}`,'g');
        this.chats.visibleChats = this.chats.allChats.filter(item => item.name.match(pattern))
        this.contacts.visibleContacts = this.contacts.allContacts.filter(item => item.name.match(pattern))
      },
      close(){
          this.user.editSeen = false
      }
    },
    mounted(){
        this.Search()
        let messages = document.getElementById("messages")
        messages.scrollTo(0,messages.scrollHeight)
    }
  }

    
  
  Vue.createApp(Messanger).mount('#app')
