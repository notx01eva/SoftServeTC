const cards = document.querySelectorAll('.card');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
let selectedCourse = '';

cards.forEach(card => {
    card.addEventListener('click', (event) => {
        selectedCourse = event.currentTarget.dataset.course || 'невідомий курс';
        modalTitle.innerText = `Хочете дізнатись більше про ${selectedCourse}?`;
        modal.classList.add('active');
    });
});

function closeModal() {
    modal.classList.remove('active');
    clearForm();
}

function clearForm() {
    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
}

async function submitForm() {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();

    if (!name || !email || !selectedCourse) {
        alert('Будь ласка, заповніть усі поля!');
        return;
    }

    if (!validateEmail(email)) {
        alert('Неправильний формат електронної пошти!');
        return;
    }

    try {
        const response = await fetch('http://localhost:4567/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, course: selectedCourse })
        });

        const result = await response.json();
        if (response.ok) {
            alert(result.message);
            closeModal();
        } else {
            alert(`Помилка: ${result.message}`);
        }
    } catch (error) {
        console.error('Помилка відправки форми:', error);
        alert('Не вдалося надіслати заявку. Перевірте підключення до сервера.');
    }
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

modal.addEventListener('click', (event) => {
    if (event.target === modal) {
        closeModal();
    }
});