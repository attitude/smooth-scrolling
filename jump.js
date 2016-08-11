function jump(target, options) {
    var 
        start = window.pageYOffset,
        opt = {
            duration: options.duration,
            offset: options.offset || 0,
            callback: options.callback,
            easing: options.easing || easeInOutQuad
        },
        $target = typeof target === 'string' ? document.querySelector(target) : null,
        distance = $target
            ? opt.offset + $target.getBoundingClientRect().top
              + (window.getNavbarHeight ? -1 * window.getNavbarHeight() : 0)
            : target,
        duration = typeof opt.duration === 'function'
            ? opt.duration(distance)
            : opt.duration,
        timeStart, timeElapsed
    ;

    if ($target === null && typeof target === 'string') {
        return;
    }

    requestAnimationFrame(function(time) { timeStart = time; loop(time); });

    function loop(time) {
        timeElapsed = time - timeStart;

        window.scrollTo(0, opt.easing(timeElapsed, start, distance, duration));

        if (timeElapsed < duration)
            requestAnimationFrame(loop)
        else
            end();
    }

    function end() {
        window.scrollTo(0, start + distance);

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
