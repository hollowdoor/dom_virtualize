import virtualize from '../';
import range from 'array-range';
console.log('ok')
try{
    let v = virtualize({
        render(data){
            return `<p class="data">${data}</p>`;
        }
    });

    let data = range(1000);
    v.push(...data);

    v.appendTo(document.body);

}catch(e){ console.error(e);}
