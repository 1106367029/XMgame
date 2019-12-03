new Vue({
    el: ".page",
    data: {
        stra_title:"",love:"",time:"",stra_id:"",
        content1:"",img1:""
    },
    methods: {},
    created(){
        this.stra_id=location.search.slice(9);
        axios.post("http://127.0.0.1:3000/gameinfo/selstrbyid",`stra_id=${this.stra_id}`).then((res)=>{
            if (res.data.code==200){
                var result=res.data.result[0];
                this.stra_title=result.stra_title;
                this.time=new Date(result.time).toLocaleString();
                this.love=result.love;
                this.content1=result.content1;
                if (result.content5!=null){
                    if (result.picture!=null){
                        var img=result.picture.split(',');
                        $("#content").append(`<img src="${img[0]}" width="80%" style="margin-bottom: 10px">`)
                    }
                    $("#content").append(`<h4>步骤二</h4><p style="text-indent: 30px">${result.content2}</p>`);
                    if (result.picture!=null&& img[1]!=undefined){
                        for (var i=1;i<2;i++){
                            $("#content").append(`<img src="${img[1]}" width="80%" style="margin-bottom: 10px">`)
                        }
                    }
                    $("#content").append(`<h4>步骤三</h4><p style="text-indent: 30px">${result.content3}</p>`);
                    if (result.picture!=null && img[2]!=undefined){
                        for (var i=2;i<3;i++){
                            $("#content").append(`<img src="${img[2]}" width="80%" style="margin-bottom: 10px">`)
                        }
                    }
                    $("#content").append(`<h4>步骤四</h4><p style="text-indent: 30px">${result.content4}</p>`);
                    if (result.picture!=null && img[3]!=undefined){
                        for (var i=3;i<4;i++){
                            $("#content").append(`<img src="${img[3]}" width="80%" style="margin-bottom: 10px">`)
                        }
                    }
                    $("#content").append(`<h4>步骤五</h4><p style="text-indent: 30px">${result.content5}</p>`);
                    if (result.picture!=null){
                        for (var i=4;i<img.length;i++){
                            $("#content").append(`<img src="${img[i]}" width="80%" style="margin-bottom: 10px">`)
                        }
                    }
                }
                else if (result.content4!=null){
                    if (result.picture!=null){
                        var img=result.picture.split(',');
                        $("#content").append(`<img src="${img[0]}" width="80%" style="margin-bottom: 10px">`)
                    }
                    $("#content").append(`<h4>步骤二</h4><p style="text-indent: 30px">${result.content2}</p>`);
                    if (result.picture!=null&& img[1]!=undefined){
                        for (var i=1;i<2;i++){
                            $("#content").append(`<img src="${img[1]}" width="80%" style="margin-bottom: 10px">`)
                        }
                    }
                    $("#content").append(`<h4>步骤三</h4><p style="text-indent: 30px">${result.content3}</p>`);
                    if (result.picture!=null && img[2]!=undefined){
                        for (var i=2;i<3;i++){
                            $("#content").append(`<img src="${img[2]}" width="80%" style="margin-bottom: 10px">`)
                        }
                    }
                    $("#content").append(`<h4>步骤四</h4><p style="text-indent: 30px">${result.content4}</p> `);
                    if (result.picture!=null){
                        for (var i=3;i<img.length;i++){
                            $("#content").append(`<img src="${img[i]}" width="80%" style="margin-bottom: 10px">`)
                        }
                    }
                }
                else if (result.content3!=null){
                    if (result.picture!=null){
                        var img=result.picture.split(',');
                        $("#content").append(`<img src="${img[0]}" width="80%" style="margin-bottom: 10px">`)
                    }
                    $("#content").append(`<h4>步骤二</h4><p style="text-indent: 30px">${result.content2}</p>`);
                    if (result.picture!=null && img[1]!=undefined){
                        for (var i=1;i<2;i++){
                            $("#content").append(`<img src="${img[1]}" width="80%" style="margin-bottom: 10px">`)
                        }
                    }
                    $("#content").append(`<h4>步骤三</h4><p style="text-indent: 30px">${result.content3}</p></p>`);
                    if (result.picture!=null){
                        for (var i=2;i<img.length;i++){
                            $("#content").append(`<img src="${img[i]}" width="80%" style="margin-bottom: 10px">`)
                        }
                    }
                }
                else if (result.content2!=null){
                    if (result.picture!=null){
                        var img=result.picture.split(',');
                        $("#content").append(`<img src="${img[0]}" width="80%" style="margin-bottom: 10px">`)
                    }
                    $("#content").append(`<h4>步骤二</h4><p style="text-indent: 30px">${result.content2}</p>`);
                    if (result.picture!=null){
                        for (var i=1;i<img.length;i++){
                            $("#content").append(`<img src="${img[i]}" width="80%" style="margin-bottom: 10px">`)
                        }
                    }
                }
                else {
                    if (result.picture!=null){
                        var img=result.picture.split(',');
                        for (var i=0;i<img.length;i++){
                            $("#content").append(`<img src="${img[i]}" width="80%" style="margin-bottom: 10px">`)
                        }
                    }
                }
            }
            else {
                console.log(res.data)
            }
        });
    }
})