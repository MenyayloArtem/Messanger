let socket = io.connect()

const Messanger = {
    data() {
      return {
          theme : localStorage.getItem('theme') || 'default',
          loadedImg : null,

          modal : {
              seen : false,
              option : null
          },

          editMode : false,
          message : {
              text : '',
              imgSrc : ''
          },

          selected : 'chats',
          blackoutContent: {},
          selectedItem : {},
          searchValue : "",
          searchUserValue : "",

          user : {
              editSeen : false,
              avatarUrl : "https://cdn0.iconfinder.com/data/icons/set-ui-app-android/32/8-512.png",
              nickname : "Пользователь",
              status : "Статус*",
              email : 'example@email.com',
              permission : 'guest',
              id : ''
          },

        newConv: {
            name : '',
            snbname : '',
            img : ''
        },

        chats : [],
        friends : [],

        searchedUser : null

      }
    },

    computed : {
        canInvite(){
            let friends = this.friends.slice(0)
            let members = this.selectedItem.members.map(item => item.id)
            friends = friends.filter(item => {
                return !members.includes(item.id)
            })
            return friends
        },

        visible(){
        let pattern = new RegExp(`${this.searchValue}`,'gi');
        const chats = this.chats.filter(item => item.name.match(pattern))
        const friends = this.friends.filter(item => item.nickname.match(pattern))
        return {chats,friends}
        },
        editBuffer(){
            return {
                nickname : this.user.nickname,
                status : this.user.status,
                avatarUrl : this.user.avatarUrl
            }
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
                  img : this.message.imgSrc
              }

        if(message.text && message.text.length < 30000){
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
      close(){
          this.modal.seen = false
      },

      uploadFile(id,to,mode){
          let file = document.getElementById(id).files[0]
          let reader = new FileReader()
          if(file){
            reader.onloadend = () => {
            let result = reader.result
            switch(mode){
                case 'msg' : {
                    this.message.imgSrc = result
                }
                break;
                case  'default' : {
                    document.getElementById(to).src = result
                }
            }
            // if(mode == 'default'){
            //     document.getElementById(to).src = result
            // } else {
            //     this.message.imgSrc = result
            // }
          }
            reader.readAsDataURL(file)
          } else {
              result = null
          }
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
        return () => {
            this.theme = theme
            document.getElementsByTagName('link')[1].href = `css/${theme}Theme.css`
            localStorage.setItem('theme',theme)
        }
      },

      newContact(){
        let form = document.getElementById('n')
          let fd = new FormData(form)
          let file = document.getElementById('convAvatar').files[0]
        fd.append('convIco',file)
        let x = fetch('/createContact',{
            method : 'post',
            body : fd
        })
        this.close()
        window.location.reload()
      },

      invite(user,contactId){
        socket.emit('invite',{
            user,contactId
        })
      },

      chooseSetting(setting){
          if(setting == 'other'){
                this.blackoutContent = {
                title : 'Выбрать тему',
                items : [
                {name : 'Стандартная',action : this.chooseTheme('default')},
                {name : 'Темная',action : this.chooseTheme('dark')}
                ],
                images : false
                }
          }
        this.modal.option = setting
        this.modal.seen = true
      },

      editUser(){
          let form = document.getElementById('x')
          let formData = new FormData(form)

          if(!(formData.get('editImg').size)){
              formData.append('editImg',this.user.avatarUrl.split('/')[1])
          }

          fetch('/edit',{
              method : 'post',
              body : formData
          })
          window.location.reload()
      },

    async uploadImg(){
        let file = document.getElementById('inputFile').files[0]
        let fd = new FormData()
        fd.append('uploadImg',file)
        let src = await fetch('/uploadImg',{
            method : 'post',
            body : fd
        })
        let res = await src.text()
        this.message.imgSrc = res
    },

    exit(){
        localStorage.setItem('follow','false')
        document.location.href = '/'
    },

    isFriend(id){
        return this.friends.findIndex(item => item.id == id) >= 0
    },

    getMembers(item){
        if(item.members){
            return item.members.length
        }
        return 0
    },

    async searchUser(){
        let f = await fetch('/find',{
            body: JSON.stringify({nickname : this.searchUserValue}),
            headers : {
                "Content-Type" : "application/json"
            },
            method : 'POST'
        })
        let res = await f.json()
        if(res.susses){
            this.searchedUser = res.user
        } else {
            alert('Пользователь не найден')
        }
        
    },

    doFriend(user){
        socket.emit('doFriend',{id1: this.user.id,id2 : user.id})
        this.friends.push(user)
        this.searchUserValue = ''
        this.searchedUser = null
    },
    },


    async mounted(){
        let user = await fetch('/accountData')
        let res = await user.json()
        this.user = res.user
        document.getElementsByTagName('link')[1].href = `css/${this.theme}Theme.css`
        this.user.avatarUrl = 'avatars/' + this.user.avatarUrl
        this.friends = res.friends
        if(res.convs.length){
            this.chats = res.convs
            this.select(this.chats[0])
        }

        socket.on('addMessage',(msg)=>{
            let message = msg
            message.text = message.text.replace(/xD/gi,'<img src="images/smile.png">')
            this.selectedItem.messages.push(message)
            setTimeout(()=>{
                let messagesEl = document.getElementById("messages")
                messagesEl.scrollTo(0,messagesEl.scrollHeight)
            },10)
        })
        socket.on('getMessages',(data)=>{
            let messages = data
            messages.map(item => {
                item.text = item.text.replace(/xD/gi,`<img class="smile" src="images/smile.png">`)
            })
            this.selectedItem.messages = data
            setTimeout(()=>{
                let messagesEl = document.getElementById("messages")
                messagesEl.scrollTo(0,messagesEl.scrollHeight)
            },100)
        })

        socket.on('newContact',(data)=>{
            this.chats.push(data)
        })

        socket.on('invited',(data)=>{
            this.selectedItem.members.push(data)
        })
        document.getElementsByTagName('link')[1].href = `css/${this.theme}Theme.css`
        document.addEventListener('keydown',(e)=>{
            switch(e.code){
                case 'Escape' : {
                    this.modal.seen = false
                }
            }
        })
    }
  }

 Vue.createApp(Messanger).mount('#app')
