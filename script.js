let socket = io.connect()

const Messanger = {
    data() {
      return {
          theme : localStorage.getItem('theme') || 'default',
          activeBlackout : false,
          message : {
              text : '',
              imgSrc : ''
          },
          selected : 'chats',
          blackoutContent: {},
          selectedItem : {},
          searchValue : "",
          user : {
              editSeen : false,
              avatarUrl : "https://cdn0.iconfinder.com/data/icons/set-ui-app-android/32/8-512.png",
              name : "Пользователь",
              status : "Статус*",
              email : 'example@email.com',
              permission : 'guest',
              id : ''
          },
          editedUser : {},
        chats : {
            options : {
                active : true
            },
            allChats : [
                {
            id : 1,
            avatarUrl : 'https://sun9-76.userapi.com/ZGeclmvivsjkMdnMMTBFcngE1VWtlZMFnokKqQ/GLW2Wv76gZM.jpg?ava=1',
            name : 'Разработчики',
            description : 'Разрабатываем мессeнджер',
            messages : [],
            },
                {
                id : 2,
                avatarUrl : 'https://cm1.narvii.com/7113/9c1dbcec5765ef821fd3cda8e87f1f7173234739_00.jpg',
                name : 'Пользователь',
                lastMessage : 'Гыгы',
                messages : []
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
          console.log('Отправка..')
            let message = {
                  avatarUrl : this.user.avatarUrl,
                  sender : this.user.name,
                  senderId : this.user.id,
                  text : this.message.text.trim(),
                  room : this.selectedItem.id,
                  imgSrc : this.message.imgSrc
              }

        if(message.text && message.text.length < 300){
            this.newMessage = ''
            socket.emit('sendMessage',message)
            let messages = document.getElementById("messages")
            setTimeout(()=>{
            messages.scrollTo(0,messages.scrollHeight)
            },0)
        }
        this.message.text = ''
        this.message.imgSrc = ""
        document.getElementById('file').value = ''
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
          this.activeBlackout = false
      },
      uploadFile(){
          let file = document.getElementById('file').files[0]
          let reader = new FileReader()
        console.log(file.size)
          if(file){
              let promise = new Promise((resolve,reject)=>{
              reader.onloadend = () => {
              let imgSrc = reader.result
              resolve(imgSrc)
          }
          })

          promise.then(result => {
              this.message.imgSrc = result
          })
          

            reader.readAsDataURL(file)
            document.getElementById('file').value = ''
           return
          } else {
              message.imgSrc = ''
          }
      },
      test(){
        localStorage.setItem('blackTheme',!this.blackTheme)
      },
      select(chat){
        const previousRoom = this.selectedItem.id
        this.selectedItem = chat
        const currentRoom = this.selectedItem.id
        console.log(previousRoom,currentRoom)
        socket.emit('changeRoom',{
            previousRoom,currentRoom
        })
      },
      chooseTheme(theme){
        return function(){
            this.theme = theme
            document.getElementsByTagName('link')[1].href = `css/${theme}Theme.css`
            localStorage.setItem('theme',theme)
        }
      },
      chooseSetting(setting){
          switch(setting){
              case 'theme' : {
                  this.blackoutContent = {
                title : 'Выбрать тему',
                items : [
                {name : 'Стандартная',action : this.chooseTheme('default')},
                {name : 'Темная',action : this.chooseTheme('dark')},
                {name : 'Советская',action : this.chooseTheme('dark')}
                ]
                  }
              }
          }
        this.activeBlackout = true
      }
    },
    async mounted(){
        console.log(this.theme)
        let user = await fetch('/accountData')
        let res = await user.json()
        console.log(res)
        this.user.name = res.name
        this.user.id = res.id
        this.user.permission = res.permission
        this.Search()
        socket.on('addMessage',(message)=>{
            this.selectedItem.messages.push(message)
        })
        socket.on('getMessages',(data)=>{
            this.selectedItem.messages = data
        })
        let messages = document.getElementById("messages")
        messages.scrollTo(0,messages.scrollHeight)
        document.getElementsByTagName('link')[1].href = `css/${this.theme}Theme.css`
        document.addEventListener('keydown',(e)=>{
            switch(e.code){
                case 'Escape' : {
                    this.activeBlackout = false
                }
            }
        })
    }
  }

 Vue.createApp(Messanger).mount('#app')
