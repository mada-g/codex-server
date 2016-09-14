export default function(data){
  return `<div class="item ${data.options.align}">
    <div class="mediaItem">
      <iframe className="media-elem" src=${data.options.src}></iframe>
    </div>
  </div>`
}
