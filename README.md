# filesystem.js
#### 说明：
1.这是一个html5沙箱文件操作类，对requestFileSystem重新封装，令H5文件操作更便捷。<br>
2.所有API使用异步回调，建议于Promise结合使用。<br>
3.所有API含义于MS-DOS命令相同。<br>
4.回调时回传标准形参，如dirEntry、fileEntry、FileError等，除构造函数外正常与异常使用一个回调接口。<br>
5.回调函数上下文已绑定为FileSystem实例。
#### 引入：
```html
<script src="filesystem.js"></script>
```
