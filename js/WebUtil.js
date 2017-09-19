
if (!window.wj) wj = {};
wj.DataStore = {};
wj.Components = {};
wj.CONST = {};
wj.Validater = {};
wj.Ajax = {};
wj.CONST["Year"] = [
    ["2010", "2010年"],
    ["2011", "2011年"],
    ["2012", "2012年"],
    ["2013", "2013年"],
    ["2014", "2014年"],
    ["2015", "2015年"],
    ["2016", "2016年"],
    ["2017", "2017年"],
];
wj.CONST["YearO"] = [{
    key: "2010",
    value: "2010年"
}, {
    key: "2011",
    value: "2011年"
}, {
    key: "2012",
    value: "2012年"
}, {
    key: "2013",
    value: "2013年"
}, {
    key: "2014",
    value: "2014年"
}, {
    key: "2015",
    value: "2015年"
}, {
    key: "2016",
    value: "2016年"
}, {
    key: "2017",
    value: "2017年"
}];
wj.CONST["Month"] = [
    ["1", "一月"],
    ["2", "二月"],
    ["3", "三月"],
    ["4", "四月"],
    ["5", "五月"],
    ["6", "六月"],
    ["7", "七月"],
    ["8", "八月"],
    ["9", "九月"],
    ["10", "十月"],
    ["11", "十一月"],
    ["12", "十二月"]
];
wj.CONST["MonthO"] = [{
    key: "1",
    value: "一月"
}, {
    key: "2",
    value: "二月"
}, {
    key: "3",
    value: "三月"
}, {
    key: "4",
    value: "四月"
}, {
    key: "5",
    value: "五月"
}, {
    key: "6",
    value: "六月"
}, {
    key: "7",
    value: "七月"
}, {
    key: "8",
    value: "八月"
}, {
    key: "9",
    value: "九月"
}, {
    key: "10",
    value: "十月"
}, {
    key: "11",
    value: "十一月"
}, {
    key: "12",
    value: "十二月"
}];
wj.CONST["AtN"] = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
wj.CONST["Season"] = [
    ["1", "一季度"],
    ["2", "二季度"],
    ["3", "三季度"],
    ["4", "四季度"]
];
wj.CONST["SeasonO"] = [{
    key: "1",
    value: "一季度"
}, {
    key: "2",
    value: "二季度"
}, {
    key: "3",
    value: "三季度"
}, {
    key: "4",
    value: "四季度"
}];
wj.CONST["IntChinese"] = {
    1: "一",
    2: "二",
    3: "三",
    4: "四",
    5: "五",
    6: "六",
    7: "七",
    8: "八",
    9: "九",
    10: "十"
};
wj.getSeason = function(d) {
    if (d.getMonth() > -1 && d.getMonth() < 3) return 1;
    if (d.getMonth() > 2 && d.getMonth() < 6) return 2;
    if (d.getMonth() > 5 && d.getMonth() < 9) return 3;
    if (d.getMonth() > 8) return 4;
}
wj.getChinese = function(i) {
    return wj.CONST["IntChinese"][i];
}
wj.parent = function() {
    return (window.parent && window.parent != window) ? window.parent.wj : null;
};

wj.top = function() {
    var top = wj,
        p;
    while (p = top.parent()) {
        top = p;
    }
    return top;
};

wj['and'] = function() {
    var a = arguments;
    for (var i = 0, l = a.length; i < l; i++) {
        if (!a[i]) return false;
    }
    return true;
};

wj['or'] = function() {
    var a = arguments;
    for (var i = 0, l = a.length; i < l; i++) {
        if (a[i]) return true;
    }
    return false;
};

wj['min'] = function() {
    var a = arguments,
        m = a[0];
    for (var i = 1, l = a.length; i < l; i++) {
        if (m > a[i]) m = a[i];
    }
    return m;
};

wj['max'] = function() {
    var a = arguments,
        m = a[0];
    for (var i = 1, l = a.length; i < l; i++) {
        if (m < a[i]) m = a[i];
    }
    return m;
};

