import virtualize from '../';
import range from 'array-range';

try{
    let v = virtualize({
        margin: 30,
        afterAdd(){
            console.log(this.container);
            this.container.style.height = (this.data.length * 100) + 'px';
        },
        render(data){
            return `<p class="data">${data}</p>`;
        }
    });

    v.appendTo(document.body);

    let data = range(1000);
    v.push(...data);



}catch(e){ console.error(e);}
