export default {
    data(){
        return ({
            new_message : {
                img : '',
                text : ''
            },
            message_mode : 'send',
        })
    },
    methods : {
        messageEvent(){
            switch(this.message_mode){
                case 'send' : return this.sendMessage()
                case 'edit' : return this.editMessage()
            }
          },
    
          sendMessage(){
            let {nickname,id,avatarUrl} = this.User
              if(this.new_message.text){
                this.socket.emit('sendMessage',{
                    ...this.new_message,
                    User : {
                      nickname,
                      id,
                      avatarUrl
                    },
                    room : this.Chat.info.id
                })
                this.new_message.text = ''
                this.new_message.img = ''
              }
              this.scrollToBottom()
          },
    
          editMessage(){
            if(this.new_message.text){
                this.socket.emit('editMessage',{
                    id : this.edit_id,
                    user_id : this.User.id,
                    new_message : {
                        ...this.new_message
                    }
                })
                this.closeMessage()
              }
          },
    
          deleteMessages(){
            let n = confirm(`Удалить ${this.selected_ids.length} сообщения?`)
            if(n){
                this.socket.emit('deleteMessages',{
                    user_id : this.User.id,
                    messages : this.selected_ids
                })
                this.CLEAR_SELECTED_MESSAGES()
            }
          },

          openMessage(id){
            this.SET_EDIT(id)
            setTimeout(()=>{
                this.CLEAR_SELECTED_MESSAGES()
            },0)
            this.message_mode = 'edit'
            let message = this.Messages.messages.find(item => item.id == id)
            this.new_message.text = message.text
            this.new_message.img = message.img
          },
    
          closeMessage(){
            this.message_mode = 'send'
            this.new_message.text = ''
            this.new_message.img = ''
            this.SET_EDIT(null)
          },
    }
}