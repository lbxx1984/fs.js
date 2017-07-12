new FileSystem(init);


function init(fs) {


    log(['$: md h5fs-test-folder']);
    fs.md('h5fs-test-folder')
    .then(function () {
        log(['$: md h5fs-test-folder-2']);
        return fs.md('h5fs-test-folder-2');
    })
    .then(function () {
        log(['$: dir']);
        return fs.dir();
    })
    .then(function (res) {
        list(res);
        log(['$: cd h5fs-test-folder']);
        return fs.cd('h5fs-test-folder');
    })
    .then(function () {
        log(['$: md folder']);
        return fs.md('folder');
    })
    .then(function () {
        log(['$: md empty-folder-that-will-be-removed-later']);
        return fs.md('empty-folder-that-will-be-removed-later');
    })
    .then(function () {
        log(['$: md folder/child-folder']);
        return fs.md('folder/child-folder');
    })
    .then(function () {
        log(['$: dir folder']);
        return fs.dir('folder');
    })
    .then(function (res) {
        list(res);
        log(['$: dir']);
        return fs.dir();
    })
    .then(function (res) {
        list(res);
        log(['$: rd empty-folder-that-will-be-removed-later']);
        return fs.rd('empty-folder-that-will-be-removed-later');
    })
    .then(function () {
        log(['$: dir']);
        return fs.dir();
    })
    .then(function (res) {
        list(res);
        log(['$: rd folder']);
        return fs.rd('folder');
    })
    .then(null, function (e) {
        log(['&nbsp;&nbsp;&nbsp;&nbsp;' + e]);
        log(['$: deltree folder']);
        return fs.deltree('folder');
    })
    .then(function () {
        log(['$: dir']);
        return fs.dir();
    })
    .then(function (res) {
        list(res);
        log(['$: cd ..']);
        return fs.cd('..');
    })
    .then(function () {
        log(['$: ls']);
        return fs.ls();
    })
    .then(function (res) {
        list(res);
        log(['$: create file.txt']);
        return fs.create('file.txt');
    })
    .then(function (file) {
        console.log(file);
        return new Promise(function (resolve, reject) {
            file.getMetadata(function (meta) {
                console.log(meta);
                resolve();
            });
        });
    })
    .catch(function (e) {
        log([e]);
    });


}


function list(res) {
    log(res.map(function (entry) {
        return '&nbsp;&nbsp;&nbsp;&nbsp;' + entry.fullPath;
    }));
}


function log(lines) {
    document.body.innerHTML += lines.join('<br/>') + '<br/>';
}
