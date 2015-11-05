/**
 * html5 文件沙箱操作类库
 * @author Haitao Li
 * @mail 279641976@qq.com
 * @site http://lbxx1984.github.io/
 * 说明：
 *      1.本类库使用异步API。
 *      2.回调时回传标准形参，如dirEntry、fileEntry等。
 *      3.回调函数上下文被绑定为FileSystem实例。
 *      4.建议本类库与Promise结合使用。
 *      5.本类库方法名及含义与MS-DOS相同。
 */
define(function (require) {



    /**
     * 原型定义
     */
    FileSystem.prototype = {
        // 通用结果处理, 产生一个闭包
        _resultHandler: function (_this, callback) {
            return function (evt) {
                if (evt === undefined) {
                    evt = {};
                }
                if (evt instanceof FileError || evt.error) {
                    evt.error = true;
                    _this._errorHandler(evt);
                }
                if (typeof callback !== 'function') {
                    _this._errorHandler(_this._fileError(_this._msg['CallbackType']));
                    return;
                }
                callback.call(_this, evt);
            };
        },
        // 调试信息输出
        _errorHandler: function (evt) {
            if (!this._debug) {
                return;
            }
            /*ignore*/
            console.log(evt.message || evt.name);
        },
        // 封装错误并返回FileError对象
        _fileError: function (str) {
            return {
                message: str,
                error: true
            };
        }
    };


    /*目录操作接口*/
    /**
     * 创建目录
     * 只创建一层，不递归创建，即dir1/dir2/dir3，如果dir2不存在，则将错误通过callback返回
     * @param {string} dir 目录名称
     * @param {Function} callback 回调函数，创建成功，回传dirEntry
     */
    FileSystem.prototype.md = function (dir, callback) {
        if (this._fs == null) {
            return;
        }
        var result = this._resultHandler(this, callback);

        this._fs.root.getDirectory(dir, {create: true}, result, result);
    };
    /**
     * 获取目录
     * 获取目录操作接口，若不存在抛错
     * @param {string} dir 目录名称
     * @param {Function} callback 回调函数
     */
    FileSystem.prototype.cd = function (dir, callback) {
        if (this._fs == null) {
            return;
        }
        var result = this._resultHandler(this, callback);

        this._fs.root.getDirectory(dir, {}, result, result);
    };
    /**
     * 删除目录及其内部所有内容
     * @param {string} dir 目录路径
     * @param {Function} callback 回调
     */
    FileSystem.prototype.deltree = function (dir, callback) {
        if (this._fs == null) {
            return;
        }
        var result = this._resultHandler(this, callback);

        this._fs.root.getDirectory(
            dir, {},
            function (dirEntry) {
                dirEntry.removeRecursively(result, result);
            },
            result
        );
    };
    /**
     * 删除目录
     * 只删除空目录
     * @param {string} dir 目录路径
     * @param {Function} callback 回调
     */
    FileSystem.prototype.rd = function (dir, callback) {
        if (this._fs == null) {
            return;
        }
        var result = this._resultHandler(this, callback);

        this._fs.root.getDirectory(
            dir, {},
            function (dirEntry) {
                dirEntry.remove(result, result);
            },
            result
        );
    };
    /**
     * 读目录列表
     * 将给定目录的内部结构读出来，只读一层。
     * @param {string} dir 目录路径，如果为''或null或undefined，则读根目录
     * @param {Function} callback 回调，回传目录中的entries
     */
    FileSystem.prototype.dir = function (dir, callback) {
        if (this._fs == null) {
            return;
        }
        var result = this._resultHandler(this, callback);

        function readDir(dirEntry) {
            var reader = dirEntry.createReader();
            reader.readEntries(result, result);
        }
        if (!dir) {
            readDir(this._fs.root);
        }
        else {
            this._fs.root.getDirectory(dir, {}, readDir, result);
        }
    };


    /*文件操作接口*/
    /**
     * 创建文件
     * 如果存在同名文件则抛错
     * @param {string} filename 完成文件名
     * @param {Function} callback 回调函数
     */
    FileSystem.prototype.create = function (filename, callback) {
        if (this._fs == null) {
            return;
        }
        var result = this._resultHandler(this, callback);

        this._fs.root.getFile(filename, {create: true, exclusive: true}, result, result);
    };
    /**
     * 打开文件
     * 如果文件不存在则抛错
     * @param {string} filename 完成文件名
     * @param {Function} callback 回调函数
     */
    FileSystem.prototype.open = function (filename, callback) {
        if (this._fs == null) {
            return;
        }
        var result = this._resultHandler(this, callback);

        this._fs.root.getFile(filename, {create: false}, result, result);
    };
    /**
     * 删除文件
     * 如果文件不存在则抛错
     * @param {string} filename 完成文件名
     * @param {Function} callback 回调函数
     */
    FileSystem.prototype.del = function (filename, callback) {
        if (this._fs == null) {
            return;
        }
        var result = this._resultHandler(this, callback);

        this._fs.root.getFile(
            filename, {create: false},
            function (fileEntry) {
                fileEntry.remove(result, result);
            },
            result
        );
    };


    /*高级操作接口*/
    /**
     * 复制
     * 复制文件或目录到指定目录
     * @param {string} src 源路径
     * @param {string} dest 目标目录
     * @param {Function} callback 回调函数
     */
    FileSystem.prototype.copy = function (src, dest, callback) {
        if (this._fs == null) {
            return;
        }
        var _this = this;
        var result = this._resultHandler(this, callback);

        function gotDest(destEntry) {
            function gotSrc (srcEntry) {
                srcEntry.copyTo(destEntry, null, result, result);
            }
            function tryDirectory () {
                _this._fs.root.getDirectory(src, {}, gotSrc, result);
            }
            _this._fs.root.getFile(src, {create: false}, gotSrc, tryDirectory);
        }
        _this._fs.root.getDirectory(dest, {}, gotDest, result);
    };
    /**
     * 移动
     * 移动文件或目录到指定目录
     * @param {string} src 源路径
     * @param {string} dest 目标目录
     * @param {Function} callback 回调函数
     */
    FileSystem.prototype.move = function (src, dest, callback) {
        if (this._fs == null) {
            return;
        }
        var _this = this;
        var result = this._resultHandler(this, callback);

        function gotDest(destEntry) {
            function gotSrc (srcEntry) {
                srcEntry.moveTo(destEntry, null, result, result);
            }
            function tryDirectory () {
                _this._fs.root.getDirectory(src, {}, gotSrc, result);
            }
            _this._fs.root.getFile(src, {create: false}, gotSrc, tryDirectory);
        }
        _this._fs.root.getDirectory(dest, {}, gotDest, result);
    };
    /**
     * 重命名
     * 重命名文件夹或文件
     * @param {string} oldname 源文件或目录
     * @param {string} newname 新文件名
     * @param {Function} callback 回调函数
     */
    FileSystem.prototype.ren = function (oldname, newname, callback) {
        if (this._fs == null) {
            return;
        }
        var _this = this;
        var result = this._resultHandler(this, callback);

        function getParent(entry) {
            entry.getParent(function (parentEntry) {
                entry.moveTo(parentEntry, newname, result, result);
            });
        }
        function tryFile() {
            _this._fs.root.getFile(oldname, {create: false}, getParent, result);
        }
        _this._fs.root.getDirectory(oldname, {}, getParent, tryFile);
    };


    /*读写文件接口*/
    /**
     * 读取文件
     * @param {string} src 文件路径，若不存在抛错
     * @param {Object} param 读取配置
     * @param {string} param.type 读取方式
     *      readAsBinaryString, readAsText, readAsDataURL, readAsArrayBuffer
     * @param {string} param.encoding 编码方式，用于readAsText的第二个参数
     *      默认utf8，在windows中文操作系统中读取本地文件时经常用gb2312
     * @param {Function} callback 回调函数
     */
    FileSystem.prototype.read = function (src, param, callback) {
        if (this._fs == null) {
            return;
        }
        var _this = this;
        var result = this._resultHandler(this, callback);
        param.type = param.type || 'readAsText';
        param.encoding = param.encoding || 'utf8';

        function gotFile(file) {
            var reader = new FileReader();
            reader.onloadend = function(e) {
                callback(e);
            };
            if (typeof reader[param.type] === 'function') {
                reader[param.type](file, param.encoding);
            }
        }
        _this._fs.root.getFile(
            src, {}, 
            function (fileEntry) {
                fileEntry.file(gotFile, result);
            },
            result
        );
    };
    /**
     * 写文件
     *     文件不存在，则创建；不指定append，则清空文件从头写入，否则追加写入
     * @param {string} src 文件路径，若不存在抛错
     * @param {Object} param 写入配置
     * @param {Blob} param.data 待写入的数据，以封装好的blob
     * @param {boolean} param.append 是否以追加形式写入
     * @param {Function} callback 回调函数
     */
    FileSystem.prototype.write = function (src, param, callback) {
        if (this._fs == null) {
            return;
        }
        var _this = this;
        var result = this._resultHandler(this, callback);
        if (typeof param !== 'object' || !(param.data instanceof Blob)) {
            result(_this._fileError(_this._msg['BeBlob']));
            return;
        }
        var toDo = param.append ? gotFile : toDel;
        
        function toDel(fileEntry) {
            fileEntry.remove(function () {
                _this._fs.root.getFile(src, {create: true}, gotFile, result);
            }, result);
        }
        function gotFile(fileEntry) {
            fileEntry.createWriter(
                function(fileWriter) {
                    fileWriter.seek(fileWriter.length);
                    fileWriter.onwriteend = function(e) {
                        callback(e);   
                    };
                    fileWriter.write(param.data);
                }
            );
        }
        _this._fs.root.getFile(src, {create: true}, toDo, result);
    };

    return FileSystem;

});
