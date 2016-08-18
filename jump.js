function jump(target, options) {
    var
        start = window.pageYOffset,
        opt = {
            duration: options.duration || 400,
            offset: options.offset || 0,
            callback: options.callback,
            easing: options.easing || easeInOutQuad,
            scrolled: options.scrolled || window
        },
        $target = typeof target === 'string' ? document.querySelector(target) : (
            Object.prototype.toString.call(target) === '[object HTMLDivElement]' ? target : null),
        distance = $target
            ? opt.offset + $target.getBoundingClientRect().top
              + (opt.scrolled === window && window.getNavbarHeight ? -1 * window.getNavbarHeight() : 0)
            : target,
        duration = typeof opt.duration === 'function'
            ? opt.duration(distance)
            : opt.duration,
        timeStart, timeElapsed
    ;

    if (opt.scrolled !== window) {
        start = opt.scrolled.scrollTop;
    }

    if ($target === null && typeof target === 'string') {
        return;
    }

    requestAnimationFrame(function(time) { timeStart = time; loop(time); });

    function loop(time) {
        timeElapsed = time - timeStart;

        if (opt.scrolled === window) {
            opt.scrolled.scrollTo(0, opt.easing(timeElapsed, start, distance, duration));
        } else {
            opt.scrolled.scrollTop = opt.easing(timeElapsed, start, distance, duration);
        }

        if (timeElapsed < duration)
            requestAnimationFrame(loop)
        else
            end();
    }

    function end() {
        if (opt.scrolled === window) {
            opt.scrolled.scrollTo(0, start + distance);
        } else {
            opt.scrolled.scrollTop = start + distance;
        }

        if (typeof opt.callback === 'function')
            opt.callback();
    }

    // Robert Penner's easeInOutQuad - http://robertpenner.com/easing/
    function easeInOutQuad(t, b, c, d)  {
        t /= d / 2
        if(t < 1) return c / 2 * t * t + b
        t--
        return -c / 2 * (t * (t - 2) - 1) + b
    }

}
