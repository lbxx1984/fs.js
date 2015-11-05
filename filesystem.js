/**
 * html5 浏览器沙箱文件操作库
 *
 * @author Haitao Li
 * @mail 279641976@qq.com
 * @site http://lbxx1984.github.io/
 */
(function (namespace) {


    if (typeof define === 'function') {
        define(function (require) {
            return FileSystem;
        });
    }
    else {
        namespace.FileSystem = FileSystem;
    }


    /**
     * 内部工具，输出调试信息
     *
     * @param {string} str 要输出到控制台的信息
     * @param {string} type 输出类型，即console对应的方法
     */
    function log(str, type) {
        var func = 'log';
        str = str || '';
        type = typeof console[type] === 'function' ? type : 'log';
        console[func](str);
    }


    /**
     * 构造函数
     *
     * @constructor
     * @param {Object} param配置信息
     * @param {number} param.size 空间大小：字节。
     * @param {boolean} param.debug 是否输出debug信息
     * @param {Function} param.callback 回调
     */
    function FileSystem(param) {
        if (!(this instanceof FileSystem)) {
            return new FileSystem(param);
        }
        param = param || {};
        var size = (~~param.size) || 1024 * 1024 * 100; // 100MB
        var callback = typeof param.callback === 'function' ? param.callback : function () {};
        var malloc = window.requestFileSystem || window.webkitRequestFileSystem;
        var me = this;
        this.debug = param.debug ? function () {} : function (str, type) {log(str, type);};
        this.param = {
            enable: false,
            current: null
        };
        // 分配空间，申请文件操作句柄
        if (typeof malloc === 'function') {
            malloc(window.TEMPORARY, size, success, fail);
        }
        else {
            fail();
        }
        function success(fs) {
            me.debug('FileSystem ' + me.version);
            me.param.enable = true;
            me.fs = fs;
            me.param.current = fs.root;
            callback(me);
        }
        function fail() {
            me.debug('Your browser don\'t support!', me, 'warn');
            callback();
        }
    }


    FileSystem.prototype.version = '0.0.1';


})(window);