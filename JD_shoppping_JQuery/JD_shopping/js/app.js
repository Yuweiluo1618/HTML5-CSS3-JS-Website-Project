/*
 1. 鼠标移入显示,移出隐藏
 目标: 手机京东, 客户服务, 网站导航, 我的京东, 去购物车结算, 全部商品
 2. 鼠标移动切换二级导航菜单的切换显示和隐藏
 3. 输入搜索关键字, 列表显示匹配的结果
 4. 点击显示或者隐藏更多的分享图标
 5. 鼠标移入移出切换地址的显示隐藏
 6. 点击切换地址tab

 7. 鼠标移入移出切换显示迷你购物车
 8. 点击切换产品选项 (商品详情等显示出来)

 9. 点击向右/左, 移动当前展示商品的小图片
 10. 当鼠标悬停在某个小图上,在上方显示对应的中图
 11. 当鼠标在中图上移动时, 显示对应大图的附近部分区域
 
 */

$(function(){

    show_hide();
    hover_sub_menu();
    search();
    share();
    address();
    shift_address_tabs();
    hover_minicart();
    click_products_tabs();
    move_min_img();
    hover_min_img();
    large_img();

    function large_img(){
        var $mask = $("#mask");
        var $mediumImg = $("#mediumImg");
        var $maskTop = $("#maskTop");
        var $largeImgContainer = $("#largeImgContainer");
        var $loading = $("#loading");
        var $largeImg = $("#largeImg");
        var mask_width = $mask.width();
        var mask_height = $mask.height();
        var m_pic_width = $maskTop.width();
        var m_pic_height = $maskTop.height();
        

        $maskTop.hover(function(){
            $mask.show();
            $largeImgContainer.show();
            var src = $mediumImg.attr("src").replace("-m", "-l");
            $largeImg.attr("src", src);

            $largeImg.on("load", function(){
                var l_pic_width = $largeImg.width();
                var l_pic_height = $largeImg.height();
                $largeImgContainer.css({"width": l_pic_width/2, "height": l_pic_height/2});
                $loading.hide();
                $largeImg.show();
                $maskTop.mousemove(function(event){
                    var left = 0;
                    var top = 0;
                    var event_x = event.offsetX;
                    var event_y = event.offsetY;

                    left = event_x - mask_width/2;
                    top = event_y - mask_height/2;



                    if(left <= 0){
                        left = 0;
                    }else if(left > m_pic_width - mask_width){
                        left = m_pic_width - mask_width;
                    }

                    if(top <= 0){
                        top = 0;
                    }else if(top > m_pic_height - mask_height){
                        top = m_pic_height - mask_height;
                    }
                    
                    $mask.css({"left": left, "top": top});

                    left =  left * (l_pic_width/m_pic_width);
                    top = top * (l_pic_height/l_pic_height);
                    $largeImg.css({"left": -left, "top": -top});

                });
            });
        }, function(){
            $mask.hide();
            $largeImgContainer.hide();
        });

    }

    function hover_min_img(){
        $("#icon_list > li").hover(function(){
            $(this).children().addClass("hoveredThumb");
            var src = $(this).children().attr("src").replace(".jpg", "-m.jpg");
            $("#mediumImg").attr("src", src);

        }, function(){
            $(this).children().removeClass("hoveredThumb");
        })
    }

    function move_min_img(){
        var $as = $("#preview > h1 > a");
        var $backward = $as.first();
        var $forward = $as.last();
        var $ul = $("#icon_list");
        var $img_list = $ul.children();
        var li_width = $img_list.first().width();
        var SHOW_COUNT = 5;
        var img_count = $img_list.length;
        var move_count = 0;
        
        if($img_list.length > SHOW_COUNT){
            $forward.attr("class", "forward");
        }

        $forward.click(function(){
            if(img_count - move_count === SHOW_COUNT){
                return;
            }
            move_count++;
            $backward.attr("class", "backward");
            if(img_count - move_count === SHOW_COUNT){
                $forward.attr("class", "forward_disabled");
            }
            $ul.css("left", -move_count*li_width);
        });

        $backward.click(function(){
            if(move_count === 0){
                return;
            }
            move_count--;
            $forward.attr("class", "forward");
            if(move_count === 0){
                $backward.attr("class", "backward_disabled");
            }
            $ul.css("left", -move_count*li_width);
        });

        


    }

    function click_products_tabs(){
        $("#product_detail > ul > li").click(function(){
            $("#product_detail > ul > li").removeClass("current");
            this.className = "current";
            var index = $(this).index();
            $("#product_detail > div:gt(0)").hide();
            $("#product_detail > div:gt(0)").eq(index).show();

        });
    }

    function hover_minicart(){
        $("#minicart").hover(function(){
            this.className = 'minicart';
            $(this).children(":last").show();
        }, function(){
            this.className = '';
            $(this).children(":last").hide();
        });
    }

    function shift_address_tabs(){
        $("#store_tabs > li").click(function(){
            $("#store_tabs > li").removeClass("hover");
            this.className = "hover";
        });
    }

    function address(){
        var $store_select = $("#store_select");
        $store_select
        .hover(function(){
            $(this).children(":gt(0)").show();
        }, function(){
            $(this).children(":gt(0)").hide();
        })
        .children(":last")
        .click(function(){
            $store_select.children(":gt(0)").hide();
        });
    }

    function share(){
        var isOpen = false;
        var $shareMore = $("#shareMore");
        var $parent = $shareMore.parent();
        var $a_list = $shareMore.prevAll("a:lt(2)");
        var $b = $shareMore.children();

        $shareMore.click(function(){
            
            if(isOpen){
                $parent.css("width", 155);
                $a_list.hide();
                $b.removeClass("backword");
            }else{
                $parent.css("width", 200);
                $a_list.show();
                $b.addClass("backword");
            }

            isOpen = !isOpen;
        });

    }

    function search(){
        $("#txtSearch")
        .on("focus keyup", function(){
            var content = $(this).val().trim();
            if(content){
                $("#search_helper").show();
            }
        })
        .blur(function(){
            $("#search_helper").hide();
        })
    }
    
    
    function show_hide(){
        $("[name=show_hide]").hover(function(){
            var id = this.id+"_items";
            $("#"+id).show();
        }, function(){
            var id = this.id+"_items";
            $("#"+id).hide();
        });
    }

    
    function hover_sub_menu(){
        $("#category_items > div").hover(function(){
            $(this).children(":last").show();
        }, function(){
            $(this).children(":last").hide();
        })
    }
});