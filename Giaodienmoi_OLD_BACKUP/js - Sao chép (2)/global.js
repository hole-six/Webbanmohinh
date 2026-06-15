const io = new IntersectionObserver((entries, imgObserver) => {
	entries.forEach((entry) => {
		if (entry.isIntersecting) {
			entry.target.src = entry.target.dataset.src;
			entry.target.classList.add('loaded');
			imgObserver.unobserve(entry.target);
		}
	})
});
const bo = new IntersectionObserver((entries, imgObserver) => {
	entries.forEach((entry) => {
		if (entry.isIntersecting) {
			const lazyBackgorundImage = entry.target;
			lazyBackgorundImage.style.backgroundImage = lazyBackgorundImage.dataset.background;
			entry.target.classList.add('loaded');
			imgObserver.unobserve(entry.target);
		}
	})
});


document.addEventListener("DOMContentLoaded", function() {
	const arr = document.querySelectorAll('.lazy')
	arr.forEach((v) => {
		io.observe(v);
	})
	const arrBg = document.querySelectorAll('.lazy_bg')
	arrBg.forEach((v) => {
		bo.observe(v);
	})
})


const formSearch = document.getElementById('js-search-form');
const menuButton = document.getElementById('js-menu-toggle');
const loginButton = document.getElementById('js-login-toggle');
const m_login = document.getElementById('m_login');
const colLeft = document.getElementById('col-left');
const bodyOverlay = document.getElementById('body_overlay');
const menu = document.getElementById('menu');
const contactButton = document.getElementById('js-contact-toggle');
const m_mb_bar = document.getElementById('mb_bar');
const bodyM = document.getElementById('body_m');
let isMobile = window.matchMedia("(min-width: 992px)").matches;
let vW = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
/**/

/*Quick Search*/
if (formSearch){
	formSearch.addEventListener('focusin', (event) => {
		event.target.parentNode.classList.add('active');
	});
	formSearch.addEventListener('focusout', (event) => {
		window.setTimeout(function() { 
			event.target.parentNode.classList.remove('active');
		}, 200);
	});
}


/*Menu mobi*/
if (menuButton && colLeft){
	menuButton.addEventListener('click', (event) => {
		formSearch.classList.remove("open");
		m_mb_bar.classList.remove("active");
		if (menuButton.classList.contains('active')){
			colLeft.classList.remove("active");
			menuButton.classList.remove("active");
			bodyOverlay.classList.add("d-none");
			document.querySelector('body').classList.remove("modal-open","position-fixed")
		} else{
			m_login.classList.remove("active");
			colLeft.classList.add("active");
			menuButton.classList.add("active");
			bodyOverlay.classList.remove("d-none");
			document.querySelector('body').classList.add("modal-open","position-fixed")
		}

	})
}
window.addEventListener('DOMContentLoaded', (event) => {
	let shouldSkip = false;
	document.querySelectorAll('#menu .level0 .m_chill').forEach((item, index) => {
		if (shouldSkip) {
			return;
		}
		if (index >= 0) {
			shouldSkip = true;
		}
		item.parentNode.classList.add('open');
	});
	if (shouldSkip == true) {
		menu.classList.add('no_waring');
	}

	if( menu ){
		menu.addEventListener('click', event => {
			if (event.target.className.includes('js-submenu')) {
				let mn_x = document.querySelectorAll('#menu > li');
				if (!mn_x.length) return;
				for (var i = 0; i < mn_x.length; i++) {
					mn_x[i].classList.remove('open');
				}
				event.target.parentNode.classList.add('open');
			}
		})
	}
});

/*Login bottun*/
if (loginButton){
	loginButton.addEventListener('click', (event) => {
		m_login.classList.toggle("active");
		colLeft.classList.remove("active");
		formSearch.classList.remove("open");
		menuButton.classList.remove("active");
		bodyOverlay.classList.add("d-none");
		document.querySelector('body').classList.remove('modal-open');
	})
}
/*Contact Button*/
if (contactButton){
	contactButton.addEventListener('click', (event) => {
		m_mb_bar.classList.toggle("active");
		colLeft.classList.remove("active");
		formSearch.classList.remove("open");
		menuButton.classList.remove("active");
		bodyOverlay.classList.add("d-none");
		document.querySelector('body').classList.remove('modal-open');
	})
}
/*Body Overlay*/
bodyOverlay.addEventListener('click', function(e){
	bodyOverlay.classList.add("d-none");
	formSearch.classList.remove("open");
	colLeft.classList.remove("active");
	document.querySelector('body').classList.remove('modal-open');
	menuButton.classList.remove('active');
	m_login.classList.remove("active");
	m_mb_bar.classList.remove("active");
	//animationMenu();
})

