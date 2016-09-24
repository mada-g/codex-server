export default function(data){

  let s = `width: ${data.options.size}%; height: auto;`;

  let label = "";
  let str = data.content.trim();

  console.log(str);

  if(str.length > 0){
    label = `<div class="img-label-container">
      <div class="img-label" style="${s}">${data.content}</div>
    </div>`;
  }
  return `<div class="item ${data.options.align}">
    <div class="imgItem">
      <img src=${data.src} style="${s}" />
        ${label}
    </div>
  </div>`
}
