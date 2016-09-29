export default function(data){
  if(data.options.src === null) return "";
  
  return `<div class="item">
    <div class="mediaItem">
      <iframe class="media-elem" src=${data.options.src}></iframe>
    </div>
  </div>`
}
