## filesystem.js
### 说明：
1.这是一个html5沙箱文件操作类，对requestFileSystem重新封装，令H5文件操作更便捷。<br>
2.所有API使用异步回调，建议与Promise结合使用。<br>
3.所有API含义于MS-DOS命令相同。<br>
4.回调时回传标准形参，如dirEntry、fileEntry、FileError等，除构造函数外正常与异常使用一个回调接口。<br>
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
### 目录操作：
#### 创建目录
只创建一层，不递归创建，即dir1/dir2/dir3，如果dir2不存在，则将错误通过callback返回<br>
```javascript
fs.md(dir, callback);
```
参数|类型|说明
-------------|--------------|-------------
dir|string 目录名称
callback|Function|创建成功，回传dirEntry对象； 创建失败，回传FileError对象(后略)
