// ==UserScript==
// @name        HES
// @namespace   http://github.com/keyten
// @description Habrahabr Enhancement Suite
// @include     http://geektimes.ru/*
// @include     http://habrahabr.ru/*
// @include     http://megamozg.ru/*
// @include     https://geektimes.ru/*
// @include     https://habrahabr.ru/*
// @include     https://megamozg.ru/*
// @match       http://geektimes.ru/*
// @match       http://habrahabr.ru/*
// @match       http://megamozg.ru/*
// @match       https://geektimes.ru/*
// @match       https://habrahabr.ru/*
// @match       https://megamozg.ru/*
// @exclude     %exclude%
// @author      HabraCommunity
// @version     1
// @grant       none
// ==/UserScript==

// Настройки
// Авторы, посты которых скрываем
(function(window, $, undefined){
	var config = {
		hidePosts: {
			enabled: true,
			authors: [
				'alizar',
				'marks',
				'ivansychev',
				'ragequit',
				'SLY_G'
		 ],
			mode: 'hideContent'
		},

		mathjax: true,

		nightMode: false,

		hideUserInfo: false // скрывать "плашки", появл. при наведении на ник пользователя
	};

	// подгружаем настройки из localStorage
	var citem;
	if( citem = localStorage.getItem('us_config') ){
		citem = JSON.parse(citem);
		for(var key in citem){
			if(!Object.prototype.hasOwnProperty.call(citem, key))
				continue;
			config[key] = citem[key];
		}
	}
	else {
		localStorage.setItem('us_config', JSON.stringify(config));
	}

	// стиль для nightMode
	var nmstyle = "@media screen{#TMpanel{z-index:2;background:#111;border:none}body{background-color:#111!important;color:#bbb}#layout,#xpanel,.to_top{z-index:1}#layout #navbar,#layout .inner{background:#333!important}#footer{position:relative;z-index:1}#navbar .nav_panel .logo{opacity:0.3}#navbar .nav_panel .tab.tab_settings:hover,#navbar .nav_panel .tab:hover{background-position:0 0}#navbar .nav_panel .tab.tab_user img,.comments_list .comment_item .info a.avatar img,.conversation_page .messages .message .info a.avatar img,.author-info__image-pic,.user_header .avatar img,.post h1.title .flag_sandbox,.post h1.title .flag_recovery,.post h1.title .flag_translation,.postinfo-panel__item + .postinfo-panel__item .post-author__pic,.company_top_banner img,.company_header .company_icon img{opacity:0.5;-webkit-filter:grayscale(0.8);-moz-filter:grayscale(0.8);-ms-filter:grayscale(0.8);-o-filter:grayscale(0.8);filter:grayscale(0.8);transition:all .3s}#navbar .nav_panel .tab.tab_user img:hover,.comments_list .comment_item .info a.avatar img:hover,.conversation_page .messages .message .info a.avatar img:hover,.author-info__image-pic:hover,.user_header .avatar img:hover,.postinfo-panel__item + .postinfo-panel__item:hover .post-author__pic,.company_top_banner img:hover,.company_header .company_icon img:hover{opacity:1;-webkit-filter:grayscale(0);-moz-filter:grayscale(0);-ms-filter:grayscale(0);-o-filter:grayscale(0);filter:grayscale(0)}#navbar .nav_tabs_content .nav_tab .menu a,.conversation_page .messages .message .info .time{color:#fff}#navbar .nav_tabs_content .nav_tab .title a,#navbar .nav_tabs_content .nav_tab .title{color:#bbb}#navbar .nav_panel .tab .g-icon{vertical-align:middle;font-size:32px}.editor .panel .wysiwyg_wrapper .btn .g-icon,#navbar .nav_panel .tab .g-icon{color:#777}#navbar .nav_panel .tab .count:not(:empty),#navbar .nav_tabs_content .nav_tab .menu a .count:not(:empty){background:#79b;color:#000}.page_head{z-index:200}.comments_list .comment_item .info .folding-dot{background-image:url(http://habrastorage.org/files/52f/683/1d1/52f6831d16784d71b3dcf72b003851fc.png)}.comments_list .comment_item .info.is_new,.conversation_page .messages .message.new .info{background:#445}.comments_list .comment_item .info.is_topic_starter{background:#454}.content_left table.menu tr td a,.content_left .submenu{background:#555;border:none;color:#fff}.content_left table.menu tr td span.count_new,.sidebar_right .block.habralenta_settings .category-list .category .new,.post .hubs a.subscribed,.comments_list .comment_item .info .voting .mark.positive span{color:#4a4}.content_left table.menu tr td.active a,.content_left .submenu .item.active{background:#444;border:none;color:#d3e2f0}.comments_list .comment_item .info a.username,#navbar .nav_tabs_content .navtab .title,.conversation_page .messages .message .info .login a{color:#ddd}.page-nav #nav-pages li em{background:#6da3bd;color:#333}.sidebar_right .block.for_authors_help .row .g-icon,.sidebar_right .block.about_exchange .row .g-icon{color:rgba(255,255,255,.2)}.sidebar_right .block{background:#222;opacity:.5!important;transition:all .3s}.sidebar_right .block:hover{opacity:1!important}.sidebar_right .block.for_authors_help .row .text{color:#858585}.sidebar_right .block.for_authors_help .line{background:#555!important;border-top:1px solid #333}.sidebar_right .block > .show_more{background:#383838}.sidebar_right .block .posts_list .post_item .count,.comments_list .comment_item_plain .post_info .count,.comments_list .comment_item .info .voting .mark.negative span{color:#a44!important}.posts .post h1.title,.post h1.title a.post_title,.post h1.title,.html_format h1,.html_format h2,.html_format h3,.html_format h4,.html_format h5,.html_format h6,.page_head h2.title{color:#B9C5CF}.sidebar_right .block .posts_list .post_item a.post_name,.post ul.tags li a,.sidebar_right .block.best_company .company_info p a,.sidebar_right .block.new_vacanies .vacancies .job_item a,.sidebar_right .block.freelansim .tasks .task a,.html_format.message a,.content_left .submenu .item a,.post .content a,.html_format a,.user_header h2.username a,.conversations .conversation a.conversation_link,.page_head h2.title,#TMpanel .container .menu a,#TMpanel .container .bmenu a,.bottom_promo_blocks .block.new_vacanies .vacancies .job_item a,.bottom_promo_blocks .block.freelansim .tasks .task a,.block_after_post .block.similar_posts .posts_list .post_item a.post_name{color:#93b2d0}.post h1.title a.post_title:visited,.sidebar_right .block .posts_list .post_item a.post_name:visited,.post ul.tags li a:visited,.sidebar_right .block.best_company .company_info p a:visited,.sidebar_right .block.new_vacanies .vacancies .job_item a:visited,.sidebar_right .block.freelansim .tasks .task a:visited,.html_format.message a:visited,.content_left .submenu .item.active a,.post .content a:visited,.html_format a:visited,.grey a,a.grey,#TMpanel .container .menu a.current,#TMpanel .container .bmenu a.current,.bottom_promo_blocks .block.new_vacanies .vacancies .job_item a:visited,.bottom_promo_blocks .block.freelansim .tasks .task a:visited,.block_after_post .block.similar_posts .posts_list .post_item a:visited.post_name{color:#738290}.buttons button,.buttons a.button,.buttons input,.buttons button.blue,.buttons a.button.blue,.buttons input.blue,.buttons input.green,.buttons button.blue:hover,.buttons a.button.blue:hover,.buttons input.blue:hover,.buttons input.green:hover,.buttons button.blue:active,.buttons a.button.blue:active,.buttons input.blue:active,.buttons input.green:active,.buttons button.loading,.buttons a.button.loading,.buttons input.loading,.buttons button:active,.buttons a.button:active,.buttons input:active,.buttons button:disabled,.buttons a.button:disabled,.buttons input:disabled,.buttons button:disabled:active,.buttons a.button:disabled:active,.buttons input:disabled:active,.sidebar_right .block.user_info .join button{box-shadow:inset 0 1px 0 #2a2a2a;text-shadow:0 1px 0 #2a2a2a;border:none!important;background:#444!important;color:#fff!important}.buttons button:disabled,.buttons a.button:disabled,.buttons input:disabled,.buttons button:disabled:active,.buttons a.button:disabled:active,.buttons input:disabled:active{text-shadow:none}body .buttons a.button:disabled:hover,.buttons input:disabled:hover{background:#fafcfa!important}body .buttons a.button:hover,.buttons button:hover,.buttons a.button:hover,.buttons input:hover{background:#666!important}.buttons input.green{padding-left:15px;padding-right:15px}.html_format pre code{background:#bbb;border:none;display:block;padding:.5em}.html_format .spoiler .spoiler_text{background:#444;border:none}.comments_list .comment_item .info.is_author,.conversation_page .messages .message.my .info{background:#554}.editor .text-holder textarea,input[type=text],.chzn-container-multi .chzn-choices,.chzn-container .chzn-drop{background:#444!important;color:#fff!important;border-color:#555!important}form .item label{color:#838383}.blue_buttons_panel{background:#6C747A}.sidebar_right .block > .line-r{background:#504E4E}.sidebar_right .block > .line-r:after{border-color:#646464}.editor .text-holder,.conversations .conversation:hover,.conversations .conversation.new{background:#444;border-color:#444}.tracker_page table[class^=tracker] tr th{border-bottom-color:#777}.notes table tr td,.conversations .conversation,.tracker_page table[class^=tracker] tr td{border-bottom-color:#555}.tracker_page table.tracker_comments tr td.comment_count a{color:#CF5555}.conversation_page .messages .message{border-top:1px solid #555}.html_format code,.html_format pre code.hljs{color:#A9B7C6;background:#2b2b2b;font-family:Consolas, Menlo, Monaco, 'Courier New', monospace;font-size:13px}.html_format code{display:inline-block;padding:0 3px}.hljs-comment,.bash .hljs-shebang,.java .hljs-javadoc,.javascript .hljs-javadoc,.rust .hljs-preprocessor,.hljs-quote{color:gray}.hljs-string,.hljs-doctag,.apache .hljs-sqbracket,.coffeescript .hljs-subst,.coffeescript .hljs-regexp,.cpp .hljs-preprocessor,.c .hljs-preprocessor,.javascript .hljs-regexp,.json .hljs-attribute,.makefile .hljs-variable,.markdown .hljs-value,.markdown .hljs-link_label,.markdown .hljs-strong,.markdown .hljs-emphasis,.markdown .hljs-blockquote,.nginx .hljs-regexp,.nginx .hljs-number,.objectivec .hljs-preprocessor .hljs-title,.perl .hljs-regexp,.php .hljs-regexp,.xml .hljs-value,.less .hljs-built_in,.scss .hljs-built_in,.hljs-link,.hljs-regexp{color:#390}.hljs-keyword,.css .hljs-at_rule,.css .hljs-important,.http .hljs-request,.ini .hljs-setting,.haskell .hljs-type,.java .hljs-javadoctag,.javascript .hljs-tag,.javascript .hljs-javadoctag,.nginx .hljs-title,.objectivec .hljs-preprocessor,.php .hljs-phpdoc,.sql .hljs-built_in,.less .hljs-tag,.less .hljs-at_rule,.scss .hljs-tag,.scss .hljs-at_rule,.scss .hljs-important,.stylus .hljs-at_rule,.go .hljs-typename,.swift .hljs-preprocessor,.hljs-selector-tag,.hljs-subst{color:#CC7833}.hljs-literal,.hljs-number,.hljs-tag .hljs-attr,.hljs-template-variable,.hljs-variable,.apache .hljs-common,.apache .hljs-cbracket,.apache .hljs-keyword,.bash .hljs-literal,.bash .hljs-built_in,.coffeescript .hljs-literal,.coffeescript .hljs-built_in,.coffeescript .hljs-number,.cpp .hljs-number,.cpp .hljs-built_in,.c .hljs-number,.c .hljs-built_in,.cs .hljs-number,.cs .hljs-built_in,.css .hljs-attribute,.css .hljs-hexcolor,.css .hljs-number,.css .hljs-function,.haskell .hljs-number,.http .hljs-literal,.http .hljs-attribute,.java .hljs-number,.javascript .hljs-built_in,.javascript .hljs-literal,.javascript .hljs-number,.json .hljs-number,.makefile .hljs-keyword,.markdown .hljs-link_reference,.nginx .hljs-built_in,.objectivec .hljs-literal,.objectivec .hljs-number,.objectivec .hljs-built_in,.php .hljs-literal,.php .hljs-number,.python .hljs-number,.ruby .hljs-prompt,.ruby .hljs-constant,.ruby .hljs-number,.ruby .hljs-subst .hljs-keyword,.ruby .hljs-symbol,.rust .hljs-number,.sql .hljs-number,.puppet .hljs-function,.less .hljs-number,.less .hljs-hexcolor,.less .hljs-function,.less .hljs-attribute,.scss .hljs-preprocessor,.scss .hljs-number,.scss .hljs-hexcolor,.scss .hljs-function,.scss .hljs-attribute,.stylus .hljs-number,.stylus .hljs-hexcolor,.stylus .hljs-attribute,.stylus .hljs-params,.go .hljs-built_in,.go .hljs-constant,.swift .hljs-built_in,.swift .hljs-number,.hljs-builtin-name,.hljs-bullet,.hljs-symbol{color:#9876AA}.apache .hljs-tag,.cs .hljs-xmlDocTag,.css .hljs-tag,.xml .hljs-title,.stylus .hljs-tag{color:#63a35c}.bash .hljs-variable,.cs .hljs-preprocessor,.cs .hljs-preprocessor .hljs-keyword,.css .hljs-attr_selector,.css .hljs-value,.ini .hljs-value,.ini .hljs-keyword,.javascript .hljs-tag .hljs-title,.makefile .hljs-constant,.nginx .hljs-variable,.xml .hljs-tag,.scss .hljs-variable,.hljs-name{color:#D0D0FF}.bash .hljs-title,.coffeescript .hljs-title,.cpp .hljs-title,.c .hljs-title,.cs .hljs-title,.css .hljs-id,.css .hljs-class,.css .hljs-pseudo,.ini .hljs-title,.haskell .hljs-title,.haskell .hljs-pragma,.java .hljs-title,.javascript .hljs-title,.makefile .hljs-title,.objectivec .hljs-title,.perl .hljs-sub,.php .hljs-title,.python .hljs-decorator,.python .hljs-title,.ruby .hljs-parent,.ruby .hljs-title,.rust .hljs-title,.xml .hljs-attribute,.puppet .hljs-title,.less .hljs-id,.less .hljs-pseudo,.less .hljs-class,.scss .hljs-id,.scss .hljs-pseudo,.scss .hljs-class,.stylus .hljs-class,.stylus .hljs-id,.stylus .hljs-pseudo,.stylus .hljs-title,.swift .hljs-title,.diff .hljs-chunk,.hljs-section,.hljs-selector-id,.hljs-class .hljs-title{color:#FFC66D}.coffeescript .hljs-reserved,.coffeescript .hljs-attribute{color:#1d3e81}.diff .hljs-chunk{font-weight:700}.diff .hljs-addition,.diff .hljs-deletion,.diff .hljs-change{display:block;margin-bottom:-1.6em}.diff .hljs-addition{background-color:#294436}.diff .hljs-deletion{background-color:#484A4A}.diff .hljs-change{background-color:#385570}.markdown .hljs-link_url{text-decoration:underline}.postinfo-panel,.post-type,.author-info,.author-info__image{background-color:transparent}.postinfo-panel,.voting-wjt,.post-comments,.post-type{border-color:#444}.author-info__name,.author-info__nickname{color:#6a6a6a}.posts .post h1.title .edit img{display:none}.comments_list .comment_item .info a.favorite{height:15px;margin-top:3px}#header_mouse_activity .main_menu a.active{color:#949494}#header_mouse_activity .user_panel a{color:#8D8D8D}.company_header .name a{color:#888}.company_info,.company_links,.corporate_news,.corporate_blog,.mobile_applications,.hantim_vacanies,.twitter_stream{padding:5px}.sidebar_right .block a{color:#8392a0}.sidebar_right .block.mobile_applications .app_widget .app_title{color:#5f5f5f}.sidebar_right .block.mobile_applications .app_widget .description{color:#6c6362}.live-broadcast,.top-materials_geektimes,.top-materials_habrahabr,.top-materials_megamozg,.live-broadcast,.promo-block{background-color:transparent!important;border-color:transparent!important}#logo,#reg-wrapper,.company_header,.user_header,.content_left,.sidebar_right,.rotated_posts{z-index:1;position:relative}#reg-wrapper,.content_left table.menu tr td,.content_left table.menu tr td.active{border-color:transparent}#navbar .nav_panel .tab.open,#navbar .nav_panel .tab:hover,#navbar .nav_tabs_content.open .nav_tab,.tracker_page table[class^=tracker] tr.new,.bottom_promo_blocks .block,.block_after_post .block{background:#444}#navbar .nav_panel .tab.tab_settings,#navbar .nav_panel .tab,#navbar .nav_panel .tab.tab_login,.rotated_posts,#navbar .nav_panel .tab.tab_login,#navbar .nav_panel .tab.tab_print,.editor .panel .wysiwyg_wrapper .can_use_html,.editor .panel .wysiwyg_wrapper .btn{border:none}#navbar .nav_panel,#navbar .nav_tabs_content .nav_tab,.comments_list .comment_item .message[class*=bad],.editor .panel,.wysiwyg_wrapper{background:transparent}#navbar .nav_tabs_content .nav_tab .line,#header_mouse_activity #header{background:#333}.comments_list .comment_item .info time,.comments_list .comment-item__username:hover,.conversation_page .messages .message .info .login a:hover,.sidebar_right .block.twitter_stream .tweets .tweet .text{color:#aaa}.post .content img,.comments_list .html_format.message img,.top_banner img,.announce img,.mobile_applications img,iframe,object{opacity:0.6;-webkit-filter:grayscale(0.8);-moz-filter:grayscale(0.8);-ms-filter:grayscale(0.8);-o-filter:grayscale(0.8);filter:grayscale(0.8);transition:all .3s}.post .content img:hover,.comments_list .html_format.message img:hover,.top_banner img:hover,.announce img:hover,.mobile_applications img:hover,iframe:hover,object:hover{-webkit-filter:grayscale(0);-moz-filter:grayscale(0);-ms-filter:grayscale(0);-o-filter:grayscale(0);filter:grayscale(0);opacity:1}.chzn-container-multi .chzn-choices .search-choice,.chzn-container .chzn-results .highlighted,.chzn-container .chzn-results .highlighted .subscribers{color:#000}.conversation_page > .title,.conversation_page .all_dialogs,.editor .panel .wysiwyg_wrapper .help_holder dl dt,#header_mouse_activity .user_panel a.username{color:#ccc}.post .content .poll .poll_title,.editor .panel .wysiwyg_wrapper .help_holder h4,.editor .panel .wysiwyg_wrapper .help_holder dl dd{color:#999}}";


	$(function(){

		// скрываем авторов
		if(config.hidePosts.enabled
			 && config.hidePosts.authors.length > 0){
			$('.post').each(function(){
				var author = trim( $('.post-author__link', this).text() );
				author = author.substr(1);
				console.log(author);
				if( config.hidePosts.authors.indexOf( author ) > -1 ){
					if( config.hidePosts.mode == 'hideContent')
						$('.hubs, .content', this).hide();
					else
						$(this).hide();
				}
			});
		}

		// красивые формулы
		if(config.mathjax){
			var id = 0;
			// заменяем картинки на формулы
			$('img[src^="https://tex.s2cms.ru/svg/"]').each(function(){

				var $this = $(this);

				// парсим код
				var code = this.src.replace(/^https:\/\/tex\.s2cms\.ru\/svg/, '');
				code = code.substr(1);
				code = unescape(code);

				// создаём объект для TeX-формулы
				var span = $('<span></span>');

				// проверяем, использовать $ или $$
				if(!this.id)
					this.id = 'texImage' + (id++);

				if( $('div[style="text-align:center;"] > #' + this.id).length > 0 ){
					span.text('$$tex' + code + '$$');
				}
				else {
					span.text('$tex' + code + '$');
				}


				// скрываем картинку и выводим TeX
				$this.after(span)
				$this.hide();
			});

			// подключаем mathjax
			var v = document.createElement('script');
			v.type = 'text/x-mathjax-config';
			v.textContent = "MathJax.Hub.Config({tex2jax:{inlineMath:[['$tex','$']],displayMath:[['$$tex','$$']]},asciimath2jax:{delimiters:[['$asc','$']]}});\
            		MathJax.Hub.Register.MessageHook('TeX Jax - parse error',function (message) {var $span = $(message[4]).parent(); $span.prev('img').show(); $span.remove()});";
            		var s = document.createElement('script');
			s.src = '//cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-MML-AM_CHTML&locale=ru';
			document.head.appendChild(v);
			document.head.appendChild(s);
		}

		// night mode
		if(config.nightMode){
			var s = document.createElement('style');
			s.id = 'us_nmstyle';
			s.textContent = nmstyle;
			document.head.appendChild(s);
		}

        // скрываем плашки с именем-кармой-etc юзера
        if(config.hideUserInfo){
            $('*[rel=user-popover]').webuiPopover('destroy');
        }

		// добавляем менюшку с конфигом
		{
			var $tab = $('#settings_tab');
			var $menu = $('<div class="menu"></div>');
			$tab.append('<div class="title">HES</div>');
			$tab.append($menu);

			var $he_button = $('<a href="javascript://"></a>');
			if(!config.hidePosts.enabled)
				$he_button.text('Скрывать посты: off');
			else if(config.hidePosts.mode == 'hideContent')
				$he_button.text('Скрывать частично');
			else
				$he_button.text('Скрывать посты: on');
			$he_button.click(function(){
				if(!config.hidePosts.enabled){
					config.hidePosts.enabled = true;
					config.hidePosts.mode = 'hide';
					$he_button.text('Скрывать посты: on');
				}
				else if(config.hidePosts.mode == 'hideContent'){
					config.hidePosts.enabled = false;
					$he_button.text('Скрывать посты: off');
				}
				else {
					config.hidePosts.enabled = true;
					config.hidePosts.mode = 'hideContent';
					$he_button.text('Скрывать частично');
				}
				localStorage.setItem('us_config', JSON.stringify(config));
			});
			$he_button.appendTo($menu);

			var $ha_button = $('<a href="javascript://">Скрываемые авторы</a>');
			$ha_button.click(function(){
				var auth = window.prompt('Через запятую (можно пробелы), регистр важен', config.hidePosts.authors.join(', '));
				if(!auth)
					return;
				config.hidePosts.authors = auth.replace(/\s/g, '').split(',');
				localStorage.setItem('us_config', JSON.stringify(config));
			});
			$ha_button.appendTo($menu);

			var $mj_button = $('<a href="javascript://">MathJax: ' + (config.mathjax ? 'on' : 'off') + '</a>');
			$mj_button.click(function(){
				if(config.mathjax){
					config.mathjax = false;
					$mj_button.text('MathJax: off');
				}
				else {
					config.mathjax = true;
					$mj_button.text('MathJax: on');
				}
				localStorage.setItem('us_config', JSON.stringify(config));
		 });
			$mj_button.appendTo($menu);

			var $nm_button = $('<a href="javascript://">Night mode: ' + (config.nightMode ? 'on' : 'off') + '</a>');
			$nm_button.click(function(){
				if(config.nightMode){
					config.nightMode = false;
					$nm_button.text('Night mode: off');
					var s = document.getElementById('us_nmstyle');
					if(s)
						document.head.removeChild(s);
				}
				else {
					config.nightMode = true;
					$nm_button.text('Night mode: on');
					var s = document.createElement('style');
					s.id = 'us_nmstyle';
					s.textContent = nmstyle;
					document.head.appendChild(s);
				}
				localStorage.setItem('us_config', JSON.stringify(config));
			});
			$nm_button.appendTo($menu);

            // Hide user info. Аббревиатуру не делать.
            var $h_button = $('<a href="javascript://">Скрывать юзеринфо: ' + (config.hideUserInfo ? 'on' : 'off') + '</a>');
			$h_button.click(function(){
				if(config.hideUserInfo){
					config.hideUserInfo = false;
					$h_button.text('Скрывать юзеринфо: off');
				}
				else {
					config.hideUserInfo = true;
					$h_button.text('Скрывать юзеринфо: on');
				}
				localStorage.setItem('us_config', JSON.stringify(config));
		    });
			$h_button.appendTo($menu);

		}
	});

	function trim(str){
		return str.replace(/^\s*/, '').replace(/\s*$/, '');
	}
})(window, window.jQuery);