wj['between'] = function(v, f, t) {
    return (f == null || v >= f) && (t == null || v <= t);
};

wj['in'] = function() {
    var a = arguments,
        v = a[0];
    for (var i = 1, l = a.length; i < l; i++) {
        if (v == a[i]) return true;
    }
    return false;
};
wj.Validater.isExitsFunction = function(funcName) {
    try {
        if (typeof(eval(funcName)) == "function") {
            return true;
        }
    } catch (e) {
        return false;
    }
    return false;
}
wj['oneOf'] = wj['in'];
(function($, h, c) {
    var a = $([]),
        e = $.resize = $.extend($.resize, {}),
        i, k = "setTimeout",
        j = "resize",
        d = j + "-special-event",
        b = "delay",
        f = "throttleWindow";
    e[b] = 250;
    e[f] = true;
    $.event.special[j] = {
        setup: function() {
            if (!e[f] && this[k]) {
                return false;
            }
            var l = $(this);
            a = a.add(l);
            $.data(this, d, {
                w: l.width(),
                h: l.height()
            });
            if (a.length === 1) {
                g();
            }
        },
        teardown: function() {
            if (!e[f] && this[k]) {
                return false;
            }
            var l = $(this);
            a = a.not(l);
            l.removeData(d);
            if (!a.length) {
                clearTimeout(i);
            }
        },
        add: function(l) {
            if (!e[f] && this[k]) {
                return false;
            }
            var n;

            function m(s, o, p) {
                var q = $(this),
                    r = $.data(this, d);
                r.w = o !== c ? o : q.width();
                r.h = p !== c ? p : q.height();
                n.apply(this, arguments);
            }
            if ($.isFunction(l)) {
                n = l;
                return m;
            } else {
                n = l.handler;
                l.handler = m;
            }
        }
    };

    function g() {
        i = h[k](function() {
            a.each(function() {
                var n = $(this),
                    m = n.width(),
                    l = n.height(),
                    o = $.data(this, d);
                if (m !== o.w || l !== o.h) {
                    n.trigger(j, [o.w = m, o.h = l]);
                }
            });
            g();
        }, e[b]);
    }
}(jQuery, this));

wj.Createjscssfile = function(url, filetype) {
    if (filetype == "js") { //if filename is a external JavaScript file
        var fileref = document.createElement('script');
        fileref.setAttribute("type", "text/javascript");
        fileref.setAttribute("src", url);
    } else if (filetype == "css") { //if filename is an external CSS file
        var fileref = document.createElement("link");
        fileref.setAttribute("rel", "stylesheet");
        fileref.setAttribute("type", "text/css");
        fileref.setAttribute("href", url);
    }
    return fileref;
}

wj.Replacejscssfile = function(oldfilename, newfilename, filetype) {
    var targetelement = (filetype == "js") ? "script" : (filetype == "css") ? "link" : "none";
    var targetattr = (filetype == "js") ? "src" : (filetype == "css") ? "href" : "none";
    var allsuspects = document.getElementsByTagName(targetelement);
    for (var i = allsuspects.length; i >= 0; i--) {
        if (allsuspects[i] && allsuspects[i].getAttribute(targetattr) != null && allsuspects[i].getAttribute(targetattr).indexOf(oldfilename) != -1) {
            var newelement = createjscssfile(newfilename, filetype);
            allsuspects[i].parentNode.replaceChild(newelement, allsuspects[i]);
        }
    }
}
if (!Array.indexOf) {
    Array.prototype.indexOf = function(obj) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] == obj) {
                return i;
            }
        }
        return -1;
    }
}
if (!String.startsWith) {
    String.prototype.startsWith = function(str) {
        if (str == null || str == "" || this.length == 0 || str.length > this.length)
            return false;
        if (this.substr(0, str.length) == str)
            return true;
        else
            return false;
        return true;
    };
}
String.prototype.cutcomma = function() {
    return this.slice(0, this.length - 1);
}
/**
 * 将数字变为中文数字
 * @param {String} n
 * @returns {String}
 */
