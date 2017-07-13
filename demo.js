new FileSystem(init);


function init(fs) {

    var space = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';

    function log(lines) {
        lines = lines instanceof Array ? lines.join('<br/>') : lines;
        document.body.innerHTML += lines + '<br/>';
    }

    function listDirectory(res) {
        log(res.map(function (entry) {
            return space + entry.fullPath;
        }));
    }

    function readFileMeta(file) {
        return new Promise(function (resolve, reject) {
            file.getMetadata(function (meta) {
                log([
                    space + 'name:&nbsp;&nbsp;' + file.name,
                    space + 'size:&nbsp;&nbsp;' + meta.size + 'B',
                    space + 'date:&nbsp;&nbsp;' + meta.modificationTime
                ]);
                resolve();
            });
        });
    }

    function readFileData(file) {
        var arr = file.target.result.split('\n').map(function (line) {
            return space + line;
        });
        log(arr);
    }

    function dir(path) {
        return function () {
            log('$: dir ' + (path ? path : ''));
            return fs.dir(path).then(listDirectory);
        };
    }

    function md(folder) {
        return function () {
            log('$: md ' + folder);
            return fs.md(folder);
        };
    }

    function cd(path) {
        return function () {
            log('$: cd ' + path);
            return fs.cd(path);
        };
    }

    function rd(folder) {
        return function () {
            log('$: rd ' + folder);
            return fs.rd(folder);
        };
    }

    function deltree(folder) {
        return function () {
            log('$: deltree ' + folder);
            return fs.deltree(folder);
        };
    }

    function create(filename) {
        return function () {
            log('$: create ' + filename);
            return fs.create(filename);
        };
    }

    function del(filename) {
        return function () {
            log('$: del ' + filename);
            return fs.del(filename);
        };
    }

    function copy(src, dest) {
        return function () {
            log('$: copy ' + src + ' ' + dest);
            return fs.copy(src, dest);
        };
    }

    function move(src, dest) {
        return function () {
            log('$: move ' + src + ' ' + dest);
            return fs.move(src, dest);
        };
    }

    function ren(src, newname) {
        return function () {
            log('$: ren ' + src + ' ' + newname);
            return fs.ren(src, newname);
        };
    }

    function open(filename) {
        return function () {
            log('$: open ' + filename);
            return fs.open(filename).then(readFileMeta);
        };
    }

    function write(filename, txt, append) {       
        return function () {
            log('$: write ' + filename + ' data= "' + txt + '" append=' + append);
            return fs.write(filename, {
                data: txt,
                append: append
            });
        }
    }

    function read(filename) {
        return function () {
            log('$: read ' + filename);
            return fs.read(filename).then(readFileData);
        };
    }

    // 目录测试
    md('h5fs-test-folder')()
    .then(md('h5fs-test-folder-2'))
    .then(md('h5fs-test-folder-3'))
    .then(dir())
    .then(cd('h5fs-test-folder'))
    .then(md('folder'))
    .then(md('empty-folder-that-will-be-removed-later'))
    .then(md('folder/child-folder'))
    .then(dir('folder'))
    .then(dir())
    .then(rd('empty-folder-that-will-be-removed-later'))
    .then(dir())
    .then(rd('folder'))
    .then(null, log)
    .then(deltree('folder'))
    .then(dir())
    .then(cd('..'))
    .then(dir())

    // 文件测试
    .then(create('file.txt'))
    .then(dir())
    .then(ren('file.txt', 'file1.txt'))
    .then(dir())
    .then(ren('file-does-not-exist', 'file1.txt'))
    .then(null, log)
    .then(ren('file1.txt', 'test/test.txt'))
    .then(null, log)
    .then(ren('file1.txt', 'file.txt'))
    .then(dir())

    // 读写测试
    .then(write('file.txt', 'line1-data\nline2-data', false))
    .then(open('file.txt'))
    .then(read('file.txt'))
    .then(write('file.txt', '\nline3-data\nline4-data', true))
    .then(open('file.txt'))
    .then(read('file.txt'))
    .then(write('file.txt', 'line1-data\nline2-data', false))
    .then(open('file.txt'))
    .then(read('file.txt'))

    // 复制测试
    .then(copy('file.txt', 'h5fs-test-folder'))
    .then(dir('h5fs-test-folder'))
    .then(read('h5fs-test-folder/file.txt'))
    .then(copy('file.txt', 'folder-does-not-exist'))
    .then(null, log)
    .then(copy('file-does-not-exist', 'h5fs-test-folder'))
    .then(null, log)
    .then(copy('h5fs-test-folder', 'h5fs-test-folder'))
    .then(null, log)
    .then(dir('h5fs-test-folder'))
    .then(dir())
    
    // 移动测试
    .then(move('file-does-not-exist', 'h5fs-test-folder'))
    .then(null, log)
    .then(move('file.txt', 'folder-does-not-exist'))
    .then(null, log)
    .then(move('file.txt', 'h5fs-test-folder-2'))
    .then(dir('h5fs-test-folder-2'))
    .then(read('h5fs-test-folder-2/file.txt'))
    .then(dir('h5fs-test-folder'))

    // 删除测试
    .then(deltree('h5fs-test-folder'))
    .then(deltree('h5fs-test-folder-2'))
    .then(deltree('h5fs-test-folder-3'))
    .then(dir())

    // 完成测试
    .then(function () {
        log('all test finished');
    });

}
