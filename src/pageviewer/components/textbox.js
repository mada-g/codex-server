export default function(data){
  return `<div class="item ${data.options.align}">
    <div class="textbox">
      ${data.content}
    </div>
  </div>`
}
