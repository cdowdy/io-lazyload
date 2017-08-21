// PolyFill for "isIntersecting"
// https://github.com/WICG/IntersectionObserver/issues/211#issuecomment-309144669
if ('IntersectionObserver' in window &&
    'IntersectionObserverEntry' in window &&
    'intersectionRatio' in window.IntersectionObserverEntry.prototype &&
    !('isIntersecting' in IntersectionObserverEntry.prototype)) {

    Object.defineProperty(window.IntersectionObserverEntry.prototype, 'isIntersecting', {
        get: function () {
            return this.intersectionRatio > 0
        }
    })
}

// another for nodelist.foreach()
// https://developer.mozilla.org/en-US/docs/Web/API/NodeList/forEach#Polyfill
if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = function (callback, thisArg) {
        thisArg = thisArg || window;
        for (var i = 0; i < this.length; i++) {
            callback.call(thisArg, this[i], i, this);
        }
    };
}

class IOlazy {

    constructor( { image = '.lazyload', threshold = .006 } = {} ) {

        this.threshold = threshold;
        this.image = document.querySelectorAll(image);
        // the intersection observer
        this.observer = new IntersectionObserver( ::this.handleChange, {
            threshold: [ this.threshold ]
        });

        this.lazyLoad();
    }

    handleChange(changes) {

        changes.forEach(change => {

            if (change.isIntersecting) {

                change.target.classList.add('visible');

                if ( change.target.getAttribute('data-srcset') ) {
                    change.target.srcset = change.target.getAttribute('data-srcset');
                }

                if ( change.target.getAttribute('data-src') ) {
                    change.target.src = change.target.getAttribute('data-src');
                }

                this.observer.unobserve(change.target);
            }
        });
    }

    lazyLoad() {

        this.image.forEach( img => {
            this.observer.observe(img);
        })
    }
}