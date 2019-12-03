new Vue({
    el: ".page",
    data: {
        title:"",time:"",newid:"",content:""
    },
    methods: {},
    created(){
        this.newid=location.search.slice(7);
        axios.post("http://127.0.0.1:3000/gameinfo/selnewbyid",`ginfo_id=${this.newid}`).then((res)=>{
            if (res.data.code==200){
                var result=res.data.result[0];
                this.title=result.title;
                this.time=new Date(result.time).toLocaleString();
                this.content=result.content;
                var img=result.img.split(",");
                if (img!=null){
                    for (var i=0;i<img.length;i++){
                        $(".page-description").after(`<img src="${img[i]}" style="margin-bottom: 15px">`);
                    }
                }
                console.log(result.img);
            }else {
                console.log(res.data)
            }
        });
    }
})