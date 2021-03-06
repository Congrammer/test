!function(){
	if(window['__actualize.js'])return;window['__actualize.js']=1;
	var actual = "https://api.kinogram.best"
		,ignore,last = 'https://api.placehere.link'
		,re=/^https?:\/\/(?:mm|app?i\w*)\.(delivembed\.cc|buildplayer\.com|embedstorage\.net|mir-dikogo-zapada\.com|multikland\.net|placehere\.link)/
		,delay=200
		,dry=[]
		,MS = window.MediaSource || window['WebKitMediaSource']
		,ios=~navigator.userAgent.indexOf('iPhone')
		,s=document.createElement('style');
	s.innerHTML='.collaps-fake-fullscreen{position:fixed !important;width:100% !important;height:100% !important;left:0;top:0;z-index:1111}';
	document.head.appendChild(s);
	addEventListener('message',function(e){
		if(!re.test(e.origin)||e.data.event!=='fakeFullScreen')return;
		var ifr = findFrame(function(i){return i.src===e.data.src});
		if(ifr)ifr.classList.toggle('collaps-fake-fullscreen');
	});
	var ral;if(window.fetch&&!ios)head('https://hls-c1.streamvid.club/ping').catch(function(){ral=1});
	new Image().src = "https://stats.myangular.life/player?hit=script&sub=actualize&host=" + location.hostname;
	replace();
	function findFrame(fn){
		if(document.body)return Array.prototype.find.call(document.body.getElementsByTagName('iframe'),fn);
	}
	function replace(){
		setTimeout(replace,delay++);
		var old,i = findFrame(function(ii){return old=ii.src&&ii.src.indexOf(actual)&&dry.indexOf(ii.src)===-1&&ii.src.match(re)});
		if (!i ||i.offsetWidth===0||old[0]==ignore) return;
		dry.push(i.src);
		var f=function(){
			var url = i.src.replace(old[0], actual);
			get(url, function(r){
				if(ral===1)return;
				var up=update(i,r);
				dry=[];
				if(window.URL){
					url=new URL(url);
					url.searchParams.delete('episode');
				}
				addEventListener('message',function(e){
					if(e.origin==location.origin&&e.data=='reActualizeMe'&&up.contentWindow==e.source)
						get(url,function(r){up=update(up,r);})
				})
			})
		};
		if ((ios&&'https:'==location.protocol)
			||(!MS&&(navigator.serviceWorker||(!ios&&'http:'==location.protocol)))) {
			head(last + '/ping/').then(function () {
				i.src = i.src.replace(old[0], last);
				dry = [];
				ignore=last;
			}).catch(f);
		} else f();
	}
	function update(old,w){
		var up=document.createElement('iframe');
		copyAttr(old,up);
		up.setAttribute('allow', 'autoplay *; fullscreen');
		up.allow = 'autoplay *; fullscreen';
		old.parentElement.replaceChild(up,old);
		up.contentDocument.write(w);
		up.contentDocument.close();
		return up;
	}
	function copyAttr(from,to){
		var attrs=from.attributes;
		for(var i=0;i<attrs.length;i++){
			if(attrs[i].name!=='src'&&/^[\w\-]+$/.test(attrs[i].name))
				to.setAttribute(attrs[i].name,attrs[i].value);
		}
	}
	function get(url, cb) {
		var xhr = new XMLHttpRequest;
		xhr.withCredentials = true;
		xhr.open('GET', url);
		xhr.onreadystatechange = function() {
			if (xhr.readyState === 4 && xhr.status === 200) cb(xhr.response);
		};
		xhr.send();
	}
	function head(u) {
		return fetch(u,{method:'head'});
	}
}()