wj.FormatNumToChinese = function(n) {
    var _r = "〇";
    switch (n) {
        case '0':
            _r = "〇"
            break;
        case '1':
            _r = "一"
            break;
        case '2':
            _r = "二"
            break;
        case '3':
            _r = "三"
            break;
        case '4':
            _r = "四"
            break;
        case '5':
            _r = "五"
            break;
        case '6':
            _r = "六"
            break;
        case '7':
            _r = "七"
            break;
        case '8':
            _r = "八"
            break;
        case '9':
            _r = "九"
            break;
    }

    return _r;
}
/**
 * 返回中文年
 * @param {String} y
 * @returns {String}
 */
wj.FormatYearToChinese = function(y) {
    var _r = "";
    for (var _i = 0; _i < 4; _i++) {
        _r += FormatNumToChinese(y[_i]);
    }
    return _r;
}
/**
 * 生成GUID
 * @returns {type}
 */
wj.Guid = function(pre) {
    var guid = "";
    for (var i = 1; i <= 32; i++) {
        var n = Math.floor(Math.random() * 16.0).toString(16);
        guid += n;
        if ((i == 8) || (i == 12) || (i == 16) || (i == 20))
            guid += "-";
    }
    pre += "_";
    return (typeof pre == "undefined") ? guid : (pre + guid);
}

