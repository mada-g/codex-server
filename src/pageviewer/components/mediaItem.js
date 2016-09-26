export default function(data){
  return `<div class="item">
    <div class="mediaItem">
      <iframe class="media-elem" src=${data.options.src}></iframe>
    </div>
  </div>`
}
