
define(function (require) {


    /*文件操作接口*/

 
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
