webpackHotUpdate(0,[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(1);
	// 路径配置
	;;

	// 使用
	!/* require */(/* empty */function() { var __WEBPACK_AMD_REQUIRE_ARRAY__ = [
	        !(function webpackMissingModule() { var e = new Error("Cannot find module \"../../bower_components/echarts/build/dist/chart\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()),
	        !(function webpackMissingModule() { var e = new Error("Cannot find module \"echarts/chart/bar\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()) // 使用柱状图就加载bar模块，按需加载
	    ]; (function (ec) {
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


	    }.apply(null, __WEBPACK_AMD_REQUIRE_ARRAY__));}());


/***/ }
])