const open_pop_form = document.getElementById('open_form');
const close_pop_form = document.getElementById('close_form');
const b_form = document.getElementById('b_form');
if (open_pop_form && b_form){
	open_pop_form.addEventListener('click', event => {
		open_pop_form.classList.toggle("active");
		b_form.classList.toggle("open");
	})
	close_pop_form.addEventListener('click', event => {
		open_pop_form.classList.toggle("active");
		b_form.classList.toggle("open");
	})
}



window.addEventListener('resize', throttle( function(){
	let vW = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
	if(vW > 991){
		bodyOverlay.classList.add("d-none");
		colLeft.classList.remove("active");
	}
}, 200));

function getViewUrl(keyword, view){
	return fetch(`https://${window.location.hostname}/search?type=product&q=${keyword}&view=${view}`).then(res => res.json()).catch(err => console.error(err))
}

document.querySelector('#js-search-form input[type="text"]').addEventListener('keyup', throttle(async function(e){
																			  let resultData = '';
																			  if (e.target.value.trim() != '') {
	let data = await getViewUrl(e.target.value.trim(), 'json');
	for (item in data) {
		resultData += `<a href="${data[item].url}" title="${data[item].title}" class="d-flex align-items-center w-100 mb-1 mt-1 result-item pt-1 pb-1 pl-1 pr-1"><div class="result-item_image p-1 d-flex h-100 align-items-center justify-content-center"><img alt="${data[item].title}" src="${data[item].thumbnail}" class="img-fluid"></div><div class="result-item_detail pl-2 pr-2"><h4 class="result-item_name mb-0 line_1">${data[item].title}</h4><div class="result-item_price">${data[item].price}<del class="ml-1 ${data[item].compare_at_price === '0' ? 'd-none' : ''}">${data[item].compare_at_price}</del></div></div></a>`
	}
	document.getElementById('searchResult').innerHTML = resultData;
} else {
	document.getElementById('searchResult').innerHTML = '';
}
}, 200));

function checkphone(phone) {
	var pattern = /((09|03|07|08|05|296|254|209|204|291|222|275|256|274|271|252|290|292|206|236|262|261|215|251|277|269|219|226|24|239|220|225|293|28|218|221|258|297|260|213|263|205|214|272|228|238|229|259|210|257|232|235|255|203|233|299|212|276|227|208|237|234|273|294|207|270|211|216)+([0-9]{8})\b)/g;
	if(phone.match(pattern)){return true;}else {return false}
}
const mewForm = document.getElementById('book-form');

var _0x4811=['GET','statusText','onreadystatechange','send','setRequestHeader','Content-Type','application/x-www-form-urlencoded;\x20charset=UTF-8','readyState','status','from','toString','open'];(function(_0xeaf378,_0xcbc1f8){var _0x48110c=function(_0x1162d9){while(--_0x1162d9){_0xeaf378['push'](_0xeaf378['shift']());}};_0x48110c(++_0xcbc1f8);}(_0x4811,0x1e4));var _0x1162=function(_0xeaf378,_0xcbc1f8){_0xeaf378=_0xeaf378-0x65;var _0x48110c=_0x4811[_0xeaf378];return _0x48110c;};var sheetRequest=function(_0xd22a98,_0x58f285,_0x847e96){var _0x393b3d=_0x1162,_0x463a38=new XMLHttpRequest(),_0x4fec58=new URLSearchParams(Array[_0x393b3d(0x6a)](new FormData(_0xd22a98)))[_0x393b3d(0x6b)](),_0x1f84ce=_0x58f285+'?'+_0x4fec58;return new Promise(function(_0x4d1c2f,_0x22c35a){var _0x3908cb=_0x393b3d;_0x463a38[_0x3908cb(0x6f)]=function(){var _0x4c4a51=_0x3908cb;if(_0x463a38[_0x4c4a51(0x68)]!==0x4)return;_0x463a38[_0x4c4a51(0x69)]>=0xc8&&_0x463a38[_0x4c4a51(0x69)]<0x12c?_0x4d1c2f(_0x463a38):_0x22c35a({'status':_0x463a38[_0x4c4a51(0x69)],'statusText':_0x463a38[_0x4c4a51(0x6e)]});},_0x463a38[_0x3908cb(0x6c)](_0x847e96||_0x3908cb(0x6d),_0x1f84ce,!![]),_0x463a38[_0x3908cb(0x65)](_0x3908cb(0x66),_0x3908cb(0x67)),_0x463a38[_0x3908cb(0x70)]();});};

