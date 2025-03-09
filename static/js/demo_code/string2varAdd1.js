(() => {
    var xhrPost = (url, d, onload) => {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', url);
        xhr.setRequestHeader('Content-Type', "application/x-www-form-urlencoded");
        xhr.responseType = 'json';
        xhr.onload = () => {
            onload(xhr);
        };
        var data = window.asrsea(d, e, f, g);
        data.params = data.encText;
        delete data.encText;
        data = new URLSearchParams(data);
        xhr.send(data);
    };

    var e = '010001';
    var f = '00e0b509f6259df8642dbc35662901477df22677ec152b5ff68ace615bb7b725152b3ab17a876aea8a5aa76d2e417629ec4ee341f56135fccf695280104e0312ecbda92557c93870114af6c9d05c4f7f0c3685b7a46bee255932575cce10b424d813cfe4875d3e82047b97ddef52741d546b8e289dc6935b3ece0462db0a22b8e7';
    var g = '0CoJUm6Qyw8W8jud';

    var url = 'https://music.163.com/weapi/resource/like';
    var d = JSON.stringify({
        threadId: 'A_EV_2_30042891852_415575102'
    });
    xhrPost(url, d, (xhr) => {
    });

    url = 'https://music.163.com/weapi/resource/comments/add';
    d = JSON.stringify({
        threadId: 'A_EV_2_30042891852_415575102',
        content: '(｀・ω・´)来啦~',
    });
    xhrPost(url, d, (xhr) => {
    });

    document.body.innerHTML = '';
    document.body.style.fontSize = '16px';
    var interval = 2;
    var authorElement = document.createElement('p');
    var demoElement = document.createElement('a');
    var countElement = document.createElement('p');
    var tipsElement = document.createElement('p');
    var claimElement = document.createElement('p');
    var buttonElement = document.createElement('button');
    authorElement.textContent = "@delic1ous";
    authorElement.style.padding = '6px';
    demoElement.textContent = '视频演示';
    demoElement.style.padding = '6px';
    demoElement.href = 'https://www.bilibili.com/video/BV1wJ4m1G751';
    demoElement.target = '_blank';
    demoElement.style.textDecoration = 'underline';
    tipsElement.textContent = `说明：需要先登录，然后进入想刷的歌曲页面运行该脚本。每隔${interval}秒刷一次（刷的太多最近一周里的记录第二天会被清除，所有时间里不会清除）`;
    tipsElement.style.padding = '6px';
    claimElement.textContent = '免责声明：本脚本仅供娱乐，请勿滥用，否则所产生的一切后果与责任由您自行承担。';
    claimElement.style.padding = '6px';
    var count = 0;
    countElement.textContent = `理论上已刷${count}次`;
    countElement.style.paddingTop = '12px';
    countElement.style.paddingBottom = '6px';
    countElement.style.fontSize = '24px';
    countElement.style.textAlign = 'center';
    buttonElement.textContent = '开始';
    buttonElement.value = 'start';
    buttonElement.style.padding = '6px';
    buttonElement.style.fontSize = '20px';
    buttonElement.style.backgroundColor = '#4CAF50';
    buttonElement.style.color = 'white';
    buttonElement.style.border = 'none';
    buttonElement.style.borderRadius = '4px';
    buttonElement.style.display = 'block';
    buttonElement.style.margin = '0 auto';

    var timer = null;
    url = 'https://music.163.com/weapi/feedback/weblog';
    var onload = (xhr) => {
        var response = xhr.response;
        if (response.code === 200) {
            countElement.textContent = `理论上已刷${count++}次`;
        } else {
            buttonElement.click();
            alert(`出错了哦：${JSON.stringify(response)}`);
        }
    };
    var songId = location.href.split('id=')[1];
    d = JSON.stringify({
        logs: JSON.stringify([{
            action: 'play',
            json: {
                type: 'song',
                wifi: 0,
                download: 0,
                id: Number(songId),
                time: 31,
                end: 'ui',
                mainsite: '1',
                content: 'id=' + songId,
            }
        }])
    });
    buttonElement.addEventListener('click', () => {
        if (buttonElement.value === 'start') {
            buttonElement.value = 'pause';
            buttonElement.textContent = '暂停';
            timer = setInterval(() => {
                xhrPost(url, d, onload);
            }, interval * 1000);
        } else {
            buttonElement.value = 'start';
            buttonElement.textContent = '开始';
            clearInterval(timer);
        }
    });
    document.body.appendChild(countElement);
    document.body.appendChild(tipsElement);
    document.body.appendChild(authorElement);
    document.body.appendChild(demoElement);
    document.body.appendChild(claimElement);
    document.body.appendChild(buttonElement);
})();