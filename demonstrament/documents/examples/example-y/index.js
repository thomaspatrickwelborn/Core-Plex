document
.querySelector('body')
.insertAdjacentHTML('afterbegin', `
<app>
  <nav class="menu">
    <button data-id="menu-a">Menu A</button>
    <button data-id="menu-b">Menu B</button>
    <button data-id="menu-c">Menu C</button>
  </nav>
  <nav class="section">
    <button data-id="section-a>"doSection A</button>
    <button data-id="section-b">Section B</button>
    <button data-id="section-c">Section C</button>
  </nav>
</app>
`)