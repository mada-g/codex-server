import romanNum from 'roman-numerals';

function formatLabel(l, numbering){
  if(numbering === "none") return "";

  let t = "";

  for(let i in l){
    let num = l[i];
    if(l[i] !== 0){
      if(i>0) t += '.';
      if(numbering==="roman"){
        num = romanNum.toRoman(l[i]);
      }
      t += num;
    }
  }
  return t;
}

function renderLabel(align, level, numbering){

  if(numbering === "none") return "";

  if(align !== 'aligncenter'){
    return `<div class="heading-label">
        <div class="heading-level-alt">${formatLabel(level, numbering)}</div>
      </div>`
  }

  else{
    return `<div class="heading-label-center">
        ${formatLabel(level, numbering)}
      </div>`
  }

}

export default function(data, numbering){
  return `<div class="item ${data.options.align}">
    <div class="heading ${data.options.size}">
      ${renderLabel(data.options.align, data.options.level, numbering)}
      <div class="heading-content">
        ${data.content}
      </div>
    </div>
  </div>`
}
