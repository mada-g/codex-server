function renderPageTitle(page, user){
  return `<div class="page-elem">
            <a href="/view/${user}/${page.pageid}">
              <div class="page-title">${page.title}</div>
              <div class="page-details">${page.details}</div>
            </a>
      </div>`
}


export default function(data, user){

  let htmlStr = `<!doctype html>
  <html>
  <head>
    <title>Codex // Madalinski</title>
    <link href="https://fonts.googleapis.com/css?family=Righteous|Coda|Raleway|Dosis|Josefin+Sans|Quicksand" rel="stylesheet" />
    <link rel="stylesheet" type="text/css" href="/assets/style_userpage.css"/>
  </head>
  <body>
  <div class="codex">

    <div class="headerBar">
      <div class="tool-sect page-tools">
        <div class="toolbox">
          <div class="toolbox-box app-title">codex</div>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="user-title">
        Stories by <span>${user}</span>
      </div>
  `;


  data.forEach((p) => {
    htmlStr += renderPageTitle(p, user);
  })

  htmlStr += `</div>
    </div>
  </body>
  </html>`;

  return htmlStr;

}
