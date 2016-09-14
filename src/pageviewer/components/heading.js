export default function(data){
  return `<div class="item ${data.options.align}">
    <div class="heading ${data.options.size} ${data.options.level}">
      ${data.content}
    </div>
  </div>`
}
