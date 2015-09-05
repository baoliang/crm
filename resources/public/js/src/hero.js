require(["simplegrid/avalon.simplegrid"], function() {

    avalon.define("test", function(vm) {
vm.simplegrid = {
    columns: [{field: "id", text: "编号",resizable: true},
        {field: "name", text: "名称", resizable: true},
        {field: "progress", text: "进度", resizable: true},
        {field:"is_paid", text: "是否已放款"},
        {field: "op", text: "操作", resizable: true}],
    showRows: 10,
    pageable: true,
    data: [],
    renderCell: function(val, key, row) {
        switch (key) {
            case "id":
                return  "<b>" + val + "</b>"
            case "op":
                if(row.is_paid === true){
                    return  ""
                }else{
                    return  "<a href='javascript:void(0)' id='"+row.id+"' class='loan'>放款</a>"
                }

            default:
                return  "<b>" + val + "</b>"
        }
    },

    pager: {
        perPages: 10,
        totalItems: 1000,
        showPages: 5
    },
    theadRenderedCallback: function(vmodel) {
        $.ajax("/admin/get-page-campaigns/1",
            {success: function(data){

                vmodel._data = data.list;
                vmodel.pager.totalItems = data.count;
                $(".loan").on("click",function(t){
                    $.ajax("/admin/yeepay/do-loan-buy/"+t.target.id,
                        {success: function(data){
                            if(data.success == true){
                                alert("成功");
                                location.reload();
                            }else{
                                alert("放款失败");
                            }
                        }})
                });

            }});
    }

}

vm.$skipArray = ["simplegrid"];
avalon.scan();

    });


});







