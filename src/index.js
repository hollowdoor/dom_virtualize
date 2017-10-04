import { toElement } from 'dom-elementals';

class Virtualize {
    constructor({
        frame = document.createElement('div'),
        parent = document.createElement('div'),
        render = null,
        classes = {}
    }){
        frame.style.width = '500px';
        frame.style.height = '400px';
        frame.style.border = '1px solid black';
        const self = this;
        frame.appendChild(parent);

        this.data = [];
        this.element = frame;
        this._parent = parent;
        this._render = render;
        this.indexes = {
            top: 0,
            bottom: 0
        };

        let last = this.last = document.createElement('div');
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
    }
    expand(){
        let rect = this.last.getBoundingClientRect();
        let outer = this.element.getBoundingClientRect();
        let parent = this._parent;
        let bottom = this.indexes.bottom;
        if(rect.top >= outer.bottom){
            for(let i=this.indexes.bottom; i<this.data.length; i++){
                rect = this.last.getBoundingClientRect();
                if(rect.top >= outer.bottom){
                    console.log('this.data[i] ',this.data[i])
                    let el = toElement(this._render(this.data[i]));
                    parent.appendChild(el);
                    bottom = i;
                }

            }
            this.indexes.bottom = bottom;

        }
    }
    push(...data){
        this.data = this.data.concat(data);
        this.expand();
    }
    appendTo(dest){
        console.log('dest ',dest)
        try{

            dest.appendChild(this.element);
        }catch(e){ console.error(e)}
    }
}

export default function virtualize(options){
    return new Virtualize(options);
}
