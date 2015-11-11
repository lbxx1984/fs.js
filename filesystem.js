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
     *
     * @param {Object} me fs对象实例
     * @param {Function} callback 待封包的函数
     * @return {Function} 封号包的函数
     */
    function bind(me, callback) {
        callback = typeof callback === 'function' ? callback : function () {};
        me = me || {};
        return function () {
            callback.apply(me, arguments);
        };
    }


    /**
     * 内部工具，扩展fs对象实例API
     *
     * @param {Object} me fs对象实例
     * @param {Object} fs 文件操作句柄
     */
    function extend(me, fs) {
        var currentDirectory = fs.root;

        /**
         * 创建目录，不递归创建
         *
         * @param {string} dir 相对路径
         * @param {Function} callback 回调函数，创建成功，回传dirEntry
         */
        me.md = function (dir, callback) {
            callback = bind(this, callback);
            fs.root.getDirectory(joinPath(currentDirectory.fullPath, dir), {create: true}, callback, callback);
        };

        /**
         * 读取当前目录
         *
         * @param {Function} callback 回调函数
         * @param {?string} dir 相对路径
         */
        me.dir = function (callback, dir) {
            callback = bind(this, callback);
            fs.root.getDirectory(joinPath(currentDirectory.fullPath, dir), {}, success, callback);
            function success(dirEntry) {
                var reader = dirEntry.createReader();
                reader.readEntries(callback, callback);
            }
        };
    }


    /**
     * 构造函数
     *
     * @constructor
     * @param {Function} callback 回调
     * @param {Object} param配置信息
     * @param {number} param.size 空间大小：字节
     */
    function FileSystem(callback, param) {

        if (!(this instanceof FileSystem)) {
            return new FileSystem(param, callback);
        }
        param = param || {};
        var size = (~~param.size) || 1024 * 1024 * 100; // 100MB
        var callback = typeof callback === 'function' ? callback : function () {};
        var malloc = window.requestFileSystem || window.webkitRequestFileSystem;
        var me = this;
        
        // 分配空间，申请文件操作句柄
        if (typeof malloc === 'function') {
            malloc(window.TEMPORARY, size, success, fail);
        }
        else {
            fail();
        }
        
        // 回调处理事件
        function success(fs) {
            log('FileSystem ' + me.version);
            extend(me, fs);
            callback(me);
        }
        function fail() {
            log('Your browser don\'t support!', 'warn');
            callback();
        }
    }


    FileSystem.prototype.version = '0.0.1';


    


    // /**
    //  * 切换当前目录
    //  *
    //  * @param {string} dir 相对路径
    //  * @param {Function} callback 回调函数
    //  */
    // FileSystem.prototype.cd = function (dir, callback) {
    //     if (this.fs == null) {
    //         return;
    //     }
    //     callback = bind(this, callback);
    //     var path = joinPath(this.currentDirectory.fullPath, dir);
    //     var me = this;
    //     me.fs.root.getDirectory(dir, {}, success, fail);
    //     function success(evt) {
    //         me.currentDirectory = evt;
    //         callback(evt);
    //     }
    //     function fail(evt) {
    //         callback(evt);
    //     }
    // };


    


    // *
    //  * 删除目录
    //  * 只删除空目录
    //  *
    //  * @param {string} dir 相对路径
    //  * @param {Function} callback 回调
     
    // FileSystem.prototype.rd = function (dir, callback) {
    //     if (this.fs == null) {
    //         return;
    //     }
    //     callback = bind(this, callback);
    //     var path = joinPath(this.currentDirectory.fullPath, dir);
    //     this.fs.root.getDirectory(path, {}, gotDirectory, callback);
    //     function gotDirectory(dirEntry) {
    //         dirEntry.remove(callback, callback);
    //     }
    // };


    // /**
    //  * 删除目录及其内部所有内容
    //  *
    //  * @param {string} dir 相对路径
    //  * @param {Function} callback 回调
    //  */
    // FileSystem.prototype.deltree = function (dir, callback) {
    //     if (this.fs == null) {
    //         return;
    //     }
    //     callback = bind(this, callback);
    //     var path = joinPath(this.currentDirectory.fullPath, dir);
    //     this.fs.root.getDirectory(path, {}, gotDirectory, callback);
    //     function gotDirectory(dirEntry) {
    //         dirEntry.removeRecursively(callback, callback);
    //     }
    // };


    // /**
    //  * 创建文件
    //  * 如果存在同名文件则抛错
    //  *
    //  * @param {string} filename 文件名（可含相对路径）
    //  * @param {Function} callback 回调函数
    //  */
    // FileSystem.prototype.create = function (filename, callback) {
    //     if (this.fs == null) {
    //         return;
    //     }
    //     callback = bind(this, callback);
    //     var file = joinPath(this.currentDirectory.fullPath, filename);
    //     this.fs.root.getFile(file, {create: true, exclusive: true}, callback, callback);
    // };


    // /**
    //  * 打开文件
    //  * 如果文件不存在则抛错
    //  *
    //  * @param {string} filename 完成文件名
    //  * @param {Function} callback 回调函数
    //  */
    // FileSystem.prototype.open = function (filename, callback) {
    //     if (this.fs == null) {
    //         return;
    //     }
    //     callback = bind(this, callback);
    //     var file = joinPath(this.currentDirectory.fullPath, filename);
    //     this.fs.root.getFile(file, {create: false}, callback, callback);
    // };


})(window);