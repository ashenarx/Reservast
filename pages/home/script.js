fetch('../../src/components/navbar.html')
    .then(response => response.text())
    .then(html => {
        document.getElementById('navbar').innerHTML = html;

        const toggleButtons = document.querySelectorAll('.toggle-button');
        toggleButtons.forEach(button => {
            button.addEventListener('click', () => {
                toggleButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
            });
        });
    })
    .catch(error => {
        console.error('Error loading navbar:', error);
    });

document.addEventListener('DOMContentLoaded', () => {
    flatpickr('#date-picker', {
        dateFormat: 'd-m-Y',
        defaultDate: new Date(),
        onChange: (selectedDates, dateStr) => {
            console.log('Selected date:', dateStr);
        }
    });

    const datePicker = document.querySelector('#date-picker');
    datePicker.addEventListener('click', (event) => {
        event.stopPropagation();
    });

    const timePicker = document.querySelector('.filter-content.time-picker');
    const timeGrid = timePicker.querySelector('.time-grid');
    const applyButton = timePicker.querySelector('.apply-time-button');
    const timeText = timePicker.querySelector('.filter-text');

    for (let hour = 0; hour < 24; hour++) {
        const timeSlot = document.createElement('div');
        timeSlot.classList.add('time-slot');
        timeSlot.textContent = `${hour.toString().padStart(2, '0')}:00`;
        timeGrid.appendChild(timeSlot);
    }

    let selectedTimes = [];

    timeGrid.addEventListener('click', (event) => {
        if (event.target.classList.contains('time-slot')) {
            const time = event.target.textContent;

            if (selectedTimes.includes(time)) {
                selectedTimes = selectedTimes.filter(t => t !== time);
                event.target.classList.remove('selected');
            } else if (selectedTimes.length < 2) {
                selectedTimes.push(time);
                event.target.classList.add('selected');
            }

            selectedTimes.sort();
        }
    });

    applyButton.addEventListener('click', (event) => {
        event.stopPropagation();
        if (selectedTimes.length === 2) {
            timeText.textContent = `${selectedTimes[0]} - ${selectedTimes[1]}`;
        } else {
            alert('Please select two times to create a time span.');
        }
        timePicker.classList.remove('active');
    });

    timePicker.addEventListener('click', (event) => {
        event.stopPropagation();
        timePicker.classList.toggle('active');
    });

    document.addEventListener('click', () => {
        timePicker.classList.remove('active');
    });

    const cards = [
        {
            tag: "Meeting Room",
            image: "../../src/assets/images/hotelbidakara.svg",
            title: "Hotel Bidakara Meeting Room",
            location: "Jakarta Selatan, DKJ",
            rating: 4.5,
            reviews: 67,
            price: "Rp10.000.000/jam",
        },
        {
            tag: "Meeting Room",
            image: "../../src/assets/images/thesummitroom.svg",
            title: "The Summit Room",
            location: "Jakarta Pusat, DKJ",
            rating: 4.7,
            reviews: 124,
            price: "Rp12.000.000/jam",
        },
        {
            tag: "Co-working Space",
            image: "../../src/assets/images/orbitroom.png",
            title: "Orbit Room",
            location: "Jakarta Selatan, DKJ",
            rating: 4.4,
            reviews: 31,
            price: "Rp8.500.000/jam",
        },
        {
            tag: "Event Space",
            image: "../../src/assets/images/quantumhall.svg",
            title: "Quantum Hall",
            location: "Jakarta Timur, DKJ",
            rating: 4.8,
            reviews: 150,
            price: "Rp15.000.000/jam",
        },
    ];

    function renderCards() {
        const cardGrid = document.querySelector(".card-grid");
        cardGrid.innerHTML = "";

        cards.forEach((card) => {

            const cardElement = document.createElement('div');
            cardElement.className = 'card';
            cardElement.setAttribute('data-title', card.title);

            cardElement.innerHTML = `
                <span class="card-tag">${card.tag}</span>
                <img src="${card.image}" alt="${card.title}" class="card-image">
                <div class="card-content">
                    <h2>${card.title}</h2>
                    <div class="card-location">
                        <img src="../../src/assets/icons/location.svg" alt="Location Icon" class="icon">
                        <span>${card.location}</span>
                    </div>
                    <div class="card-rating">
                        <img src="../../src/assets/icons/star.svg" alt="Star Icon" class="icon">
                        <span>${card.rating} (${card.reviews} Ulasan)</span>
                    </div>
                    <div class="card-price">${card.price}</div>
                </div>
            `;
            cardGrid.appendChild(cardElement);
        });
        
        document.querySelectorAll('.card').forEach(card => {
            if (card.getAttribute('data-title') === 'Hotel Bidakara Meeting Room') {
                card.style.cursor = 'pointer';
                card.addEventListener('click', () => {
                    window.location.href = '../details/details.html';
                });
            }
        });
    }

    renderCards();

    document.querySelectorAll('.filter').forEach(filter => {
        const filterContent = filter.querySelector('.filter-content');
        const dropdown = filter.querySelector('.dropdown');
        const options = dropdown.querySelectorAll('li');

        filterContent.addEventListener('click', (event) => {
            event.stopPropagation();
            document.querySelectorAll('.filter').forEach(f => {
                if (f !== filter) f.classList.remove('active');
            });
            filter.classList.toggle('active');
        });

        options.forEach(option => {
            option.addEventListener('click', (event) => {
                event.stopPropagation();
                const selectedText = option.textContent.trim();
                filterContent.querySelector('.filter-text').textContent = selectedText;
                filter.classList.remove('active');
            });
        });
    });

    document.addEventListener('click', () => {
        document.querySelectorAll('.filter').forEach(f => f.classList.remove('active'));
    });
});
