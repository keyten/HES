// ==UserScript==
// @name        HabraScript
// @namespace   http://github.com/keyten
// @description UserScript for hh & gt & mm
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
(function(window, undefined){
  var config = {
     hiddenAuthors: [
      'alizar',
      'marks',
      'ivansychev',
      'ragequit',
      'SLY_G'
    ],
    
    mathjax: true
  };

  $(function(){
    
    // скрываем авторов
    if(config.hiddenAuthors.length > 0){
      $('.post').each(function(){
        var author = trim( $('.post-author__link', this).text() );
        author = author.substr(1);
        if( config.hiddenAuthors.indexOf( author ) > -1 )
          $(this).hide();
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
        
        // настраиваем обработку ошибок
        span.mouseover(function(){
          if( $('merror', this).length > 0 ){
            span.remove();
            $this.show();
          }
        });
      });
      
      // подключаем mathjax
      var v = document.createElement('script');
      v.type = 'text/x-mathjax-config';
      v.textContent = "MathJax.Hub.Config({tex2jax:{inlineMath:[['$tex','$']],displayMath:[['$$tex','$$']]},asciimath2jax:{delimiters:[['$asc','$']]}});";
      var s = document.createElement('script');
      s.src = '//cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-MML-AM_CHTML&locale=ru';
      document.head.appendChild(v);
      document.head.appendChild(s);
    }
  });
  
  function trim(str){
    return str.replace(/^\s*/, '').replace(/\s*$/, '');
  }
})(window);
