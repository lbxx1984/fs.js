new FileSystem(init);


function init(fs) {

    var space = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';

    function log(lines) {
        lines = lines instanceof Array ? lines.join('<br/>') : lines;
        document.body.innerHTML += lines + '<br/>';
    }

    function list(res) {
        log(res.map(function (entry) {
            return space + entry.fullPath;
        }));
    }

    function dir(path) {
        return function () {
            log('$: dir ' + (path ? path : ''));
            return fs.dir(path);
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
            log(['$: create ' + filename]);
            return fs.create(filename);
        };
    }

    function readFileMeta(file) {
        return new Promise(function (resolve, reject) {
            file.getMetadata(function (meta) {
                log([
                    space + 'name:' + file.name,
                    space + 'size:' + meta.size + 'B',
                    space + 'date:' + meta.modificationTime
                ]);
                resolve();
            });
        });
    }

    function del(filename) {
        return function () {
            log(['$: del ' + filename]);
            return fs.del(filename);
        };
    }

    md('h5fs-test-folder')()
    .then(md('h5fs-test-folder-2'))
    .then(md('h5fs-test-folder-3'))
    .then(dir())
    .then(list)
    .then(cd('h5fs-test-folder'))
    .then(md('folder'))
    .then(md('empty-folder-that-will-be-removed-later'))
    .then(md('folder/child-folder'))
    .then(dir('folder'))
    .then(list)
    .then(dir())
    .then(list)
    .then(rd('empty-folder-that-will-be-removed-later'))
    .then(dir())
    .then(list)
    .then(rd('folder'))
    .then(null, log)
    .then(deltree('folder'))
    .then(dir())
    .then(list)
    .then(cd('..'))
    .then(dir())
    .then(list)
    .then(create('file.txt'))
    .then(readFileMeta)
    .then(dir())
    .then(list)
    .then(del('file.txt'))
    .then(dir())
    .then(list)

}
