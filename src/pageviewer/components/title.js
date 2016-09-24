export default function(data, auth, date){
  return `<div class="item ${data.options.align}">
    <div class="title">
      <div class="subtitle left">
        <div class="content">
          <span class="author">${auth}</span> writes</span>
        </div>
      </div>
      ${data.content}
      <div class="subtitle right">
        <div class="content">
          <span class="date">${date}</span>
        </div>
      </div>
    </div>
  </div>`
}
