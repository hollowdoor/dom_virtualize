'use strict';

var domElementals = require('dom-elementals');

var Virtualize = function Virtualize(ref){
    var frame = ref.frame; if ( frame === void 0 ) frame = document.createElement('div');
    var parent = ref.parent; if ( parent === void 0 ) parent = document.createElement('div');
    var render = ref.render; if ( render === void 0 ) render = null;
    var classes = ref.classes; if ( classes === void 0 ) classes = {};

    frame.style.width = '500px';
    frame.style.height = '400px';
    frame.style.border = '1px solid black';
    var self = this;
    frame.appendChild(parent);

    this.data = [];
    this.element = frame;
    this._parent = parent;
    this._render = render;
    this.indexes = {
        top: 0,
        bottom: 0
    };

    var last = this.last = document.createElement('div');
    last.style.width = '100%';
    last.style.hight = '0px';
    last.style.margin = '';
    last.style.padding = '';
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

    parent.addEventListener('scroll', onScroll);

    this.destroy = function(){
        parent.removeEventListener('scroll', onScroll);
    };
};
Virtualize.prototype.expand = function expand (){
        var this$1 = this;

    var rect = this.last.getBoundingClientRect();
    var outer = this.element.getBoundingClientRect();
    var parent = this._parent;
    var bottom = this.indexes.bottom;
    if(rect.top >= outer.bottom){
        for(var i=this.indexes.bottom; i<this.data.length; i++){
            rect = this$1.last.getBoundingClientRect();
            if(rect.top >= outer.bottom){
                console.log('this.data[i] ',this$1.data[i]);
                var el = domElementals.toElement(this$1._render(this$1.data[i]));
                parent.appendChild(el);
                bottom = i;
            }

        }
        this.indexes.bottom = bottom;

    }
};
Virtualize.prototype.push = function push (){
        var data = [], len = arguments.length;
        while ( len-- ) data[ len ] = arguments[ len ];

    this.data = this.data.concat(data);
    this.expand();
};
Virtualize.prototype.appendTo = function appendTo (dest){
    console.log('dest ',dest);
    try{

        dest.appendChild(this.element);
    }catch(e){ console.error(e);}
};

function virtualize(options){
    return new Virtualize(options);
}

module.exports = virtualize;
//# sourceMappingURL=bundle.js.map
