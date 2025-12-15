const modal = document.getElementById('createEventModal');
const createEventBtn = document.getElementById('createEventBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const createEventForm = document.getElementById('createEventForm');
const modalMessage = document.getElementById('modalMessage');
const submitBtn = document.getElementById('submitBtn');

// Tjek om bruger er logget ind
async function checkAuth() {
    try {
        const response = await fetch('/api/auth/status');
        const data = await response.json();
        
        if (!data.loggetInd) {
            window.location.href = '/';
        } else {
            document.getElementById('userName').textContent = data.brugernavn;
            loadEvents();
        }
    } catch (error) {
        console.error('Auth check error:', error);
        window.location.href = '/';
    }
}

// Hent events
async function loadEvents() {
    try {
        const response = await fetch('/api/events');
        const events = await response.json();
        
        const eventsContent = document.getElementById('eventsContent');
        
        if (events.length === 0) {
            eventsContent.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📅</div>
                    <h3>Ingen events endnu</h3>
                    <p>Klik på "Opret Event" for at komme i gang!</p>
                </div>
            `;
        } else {
            const eventsList = events.map(event => {
                const eventDate = event.date ? new Date(event.date).toLocaleString('da-DK', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                }) : 'Ingen dato';
                
                // Vejr info
                let weatherHTML = '';
                if (event.weather && event.weather.temperature) {
                    const weatherEmoji = getWeatherEmoji(event.weather.weatherCode);
                    weatherHTML = `
                        <div class="event-meta-item">
                            <span class="weather-info">
                                <span class="weather-icon">${weatherEmoji}</span>
                                <span class="weather-temp">${event.weather.temperature}°C</span>
                            </span>
                        </div>
                    `;
                }
                
                return `
                    <div class="event-item" data-event-id="${event._id}">
                        <div class="event-id">Event #${event.id}</div>
                        <div class="event-title">${event.title}</div>
                        <div class="event-details">
                            ${event.description || 'Ingen beskrivelse'}
                        </div>
                        <div class="event-meta">
                            <div class="event-meta-item">📅 ${eventDate}</div>
                            <div class="event-meta-item">📍 ${event.location || 'Ingen lokation'}</div>
                            ${weatherHTML}
                            <div class="event-meta-item">👥 ${event.participants} deltagere</div>
                            <div class="event-meta-item">💰 ${event.entryFee} DKK</div>
                            ${event.eventPlanner ? `<div class="event-meta-item">👤 ${event.eventPlanner}</div>` : ''}
                        </div>
                        <div class="event-actions">
                            <button class="delete-btn" onclick="deleteEvent('${event._id}', '${event.title}')">
                                🗑️ Slet Event
                            </button>
                        </div>
                    </div>
                `;
            }).join('');
            eventsContent.innerHTML = '<div class="events-list">' + eventsList + '</div>';
        }
    } catch (error) {
        console.error('Error loading events:', error);
        document.getElementById('eventsContent').innerHTML = 
            '<p class="loading" style="color: #e74c3c;">Kunne ikke hente events.</p>';
    }
}

// Hjælpefunktion til at få vejr emoji
function getWeatherEmoji(code) {
    if (code === 0 || code === 1) return '☀️';
    if (code === 2) return '⛅';
    if (code === 3) return '☁️';
    if (code === 45 || code === 48) return '🌫️';
    if (code >= 51 && code <= 55) return '🌦️';
    if (code >= 61 && code <= 65) return '🌧️';
    if (code >= 71 && code <= 77) return '❄️';
    if (code >= 80 && code <= 82) return '🌧️';
    if (code >= 85 && code <= 86) return '🌨️';
    if (code >= 95) return '⛈️';
    return '🌤️';
}

// Slet event
async function deleteEvent(eventId, eventTitle) {
    const confirmDelete = confirm(`Er du sikker på, at du vil slette eventet "${eventTitle}"?\n\nDenne handling kan ikke fortrydes.`);
    
    if (!confirmDelete) {
        return;
    }

    try {
        const eventElement = document.querySelector(`[data-event-id="${eventId}"]`);
        const deleteBtn = eventElement.querySelector('.delete-btn');
        
        deleteBtn.disabled = true;
        deleteBtn.innerHTML = '⏳ Sletter...';

        const response = await fetch(`/api/events/${eventId}`, {
            method: 'DELETE'
        });

        if (response.ok || response.status === 204) {
            eventElement.style.transition = 'all 0.3s ease-out';
            eventElement.style.opacity = '0';
            eventElement.style.transform = 'translateX(-20px)';
            
            setTimeout(() => {
                loadEvents();
            }, 300);
        } else {
            const data = await response.json();
            alert('Kunne ikke slette event: ' + (data.message || 'Ukendt fejl'));
            
            deleteBtn.disabled = false;
            deleteBtn.innerHTML = '🗑️ Slet Event';
        }
    } catch (error) {
        console.error('Error deleting event:', error);
        alert('Der opstod en fejl ved sletning af event. Prøv igen.');
        
        const eventElement = document.querySelector(`[data-event-id="${eventId}"]`);
        const deleteBtn = eventElement.querySelector('.delete-btn');
        deleteBtn.disabled = false;
        deleteBtn.innerHTML = '🗑️ Slet Event';
    }
}

// Åbn modal
createEventBtn.addEventListener('click', () => {
    modal.classList.add('show');
    modalMessage.classList.remove('show');
});

// Luk modal
closeModalBtn.addEventListener('click', () => {
    modal.classList.remove('show');
    createEventForm.reset();
});

// Luk modal ved klik uden for
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('show');
        createEventForm.reset();
    }
});

// Luk modal med ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('show')) {
        modal.classList.remove('show');
        createEventForm.reset();
    }
});

// Håndter formular submit
createEventForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Opretter...';
    
    const formData = new FormData(createEventForm);
    const eventData = {};
    
    for (let [key, value] of formData.entries()) {
        if (value) {
            if (key === 'entryFee' || key === 'participants') {
                eventData[key] = parseInt(value);
            } else if (key === 'date') {
                eventData[key] = new Date(value).toISOString();
            } else if (key === 'lat' || key === 'lng') {
                if (!eventData.coordinates) eventData.coordinates = {};
                eventData.coordinates[key] = parseFloat(value);
            } else {
                eventData[key] = value;
            }
        }
    }

    try {
        const response = await fetch('/api/events', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(eventData)
        });

        const data = await response.json();

        if (response.ok) {
            showModalMessage(`Event oprettet succesfuldt med ID #${data.id}! 🎉`, 'success');
            createEventForm.reset();
            
            setTimeout(() => {
                modal.classList.remove('show');
                loadEvents();
                modalMessage.classList.remove('show');
            }, 1500);
        } else {
            showModalMessage(data.message || 'Kunne ikke oprette event', 'error');
        }
    } catch (error) {
        console.error('Error creating event:', error);
        showModalMessage('Der opstod en fejl. Prøv igen.', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Opret Event';
    }
});

// Vis besked i modal
function showModalMessage(text, type) {
    modalMessage.textContent = text;
    modalMessage.className = 'message ' + type + ' show';
}

// Logout
document.getElementById('logoutBtn').addEventListener('click', async () => {
    try {
        const response = await fetch('/api/auth/logout', {
            method: 'POST'
        });
        const data = await response.json();
        
        if (data.success) {
            window.location.href = '/';
        }
    } catch (error) {
        console.error('Logout error:', error);
    }
});

// DAWA Address Search Implementation
const locationInput = document.getElementById('eventLocation');
const addressDropdown = document.getElementById('addressDropdown');
const selectedAddressInput = document.getElementById('selectedAddress');
let searchTimeout;

// Søg efter adresser
async function searchAddress(query) {
    if (query.length < 2) {
        addressDropdown.classList.remove('show');
        return;
    }

    try {
        const response = await fetch(
            `https://api.dataforsyningen.dk/adresser/autocomplete?q=${encodeURIComponent(query)}&per_side=10`
        );
        const addresses = await response.json();
        
        displayAddresses(addresses);
    } catch (error) {
        console.error('DAWA API error:', error);
        addressDropdown.innerHTML = '<div class="address-empty">Kunne ikke hente adresser</div>';
        addressDropdown.classList.add('show');
    }
}

// Vis adresser i dropdown
function displayAddresses(addresses) {
    if (addresses.length === 0) {
        addressDropdown.innerHTML = '<div class="address-empty">Ingen adresser fundet</div>';
        addressDropdown.classList.add('show');
        return;
    }

    const html = addresses.map(addr => {
        const vejnavn = addr.adresse.vejnavn;
        const husnr = addr.adresse.husnr;
        const etage = addr.adresse.etage || '';
        const dør = addr.adresse.dør || '';
        const postnr = addr.adresse.postnr;
        const postnrnavn = addr.adresse.postnrnavn;
        
        let mainText = `${vejnavn} ${husnr}`;
        if (etage) mainText += `, ${etage}`;
        if (dør) mainText += ` ${dør}`;
        
        const detailText = `${postnr} ${postnrnavn}`;
        const fullAddress = `${mainText}, ${detailText}`;
        
        const lat = addr.adresse.y;
        const lng = addr.adresse.x;
        
        return `
            <div class="address-item" 
                 data-address="${fullAddress}"
                 data-lat="${lat}"
                 data-lng="${lng}">
                <div class="address-main">${mainText}</div>
                <div class="address-details">${detailText}</div>
            </div>
        `;
    }).join('');

    addressDropdown.innerHTML = html;
    addressDropdown.classList.add('show');

    document.querySelectorAll('.address-item').forEach(item => {
        item.addEventListener('click', () => {
            const fullAddress = item.dataset.address;
            const lat = item.dataset.lat;
            const lng = item.dataset.lng;
            
            locationInput.value = fullAddress;
            selectedAddressInput.value = fullAddress;
            
            document.getElementById('eventLat').value = lat;
            document.getElementById('eventLng').value = lng;
            
            addressDropdown.classList.remove('show');
        });
    });
}

// Lyt efter input i location feltet
locationInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    const query = e.target.value.trim();
    
    searchTimeout = setTimeout(() => {
        searchAddress(query);
    }, 300);
});

// Luk dropdown når der klikkes uden for
document.addEventListener('click', (e) => {
    if (!e.target.closest('.address-search-container')) {
        addressDropdown.classList.remove('show');
    }
});

// Luk dropdown med ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        addressDropdown.classList.remove('show');
    }
});

// Kør ved page load
checkAuth();