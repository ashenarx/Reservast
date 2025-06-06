fetch('../../src/components/navbar.html')
    .then(response => response.text())
    .then(html => {
        document.getElementById('navbar').innerHTML = html;
    })
    .catch(error => {
        console.error('Error loading navbar:', error);
    });

document.addEventListener('DOMContentLoaded', function() {
    const btn = document.querySelector('.reserve-btn');
    if (btn) {
        btn.addEventListener('click', () => {
            alert('Reservasi berhasil! Silakan cek email Anda untuk konfirmasi.');
        });
    }
});