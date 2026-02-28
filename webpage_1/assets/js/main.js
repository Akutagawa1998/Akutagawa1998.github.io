/*
	Strata by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var $window = $(window),
		$body = $('body'),
		$header = $('#header'),
		$footer = $('#footer'),
		$main = $('#main'),
		settings = {

			// Parallax background effect?
				parallax: true,

			// Parallax factor (lower = more intense, higher = less intense).
				parallaxFactor: 20

		};

	// Breakpoints.
		breakpoints({
			xlarge:  [ '1281px',  '1800px' ],
			large:   [ '981px',   '1280px' ],
			medium:  [ '737px',   '980px'  ],
			small:   [ '481px',   '736px'  ],
			xsmall:  [ null,      '480px'  ],
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Touch?
		if (browser.mobile) {

			// Turn on touch mode.
				$body.addClass('is-touch');

			// Height fix (mostly for iOS).
				window.setTimeout(function() {
					$window.scrollTop($window.scrollTop() + 1);
				}, 0);

		}

	// Footer.
		breakpoints.on('<=medium', function() {
			$footer.insertAfter($main);
		});

		breakpoints.on('>medium', function() {
			$footer.appendTo($header);
		});

	// Header.

		// Parallax background.

			// Disable parallax on IE (smooth scrolling is jerky), and on mobile platforms (= better performance).
				if (browser.name == 'ie'
				||	browser.mobile)
					settings.parallax = false;

			if (settings.parallax) {

				breakpoints.on('<=medium', function() {

					$window.off('scroll.strata_parallax');
					$header.css('background-position', '');

				});

				breakpoints.on('>medium', function() {

					$header.css('background-position', 'left 0px');

					$window.on('scroll.strata_parallax', function() {
						$header.css('background-position', 'left ' + (-1 * (parseInt($window.scrollTop()) / settings.parallaxFactor)) + 'px');
					});

				});

				$window.on('load', function() {
					$window.triggerHandler('scroll');
				});

			}

	// Main Sections: Two.

		// Lightbox gallery.
			$window.on('load', function() {

				//$('#two').poptrox({
				$('#two').poptrox({
					caption: function($a) { 
						var link = $a.next('h3').find('a');

        				// 获取 a 标签的 href 属性和文本
        				var href = link.attr('href');
        				var text = link.text();

        				// 创建带有链接的 caption
        				return '<a href="' + href + '">' + text + '</a>';},
						// return $a.next('h3').text(); },
					overlayColor: '#2c2c2c',
					overlayOpacity: 0.85,
					popupCloserText: '',
					popupLoaderText: '',
					selector: '.work-item a.image',
					//selector: 'a[data-poptrox="gallery"]',
					usePopupCaption: true,
					usePopupDefaultStyling: false,
					usePopupEasyClose: false,
					usePopupNav: true,
					windowMargin: (breakpoints.active('<=small') ? 0 : 50),
					onPopupOpen: function() {
						// 当光箱打开后，您可以在这里添加事件监听器
						$('.poptrox-popup').css('cursor', 'pointer').on('click', function() {
							// 这里指定用户点击后要跳转的页面
							window.location.href = 'new_page.html';
						})
				}
			});
});

})(jQuery);

// 获取 header 元素
var header = document.getElementById('header');

// 初始化最小尺寸变量
var minSize;

// 在页面加载时设置最小背景尺寸
document.addEventListener('DOMContentLoaded', function() {
  // 获取 header 高度
  var headerHeight = header.offsetHeight;
  
  // 根据 header 高度设置最小背景尺寸
  minSize = headerHeight;

  // 设置初始背景尺寸
  header.style.backgroundSize = 'auto ' + minSize + 'px';
});

// 监听滚动事件
window.addEventListener('scroll', function() {
  // 计算新的背景尺寸，基于滚动距离
  var scrollFactor = window.scrollY / 10; // 比例因子可以根据您的需求调整
  
  // 只增加背景尺寸，不减少
  header.style.backgroundSize = 'auto ' + Math.max(minSize, minSize + scrollFactor) + 'px';
});

// 新的脚本
var img = document.getElementById("myImg");
var modalImg = document.getElementById("img01");
var captionText = document.getElementById("caption");

img.onclick = function(){
  modal.style.display = "block";
  modalImg.src = this.src;
  captionText.innerHTML = this.alt;
}

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function() { 
  modal.style.display = "none";
}


