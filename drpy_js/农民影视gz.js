var rule = {
    title: '农民影视',
    host: 'https://www.wwgz.cn/',
    /*
    hostJs:`print(HOST);let html=request(HOST,{headers:{"User-Agent":MOBILE_UA}});
    let src = jsp.pdfh(html,"body&&a:eq(1)&&href")||jsp.pdfh(html,"body&&a:eq(1)&&Text");
    if(!src.startsWith('http')){src='https://'+src};print("抓到主页:"+src);HOST=src`,
    */
    url: '/vod-list-id-fyfilter.html',
    filterable: 1,//是否启用分类筛选,
    filter_url: '{{fl.cateId}}-pg-fypage-order--by-{{fl.by or "time"}}-class-0-year-{{fl.year}}-letter-{{fl.letter}}-area-{{fl.area}}-lang-',
    filter: 'H4sIAAAAAAAAA+2Z304TQRyF32WvuZjZtjNT3sBnMFxUbCJRMQE0IYRELQgtCmqkFSz+iZaWiFICIbIIfZnulr6FW7o756CJMeFKMnf9ndOdnW9osl+WOU96ozfnvLvFWW/UGy/MFG/c9ka8ycL9Yjz39k/C9yvx/Khw72Hx4ouTcRwutvql1iCOB+nNjyRxpdU9rffKS0mTQ1Oth+UmGmWb3vJ+VFpEo9E0X4XHJ2iMbaInL6PHVTR53KfcvLSaFLho+W03KFOFfUelSvR0kypsL2wsXdqEjPc3NiiH51WYKhZwWmG9HT4P/n5aWPlLs7/xLEmTIe362xvRj72kSwZ73Vo7Oj5LrxsO9sjOVsN3p0mXDHbNDzvoksEeQK0R1XeTLhlsd9DGdclgu2o7rHwMtz6ltZ3tXXd2o63GeaPTDTbTe3NkqV60w2A7pRoOaXe+so8dJAN2t867W+cu3kq00omPNl3WznblRqe39q1X3kgXt3P6jW5noXdai6rpHwOzvcviUfi9lN5iOPBPZLZYmKKfyPFh9+TzP/5EfOFnkuziI+U+cp9ziVxyLpALymXe5jLPuUFuONfINecKueI8hzzHeRZ5lnPwSuaV4JXMK8ErmVeCVzKvAK9gXgFewbwCvIJ5BXgF8wrwCuYV4BXMK8ArmFeAVzCvAK9gXgFeAV6Zz6e8Fx8pN8gN5xq55lwhV5znkOc4zyLPcp5BnuHcR+5zLpFLzgVy5jXgNcxrwGuY14DXMK8Br2FeA17DvAa8hnkNeA3zGvAa5jXgNcxrwGuYV4NXM68Gr2ZeDV7NvBq8mnk1eDXzavBq5tXg1cyrwauZV4NXM68Gr2ZeBV7FvAq8inkVeBXzKvAq5lXgVcyrwKuYV4FXMa8Cr2JeBV7FvAq88Ud+fNyaxcMjWn0dBmt/PDyi2lG/dpgsMDMRf9U+vYIgar9JmjsTM9N48u0thMupfUyPP5gqDu46NuL5V7RB0MaP4m7QjI0sRUMV+8zAXA7aaYWzi+1jICe4Cscd7TYHToMq51zMuZhzMedizsWcizkXcy52zVwsQy7m7MbZjbMbZzfObpzdOLtxdvP/2032im+acDphpRX9/EovhsxvFf3/Lu/eGTmrclblrMpZlbMqZ1XOqq6ZVfnKvTRyeuP0xumN0xunN05vnN5cI72Z/wVNTNQhri4AAA==',
    filter_def: {
        1: {cateId: '1'},
        2: {cateId: '2'},
        3: {cateId: '3'},
        4: {cateId: '4'},
        26: {cateId: '26'}
    },
    searchUrl: '/index.php?m=vod-search&wd=**',
    searchable: 2,//是否启用全局搜索,
    searchNoPage: 1,//是否关闭搜索分页,
    headers: {//网站的请求头,完整支持所有的,常带ua和cookies
        'User-Agent': 'MOBILE_UA',
    },
    // class_parse: '#topnav li:lt(4);a&&Text;a&&href;.*/(.*?).html',
    class_name: '电影&连续剧&综艺&动漫&短剧',//静态分类名称拼接
    class_url: '1&2&3&4&26',//静态分类标识拼接
    play_parse: true,
    lazy: $js.toString(() => {
        pdfh = jsp.pdfh;
        pdfa = jsp.pdfa;
        let html = request(input);
        let mac_url = html.match(/mac_url='(.*?)';/)[1];
        let mac_from = html.match(/mac_from='(.*?)'/)[1];
        log(mac_from);
        let index = parseInt(input.match(/num-(\d+)/)[1]) - 1;
        let playUrls = mac_url.split('#');
        let playUrl = playUrls[index].split('$')[1];
        log(playUrl);
        let jx_js_url = 'https://api.cnmcom.com/nmapi/nmbof/' + mac_from + '.js';
        html = request(jx_js_url);
        let jx_php_url = html.match(/src="(.*?)'/)[1];
        if (mac_from.includes('m3u8')) {
            html = request(jx_php_url + playUrl);
            let realUrl = html.match(/url='(.*?)'/)[1];
            if (realUrl) {
                input = {parse: 0, url: realUrl};
            }
        } else {
            html = request(jx_php_url + playUrl, {headers: {'Referer': 'https://nmvod.cnmcom.com/'}});
            let line1 = html.match(/case\s+'线路①':\s*src\s*=\s*'(.*?)'/)[1];
            html = request(line1 + playUrl, {headers: {'Referer': jx_php_url + playUrl}});
            let realUrl = html.match(/url.*?'(.*?)'/)[1];
            if (realUrl) {
                input = {parse: 0, url: realUrl};
            }
        }
    }),
    limit: 6,
    推荐: '.globalPicList .resize_list;*;img&&data-src;*;*',
    一级: '.globalPicList li;.sTit&&Text;img&&src;.sBottom--em&&Text;a&&href',
    二级: {
        "title": ".title&&Text;.type-title&&Text",
        "img": ".page-hd&&img&&src",
        "desc": ".desc_item:eq(3)&&Text;.desc_item:eq(4)--span&&Text;;.desc_item:eq(1)--span&&Text;.desc_item:eq(2)--span&&Text",
        "content": ".detail-con p&&Text",
        "tabs": ".hd li",
        "lists": ".numList:eq(#id) li"
    },
    搜索: '.ulPicTxt.clearfix li;*;img&&data-src;.sDes:eq(1)&&Text;*',
    搜索验证标识: '系统安全验证',
}
