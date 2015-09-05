
// 路径配置
require.config({
    paths: {
        echarts: 'http://echarts.baidu.com/build/dist'
    }
});

// 使用
require(
    [
        'echarts',
        'echarts/chart/bar' // 使用柱状图就加载bar模块，按需加载
    ],
    function (ec) {
        // 基于准备好的dom，初始化echarts图表
        var myChart = ec.init(document.getElementById('main'));

        var province_bar = ec.init(document.getElementById('province_bar'));
        var city_bar = ec.init(document.getElementById('city_bar'));
        var get_sales_bar = ec.init(document.getElementById('get_sales_bar'));
        var create_sales_bar = ec.init(document.getElementById('create_sales_bar'));
        $.ajax({url:"/statistics/sources/status",
               success: function(data){

                   var option = {
                       tooltip: {
                           show: true
                       },
                       legend: {
                           data:['数量']
                       },
                       xAxis : [
                           {
                               type : 'category',
                               data : $.map(data, function(n, i){
                              return      n["status"]
                               })
                           }
                       ],
                       yAxis : [
                           {
                               type : 'value'
                           }
                       ],
                       series : [
                           {
                               "name":"数量",
                               "type":"bar",
                               data : $.map(data, function(n, i){
                               return    n["count"]
                               })
                           }
                       ]
                   };
                   myChart.setOption(option);
               }})
        $.ajax({url:"/statistics/sources/province",
            success: function(data){

                var option = {
                    tooltip: {
                        show: true
                    },
                    legend: {
                        data:['数量']
                    },
                    xAxis : [
                        {
                            type : 'category',
                            data : $.map(data, function(n, i){
                                return      n["status"]
                            })
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value'
                        }
                    ],
                    series : [
                        {
                            "name":"数量",
                            "type":"bar",
                            data : $.map(data, function(n, i){
                                return    n["count"]
                            })
                        }
                    ]
                };
                province_bar.setOption(option);
            }})
        $.ajax({url:"/statistics/sources/city",
            success: function(data){

                var option = {
                    tooltip: {
                        show: true
                    },
                    legend: {
                        data:['数量']
                    },
                    xAxis : [
                        {
                            type : 'category',
                            data : $.map(data, function(n, i){
                                if ( n["status"]==null || n["status"] == ""){
                                    return     "无";
                                }else{
                                    return n["status"];
                                }

                            })
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value'
                        }
                    ],
                    series : [
                        {
                            "name":"数量",
                            "type":"bar",
                            data : $.map(data, function(n, i){
                                return    n["count"]
                            })
                        }
                    ]
                };
                city_bar.setOption(option);
            }})
        $.ajax({url:"/statistics/sources/create-sales",
            success: function(data){

                var option = {
                    tooltip: {
                        show: true
                    },
                    legend: {
                        data:['数量']
                    },
                    xAxis : [
                        {
                            type : 'category',
                            data : $.map(data, function(n, i){
                                if ( n["status"]==null || n["status"] == ""){
                                    return     "无";
                                }else{
                                    return n["status"];
                                }
                            })
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value'
                        }
                    ],
                    series : [
                        {
                            "name":"数量",
                            "type":"bar",
                            data : $.map(data, function(n, i){
                                return    n["count"]
                            })
                        }
                    ]
                };
                create_sales_bar.setOption(option);
            }})
        $.ajax({url:"/statistics/sources/get-sales",
            success: function(data){

                var option = {
                    tooltip: {
                        show: true
                    },
                    legend: {
                        data:['数量']
                    },
                    xAxis : [
                        {
                            type : 'category',
                            data : $.map(data, function(n, i){
                                if ( n["status"]==null || n["status"] == ""){
                                    return     "无";
                                }else{
                                    return n["status"];
                                }
                            })
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value'
                        }
                    ],
                    series : [
                        {
                            "name":"数量",
                            "type":"bar",
                            data : $.map(data, function(n, i){
                                return    n["count"]
                            })
                        }
                    ]
                };
                get_sales_bar.setOption(option);
            }})


    }
);
