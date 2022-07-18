<template>

<div class="upload-file">
    <div class="upload-file__container">
        <div class="upload-file__preview">
            <img class="upload-file__image" 
            :src="img ? 'http://localhost:3001/' + img :
            'http://localhost:3001/default.jpg'
            ">
            
        </div>
        <div class="upload-file__bottom">
            <input id="file" :name="jsonKey" class="upload-file__input" type="file"
            @input="upload"
            >
            <label for="file" class="upload-file__label">Выберите файл</label>
            <span class="upload-file__filename">{{ sliced_filename }}</span>
        </div>
    </div>
</div>

</template>

<script>
export default {
    props : ['jsonKey','image'],
    data(){
        return ({
            filename : '',
            img : this.image
        })
    },
    computed : {
        sliced_filename(){
            let len = this.filename.length
            let max = 20
            return len > max ?
            "..." + this.filename.slice(len - max) :
            this.filename
        }
    },
    methods : {
        upload(e){
            let file = e.target.files[0]
            this.filename = file.name
            this.$store.dispatch("UPLOAD_FILE",file)
            .then(img => {
                this.filename = img
                this.img = img
                this.$emit('fileLoaded',img)
            })
        }
    }
}
</script>