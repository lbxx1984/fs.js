## filesystem.js
### 说明：
1.这是一个html5沙箱文件操作类，对requestFileSystem重新封装，令H5文件操作更便捷。<br>
2.所有API使用异步回调，建议与Promise结合使用。<br>
3.所有API含义与MS-DOS命令相同。<br>
4.回调时回传标准形参，如dirEntry、fileEntry、FileError，除构造函数正常异常使用同一回调。<br>
5.回调函数上下文已绑定为FileSystem实例。
### 引入：
```html
<script src="filesystem.js"></script>
```
### 声明：
```javascript
var fs = new FileSystem({
    type: window.TEMPORARY, // 空间类型：window.TEMPORARY、window.PERSISTENT
    size: 1024 * 1024 * 100, // 空间大小：单位B
    debug: true, // 是否在控制台输出调试信息
    onSuccess: function (fs) {}, // 成功回调，形参为fs对象
    onFail: function (evt) {} // 失败回调，形参为FileError对象
});
```
<hr>
### 目录接口：
#### md，创建目录
创建目录，只创建一层，不递归创建，即dir1/dir2/dir3，如果dir2不存在，则将错误通过callback返回
```javascript
fs.md(dir, callback);
```
参数|类型|说明
-------------|--------------|-------------
dir|string|目录名称
callback|Function|创建成功，回传dirEntry对象； 创建失败，回传FileError对象(后略)

#### cd，获取目录
获取目录操作接口，若不存在抛错<br>
```javascript
fs.cd(dir, callback);
```
参数|类型|说明
-------------|--------------|-------------
dir|string|目录名称
callback|Function|回传dirEntry对象

#### deltree，删除目录
若目录中含有文件或其他目录，则递归删除
```javascript
fs.deltree(dir, callback);
```
参数|类型|说明
-------------|--------------|-------------
dir|string|目录名称
callback|Function|回传dirEntry对象

#### rd，删除空目录
若目录中含有文件或其他目录，则抛错
```javascript
fs.rd(dir, callback);
```
参数|类型|说明
-------------|--------------|-------------
dir|string|目录名称
callback|Function|回传dirEntry对象

#### dir，获取目录列表
将给定目录的内部结构读出来，只读一层。
```javascript
fs.dir(dir, callback);
```
参数|类型|说明
-------------|--------------|-------------
dir|string|目录路径，如果为''或null或undefined，则读根目录
callback|Function|回传entries数组
<hr>
### 文件接口：
#### create，创建空白文件
创建文件，如果存在同名文件则抛错
```javascript
fs.create(filename, callback);
```
参数|类型|说明
-------------|--------------|-------------
filename|string|文件绝对路径名
callback|Function|回传文件句柄fileEntry

#### open，打开文件
打开文件，如果不存在则抛错
```javascript
fs.open(filename, callback);
```
参数|类型|说明
-------------|--------------|-------------
filename|string|文件绝对路径名
callback|Function|回传文件句柄fileEntry

#### del，删除文件
删除文件，如果不存在则抛错
```javascript
fs.del(filename, callback);
```
参数|类型|说明
-------------|--------------|-------------
filename|string|文件绝对路径名
callback|Function|回传文件句柄fileEntry
<hr>
### 操作接口：
#### copy，复制
复制文件或目录到目标目录<br>
（1）若源文件或目录不存在，则抛错；<br>
（2）若目标目录不存在，则抛错；<br>
（3）若源文件或目标移动违反树逻辑，如将父目录复制到子目录中，则抛错
```javascript
fs.copy(src, dest, callback);
```
参数|类型|说明
-------------|--------------|-------------
src|string|源文件或源目录
dest|string|目标目录
callback|Function|回传目标目录句柄dirEntry

#### move，移动
移动文件或目录到目标目录<br>
（1）若源文件或目录不存在，则抛错；<br>
（2）若目标目录不存在，则抛错；<br>
（3）若源文件或目标移动违反树逻辑，如将父目录移动到子目录中，则抛错
```javascript
fs.move(src, dest, callback);
```
参数|类型|说明
-------------|--------------|-------------
src|string|源文件或源目录
dest|string|目标目录
callback|Function|回传目标目录句柄dirEntry

#### ren，重命名
重命名目录或文件夹
```javascript
fs.ren(oldname, newname, callback);
```
参数|类型|说明
-------------|--------------|-------------
oldname|string|源文件名
newname|string|新文件名，不必指定路径，路径指定错误会抛错
callback|Function|回传文件句柄fileEntry

#### read，读文件
以指定方式、指定编码读取文件
```javascript
fs.read(src, option, callback);
```
参数|类型|说明
-------------|--------------|-------------
src|string|文件名，不存在则抛错
option|Object|读取配置对象
option.type|string|读取方式：readAsBinaryString, readAsText, readAsDataURL, readAsArrayBuffer
option.encoding|string|读取编码：utf8，gb2312，用于readAsText的第二个参数
callback|Function|回传FileReader句柄

#### write，写文件
将Blob写入文件，不负责封装Blob对象实例<br>
（1）若文件名不存在，则创建文件<br>
（2）若以追加方式写，则在文件尾部追加<br>
（3）若不以追加方式写，则清空文件，写入新数据<br>
此API慎用，尤其是在非追加方式工作时，调用前请做好判断
```javascript
fs.write(src, option, callback);
```
参数|类型|说明
-------------|--------------|-------------
src|string|文件名，不存在则抛错
option|Object|读取配置对象
option.data|Blob|Blob数据，严格限制类型，使用前请自行封装Blob数据
option.append|boolean|是否以追加形式写文件
callback|Function|回传FileWriter句柄
