'use strict';

var domElementals = require('dom-elementals');

var Virtualize = function Virtualize(ref){
    var frame = ref.frame; if ( frame === void 0 ) frame = document.createElement('div');
    var parent = ref.parent; if ( parent === void 0 ) parent = document.createElement('div');
    var render = ref.render; if ( render === void 0 ) render = null;
    var afterAdd = ref.afterAdd; if ( afterAdd === void 0 ) afterAdd = function (){};
    var childHeight = ref.childHeight; if ( childHeight === void 0 ) childHeight = 0;
    var classes = ref.classes; if ( classes === void 0 ) classes = {};

    frame.style.width = '500px';
    frame.style.height = '400px';
    frame.style.border = '1px solid black';
    frame.style.display = 'block';

    var self = this;
    frame.appendChild(parent);
    //parent.style.height = childHeight + 'px';

    this.startIndex = 0;

    this.childHeight = childHeight;
    this.data = [];
    this.element = this.frame = frame;
    this.container = this._parent = parent;
    this._render = render;
    this._afterAdd = afterAdd;
    this.indexes = {
        top: 0,
        bottom: 0
    };

    /*let last = this.last = document.createElement('div');
    last.style.width = '100%';
    last.style.hight = '0px';
    last.style.margin = '';
    last.style.padding = '';
    last.style.border = '1px solid red';
    last.style.position = 'relative';
    parent.appendChild(last);*/
    frame.style.overflow = 'scroll';

    /*let {
        last = 'dom-virtualize-last'
    } = (classes || {});

    classes = this.classes = {
        last
    };*/

    function onScroll(event){
        self.expand();
    }

    frame.addEventListener('scroll', onScroll);

    this.destroy = function(){
        frame.removeEventListener('scroll', onScroll);
    };
};
Virtualize.prototype.expand = function expand (){
        var this$1 = this;

    var first = this._parent.firstChild;
    var last = this._parent.lastChild;
    var rect = last ? last.getBoundingClientRect() : null;
    var outer = this.frame.getBoundingClientRect();
    var parent = this._parent;
    var bottom = this.indexes.bottom;
    //console.log('outer ',outer);
    //console.log('this.element.style.height ',this.element.style.height)
    //console.log(!rect || rect.bottom >= outer.bottom)
    if(!rect || rect.top <= outer.bottom){
        var start = parent.children.length;
        for(var i=start; i<this.data.length; i++){
            if(last){
                rect = last.getBoundingClientRect();
                console.log('rect ', rect);
                if(rect.bottom >= outer.bottom && rect.right > outer.right - rect.width){
                    break;
                }
            }

            //console.log('this.data[i] ',this.data[i])
            var el = domElementals.toElement(this$1._render(this$1.data[i]));
            parent.appendChild(el);
            last = el;
            bottom = i;


        }
        //console.log('outer ',outer)
        this.indexes.bottom = bottom;

    }else if(rect.top > outer.bottom + 10){
        for(var i$1=0; i$1<parent.children.length; i$1++){
            var child = parent.children[i$1];
            rect = child.getBoundingClientRect();
            if(rect.top > outer.bottom + 10){
                parent.removeChild(child);
            }
        }
    }

    rect = parent.children[this.startIndex] ? parent.children[this.startIndex].getBoundingClientRect() : null;

    if(rect){
        console.log('top ',rect.bottom < outer.top - 10);
        if(rect.bottom < outer.top - 10){
            for(var i$2=0; i$2<parent.children.length; ++i$2){
                var child$1 = parent.children[i$2];
                rect = child$1.getBoundingClientRect();
                if(rect.bottom < outer.top + 10){
                    var placeholder = child$1.cloneNode();
                    placeholder.innerHTML = '';
                    parent.replaceChild(placeholder, child$1);
                    this$1.startIndex = i$2;
                }
            }
        }else if(rect.bottom >= outer.top){
            var start$1 = this.startIndex;
            console.log('start ',start$1);
            for(var i$3=start$1; i$3>-1; --i$3){
                var current = parent.children[i$3];
                if(current){
                    rect = current.getBoundingClientRect();
                    console.log('rect ', rect);
                    if(rect.bottom <= outer.top){
                        this$1.startIndex = i$3;
                        break;
                    }
                }
                var el$1 = domElementals.toElement(this$1._render(this$1.data[i$3]));
                parent.replaceChild(el$1, current);
            }
        }
    }


};
Virtualize.prototype.push = function push (){
        var data = [], len = arguments.length;
        while ( len-- ) data[ len ] = arguments[ len ];

    this.data = this.data.concat(data);
    this._afterAdd();

    //this._parent.style.height = (this.childHeight * this.data.length) + 'px';
    this.expand();
};
Virtualize.prototype.appendTo = function appendTo (dest){
    try{

        dest.appendChild(this.element);
    }catch(e){ console.error(e);}
};

function virtualize(options){
    return new Virtualize(options);
}

module.exports = virtualize;
//# sourceMappingURL=bundle.js.map
