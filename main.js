require(['FileSystem'], function (FileSystem) {
    var fs = FileSystem({}, done);

    function done() {
        outputFileList();
    }

    function outputFileList() {
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
            var html = readChildren('/').join('<br>');
            document.write(html);
            function readChildren(path) {
                var arr = result[path];
                var html = [];
                for (var i = 0; i < arr.length; i++) {
                    var level = arr[i].split('/').length;
                    html.push(produceTab(level - 2) + arr[i]);
                    if (result[arr[i]]) {
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
});