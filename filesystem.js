/**
 * html5 浏览器端沙箱文件操作库
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
        namespace.fs = FileSystem;
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
     * 内部工具，合并路径
     *
     * @param {string} path1 currentDirectory的fullpath
     * @param {string} path2 相对路径
     * @return {string} 绝对路径
     */
    function joinPath(path1, path2) {
        var arr1 = typeof path1 === 'string' ? path1.split('/') : [];
        var arr2 = typeof path2 === 'string' ? path2.split('/') : [];
        if (arr2.length === 0) {
            return path1;
        }
        if (arr2[0] === '') {
            arr1 = [];
        }
        for (var i = 0; i < arr2.length; i++) {
            if (arr2[i] === '.') {
                continue;
            }
            if (arr2[i] === '..') {
                arr1.pop();
                continue;
            }
            arr1.push(arr2[i]);
        }
        var dest = [];
        for (i = 0; i < arr1.length; i++) {
            if (arr1[i] === '') {
                continue;
            }
            dest.push(arr1[i]);
        }
        return '/' + dest.join('/');
    }


    /**
     * 内部工具，包装callback回调
     */
    function bind(me, callback) {
        callback = typeof callback === 'function' ? callback : function () {};
        me = me || {};
        return function () {
            callback.apply(me, arguments);
        };
    }


    /**
     * 构造函数
     *
     * @constructor
     * @param {Object} param配置信息
     * @param {number} param.size 空间大小：字节。
     * @param {boolean} param.debug 是否输出debug信息
     * @param {Function} callback 回调
     */
    function FileSystem(callback, param) {

        if (!(this instanceof FileSystem)) {
            return new FileSystem(param, callback);
        }
        var me = this;
        var callback = typeof callback === 'function' ? callback : function () {};
        var malloc = window.requestFileSystem || window.webkitRequestFileSystem;

        param = param || {};
        var size = (~~param.size) || 1024 * 1024 * 100; // 100MB
        
        // 调试输出方法
        this.debug = param.debug ? function () {} : function (str, type) {log(str, type);}
        // 当前所在目录，初始为root
        this.currentDirectory = null;
        // 文件操作句柄
        this.fs = null;
        
        // 分配空间，申请文件操作句柄
        if (typeof malloc === 'function') {
            malloc(window.TEMPORARY, size, success, fail);
        }
        else {
            fail();
        }
        
        // 回调处理事件
        function success(fs) {
            me.debug('FileSystem ' + me.version);
            me.fs = fs;
            me.currentDirectory = fs.root;
            callback(me);
        }
        function fail() {
            me.debug('Your browser don\'t support!', me, 'warn');
            callback();
        }
    }


    FileSystem.prototype.version = '0.0.1';


    /**
     * 创建目录
     * 只创建一层，不递归创建，即dir1/dir2/dir3，如果dir2不存在，则将错误通过callback返回
     *
     * @param {string} name 目录名称
     * @param {Function} callback 回调函数，创建成功，回传dirEntry
     * @param {?string} dir 相对路径
     */
    FileSystem.prototype.md = function (name, callback, dir) {
        name = typeof name === 'string' ? name : '';
        if (name === '' || this.fs == null) {
            return;
        }
        callback = bind(this, callback);
        var path = joinPath(this.currentDirectory.fullPath, dir) + '/' + name;
        this.fs.root.getDirectory(path, {create: true}, callback, callback);
    };


    /**
     * 切换当前目录
     *
     * @param {string} dir 相对路径
     * @param {Function} callback 回调函数
     */
    FileSystem.prototype.cd = function (dir, callback) {
        if (this.fs == null) {
            return;
        }
        callback = bind(this, callback);
        var path = joinPath(this.currentDirectory.fullPath, dir);
        var me = this;
        me.fs.root.getDirectory(dir, {}, success, fail);
        function success(evt) {
            me.currentDirectory = evt;
            callback(evt);
        }
        function fail(evt) {
            callback(evt);
        }
    };


    /**
     * 读取当前目录
     *
     * @param {Function} callback 回调函数
     * @param {string} dir 相对路径
     */
    FileSystem.prototype.dir = function (callback, dir) {
        if (this.fs == null) {
            return;
        }
        callback = bind(this, callback);
        var path = joinPath(this.currentDirectory.fullPath, dir);
        this.fs.root.getDirectory(path, {}, success, fail);
        function success(dirEntry) {
            var reader = dirEntry.createReader();
            reader.readEntries(callback, callback);
        }
        function fail(evt) {
            callback(evt);
        }
    };


})(window);