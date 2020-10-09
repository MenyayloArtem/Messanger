const Messanger = {
    data() {
      return {
          blackTheme : true,
          newMessage : '',
          selected : 'chats',
          user : {
              avatarUrl : "https://cdn0.iconfinder.com/data/icons/set-ui-app-android/32/8-512.png",
              name : "Пользователь",
              status : "Статус*",
              auth : true // Чтобы не появлялась менюшка авторизации поставь тут true
          },
        messages : [
            {
                avatarUrl : 'https://cm1.narvii.com/7113/9c1dbcec5765ef821fd3cda8e87f1f7173234739_00.jpg',
                sender : 'Кто-то',
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
                lastMessage : 'Что-то'
            }
           ]
      }
      }
    },
    methods : {
      sendMessage(){
          let message = {
                  avatarUrl : this.user.avatarUrl,
                  sender : this.user.name,
                  text : this.newMessage.trim()
              }
        if(message.text && message.text.length < 300){
            this.newMessage = ''
            this.messages.push(message)
            let messages = document.getElementById("messages")
            setTimeout(()=>{
            messages.scrollTo(0,messages.scrollHeight)
            },0)
        }
      },
      Login(){
        if(!(this.user.avatarUrl)){
            this.user.avatarUrl = "https://cdn0.iconfinder.com/data/icons/set-ui-app-android/32/8-512.png"
        }
        if(this.user.name){
            this.user.auth = true
        }   
      }
    },
    mounted(){
        let messages = document.getElementById("messages")
        messages.scrollTo(0,messages.scrollHeight)
    }
  }

    
  
  Vue.createApp(Messanger).mount('#app')
