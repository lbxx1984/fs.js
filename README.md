##H5FS

* H5FS is a library for HTML5 sandbox files operating in Browser.
* All H5FS APIs are asynchronous, it will be very efficient with the use of Promise. 
* All H5FS APIs have the same meaning as MS-DOS (e.g. cd, md, del).
* H5FS maintains a working directory inside for each instance, use 'cd' to change it.
* H5FS supports relative path like '/', './', '../' .
* The context of callback function will be binded to the instance of constructor.

##How to use

* Clone a copy of the main git repo by running:
```bash
    git clone git://github.com/lbxx1984/H5FS.git
```

* Import FileSystem.js to your project:
```html
    <script type="text/javascript" src="FileSystem.js"></script>
```
or:
```javascript
    define(function (require) {
        var FileSystem = require('FileSystem');
    });
```

* Create H5FS instances like:
```javascript
    var fs = new FileSystem(callback);
    function callback(fs1) {
        console.log(fs1);
        console.log(fs1 === fs);
    }
```
* See more examples by accessing ./index.html or checking ./demo.js directly.

##Docs

#### Constructor
* new FileSystem(callback, param)
```
    @param {?Object} param, params for initialization
    @param {?number} param.size, disk space (B)
    @callback(FileSystem) create successfully
    @callback(null) create unsuccesslly
```

#### Directory Operating APIs
* .dir(callback, dir)
```
    Read working directory or specified directory
    @param {?string} dir, specified directory path
    @callback(Array.<DirectoryEntry | FileEntry>) read directory successfully
    @callback(FileError) read directory unsuccessfully
```
* .cd(dir, callback)
```
    Change current working directory
    @param {string} dir, relative path for target directory
    @callback(DirectoryEntry) target directory exists, and read successfully
    @callback(FileError) target directory does not exist
```
* .md(dir, callback)
```
    Create a directory, the father directory of the new directory must exist
    @param {string} dir, relative path for new directory
    @callback(DirectoryEntry) create successfully
    @callback(FileError) create unsuccessfully
```
* .rd(dir, callback)
```
    Remove an empty directory
    @param {string} dir, relative path for the directory would be removed
    @callback(undefined) remove successfully
    @callback(FileError) remove unsuccessfully
```
* .deltree(dir, callback)
```
    Remove a normal directory
    @param {string} dir, relative path for the directory would be removed
    @callback(undefined) remove successfully
    @callback(FileError) remove unsuccessfully
```

#### File Operating APIs
* .create(filename, callback)
```
    Create an empty file
    @param {string} filename, file name including relative path
    @callback(FileEntry) create new file successfully
    @callback(FileError) create unsuccessfully
```
* .del(filename, callback)
```
    Delete a file
    @param {string} filename, file name would be deleted including relative path
    @callback(undefined) delete successfully
    @callback(FileError) delete unsuccessfully 
```
* .open(filename, callback)
```
    Open a file
    @param {string} filename, file name would be opened including relative path
    @callback(FileEntry) open successfully
    @callback(FileError) open unsuccessfully
```
* .read(filename, callback, param)
```
    Read a file
    @param {string} filename, file name would be read including relative path
    @param {?Object} param, reading config information
    @param {?string} param.type, reading type, include 'readAsBinaryString', 'readAsText', 'readAsDataURL', 'readAsArrayBuffer'
    @param {?string} param.encoding, charset for reading, for example 'uft8', 'gb2312'
    @callback(ProgressEvent) read successfully
    @callback(FileError) read unsuccessfully
```
* .write(filename, param, callback)
```
    Write content to file
    @param {string} filename, file name including relative path
    @param {Object} param, writing config information
    @param {Blob} param.data, data to write
    @param {?boolean} param.append, writing in an appending way or not, default value is false
    @callback(ProgressEvent) write successfully
    @callback(FileError) write unsuccessfully
```
#### Advanced Operating APIs
* .ren(oldname, newname, callback)
```
    Rename directory or file
    @param {string} oldname, directory or file would be renamed including relative path
    @param {string} newname, new name excluding path
    @callback(DirectoryEntry | FileEntry) rename successfully
    @callback(FileError) rename unsuccessfully
```
* .move(source, dest, callback)
```
    Move directory or file to destination directory
    @param {string} source, directory or file would be moved including relative path
    @param {string} dest, destination directory including relative path
    @callback(DirectoryEntry | FileEntry) move successfully
    @callback(FileError) move unsuccessfully
```
* .copy(source, dest, callback)
```
    Copy directory or file to destination directory
    @param {string} source, directory or file would be copied including relative path
    @param {string} dest, destination directory including relative path
    @callback(DirectoryEntry | FileEntry) copy successfully
    @callback(FileError) copy unsuccessfully
```

#### Other APIs
* .getWorkingDirectory()
```
    Get current working directory
    @return {DirectoryEntry} working directory
```

##Author
* email: lbxxlht@163.com
* weibo: http://weibo.com/lbxx1984
* blog: http://blog.csdn.net/lbxx1984