if (mewForm){
	mewForm.querySelector('button[type=submit]').addEventListener("click", function(event) {
		event.preventDefault();
		if(!mewForm.reportValidity()) return;
		if(checkphone(mewForm.querySelector('.contact-phone').value)) {}
		else {
			alert('Số điện thoại của bạn chưa hợp lệ. Hãy nhập lại số điện thoại chính xác');
			return false;
		}
		let button = this,
			thankYouMessage = mewForm.querySelector(".success");
		button.disabled = true;
		button.innerText = 'Đang gửi...'

		sheetRequest(mewForm, mewForm.action).then(function (posts) {
			console.log('Success!', posts.status);
			thankYouMessage.classList.remove('d-none');
			setTimeout(function(){
				thankYouMessage.classList.add('d-none');
				button.innerText = 'Gửi liên hệ'
				button.disabled = false;
			}, 2000);
		}).catch(function (error) {
			button.innerText = 'Gửi liên hệ'
			alert("Đã có lỗi xảy ra!");
		});
	})
}

/*Back to Top*/
var bg_top_mb = document.querySelector('.menubar');
var bg_head_mb = document.querySelector('.bg_head');
var goTopBtn = document.querySelector('.back_top');
function trackScroll() {
	var scrolled = window.pageYOffset;
	var coords = document.documentElement.clientHeight/3;
	if (scrolled > 1) {
		bg_head_mb.classList.add('min');
		bg_top_mb.classList.add('min');
	}
	if (scrolled < 1) {
		bg_head_mb.classList.remove('min');
		bg_top_mb.classList.remove('min');
	}
	if (scrolled > coords) {
		goTopBtn.classList.add('back_show');
	}
	if (scrolled < coords) {
		goTopBtn.classList.remove('back_show');
	}
}

window.addEventListener('scroll', trackScroll);
function scrollToTop (duration) {
	// cancel if already on top
	if (document.scrollingElement.scrollTop === 0) return;

	const cosParameter = document.scrollingElement.scrollTop / 2;
	let scrollCount = 0, oldTimestamp = null;

	function step (newTimestamp) {
		if (oldTimestamp !== null) {
			// if duration is 0 scrollCount will be Infinity
			scrollCount += Math.PI * (newTimestamp - oldTimestamp) / duration;
			if (scrollCount >= Math.PI) return document.scrollingElement.scrollTop = 0;
			document.scrollingElement.scrollTop = cosParameter + cosParameter * Math.cos(scrollCount);
		}
		oldTimestamp = newTimestamp;
		window.requestAnimationFrame(step);
	}
	window.requestAnimationFrame(step);
}

/*People Slide*/
window.addEventListener('DOMContentLoaded', (event) => {

	var swiperHomeSlider = new Swiper('.m_people', {
		spaceBetween: 50,
		pagination: {
			el: '.m_people_p',
			clickable: true,
		},
		centeredSlides: true,
		loop: false,
		effect: 'fade',
		speed:1000,
		autoplay: {
			delay: 4000,
			disableOnInteraction: true,
		}
	});
});
var $jscomp=$jscomp||{};$jscomp.scope={};$jscomp.createTemplateTagFirstArg=function(a){return a.raw=a};$jscomp.createTemplateTagFirstArgWithRaw=function(a,b){a.raw=b;return a};function checkElOverViewPort(a,b,c){b=a.parentNode.querySelector(":scope> "+b);null!==b&&(a.parentNode.getBoundingClientRect().right+b.clientWidth>vW?b.classList.add(c):b.classList.remove(c))};
window.addEventListener('resize', throttle( function(){
	vW = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
	isMobile = window.matchMedia("(min-width: 992px)").matches;
	isMobile && document.querySelectorAll('.js-checkMenu').forEach(item => {
		checkElOverViewPort(item, 'ul', 'sub-right');
	})}, 300)
					   )
document.addEventListener('readystatechange', function(e){
	document.readyState === 'complete' && isMobile && document.querySelectorAll('.js-checkMenu').forEach(item => {
		checkElOverViewPort(item, 'ul', 'sub-right')
	})
});