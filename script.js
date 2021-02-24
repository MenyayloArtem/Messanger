let socket = io.connect()

const Messanger = {
    data() {
      return {
          theme : localStorage.getItem('theme') || 'default',
          loadedImg : null,
          modal : false,
          editMode : false,
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
              nickname : "Пользователь",
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
        edit(){
            return this.user
        }
    },
    methods : {
      sendMessage(){
            let message = {
                  avatarUrl : this.user.avatarUrl.split('/')[1],
                  sender : this.user.nickname,
                  senderId : this.user.id,
                  text : this.message.text.trim(),
                  room : this.selectedItem.id,
                  imgSrc : this.message.imgSrc
              }

              console.log(message)
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
        document.getElementById('inputFile').value = ''
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
          this.modal = false
      },
      uploadFile(id,to,mode){
          let file = document.getElementById(id).files[0]
          let reader = new FileReader()
          var result = null
          if(file){
            reader.onloadend = () => {
            var result = reader.result
            if(mode == 'default'){
                document.getElementById(to).src = result
            } else {
                this.message.imgSrc = result
            }
          }
            reader.readAsDataURL(file)
          } else {
              result = null
          }
      },
      test(){
        localStorage.setItem('blackTheme',!this.blackTheme)
      },
      select(chat){
        if(this.selectedItem){
            const previousRoom = this.selectedItem.id
        this.selectedItem = chat
        const currentRoom = this.selectedItem.id
        socket.emit('changeRoom',{
            previousRoom,currentRoom
        })
        }
      },
      chooseTheme(theme){
        return function(){
            this.theme = theme
            document.getElementsByTagName('link')[1].href = `css/${theme}Theme.css`
            localStorage.setItem('theme',theme)
        }
      },
      newContact(){
        let userId = this.user.id
        let contactId = 1
        socket.emit('addContact',{
            userId,contactId
        })
      },
      chooseSetting(setting){
          switch(setting){
              case 'theme' : {
                this.blackoutContent = {
                title : 'Выбрать тему',
                items : [
                {name : 'Стандартная',action : this.chooseTheme('default')},
                {name : 'Темная',action : this.chooseTheme('dark')}
                ],
                images : false
                }
              }
        break
          case 'edit' : {
            this.editMode = true
          }
          }
          
        this.modal = true
      },
      editUser(){
          let form = document.getElementById('x')
          let formData = new FormData(form)
          if(!(formData.get('editImg').size)){
              formData.append('editImg',this.user.avatarUrl.split('/')[1])
          }
          fetch('edit',{
              method : 'post',
              body : formData
          })
      }
    },
    async mounted(){
        let user = await fetch('/accountData')
        let res = await user.json()
        res[0] = res[0][0]
        this.user = res[0]
        console.log(res)
        document.getElementsByTagName('link')[1].href = `css/${this.theme}Theme.css`
        this.user.avatarUrl = 'avatars/' + this.user.avatarUrl
        if(res[1]){
            this.chats.allChats = res[1]
            this.select(this.chats.allChats[0])
        } else {
            this.chats.allChats = []
        }
        this.Search()
        socket.on('addMessage',(msg)=>{
            let message = msg
            message.text = message.text.replace(/xD/gi,'<img src="images/smile.png">')
            this.selectedItem.messages.push(message)
        })
        socket.on('getMessages',(data)=>{
            let messages = data
            messages.map(item => {
                item.text = item.text.replace(/xD/gi,`<img class="smile" src="images/smile.png">`)
            })
            this.selectedItem.messages = data
        })
        socket.on('newContact',(data)=>{
            
            this.chats.allChats.push(data)
            console.log(data,this.chats.allChats)
        })
        let messages = document.getElementById("messages")
        messages.scrollTo(0,messages.scrollHeight)
        document.getElementsByTagName('link')[1].href = `css/${this.theme}Theme.css`
        document.addEventListener('keydown',(e)=>{
            switch(e.code){
                case 'Escape' : {
                    this.modal = false
                }
            }
        })
    }
  }

 Vue.createApp(Messanger).mount('#app')
