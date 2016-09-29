import title from './components/title.js';
import textbox from './components/textbox.js';
import heading from './components/heading.js';
import image from './components/image.js';
import mediaItem from './components/mediaItem.js';

export default function(appState, details){

  console.log('author: ' + details);

  let htmlStr = `<!doctype html>
  <html>
  <head>
    <title>Codex // Madalinski</title>
    <link href="https://fonts.googleapis.com/css?family=Righteous|Coda|Raleway|Dosis|Josefin+Sans|Quicksand" rel="stylesheet" />
    <link rel="stylesheet" type="text/css" href="/assets/style_pageviewer.css"/>
  </head>
  <body>
  <div class="codex">
    <div class="codex-container">
  `;

  console.log(appState.items);

  appState.sections.forEach( (section) => {
    let item = appState.items[section];

    if(item.type === "text"){
      htmlStr += textbox(item) || "";
    }
    else if(item.type === "title"){
      htmlStr += title(item, details.auth, appState.date) || "";
    }
    else if(item.type === "header"){
      htmlStr += heading(item, appState.headingNumbering);
    }
    else if(item.type === "img"){
      htmlStr += image(item) || "";
    }
    else if(item.type === "youtube" || item.type === "codepen"){
      htmlStr += mediaItem(item) || "";
    }
  })

  htmlStr += `</div>
    </div>
  </body>
  </html>`

  return htmlStr;

}
