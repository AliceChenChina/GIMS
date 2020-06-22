/*eslint-disable*/
const queryString = require('query-string');
import Vue from 'vue';
import { Powers }  from './powers.ts';
export default {
  number: {
    // eslint-disable-next-line camelcase
    // 格式化金额，千分位并保留两位小数（参数传2，0）
    // nullName 为number为空时，显示的文字
    formatMoney(number, dec_point, remove_end_zero) {
      if (number === null || typeof number === 'undefined' || number === '') {
        return  '-';
      }
      if (typeof (remove_end_zero) === 'undefined') {
        remove_end_zero = 1;
      }
      if (!dec_point) {
        dec_point = 2;
      }
      return this.format(number, dec_point, '.', ',', remove_end_zero);
    },
    formatMoneyWan(number) {
      return this.format(number / 10000, 2, '.', ',', false);
    },
    format(number, decimals, dec_point, thousands_sep, remove_end_zero) {
      /*
       * 参数说明： number：要格式化的数字 decimals：保留几位小数 dec_point：小数点符号 thousands_sep：千分位符号
       * remove_end_zero: 去除小数点末尾的 0
       */
      number = (number + '').replace(/[^0-9+-Ee.]/g, '');
      let n = !isFinite(+number) ? 0 : +number, prec = !isFinite(+decimals) ? 0 : Math.abs(decimals), sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep, dec = (typeof dec_point === 'undefined') ? '.'
        : dec_point, s = '', toFixedFix = function (n, prec) {
        let k = Math.pow(10, prec);
        //去除-	对数进行四舍五入取整。
        return '' + Math.round(n * k) / k;
      };
      //去除-把数四舍五入为最接近的整数。
      s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
      let re = /(-?\d+)(\d{3})/;
      while (re.test(s[0])) {
        s[0] = s[0].replace(re, "$1" + sep + "$2");
      }

      if ((s[1] || '').length < prec) {
        s[1] = s[1] || '';
        s[1] += new Array(prec - s[1].length + 1).join('0');
      }
      let rult = s.join(dec);
      if (remove_end_zero) {
        return rult.replace(/\.?0+$/, '');
      }
      return rult;
    },
    keepFourDecimal(num) {
      if (num == null || num == undefined) {
        return '-';
      } else {
        var  newNum = parseFloat(num).toFixed(5).slice(0, -1);
        return newNum;
      }
    },
    // 万元整数位,四舍五入
    keepInteger(num) {
      if (num == null || num == undefined || num === '') {
        return '--'
      } else {
        let  newNum = (parseFloat(num) / 10000).toFixed(0);
        newNum = newNum.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return newNum;
      }
    },
    deciToPer(num) {
      if (num == null || num == undefined) {
        return '-'
      } else {
        var  tmp = (parseFloat(num) * 100).toFixed(2);
        return tmp + '%';
      }
    },
    deciToPer_three(num) {
      if (num == null || num == undefined) {
        return '--'
      } else {
        var  tmp = parseFloat((parseFloat(num) * 100).toFixed(3));
        return tmp + '%';
      }
    },
    // 位数不够补0
    toDecimal(num,length){
      length = length + 1;
      var v = num.toFixed(length)
      return v.substring(0,v.lastIndexOf('.')+length)
    }
  },
  formatMoney(n, c, d, t) {
    var c = isNaN(c = Math.abs(c)) ? 2 : c, d = d == undefined ? "." : d, t = t == undefined ? "," : t, s = n < 0 ? "-" : "", i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))), j = (j = i.length) > 3 ? j % 3
      : 0;
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
  },
  formatFormDate(form, pattern) {
    if (!form) {
      return;
    }
    var format = pattern || 'yyyy-mm-dd HH:MM:ss';
    for (key in form) {
      var prop = form[key];
      if (prop && prop instanceof Date) {
        form[key] = prop.format(format);
      }
    }
  },
  queryString,
  objStrGet(object, strKey) {
    // 先将字符串拆为数组，再使用reduce递归取值返回
    // https://stackoverflow.com/questions/6393943/convert-javascript-string-in-dot-notation-into-an-object-reference
    try {
      return strKey.split('.').reduce((acc, key) => acc[key], object);
    } catch (e) {
      // 取不到值就返回undefined
      return undefined;
    }
  },
  observerStrKeySetter(observer, strKey, value) {
    // vue响应式对象'xx.xx'形式添加key和空对象
    if (typeof value === 'undefined' || value === null) return;
    strKey.split('.').reduce((acc, key, index, src) => {
      if (index === src.length - 1) {
        Vue.set(acc, key, value);
      } else {
        if (typeof acc[key] === 'undefined' || acc[key] === null) {
          Vue.set(acc, key, {});
        }
      }
      return acc[key];
    }, observer);
  },
  jsonClone(object) {
    // json安全深拷贝
    return window.JSON.parse(window.JSON.stringify(object));
  },
  dateFormat(date, mask, utc) {
    let token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g, timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g, timezoneClip = /[^-+\dA-Z]/g, pad = function (
      val, len) {
      val = String(val);
      len = len || 2;
      while (val.length < len)
        val = "0" + val;
      return val;
    };

    let masks = {
      "default": "ddd mmm dd yyyy HH:MM:ss",
      shortDate: "m/d/yy",
      mediumDate: "mmm d, yyyy",
      longDate: "mmmm d, yyyy",
      fullDate: "dddd, mmmm d, yyyy",
      shortTime: "h:MM TT",
      mediumTime: "h:MM:ss TT",
      longTime: "h:MM:ss TT Z",
      isoDate: "yyyy-mm-dd",
      isoTime: "HH:MM:ss",
      isoDateTime: "yyyy-mm-dd'T'HH:MM:ss",
      isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
    };

    let i18n = {
      dayNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      monthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "January", "February", "March", "April", "May", "June", "July", "August", "September",
        "October", "November", "December"]
    };
    // You can't provide utc if you skip other args (use the "UTC:" mask
    // prefix)
    if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
      mask = date;
      date = undefined;
    }

    // Passing date through Date applies Date.parse, if necessary
    date = date ? new Date(date) : new Date;
    if (isNaN(date))
      throw SyntaxError("invalid date");

    mask = String(masks[mask] || mask || masks["default"]);

    // Allow setting the utc argument via the mask
    if (mask.slice(0, 4) == "UTC:") {
      mask = mask.slice(4);
      utc = true;
    }

    var _ = utc ? "getUTC" : "get", d = date[_ + "Date"](), D = date[_ + "Day"](), m = date[_ + "Month"](), y = date[_ + "FullYear"](), H = date[_ + "Hours"](), M = date[_ + "Minutes"](), s = date[_
    + "Seconds"](), L = date[_ + "Milliseconds"](), o = utc ? 0 : date.getTimezoneOffset(), flags = {
      d: d,
      dd: pad(d),
      ddd: i18n.dayNames[D],
      dddd: i18n.dayNames[D + 7],
      m: m + 1,
      mm: pad(m + 1),
      mmm: i18n.monthNames[m],
      mmmm: i18n.monthNames[m + 12],
      yy: String(y).slice(2),
      yyyy: y,
      h: H % 12 || 12,
      hh: pad(H % 12 || 12),
      H: H,
      HH: pad(H),
      M: M,
      MM: pad(M),
      s: s,
      ss: pad(s),
      l: pad(L, 3),
      L: pad(L > 99 ? Math.round(L / 10) : L),
      t: H < 12 ? "a" : "p",
      tt: H < 12 ? "am" : "pm",
      T: H < 12 ? "A" : "P",
      TT: H < 12 ? "AM" : "PM",
      Z: utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
      o: (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
      S: ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
    };

    return mask.replace(token, function ($0) {
      return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
    });
  },
  date: {
   format(dateString, mask){
       if(dateString){
         let date=new Date(dateString.replace(/-/g, "/"));
         let o = {
           "M+" : date.getMonth()+1,     //月份
           "d+" : date.getDate(),     //日
           "h+" : date.getHours(),     //小时
           "m+" : date.getMinutes(),     //分
           "s+" : date.getSeconds(),     //秒
           "q+" : Math.floor((date.getMonth()+3)/3), //季度
           "S" : date.getMilliseconds()    //毫秒
         };
         if(/(y+)/.test(mask)){
           mask=mask.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
         }
         for(let k in o){
           if(new RegExp("("+ k +")").test(mask)){
             mask = mask.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
           }
         }
         return mask;
       }else{
         return ''
       }
     }
  },
  textLenValidator(length, label) {
    return {
      validator: (rule, value, callback) => {
        if (!value) {
          callback(new Error(`请填写${label}，最多输入${length}个字`));
          return;
        }
        if (value.length > length) {
          callback(new Error(`最多输入${length}个字`));
          return;
        }
        callback();
      },
      required: true
    };
  },
  textContentValidator(conent, errorText, length) {
    return {
      validator: (rule, value, callback) => {
        if (value && String(value).indexOf(conent) !== 0) {
          callback(new Error(errorText));
          return;
        }
        if (value.length > length) {
          callback(new Error(`最多输入${length}个字`));
          return;
        }
        callback();
      },
      required: false
    };
  },
  // 判断对象是null undefined '' 返回true
  isEmptyVal(val) {
    return val === null || typeof val === 'undefined' || val === '';
  },
  // 如果是null undefined '' 返回 -（横杠）
  // 否则返回formatter函数处理后的结果
  emptyableValue(val, formatter) {
    if (val === null || typeof val === 'undefined' || val === '' || val === 'null') {
      return '-';
    }
    if (typeof formatter === 'function')
      return formatter(val);
    return val;
  },
  dateDiff(date1, date2) {
    // 获取两个日期之间相差几天
    return Math.abs((date1 - date2) / (1000 * 60 * 60 * 24));
  },
  prefixInteger(num, n) {
    // 数字补0，n为位数
    return (Array(n).join(0) + num).slice(-n);
  },
  statusArgsWithElOptionsTag(groupKey) {
    // map方法不会执行空数组
    setTimeout(() => {
    });
    const enumArgs = Vue.prototype.$vueStore.state.argEnum[groupKey];
    const options = Object.keys(enumArgs).map(key => {
      if (/^[^\u4e00-\u9fa5]+$/.test(key)) {
        return {
          label: enumArgs[key],
          value: /^\d+$/.test(key) ? parseInt(key) : key
        };
      }
    });
    return options.filter(nodes => nodes);
  },
  //格式化时间，返回月日,接收的是日期或者时间戳
  transferTimeToMonthDate(timestamp){
    if(!timestamp){
      return
    }
    let time='';
    if(typeof(timestamp)!='number'){
      timestamp=timestamp.replace(/\-/g, "/")
      time = new Date(timestamp);
    }else{
      time = new Date(timestamp);
    }
    let month = time.getMonth() + 1;
    let day = time.getDate();
    let data= this.fillZero(month) + '-'+ this.fillZero(day)
    return data;
  },
  // 补零
  fillZero(num) {
    if (num < 10) {
      return '0'+num;
    }else{
      return num
    }
  },
  getTrueOrFalse(val){
    if (val === null || typeof val === 'undefined' || val === '') {
      return '-';
    }
    val += '';
    if (val === '1' ) {
      return '是'
    }
    if (val === '0' ) {
      return '否'
    }
  },
  Powers: Powers
}
