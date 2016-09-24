export default function(data){

  let h = data.options.height;
  let w = data.options.width;

  let s = '';

  if(w >= h){
    s = "width: 100%; height: auto;";
  }
  else {
    s = `width: ${80*w/h}%; height: auto;`;
  }

  return `<div class="item">
    <div class="img">
      <img src=${data.src} style="${s}" />
    </div>
  </div>`
}
