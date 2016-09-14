import textbox from './components/textbox.js';
import heading from './components/heading.js';
import image from './components/image.js';
import mediaItem from './components/mediaItem.js';

export default function(appState){

  let htmlStr = `<!doctype html>
  <html>
  <head>
    <title>Codex // Madalinski</title>
    <link href="https://fonts.googleapis.com/css?family=Righteous|Coda|Raleway|Dosis|Josefin+Sans|Quicksand" rel="stylesheet" />
  </head>
  <body>
  <div class="codex">
  `;

  appState.sections.forEach( (section) => {
    let item = appState.items[section];

    if(item.type === "text"){
      htmlStr += textbox(item);
    }
    else if(item.type === "header"){
      htmlStr += heading(item);
    }
    else if(item.type === "img"){
      htmlStr += image(item);
    }
    else if(item.type === "youtube" || item.type === "codepen"){
      htmlStr += mediaItem(item);
    }
  })

  htmlStr += `</div>
  </body>
  </html>`

  return htmlStr;

}
