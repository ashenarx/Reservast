fetch('../../src/components/navbar.html')
    .then(response => response.text())
    .then(html => {
        document.getElementById('navbar').innerHTML = html;
    })
    .catch(error => {
        console.error('Error loading navbar:', error);
    });