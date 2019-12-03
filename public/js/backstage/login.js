new Vue({
    el:"#content",
    data:{
        cid:"",
        cpwd:""
    },
    methods:{
        login() {
            axios.post("http://127.0.0.1:3000/controller/clogin",`cid=${this.cid}&cpwd=${this.cpwd}`).then(function (res) {
                if (res.data.code==200){
                    location.replace("bs_forum.html")
                }
            })
        }
    }
})