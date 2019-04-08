/**
 * 즉시 실행함수 또 다른 예)
 */
// !function () {}();

/* common add prototype */
// custom method
if (typeof Function.prototype.method !== "funciton") {
    Function.prototype.method = function (name, implementation) {
        this.prototype[name] = implementation;
        return this;
    };
};
// method examples
// var Test = function (name) {
//     this.name = name;
// }.method('getName', function () {
//     return this.name;
// }).method('setName', function (name) {
//     this.name = name;
//     return this;
// });
// var a = new Test('Adam');

// console.log(a.getName())

// console.log(a.setName('test').getName())

if (typeof Function.prototype.bind === "undefined") {
    Function.prototype.bind = function(thisArg) {
        var fn = this,
            slice = Array.prototype.slice,
            args = slice.call(arguments, 1);
        
        return function () {
            return fn.apply(thisArg, args.concat(slice.call(arguments)))
        }
    }
}

if (!String.prototype.trim) {
    String.prototype.trim = function () {
        return String(this).replace(/^\s+/, '').replace(/\s+$/, '');
    };
}


;(function(global, undefined){
    "use strict";

    var _configs = typeof myappConfigs === 'undefined' ? {} : myappConfigs;
    window.LIB_NAME = _configs.name || 'MYAPP';
    window.IS_DEBUG = _configs.debug || location.href.indexOf('debug=true') >= 0;

    var LIB_NAME = global.LIB_NAME || 'MYAPP';
    if (global[LIB_NAME]) {
        return;
    }

    var core = global[LIB_NAME] || (global[LIB_NAME] = {});

    core.name_space = function (ns_string){
        var parts = ns_string.split('.'),
            parent = MYAPP,
            i;
        if (parts[0] === "MYAPP") {
            parts = parts.slice(1);
        }
        for (i = 0; i < parts.length -1; i+=1) {
            if ( typeof parent[parts[i]] == "undefined" ) {
                parent[parts[i]] = {};
            };
            parent = parent[parts[i]] = {};
        };
        return parent;
    };

    // 클래스 구현, 클래스 사용에 익숙할 경우만 사용. 협업의 경우 혼란을 줄 수 있다.
    core.klass = function (Parent, props) {
        var Child, F, i;
        Child = function () {
            if (Child.uber && Child.uber.hasOwnProperty('__construct')) {
                Child.uber.__construct.apply(this, arguments);
            };

            if (Child.prototype.hasOwnProperty('__construct')) {
                Child.prototype.__construct.apply(this, arguments);
            };
        };

        Parent = Parent || Object;
        F = function(){};
        F.prototype = Parent.prototype;
        Child.prototype = new F();
        Child.uber = Parent.prototype;
        Child.prototype.constructor = Child;

        for ( i in props ) {
            if ( props.hasOwnProperty(i) ) {
                Child.prototype[i] = props[i];
            };
        };

        return Child;
    };
    core.extend = function( parent, child ){
        var toStr = Object.prototype.toString,
            astr = "[object Array]",
            i;
        // console.log(parent)
        // console.log(child)
        child = child || {};
        for ( i in parent ) {
            if (parent.hasOwnProperty(i)) {
                if ( typeof parent[i] === "object" ) {
                    child[i] = ( toStr.call(parent[i]) ==astr ) ? [] : {};
                    core.extend(parent[i], child[i]);
                } else {
                    child[i] =  parent[i];
                };
                
            };
        };
        return child;
    }
    core.Accordion = function(elem, options){
        if (!(this instanceof core.Accordion) ){
            return new core.Accordion(elem, options);
        };
        var elem = elem;
        var defaults = {
                openIndex : 0,
                singleOpen : true,
                openText : 'open' ,
                closeText: 'close',
                animate : true,
                duration : 150
            };
        var options = core.extend(options, defaults),
            lists = elem.find('.ui_acc_lists'),
            btn = $(elem).find('.ui_acc_btn'),
            currentIndex = (elem.find('.on').index() !== undefined) ? elem.find('.on').index() : null,
            openText = function(elem){
                elem.text(options.openText)
            },
            closeText = function (elem) {
                elem.text(options.closeText)
            };
        if (currentIndex !== null) {
            closeText(elem.find('.on').find('.ui_acc_btn span'))    
        };
        return {
            _init : function(){
                var self = this;
                if (options.animate) {
                    lists.each(function(){
                        var $this = $(this);
                        var conts = $this.find('.ui_acc_cont');
                        var wraps = $('<div class="conts_wrap">')
                        if ($this.hasClass('on')) {
                            wraps.css('height', conts.height()+'px')
                        }
                        conts.css('display', 'block')
                        conts.wrap(wraps)
                    })
                }
                self = this;
                self.bindEvent()
            },
            bindEvent : function (){
                var self = this;
                btn.on('click', function(e){
                    var target = $(this).parents('.ui_acc_lists');
                    if (target.hasClass('on')) {
                        self.close(target)
                    }else{
                        self.open(target)
                    }
                    return false;
                    e.preventDefault();
                })
            },
            open : function(target){
                var self = this;
                if (options.singleOpen && null !== currentIndex) {
                    self.close(lists.eq(currentIndex))
                };
                target.addClass('on');
                currentIndex = target.index();
                if (options.animate) {
                    var height = target.find('.ui_acc_cont').height()
                    target.find('.conts_wrap').animate({ "height": height + "px" }, options.duration)
                }
                closeText(target.find('.ui_acc_btn span'))
            },
            close: function (target){
                target.removeClass('on')
                target.find('.conts_wrap').animate({ "height": "0" }, options.duration)
                openText(target.find('.ui_acc_btn span'))
            }
        }
    }
})(window);
// ;(function (core, global, undefined) {
//     console.log(core)
// })(window[LIB_NAME], window);

