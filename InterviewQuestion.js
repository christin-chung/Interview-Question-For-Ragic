var style = document.createElement('style');
style.setAttribute("id","multiselect_dropdown_styles");
style.innerHTML = `
.multiselect-dropdown{
  display: inline-block;
  padding: 2px 5px 0px 5px;
  border-radius: 4px;
  border: solid 1px #ced4da;
  background-color: white;
  position: relative;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right .75rem center;
  background-size: 16px 12px;
}

.multiselect-dropdown span.optext, .multiselect-dropdown span.placeholder{
  margin-right:0.5em; 
  margin-bottom:2px;
  padding:1px 0; 
  border-radius: 4px; 
  display:inline-block;
}

.multiselect-dropdown span.optext{
  background-color:lightgray;
  padding:1px 0.75em; 
}

.multiselect-dropdown-list-wrapper{
  box-shadow: gray 0 3px 8px;
  z-index: 100;
  padding:2px;
  border-radius: 4px;
  border: solid 1px #ced4da;
  display: none;
  margin: -1px;
  position: absolute;
  top:0;
  left: 0;
  right: 0;
  background: white;
}

.multiselect-dropdown-list{
  padding:2px;
  height: 15rem;
  overflow-y:auto;
  overflow-x: hidden;
}

.multiselect-dropdown-list::-webkit-scrollbar {
  width: 6px;
}

.multiselect-dropdown-list::-webkit-scrollbar-thumb {
  background-color: #bec4ca;
  border-radius:3px;
}

.multiselect-dropdown-list div{
  padding: 5px;
}

.multiselect-dropdown-list input{
  height: 1.15em;
  width: 1.15em;
  margin-right: 0.35em;  
}

.multiselect-dropdown-list div:hover{
  background-color: #ced4da;
}slected {width:100%;}

.multiselect-dropdown-all-selector{
    border-bottom:solid 1px #999;
}

.multiselect-dropdown-list-wrapper {
    margin-top: 25px; 
  }
`;

document.head.appendChild(style);

function MultiselectDropdown(options){
  var config={
    height:'15rem',
    placeholder:'select',
    ...options
  };

  // 定義輔助函數，用於創建HTML元素並設定屬性
  function newEl(tag,attrs){
    var e=document.createElement(tag);
    if(attrs!==undefined) Object.keys(attrs).forEach(k=>{
        if(k==='class') { 
            Array.isArray(attrs[k]) ? attrs[k].forEach(o=>o!==''?e.classList.add(o):0) : (attrs[k]!==''?e.classList.add(attrs[k]):0)
        } else if(k==='style'){  
            Object.keys(attrs[k]).forEach(ks=>{
                e.style[ks]=attrs[k][ks];
            });
        } else if(k==='text'){
            attrs[k]===''?e.innerHTML='&nbsp;':e.innerText=attrs[k]
        } else{
            e[k]=attrs[k];
        } 
    });
    return e;
  }

  document.querySelectorAll("select[multiple]").forEach((el,k)=>{
    var div=newEl('div',{class:'multiselect-dropdown',style:{width:config.style?.width??el.clientWidth+'px',padding:config.style?.padding??''}});
    el.style.display='none';
    el.parentNode.insertBefore(div,el.nextSibling);
    
    var listWrap=newEl('div',{class:'multiselect-dropdown-list-wrapper'});
    var list=newEl('div',{class:'multiselect-dropdown-list',style:{height:config.height}});
    
    var box=newEl('input',{style:{width:'100%',display:'none'}});
    listWrap.appendChild(box);
    div.appendChild(listWrap);
    listWrap.appendChild(list);

    el.loadOptions=()=>{
      list.innerHTML='';

      Array.from(el.options).map(o=>{
        var op=newEl('div',{class:o.selected?'checked':'',optEl:o})
        var ic=newEl('input',{type:'checkbox',checked:o.selected});
        op.appendChild(ic);
        op.appendChild(newEl('label',{text:o.text}));

        op.addEventListener('click',()=>{
          op.classList.toggle('checked');
          op.querySelector("input").checked=!op.querySelector("input").checked;
          op.optEl.selected=!!!op.optEl.selected;
          el.dispatchEvent(new Event('change'));
          div.refresh();
        });
        ic.addEventListener('click',(ev)=>{
          ic.checked=!ic.checked;
          div.refresh();
        });
        o.listitemEl=op;
        list.appendChild(op);
      });
      div.listEl=listWrap;

      div.refresh=()=>{
        div.querySelectorAll('span.optext, span.placeholder').forEach(t=>div.removeChild(t));
        var sels=Array.from(el.selectedOptions);
        
        sels.map(x=>{
            var c=newEl('span',{class:'optext',text:x.text});
            div.appendChild(c);
        });
        if(0==el.selectedOptions.length) 
            div.appendChild(newEl('span',{class:'placeholder',text:config.placeholder}));
      };
      div.refresh();
    }

    el.loadOptions();
    
    div.addEventListener('click',()=>{
      div.listEl.style.display='block';
      box.focus();
      box.select();
    });
    
    document.addEventListener('click', function(event) {
      if (!div.contains(event.target)) {
        listWrap.style.display='none';
      }
    });    
  });
}

window.addEventListener('load', () => {
    MultiselectDropdown();

    const submitBtn = document.getElementById('submitBtn');
    submitBtn.addEventListener('click', () => {
        var selectedOptions = [];
        document.querySelectorAll('select[multiple] option:checked').forEach(option => {
          selectedOptions.push(option.text);
        });
      console.log(selectedOptions);
    });
  });
