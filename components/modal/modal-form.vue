<template>
    <div class="modal-form">
        <div class="modal-form__body">
            <div class="modal-form__inputs">
                
                <upload-file 
                v-if="reqImage || image" 
                :image="image" 
                @fileLoaded="setImg" 
                />

                <slot></slot>
            </div>
            <button class="modal-form__btn"
            :class="theme == 'Dark' ? 'dark' : ''"
            @click="sendForm()"
            >
                Сохранить
            </button>
        </div>
    </div>
</template>

<script>

import {mapState, mapMutations} from "vuex";
export default {
    name : "editForm",
    props : ["dispatchUrl","reqImage","image","deps"],
    data(){
        return ({
            payload : {
                photo : this.image || null,
                ...this.deps
            }
        })
    },
    computed : {
        ...mapState(['User','theme'])
    },
    methods : {

        ...mapMutations([
            "TOGGLE_MODAL"
        ]),
        async sendForm(){
            this.parseForm()

            const inputs = Array.from(document.querySelectorAll(".modal-form__inputs input"))
            .filter(item => item.type != 'file')

            for(let inp of inputs){
                if(!inp.value){
                    alert("Введите значение для поля " + inp.placeholder)
                    return
                }
            }

            let response = await this.$axios.$post(this.dispatchUrl, {
                id : this.User.id,
                payload : this.payload,
            })

            this.$emit("response",response)
            return response
        },
        parseForm(parent_node,path){
            if(path){
                let x = this.getValue(path)
                console.log(path,x)
                x[parent_node] = {}
            }
            
            let child_nodes;
            let inputs;

            if(parent_node){
                child_nodes = Array.from(document.querySelectorAll(`#${parent_node} > .node`))
                inputs = Array.from(document.querySelectorAll(`#${parent_node} > input`))
            } else {
                child_nodes = Array.from(document.querySelectorAll(`.modal-form__inputs > .node`))
                inputs = Array.from(document.querySelectorAll(`.modal-form__inputs > input`))
            }

            child_nodes = child_nodes.map(item => item.id)
            

            for (let inp of inputs){
                if(parent_node){
                    this.payload[parent_node][inp.name] = inp.value
                } else {
                    this.payload[inp.name] = inp.value
                }
            }

            for(let node of child_nodes){
                this.parseForm(node,path ? `${path}.${node}` : node)
            }
            
        },
        setImg(img){
            this.payload.photo = img
        },
        getValue(path){
            path = path.split('.')
            if(path.length == 1){
                return this.payload
            } else {
                path = path.slice(0,path.length - 2)
                return path.reduce((o,k)=>o[k],this.payload)
            }  
        }
        
    }
}
</script>