/**
 * localStore
 * @description 利用 localStorage 构建客户端存储体系
 * @author  jero
 *
 */

var $ = require('jquery');

var localStore = (function(opts) {
    var localStorage = window.localStorage;

    var def = {
        localSet: function(key, value) {
            localStorage.setItem(key, JSON.stringify(value));
        },

        localGet: function(key) {
            var data = localStorage.getItem(key);
            console.log(data);
            return data ? JSON.parse(data) : null;
        }
    };

    var o = $.extend(def, opts);


    return {
        config: function(settings) {
            $.extend(o, settings); 
        },

        set: function(prefix, id, data, except) {
            if (!localStorage) {
                return;
            }

            if (!(prefix && id && data && $.isArray(data))) {
                return;
            }

            if (except && !$.isArray(except)) {
                except = [except];
            }

            data = $.extend(true, [], data); // 拷贝一份数据
            $.each(data, function(_, item) {
                if (except) {
                    $.each(except, function(_, exc) {
                        delete item[exc];
                    });
                }
                o.localSet(prefix + item[id], item);
            });
        },

        get: function(prefix, idValue) {
            if (!localStorage) {
                return;
            }

            var isExist = true,
                ret = [];

            
            if (!(prefix && idValue && $.isArray(idValue))) {
                return null;
            }

            $.each(idValue, function(_, idV) {
                var data = o.localGet(prefix + idV);
                
                if (!data) {
                    isExist = false;
                    return false;
                }

                ret.push(data);
            });

            if (!isExist) {
                return null;
            }

            return ret;
        }
    };
})();