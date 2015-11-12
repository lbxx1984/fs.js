var controller = {
    fs: null,
    version: function () {
        var str = this.fs.constructor.name + '&nbsp;' + this.fs.version + ':<hr>';
        for (var key in this.fs) {
            if (!this.fs.hasOwnProperty(key)) {
                continue;
            }
            str += '&nbsp;&nbsp;' + key + '<hr>';
        }
        log(str);
    },
    dir: function () {
        this.fs.dir(listDirectory);
    },
    cd: function () {
        var me = this;
        me.fs.cd(get('cd'), function () {
            me.fs.dir(listDirectory);
        });
    },
    md: function () {
        this.fs.md(get('md'), listAll);
    },
    rd: function () {
        this.fs.rd(get('rd'), listAll);
    },
    deltree: function () {
        this.fs.deltree(get('deltree'), listAll);
    },
    create: function () {
        this.fs.create(get('create'), listAll);
    },
    del: function () {
        this.fs.del(get('del'), listAll);
    },
    open: function () {
        this.fs.open(get('open'), function (e) {
            if (typeof e.getMetadata === 'function') {
                var str = [
                    '<table><tr><td>fullPath</td><td>' + e.fullPath + '</td></tr>',
                    '<tr><td>name</td><td>' + e.name + '</td></tr>',
                ];
                e.getMetadata(function (evt) {
                    str.push('<tr><td>time</td><td>' + evt.modificationTime + '</td></tr>');
                    str.push('<tr><td>size</td><td>' + evt.size + 'B</td></tr></table>');
                    log(str.join(''));
                });
            }
        });
    },
    copy: function () {
        this.fs.copy(get('copy1'), get('copy2'), listAll);
    },
    move: function () {
        this.fs.move(get('move1'), get('move2'), listAll);
    },
    ren: function () {
        this.fs.ren(get('ren1'), get('ren2'), listAll);
    },
    read: function (file) {
        file = file || get('read');
        this.fs.read(file, function (e) {
            if (e && e.target) {
                log(e.target.result);
            }
        });
    },
    write: function () {
        var append = document.getElementById('append').checked;
        var file = get('write');
        var str = get('content');
        var me = this;
        this.fs.write(file, {data: new Blob([str]), append: append}, function (e) {
            me.read(file);
        });
    }
};

function listAll() {
    var fs = controller.fs;
    var reading = ['/'];
    var result = {};
    readDir();
    // 层优先遍历
    function readDir() {
        if (reading.length === 0) {
            outputDir();
            return;
        }
        var path = reading.shift();
        fs.dir(function (arr) {
            var items = [];
            for (var i = 0; i < arr.length; i++) {
                var f = arr[i].fullPath;
                items.push(f);
                if (arr[i].isDirectory) {
                    reading.push(f);
                }
            }
            result[path] = items;
            readDir();
        }, path);
    }
    // 深度优先遍历
    function outputDir() {
        var html = 'All files<hr>' + readChildren('/').join('<br>');
        log(html);
        function readChildren(path) {
            var arr = result[path];
            var html = [];
            for (var i = 0; i < arr.length; i++) {
                var namearr = arr[i].split('/');
                var level = namearr.length;
                var isDir = result.hasOwnProperty(arr[i]);
                html.push(
                    produceTab(level - 2) + '&lt;' + (isDir ? 'DIR' : 'FILE') + '&gt;&nbsp;' + namearr[level - 1]
                );
                if (isDir) {
                    html = html.concat(readChildren(arr[i]));
                }
            }
            return html;
        }
        function produceTab(n) {
            var r = '';
            while(n >= 0) {
                r += '&nbsp;&nbsp;';
                n--;
            }
            return r;
        }
    }
}

function listDirectory(arr) {
    var str = ['<table>'];
    var path = controller.fs.getWorkingDirectory().fullPath;
    for (var i = 0; i < arr.length; i++) {
        var file = arr[i].fullPath.split('/');
        str.push([
            '<tr><td>', (arr[i].isDirectory ? '&lt;dir&gt;' : '&lt;file&gt;'), '</td><td>', file.pop(), '</td></tr>'
        ].join(''));
    }
    str.push('</table>');
    str.unshift(path + '<hr>');
    log(str.join(''));
}

function log(str) {
    document.getElementById('screen').innerHTML = str;
}

function get(id) {
    return document.getElementById(id).value;
}

function set(id, value) {
    document.getElementById(id).value = value;
}

window.onload = function () {
    new FileSystem(function (fs) {
        if (!fs) {
            log('Your browser does not support!');
        }
        else {
            controller.fs = fs;
            controller.version();
            document.getElementById('ctrl').addEventListener('click', function (event) {
                var dom = event.target;
                if (typeof controller[dom.value] === 'function' && dom.type === 'button') {
                    controller[dom.value]();
                }
            });
            document.getElementById('ctrl').addEventListener('keyup', function (event) {
                var dom = event.target;
                if (event.keyCode === 13 && typeof controller[dom.id] === 'function' && dom.type === 'text') {
                    controller[dom.id]();
                }
            });
        }
    });
};