+function ($) {
    'use strict';

    // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
    // ============================================================

    function transitionEnd() {
        var el = document.createElement('bootstrap')

        var transEndEventNames = {
            WebkitTransition: 'webkitTransitionEnd',
            MozTransition: 'transitionend',
            OTransition: 'oTransitionEnd otransitionend',
            transition: 'transitionend'
        }

        for (var name in transEndEventNames) {
            if (el.style[name] !== undefined) {
                return { end: transEndEventNames[name] }
            }
        }

        return false // explicit for ie8 (  ._.)
    }

    // http://blog.alexmaccaw.com/css-transitions
    $.fn.emulateTransitionEnd = function (duration) {
        var called = false
        var $el = this
        $(this).one('bsTransitionEnd', function () { called = true })
        var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
        setTimeout(callback, duration)
        return this
    }

    $(function () {
        $.support.transition = transitionEnd()

        if (!$.support.transition) return

        $.event.special.bsTransitionEnd = {
            bindType: $.support.transition.end,
            delegateType: $.support.transition.end,
            handle: function (e) {
                if ($(e.target).is(this)) return e.handleObj.handler.apply(this, arguments)
            }
        }
    })

}(jQuery);

+function ($) {
    'use strict';

    // CAROUSEL CLASS DEFINITION
    // =========================

    var Carousel = function (element, options) {
        this.$element = $(element)
        this.$indicators = this.$element.find('.carousel-indicators')
        this.options = options
        this.paused =
            this.sliding =
            this.interval =
            this.$active =
            this.$items = null

        this.options.keyboard && this.$element.on('keydown.bs.carousel', $.proxy(this.keydown, this))

        this.options.pause == 'hover' && !('ontouchstart' in document.documentElement) && this.$element
            .on('mouseenter.bs.carousel', $.proxy(this.pause, this))
            .on('mouseleave.bs.carousel', $.proxy(this.cycle, this))
    }

    Carousel.VERSION = '3.3.2'

    Carousel.TRANSITION_DURATION = 600

    Carousel.DEFAULTS = {
        interval: 5000,
        pause: 'hover',
        wrap: true,
        keyboard: true
    }

    Carousel.prototype.keydown = function (e) {
        if (/input|textarea/i.test(e.target.tagName)) return
        switch (e.which) {
            case 37: this.prev(); break
            case 39: this.next(); break
            default: return
        }

        e.preventDefault()
    }

    Carousel.prototype.cycle = function (e) {
        e || (this.paused = false)

        this.interval && clearInterval(this.interval)

        this.options.interval
            && !this.paused
            && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))

        return this
    }

    Carousel.prototype.getItemIndex = function (item) {
        this.$items = item.parent().children('.item')
        return this.$items.index(item || this.$active)
    }

    Carousel.prototype.getItemForDirection = function (direction, active) {
        var activeIndex = this.getItemIndex(active)
        var willWrap = (direction == 'prev' && activeIndex === 0)
            || (direction == 'next' && activeIndex == (this.$items.length - 1))
        if (willWrap && !this.options.wrap) return active
        var delta = direction == 'prev' ? -1 : 1
        var itemIndex = (activeIndex + delta) % this.$items.length
        return this.$items.eq(itemIndex)
    }

    Carousel.prototype.to = function (pos) {
        var that = this
        var activeIndex = this.getItemIndex(this.$active = this.$element.find('.item.active'))

        if (pos > (this.$items.length - 1) || pos < 0) return

        if (this.sliding) return this.$element.one('slid.bs.carousel', function () { that.to(pos) }) // yes, "slid"
        if (activeIndex == pos) return this.pause().cycle()

        return this.slide(pos > activeIndex ? 'next' : 'prev', this.$items.eq(pos))
    }

    Carousel.prototype.pause = function (e) {
        e || (this.paused = true)

        if (this.$element.find('.next, .prev').length && $.support.transition) {
            this.$element.trigger($.support.transition.end)
            this.cycle(true)
        }

        this.interval = clearInterval(this.interval)

        return this
    }

    Carousel.prototype.next = function () {
        if (this.sliding) return
        return this.slide('next')
    }

    Carousel.prototype.prev = function () {
        if (this.sliding) return
        return this.slide('prev')
    }

    Carousel.prototype.slide = function (type, next) {
        var $active = this.$element.find('.item.active')
        var $next = next || this.getItemForDirection(type, $active)
        var isCycling = this.interval
        var direction = type == 'next' ? 'left' : 'right'
        var that = this

        if ($next.hasClass('active')) return (this.sliding = false)

        var relatedTarget = $next[0]
        var slideEvent = $.Event('slide.bs.carousel', {
            relatedTarget: relatedTarget,
            direction: direction
        })
        this.$element.trigger(slideEvent)
        if (slideEvent.isDefaultPrevented()) return

        this.sliding = true

        isCycling && this.pause()

        if (this.$indicators.length) {
            this.$indicators.find('.active').removeClass('active')
            var $nextIndicator = $(this.$indicators.children()[this.getItemIndex($next)])
            $nextIndicator && $nextIndicator.addClass('active')
        }

        var slidEvent = $.Event('slid.bs.carousel', { relatedTarget: relatedTarget, direction: direction }) // yes, "slid"
        if ($.support.transition && this.$element.hasClass('slide')) {
            $next.addClass(type)
            $next[0].offsetWidth // force reflow
            $active.addClass(direction)
            $next.addClass(direction)
            $active
                .one('bsTransitionEnd', function () {
                    $next.removeClass([type, direction].join(' ')).addClass('active')
                    $active.removeClass(['active', direction].join(' '))
                    that.sliding = false
                    setTimeout(function () {
                        that.$element.trigger(slidEvent)
                    }, 0)
                })
                .emulateTransitionEnd(Carousel.TRANSITION_DURATION)
        } else {
            $active.removeClass('active')
            $next.addClass('active')
            this.sliding = false
            this.$element.trigger(slidEvent)
        }

        isCycling && this.cycle()

        return this
    }


    // CAROUSEL PLUGIN DEFINITION
    // ==========================

    function Plugin(option) {
        return this.each(function () {
            var $this = $(this)
            var data = $this.data('bs.carousel')
            var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == 'object' && option)
            var action = typeof option == 'string' ? option : options.slide

            if (!data) $this.data('bs.carousel', (data = new Carousel(this, options)))
            if (typeof option == 'number') data.to(option)
            else if (action) data[action]()
            else if (options.interval) data.pause().cycle()
        })
    }

    var old = $.fn.carousel

    $.fn.carousel = Plugin
    $.fn.carousel.Constructor = Carousel


    // CAROUSEL NO CONFLICT
    // ====================

    $.fn.carousel.noConflict = function () {
        $.fn.carousel = old
        return this
    }


    // CAROUSEL DATA-API
    // =================

    var clickHandler = function (e) {
        var href
        var $this = $(this)
        var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) // strip for ie7
        if (!$target.hasClass('carousel')) return
        var options = $.extend({}, $target.data(), $this.data())
        var slideIndex = $this.attr('data-slide-to')
        if (slideIndex) options.interval = false

        Plugin.call($target, options)

        if (slideIndex) {
            $target.data('bs.carousel').to(slideIndex)
        }

        e.preventDefault()
    }

    $(document)
        .on('click.bs.carousel.data-api', '[data-slide]', clickHandler)
        .on('click.bs.carousel.data-api', '[data-slide-to]', clickHandler)

    $(window).on('load', function () {
        $('[data-ride="carousel"]').each(function () {
            var $carousel = $(this)
            Plugin.call($carousel, $carousel.data())
        })
    });
    var test = $('#test')
    $(window).on('touchstart', function(e){
        console.log(e)
    })
    $(window).on('touchmove', function (e) {
        console.log(e)
    })
    $(window).on('touchend', function (e) {
        console.log(e)
    })
}(jQuery);




+function($){
    var test1 = $('#test1')
    var test2 = $('#test2')
}(jQuery);