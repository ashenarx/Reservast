document.addEventListener('DOMContentLoaded', () => {
    fetch('../../src/components/navbar.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('navbar').innerHTML = html;
        })
        .catch(error => {
            console.error('Error loading navbar:', error);
        });

    const toggleButton = document.getElementById('toggle-reservations');
    const reservationList = document.querySelector('.reservation-list');

    const reservations = [
        {
            venue: "Hotel Bidakara Meeting Room",
            date: "22 September 2025",
            time: "13.00 - 16.00",
            duration: "3 Jam",
            total: "Rp30.000.000",
            image: "../../src/assets/images/hotelbidakara.svg"
        },
        {
            venue: "The Summit Room",
            date: "15 September 2025",
            time: "10.00 - 12.00",
            duration: "2 Jam",
            total: "Rp24.000.000",
            image: "../../src/assets/images/thesummitroom.svg"
        }
    ];

    let expanded = false;

    function renderReservations() {
        reservationList.innerHTML = '';
        const visibleReservations = expanded ? reservations : [reservations[0]];

        visibleReservations.forEach(reservation => {
            const card = document.createElement('div');
            card.classList.add('reservation-card');
            card.innerHTML = `
                <img src="${reservation.image}" alt="Venue Image" class="reservation-image">
                <div class="reservation-details">
                    <p><b>Venue:</b> ${reservation.venue}</p>
                    <p><b>Tanggal:</b> ${reservation.date}</p>
                    <p><b>Waktu:</b> ${reservation.time}</p>
                    <p><b>Durasi:</b> ${reservation.duration}</p>
                    <p><b>Total Biaya:</b> ${reservation.total}</p>
                </div>
            `;
            reservationList.appendChild(card);
        });

        toggleButton.textContent = expanded ? 'Lihat Lebih Sedikit' : 'Lihat Lebih Banyak';
    }

    toggleButton.addEventListener('click', () => {
        expanded = !expanded;
        renderReservations();
    });

    renderReservations();

    const modal = document.getElementById('change-password-modal');
    const changePasswordLink = document.querySelector('.change-password');
    const closeButton = document.querySelector('.close-button');
    const saveButton = document.getElementById('save-password-button');
    const cancelButton = document.getElementById('cancel-password-button');

    changePasswordLink.addEventListener('click', (event) => {
        event.preventDefault();
        modal.style.display = 'flex';
    });

    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    cancelButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    saveButton.addEventListener('click', () => {
        const currentPassword = document.getElementById('current-password').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        if (newPassword === confirmPassword) {
            alert('Password berhasil diubah!');
            modal.style.display = 'none';
        } else {
            alert('Kata sandi baru tidak cocok!');
        }
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});