Date.prototype.WJFormat = function(fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "H+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

function getPreMonth(date) {
    var arr = dhx.date2str(date, "%Y-%m-%d").split('-');
    var year = arr[0]; //获取当前日期的年份
    var month = arr[1]; //获取当前日期的月份
    var day = arr[2]; //获取当前日期的日
    var days = new Date(year, month, 0);
    days = days.getDate(); //获取当前日期中月的天数
    var year2 = year;
    var month2 = parseInt(month) - 1;
    if (month2 == 0) {
        year2 = parseInt(year2) - 1;
        month2 = 12;
    }
    var day2 = day;
    var days2 = new Date(year2, month2, 0);
    days2 = days2.getDate();
    if (day2 > days2) {
        day2 = days2;
    }
    if (month2 < 10) {
        month2 = '0' + month2;
    }
    var t2 = year2 + '-' + month2;
    return t2;
}

Date.prototype.GetLastDate = function(year, month) {
    var firstdate = year + '-' + month + '-01';
    var day = new Date(year, month, 0);
    var lastdate = year + '-' + month + '-' + day.getDate(); //获取当月最后一天日期
    //给文本控件赋值。同下
    return lastdate;
}

Date.prototype.pattern = function(fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时
        "H+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    var week = {
        "0": "/u65e5",
        "1": "/u4e00",
        "2": "/u4e8c",
        "3": "/u4e09",
        "4": "/u56db",
        "5": "/u4e94",
        "6": "/u516d"
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    if (/(E+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f" : "/u5468") : "") + week[this.getDay() + ""]);
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}

wj.Validater.OneOrHalf = function(a) {
    var reg = new RegExp(/^(0(\.)?(5|0)?|[1-9](\.)?(5|0)?|[1-9][0-9](\.)?(5|0)?|0)$/);
    if (a.value == "") return;
    if (!reg.test(a.value)) {
        a.value = "";
        alert("只能输入0.5的倍数");
    }
}
/**
 * 访问接口返回数据
 * @param {Object} config
 */
wj.Ajax.doAction = function(config) {
    var o = {};
    for (var _i in config) {
        o[_i] = config[_i];
    }
    o.url = config.url || "../tableSingle.ashx";
    o.strType = config.strType || "Search";
    o.strUserCode = User.id;
    o.strTableName = config.strTableName || "";
    o.strPageNum = config.strPageNum || "0";
    o.strIndexNum = config.strIndexNum || "1";
    o.strTitle = config.strTitle || "";
    o.strValue = config.strValue || "";
    o.strWhereTitle = config.strWhereTitle || "";
    o.strWhereTag = config.strWhereTag || "";
    o.strWhereValue = config.strWhereValue || "";
    o.strIsOP = config.strIsOP || "0";
    o.isTyhpe = config.isTyhpe || "0";
    o.strOrderBy = config.strOrderBy || "";
    o.returnBack = config.returnBack || config.strType;
    o.cache = config.cache || "0";
    o.sfunc = config.sfunc;
    if (config.withFile) {
        var _eleId = o.fileComponent;
        datastore.uploader[_eleId].params = o;
        $("#" + _eleId).fileinput('upload');
    } else {
        $.ajax({
                url: o.url,
                type: 'POST',
                dataType: 'json',
                data: o,
                beforeSend: function() {
                    //Progress(true);
                }
            })
            .done(function(s, d, r) {
                //Progress(false);
                o.sfunc(arguments[0], arguments[1], arguments[2], o.returnBack, o.cache);
            })
            .fail(function(s, d, r) {
                //Progress(false);
                if (s == "parsererror") {
                    //Logout(parent);
                }
                if (o.efunc) o.efunc(arguments[0], arguments[1], arguments[2]);
            });
    }
}
wj.Ajax.doActions = function(configarr, callback) {
    var _cb = callback;
    var _jqxhrs = [];
    for (var i = 0; i < configarr.length; i++) {
        var o = {};
        for (var _k in configarr[i]) {
            o[_k] = configarr[i][_k];
        }
        o.url = configarr[i].url || "../tableSingle.ashx";
        o.strType = configarr[i].strType || "Search";
        o.strUserCode = User.id;
        o.strTableName = configarr[i].strTableName || "";
        o.strPageNum = configarr[i].strPageNum || "0";
        o.strIndexNum = configarr[i].strIndexNum || "1";
        o.strTitle = configarr[i].strTitle || "";
        o.strValue = configarr[i].strValue || "";
        o.strWhereTitle = configarr[i].strWhereTitle || "";
        o.strWhereTag = configarr[i].strWhereTag || "";
        o.strWhereValue = configarr[i].strWhereValue || "";
        o.strIsOP = configarr[i].strIsOP || "0";
        o.isTyhpe = configarr[i].isTyhpe || "0";
        o.strOrderBy = configarr[i].strOrderBy || "";
        o.returnBack = configarr[i].returnBack || configarr[i].strType;
        o.cache = configarr[i].cache || "0";
        o.sfunc = configarr[i].sfunc || function() {};
        var jqxhr = $.ajax({
            url: o.url,
            type: 'POST',
            dataType: 'json',
            data: o,
            beforeSend: function() {
                //Progress(true);
            }
        }).done(function(s, d, r) {
            //Progress(false);
            o.sfunc(arguments[0], arguments[1], arguments[2], o.returnBack, o.cache);
        }).fail(function(s, d, r) {
            //Progress(false);
            if (s == "parsererror") {
                //Logout(parent);
            }
            if (o.efunc) o.efunc(arguments[0], arguments[1], arguments[2]);
            dhtmlx.message({
                type: 'error',
                text: '发生错误 ',
                expire: 3000
            });
        });
        _jqxhrs[i] = jqxhr;
    }

    $.when.apply(this, _jqxhrs).done(function() {
        var _dataarr = [];
        if (configarr.length > 1) {
            $(arguments).each(function(i, e) {
                if (e[0]) {
                    var _rs = RecordSet(e[0]);
                    _rs.returnBack = configarr[i].returnBack;
                    _dataarr.push(_rs);
                }
            });
        } else {
            if (arguments[0]) {
                var _rs = RecordSet(arguments[0]);
                _rs.returnBack = configarr[0].returnBack;
                _dataarr.push(_rs);
            }
        }
        _cb(_dataarr);
    });
}

wj.Ajax.RecordSet = function(data, itemsNumPerPage) {
    var _rs = {};
    var _itemsNumPerPage = parseInt(itemsNumPerPage);
    _rs.keys = data.keys;
    _rs.values = data.values;
    _rs.currentIndex = 0;
    _rs.pageTotal = parseInt(data.dataTotal);
    _rs.Next = function() {
        _rs.currentIndex++;
        var _o = null;
        if (_rs.currentIndex < _rs.values.length) {
            _o = _rs.serialize(_rs.currentIndex);
        } else {
            _rs.currentIndex--;
        }
        return _o;
    }
    _rs.Size = function() {
        var _r;
        _r = _rs.values.length;
        return _r;
    };
    _rs.First = function() {
        return _rs.values.length > 0 ? _rs.serialize(0) : null;
    };
    _rs.Serialize = function(_i) {
        var _o = {};
        var _j = _rs.keys.length;
        for (var _k = 0; _k < _j; _k++) {
            var _v = _rs.values[_i][_k]
            _o[_rs.keys[_k]] = decodeURIComponent(decodeURIComponent(_v));
        }
        return _o;
    };
    _rs.Pages = function() {
        return Math.ceil(_rs.values.length / _itemsNumPerPage);
    };
    _rs.PageTotal = function() {
        return _rs.pageTotal;
    }
    return _rs;
}

wj.ParseURL = function(url) {
    var a = document.createElement('a');
    a.href = decodeURIComponent(url);
    return {
        source: url,
        protocol: a.protocol.replace(':', ''),
        host: a.hostname,
        port: a.port,
        query: a.search,
        params: (function() {
            var ret = {},
                seg = a.search.replace(/^\?/, '').split('&'),
                len = seg.length,
                i = 0,
                s;
            for (; i < len; i++) {
                if (!seg[i]) {
                    continue;
                }
                s = seg[i].split('=');
                ret[s[0]] = s[1];
            }
            return ret;
        })(),
        file: (a.pathname.match(/\/([^\/?#]+)$/i) || [, ''])[1],
        hash: a.hash.replace('#', ''),
        path: a.pathname.replace(/^([^\/])/, '/$1'),
        relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [, ''])[1],
        segments: a.pathname.replace(/^\//, '').split('/')
    };
}

wj.Validater.ValidateInput = function(el) {
    var f = true;

    if (el.attr("type") == "text") {
        if (el.attr("value") == "" || el.val() == "") f = false;
    }

    return f;
}

//绑定数据

function trace() {
    for (var _i in arguments) {
        console.log(arguments[_i]);
    }
}

function info() {
    for (var _i in arguments) {
        console.info(arguments[_i]);
    }
}

wj.MergeArray = function(arr1, arr2) {
    var _arr = [];
    for (var i = 0; i < arr1.length; i++) {
        _arr.push(arr1[i]);
    }
    var _dup;
    for (var i = 0; i < arr2.length; i++) {
        _dup = false;
        for (var _i = 0; _i < arr1.length; _i++) {
            if (arr2[i] === arr1[_i]) {
                _dup = true;
                break;
            }
        }
        if (!_dup) {
            _arr.push(arr2[i]);
        }
    }

    return _arr;
}

wj.parseFloatA = function(v) {
    return (v == "" || isNaN(v)) ? 0 : parseFloat(v);
}

wj.CloneObjC = function(obj) {
    var o;
    if (typeof obj == "object") {
        if (obj === null) {
            o = null;
        } else {
            if (obj instanceof Array) {
                o = [];
                for (var i = 0, len = obj.length; i < len; i++) {
                    o.push(CloneObjC(obj[i]));
                }
            } else {
                o = {};
                for (var k in obj) {
                    o[k] = CloneObjC(obj[k]);
                }
            }
        }
    } else {
        o = obj;
    }
    return o;
}

wj.isDefined = function(x) {
    return x !== null && x !== undefined;
}

wj.Validater.IsArray = function(o) {
    return Object.prototype.toString.call(o) == '[object Array]';
}

wj.MergeObj = function() {
    var _obj = {};
    for (var i = 0; i < arguments.length; i++) {
        $.each(arguments[i], function(k, v) {
            _obj[k] = v;
        })
    }
    return _obj;
}
