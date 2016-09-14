export default function(data){
  return `<div class="item ${data.options.align}">
    <div class="img">
      <img src=${data.src} />
    </div>
  </div>`
}
