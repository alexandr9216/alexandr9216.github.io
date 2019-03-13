(function () {
    //'use strict';

    // Your code here...


    var html_block_result_preview = '' +
        '<div id="block_result_preview">' +
            '<div class="brp_title"><textarea style="width:100%; height: 56px;"></textarea></div>'+
            '<div class="brp_images"></div>'+
            '<div class="brp_price"></div>'+
            '<div class="brp_var_attr"></div>'+
            '<div class="brp_desc_attr"></div>'+
            '<div class="brp_desc_content"></div>'+
        ''+
    '';

    //$('body').prepend(html_block_result_preview);

    var modal = ''+
        '<div id="ex1" class="modal">'+
        '<p>'+ html_block_result_preview +'</p>'+
        '<a href="#" rel="modal:close">Close</a>'+
        '</div>'+
        '';
    $('body').prepend(modal);



    var title = $("#J_DetailMeta .tb-detail-hd h1").text();
    var title_desc = $("#J_DetailMeta .tb-detail-hd .newp").text();

    var html = '<div id="wolf-block-taobao" style="padding:20px 20px; border-bottom:10px solid red">' +
        '<h1>' + title + '</h1>' +
        //'<img src="' + arr_gallery_image[0] + '" width="100" />' +
        '<button id="start-test-wolf" type="button">---[ TEST ]---</button>' +
        '<p><a href="#ex1" rel="modal:open">Open Modal</a></p>'+
        '</div>';

    $('body').prepend(html);

    //GM_log(image);
    //GM_download('http://img.alicdn.com/imgextra/i4/688058032/TB2B0DdmGSWBuNjSsrbXXa0mVXa_!!688058032-0-item_pic.jpg_430x430q90.jpg', 'wolf.jpg');

    //TShop.Setup({'a':'1'});
    //GM_log(document);
    /*$('#J_LinkBuy').click(function(){
     alert('Вы нажали на элемент "J_LinkBuy"');
     });*/
    //$('#J_LinkBuy').trigger('click');

    //click
    //-------------------------------------------------------------------------
    $('body').on('click', '#wolf-block-taobao #start-test-wolf', function (e) {

        $('#block_result_preview textarea').val( get_product_title() );

        arr_gallery_image = get_gallery_image();
        GM_log(arr_gallery_image);

        arr_gallery_image.forEach(function(item, i, arr_gallery_image) {
            //alert( i + ": " + item + " (массив:" + arr + ")" );
            $('#block_result_preview .brp_images').prepend('<img src="'+ item +'" />');
        });



        //get_product_option();
        //get_product_option_sku_map_price();
        //get_product_spec();
        //get_product_detail();
        //get_desc_content();

        //get_link_video();

        //alert('20509:28317');
        //GM_log($('#J_DetailMeta').html());

    });



    //Заголовок продукта
    function get_product_title() {
        var title = $("#J_DetailMeta .tb-detail-hd h1").text().trim();
        var title_desc = $("#J_DetailMeta .tb-detail-hd .newp").text();
        return title;
    }



    // вкладка - [Детали продукта]
    function get_product_detail() {
        var arr_product_detail = [];
        $("#attributes #J_AttrList #J_AttrUL").find('li').each(function (indx, element) {
            var name = $(element).text();
            var i_str = name.indexOf(':');
            name = (i_str === -1) ? name : name.substring(0, i_str);

            var val = $(element).attr('title');
            arr_product_detail.push({'name': name, 'val': val});
        });

        console.log(arr_product_detail);
    }


    //вкладка - [спецификации] (самое полное описание)
    function get_product_spec() {
        var product_spec = $("#J_Detail #J_Attrs table.tm-tableAttr tbody");//вкладка - [спецификации] (самое полное описание)
        if (product_spec.length !== 0) {//если нет [спецификации], то
            var arr_product_spec = [], i = 0;
            $(product_spec).find('tr').each(function (indx, element) {
                if ($(element).hasClass('tm-tableAttrSub')) {
                    i++;
                    //console.log($(element).text());
                    var name = $(element).text();
                    arr_product_spec[i] = {};
                    arr_product_spec[i]['name'] = name;
                    arr_product_spec[i]['sub'] = [];
                } else {
                    var sub_name = $(element).find('th').text();
                    var sub_val = $(element).find('td').text();

                    arr_product_spec[i]['sub'].push({'sub_name': sub_name, 'sub_val': sub_val});
                }

            });

        }

        console.log(arr_product_spec);
    }


    //Нижнее описание товара -------------
    function get_desc_content() {
        var $desc_content = $.parseHTML($('#description .content').html());
        $($desc_content).find('img').each(function (indx, element) {
            //alert( $(element).attr('src') );
            //$(element).attr('src', 'TEST_'+$(element).attr('src') );
            var img_lazyload = $(element).attr('data-ks-lazyload');
            if (img_lazyload !== undefined) {
                $(element).attr('src', 'TEST_' + img_lazyload);
            }
        });

        GM_log($($desc_content).html());
    }


    //Получаем галерею картинок в нужном размере:
    function get_gallery_image() {
        var arr_gallery_image = [];
        $("#J_DetailMeta #J_UlThumb img").each(function (indx, element) {
            var image_url = $(element).attr('src');

            arr_gallery_image.push(
                fix_image(image_url)
            );

        });

        return arr_gallery_image;

    }


    //Получаем Опции:
    function get_product_option() {
        var arr_option = [];
        var id_option = 0;
        $("#J_DetailMeta .tb-property .tb-sku .tm-sale-prop").each(function (indx, element) {

            var name_option = $(element).find('.tb-metatit:first').text();//название опции

            var arr_option_val = [];
            $(element).find('ul.J_TSaleProp li').each(function (indx2, element2) {
                var name_val = $(element2).find('a > span:first').text();//название значения опции

                var id_option_val = $(element2).attr('data-value');//id taobao в формате: "опция:значение_опции"
                id_option_val = id_option_val.split(':');//превращаем в массив: [0] - id опции, [1] - id значения опции

                id_option = id_option_val[0];//-id опции
                var id_val = id_option_val[1];//-id значения опции

                //получаем картинку значения опции
                //пример: background:url(//img.alicdn.com/imgextra/i3/1057896752/TB25DHfviMnBKNjSZFoXXbOSFXa_!!1057896752.jpg_40x40q90.jpg) center no-repeat;"
                var image_val = $(element2).find('a:first').attr('style');//match(/background\s*[:]\s*url\s*[(]\s*([^\'\"\)\(]+)\s*[)]/i);

                if (image_val !== undefined) {
                    image_val = image_val.match(/background\s*[:]\s*url\s*[(]\s*([^\'\"\)\(]+)\s*[)]/i);
                    if (image_val !== null) {
                        image_val = fix_image(image_val[1]);
                    }
                    //console.log(image_val);
                }

                image_val = (image_val === undefined || image_val === null) ? '' : image_val;

                arr_option_val[indx2] = {
                    'name_val': name_val,
                    'id_val': id_val,
                    'image_val': image_val
                };

            });

            arr_option[indx] = {
                'name_option': name_option,
                'id_option': id_option,
                'val_option': arr_option_val
            };

        });

        GM_log(arr_option);

    }


    //Получаем Цены (с разными комбинациями опций):
    function get_product_option_sku_map_price() {

        //Получаем список цен с id вариций опций (но без указания скидок)
        var sku_map = $('body').text();
        //Ищем: "skuMap":{ ... } рег.выражение:
        var reg = new RegExp('"skuMap"[\s]*:[\s]*[{][A-Za-z0-9\s;:.,\{\}"]+"[\s]*[}][\s]*[}]', 'ig');
        var result = sku_map.match(reg);
        result = JSON.parse('{' + result[0] + '}');
        //GM_log(result);

        //кликаем по всем вариантам опций по очередно, чтобы узнать скидку
        var i = -1;
        var length_skuMap = Object.keys(result.skuMap).length;
        var interval_time = 300;
        //alert(length_skuMap);
        for (var key in result.skuMap) {
            i++;
            var key_orig = key;
            key = (key[0] == ';') ? key.substring(1, key.length) : key;
            key = (key[key.length - 1] == ';') ? key.substring(0, key.length - 1) : key;

            var arr_id = key.split(';');

            start(arr_id, key_orig);
            function start(arr_id, key_orig) {
                setTimeout(function run_timer() {

                    var out_of_stock = false;
                    arr_id.forEach(function (item, i, arr_id) {
                        //GM_log('#J_DetailMeta [data-value="'+ item +'"]');
                        var $_item_id = $('#J_DetailMeta [data-value="' + item + '"]');

                        if (!$_item_id.hasClass('tb-selected')) {
                            $_item_id.find('a')[0].click();
                        }

                        if ($_item_id.hasClass('tb-out-of-stock')) {
                            out_of_stock = true;
                        }

                    });


                    var price = $('#J_StrPriceModBox .tm-price').text();
                    price = (out_of_stock) ? 'out_of_stock' : price;
                    var promo_price = $('#J_PromoPrice .tm-price').text();
                    //alert('price: '+price +'; promo_price: '+promo_price);
                    //result.skuMap[key_orig] = {};
                    result.skuMap[key_orig]['testPrice'] = price;
                    result.skuMap[key_orig]['PromoPrice'] = promo_price;


                    //console.log(arr_k[i]);
                    //$('#J_DetailMeta ul.J_TSaleProp li [data-value="'+ arr_id +'"]')
                }, interval_time * i);//через каждые 2 секунды (умножаем секунды, потому что запуск таймера происходит одноврменно для всех циклов, и для компенсации умножаем секунды. Пример: 2*1=[2], 2*2=[4], 2*3=[6])
            }

            //alert(arr_id);
        }

        setTimeout(function run_timer() {
            GM_log(result);
        }, (interval_time * length_skuMap) + 200);

    }


    //Получеам ссылку на видеописание товара если есть
    function get_link_video() {

        var video = $('#J_DetailMeta .tm-video-box video source').attr('src');//пробуем получить тег с видео

        //если нет кнопки плей, то Видео-описание отсутствует и выходим из этой функции
        if ($("#J_DetailMeta .J_playVideo").length == 0) {
            GM_log('Видео-описание отсутствует');
            return false;
        }


        if (video === undefined) {//если тега с видео нет,
            $("#J_DetailMeta .J_playVideo").trigger('click');//значит пробуем нажать на кнопку плей, чтобы динамически появился тег с видео

            var i = 0;
            setTimeout(function run_timer() {//ждем пока динамически появится тег с видео
                i = i + 100;
                //console.log('ms: ' + i);
                video = $('#J_DetailMeta .tm-video-box video source').attr('src');

                if (video !== undefined) {//если появится тег с видео, то получаем ссылку
                    GM_log('interval URL: ' + video);
                }

                if (i < 2000 && video === undefined) {//ждем до тех пор, пока не появиться, но ждем не больше 2 секунд
                    setTimeout(run_timer, 100);
                }

            }, 100);
            //если  тег с видео есть с самого начала, то получаем ссылку:
        } else {
            GM_log(video);
        }

    }


    /*Про картинки: если в url формат ".webp" в конце убираем "_.webp" или "_400x400.jpg_.webp" и получаем стандартный формат
     Чтобы получить другой размер картинки, меняем пропорционально в url например с 400x400 на 200x200
     */
    function fix_image(image_url) {
        //убераем расширение .webp в url если есть, в результате останеться .jpg
        var i_str = image_url.search(/_[.]webp/gi);
        if (i_str != -1) {
            image_url = image_url.substring(0, i_str);
        }

        //меняем размер в url
        image_url = image_url.replace(/_[0-9]+x[0-9]+q[0-9]+[.]/gi, '_600x600q90.');
        image_url = image_url.replace(/_[0-9]+x[0-9]+[.]/gi, '_600x600.');

        //добавялем http(s) в url если отсутсвует
        i_str = image_url.search(/^http[s]:*/gi);
        if (i_str == -1) {
            image_url = window.location.protocol + image_url;
        }

        return image_url;
    }


})();