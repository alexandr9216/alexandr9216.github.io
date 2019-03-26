jQuery(document).ready(function($) {
    //'use strict';

    // Your code here...


    var html_block_result_preview = '' +
        '<div id="block_result_preview">' +
            '<div class="brp_title"><textarea></textarea></div>'+
            '<div class="brp_images"></div>'+
            '<div class="brp_price"></div>'+
            '<div class="brp_var_option"></div>'+
            '<div class="brp_desc_detail"></div>'+
            '<div class="brp_desc_spec"></div>'+
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




        //1)--- Заголовок ---------------------------------
        $('#block_result_preview textarea').val( get_product_title() );

        //2)--- Галлерея изображений ---------------------------------
        $('#block_result_preview .brp_images').html('');
        var arr_gallery_image = get_gallery_image();
        GM_log(arr_gallery_image);
        arr_gallery_image.forEach(function(item, i, arr_gallery_image) {
            //alert( i + ": " + item + " (массив:" + arr + ")" );
            $('#block_result_preview .brp_images').prepend('<div class="wrap-img"><span class="btn-delete">Удалить</span><img src="'+ item +'" /></div>');
        });

        $('body').on('click', '#block_result_preview .brp_images .btn-delete', function (e) {
            $(this).closest('.wrap-img').detach();
        });





        //3) Вариативные опции ---------------------------------
        $('#block_result_preview .brp_var_option').html('');//просто очищаем заранее html блок
        $('#block_result_preview .brp_var_option').prepend('<ul class="head-option"></ul>');
        var product_var_option = get_product_var_option();//получем массив всех вариаций
        product_var_option.forEach(function(item, i, product_var_option) {//и проходимся по каждому

            //выводим html всех вариаций:
            var html = '';
            var arr_val_option = item.val_option;
            arr_val_option.forEach(function(item2, i2, arr_val_option) {

                var id_data_value = item.id_option +':'+ item2.id_val;

                var content_val = '';
                if (item2.image_val.trim() !== '') {
                    content_val = item2.image_val.trim();
                    content_val = '<div class="block-img" style="background-image: url('+content_val+');"></div>';
                } else {
                    content_val = item2.name_val;
                }

                html += '<li data-value="'+ id_data_value +'" title="'+ item2.name_val +'" >'+
                    content_val +
                    '</li>';
            });

            var li = $('#block_result_preview .brp_var_option ul.head-option').prepend(
                '<li>'+ item.name_option +
                '<ul>' + html + '</ul>' +
                '</li>'
            );


        });

        var arr_price = get_product_option_sku_map_price();//получаем массив со всеми ценами

        $('#block_result_preview .brp_var_option').on('click', 'ul ul li', function (e) {//клик по вариациям товара

            $('#block_result_preview .brp_price').html('');//просто очищаем заранее html блок цены


            if ( $(this).hasClass('active') ) {//если элемент вариации был уже выделен, то просто снимаем выделение
                $(this).closest('ul').find('li').removeClass('active');
            } else {//если еще не был выделен, то выделяем
                $(this).closest('ul').find('li').removeClass('active');
                $(this).addClass('active');

                //проверяем, все ли элементы были выделены
                var all_active = true, arr_id_active = [];
                $('#block_result_preview .brp_var_option ul.head-option > li').filter(function(index){
                    var li_active = $('li.active', this);
                    if ( li_active.length == 0 ) {
                        all_active = false;
                    } else {
                        arr_id_active.push( li_active.attr('data-value') );
                    }
                });


                if (all_active) {//Если все элементы были выделены,
                    for (var key in arr_price.skuMap) {//то в массиве цен

                        //ищем цену для этой комбинации
                        var has_skuMap_id = true, activ_skuMap_id = '';
                        arr_id_active.forEach(function(item, i, arr_id_active) {
                            if ( !~key.indexOf(';'+item+';') ) {
                                has_skuMap_id = false;
                                //break;//-не работает для forEach, либо вместо этого бросать try исключение или заменить на цикл for
                            }
                        });

                        if (has_skuMap_id) {//Если цена найдена для текущей выделенной комбинации

                            activ_skuMap_id = arr_price.skuMap[key];//получаем эту цену
                            console.log(activ_skuMap_id);

                            var html_promo_price = '';
                            var css_price = '';
                            if (activ_skuMap_id.PromoPrice !== '') {//если имеется скидка,
                                //то добавялем html скидки
                                html_promo_price = '<br><span class="hd-promo-price">Цена со скидкой:</span><span class="promo-price">'+ activ_skuMap_id.PromoPrice +'</span>';
                                css_price = 'text-decoration: line-through;';
                            }

                            //добавляем html цены
                            $('#block_result_preview .brp_price').html(
                                '<span class="hd-price">Цена:</span><span class="price" style="'+css_price+'">'+ activ_skuMap_id.price +'</span>'+
                                '<span>'+html_promo_price+'</span>'
                            );

                            break;//останавливаем поиск в цикле, так как уже найдено
                        }
                    }

                    if (!has_skuMap_id) {//Если цена НЕ найдена для текущей выделенной комбинации
                        $('#block_result_preview .brp_price').html('<span>Цена не указана</span>');
                    }

                }
            }

        });

        GM_log(product_var_option);





        //4) [ Детали продукта ] (из первой вкладки) ---------------------------------
        var product_detail = get_product_detail();
        console.log(product_detail);

        var html = '';
        product_detail.forEach(function(item, i, product_detail) {
            html += '<tr>';
                html += '<td class="detail-name">'+ item.name +  '</td>';
                html += '<td class="detail-val">'+ item.val +  '</td>';
            html += '</tr>';
        });
        html = '<table class="tab-product_detail">' + html + '</table>';

        $('#block_result_preview .brp_desc_detail').html(html);





        //5) [ Спецификация продукта ] ( если есть 2-ая вкладка) ---------------------------------
        var product_spec = get_product_spec();
        if (product_spec !== undefined) { //-если существует вкладка [Спецификация продукта]
            //console.log(product_spec);

            var html = '';
            product_spec.forEach(function (item, i, product_spec) {
                html += '<tr><th colspan="2">' + item['name'] + '</th></tr>';

                sub_item = item['sub'];
                sub_item.forEach(function (item2, i2, sub_item) {
                    html += '<tr><td>' + item2['sub_name'] + '</td><td>' + item2['sub_val'] + '</td></tr>';
                });

            });

            html = '<table class="tab-product_spec">' + html + '</table>';

            $('#block_result_preview .brp_desc_spec').html(html);
        }





        //6) Описание в самом низу ---------------------------------
        $('#block_result_preview .brp_desc_content').html( get_desc_content() );
        $('body').on('click', '#block_result_preview .brp_desc_content .btn-delete', function (e) {
            $(this).closest('.wrap-img').detach();
        });



        //get_link_video();

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
            var name = $(element).text().trim();
            var i_str = name.indexOf(':');
            name = (i_str === -1) ? name : name.substring(0, i_str);

            var val = $(element).attr('title').trim();
            arr_product_detail.push({'name': name, 'val': val});
        });

        //console.log(arr_product_detail);
        return arr_product_detail;
    }


    //вкладка - [спецификации] (самое полное описание)
    function get_product_spec() {
        var product_spec = $("#J_Detail #J_Attrs table.tm-tableAttr:first tbody");//вкладка - [спецификации] (самое полное описание)
        if (product_spec.length !== 0) {//если есть вкладка [спецификации], то
            var arr_product_spec = [], i = 0;
            $(product_spec).find('tr').each(function (indx, element) {
                if ($(element).hasClass('tm-tableAttrSub')) {
                    i++;
                    //console.log($(element).text());
                    var name = $(element).text().trim();
                    arr_product_spec[i] = {};
                    arr_product_spec[i]['name'] = name;
                    arr_product_spec[i]['sub'] = [];
                } else {
                    var sub_name = $(element).find('th').text().trim();
                    var sub_val = $(element).find('td').text().trim();

                    arr_product_spec[i]['sub'].push({'sub_name': sub_name, 'sub_val': sub_val});
                }

            });


            //console.log(arr_product_spec);
            return arr_product_spec;
        }

        return undefined;
    }


    //Нижнее описание товара -------------
    function get_desc_content() {
        var $desc_content = $('#description .content').clone();//var $desc_content = $.parseHTML($('#description .content').html());
        $desc_content.find('img').each(function (indx, element) {
            //alert( $(element).attr('src') );
            //$(element).attr('src', 'TEST_'+$(element).attr('src') );
            var img_lazyload = $(element).attr('data-ks-lazyload');
            if (img_lazyload !== undefined) {
                $(element).attr('src', img_lazyload);
            }

            $(element).wrap('<div class="wrap-img"></div>');
            $(element).after('<span class="btn-delete">Удалить</span>');
        });

        GM_log( $desc_content.html() );
        return $desc_content.html();
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
    function get_product_var_option() {
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

        //GM_log(arr_option);
        return arr_option.reverse();

    }


    //Получаем список всех Цен (с разными комбинациями опций):
    function get_product_option_sku_map_price() {

        //Получаем список цен с id вариций опций (но без указания скидок)
        var sku_map = $('body').text();
        //Ищем: "skuMap":{ ... } рег.выражение:
        //вместо /s ставим [ \f\n\r\t\v], чтобы обзначить пробел, а то /s какого то х не работает
        var reg = new RegExp('"skuMap"[ \f\n\r\t\v]*:[ \f\n\r\t\v]*[{][A-Za-z0-9;:.,\{\}"\f\n\r\t\v]+"[ \f\n\r\t\v]*[}][ \f\n\r\t\v]*[}]', 'ig');
        var result = sku_map.match(reg);
        result = JSON.parse('{' + result[0] + '}');//здесь список цен
        //GM_log(result);

        //кликаем по всем вариантам опций по очередно, чтобы узнать скидку
        var i = -1;
        var length_skuMap = Object.keys(result.skuMap).length;//конвертируем объект в массив
        var interval_time = 100;//c каким интервалом мс. будем кликать
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

                        if ($_item_id.hasClass('tb-out-of-stock')) {//если данная вариция товара отсутсвует
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

        return result;

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


});