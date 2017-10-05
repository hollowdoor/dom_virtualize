import { toElement } from 'dom-elementals';

class Virtualize {
    constructor({
        frame = document.createElement('div'),
        parent = document.createElement('div'),
        render = null,
        afterAdd = ()=>{},
        childHeight = 0,
        classes = {}
    }){
        frame.style.width = '500px';
        frame.style.height = '400px';
        frame.style.border = '1px solid black';
        frame.style.display = 'block';

        const self = this;
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
    }
    expand(){
        let first = this._parent.firstChild;
        let last = this._parent.lastChild;
        let rect = last ? last.getBoundingClientRect() : null;
        let outer = this.frame.getBoundingClientRect();
        let parent = this._parent;
        let bottom = this.indexes.bottom;
        //console.log('outer ',outer);
        //console.log('this.element.style.height ',this.element.style.height)
        //console.log(!rect || rect.bottom >= outer.bottom)
        if(!rect || rect.top <= outer.bottom){
            let start = parent.children.length;
            for(let i=start; i<this.data.length; i++){
                if(last){
                    rect = last.getBoundingClientRect();
                    console.log('rect ', rect)
                    if(rect.bottom >= outer.bottom && rect.right > outer.right - rect.width){
                        break;
                    }
                }

                //console.log('this.data[i] ',this.data[i])
                let el = toElement(this._render(this.data[i]));
                parent.appendChild(el);
                last = el;
                bottom = i;


            }
            //console.log('outer ',outer)
            this.indexes.bottom = bottom;

        }else if(rect.top > outer.bottom + 10){
            for(let i=0; i<parent.children.length; i++){
                let child = parent.children[i];
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
                for(let i=0; i<parent.children.length; ++i){
                    let child = parent.children[i];
                    rect = child.getBoundingClientRect();
                    if(rect.bottom < outer.top + 10){
                        let placeholder = child.cloneNode();
                        placeholder.innerHTML = '';
                        parent.replaceChild(placeholder, child);
                        this.startIndex = i;
                    }
                }
            }else if(rect.bottom >= outer.top){
                let start = this.startIndex;
                console.log('start ',start);
                for(let i=start; i>-1; --i){
                    let current = parent.children[i];
                    if(current){
                        rect = current.getBoundingClientRect();
                        console.log('rect ', rect)
                        if(rect.bottom <= outer.top){
                            this.startIndex = i;
                            break;
                        }
                    }
                    let el = toElement(this._render(this.data[i]));
                    parent.replaceChild(el, current);
                }
            }
        }


    }
    push(...data){
        this.data = this.data.concat(data);
        this._afterAdd();

        //this._parent.style.height = (this.childHeight * this.data.length) + 'px';
        this.expand();
    }
    appendTo(dest){
        try{

            dest.appendChild(this.element);
        }catch(e){ console.error(e)}
    }
}

export default function virtualize(options){
    return new Virtualize(options);
}
