async function fetchOptions(component) {
    const response = await fetch(`http://localhost:3000/api/${component}`);
    const data = await response.json();
    return data;
}

async function populateSelects() {
    const components = ['video_card', 'cpu', 'cooler', 'ssd', 'ram', 'power_unit', 'frame', 'motherboard'];

    for (const component of components) {
        const selectElement = document.getElementById(component);
        const options = await fetchOptions(component);
        
        options.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option.price;
            optionElement.text = option.name;
            selectElement.appendChild(optionElement);
        });
    }
}

function calculatePrice() {
    const components = ['video_card', 'cpu', 'cooler', 'ssd', 'ram', 'power_unit', 'frame', 'motherboard'];
    let totalPrice = 0;

    components.forEach(component => {
        const selectElement = document.getElementById(component);
        const price = parseInt(selectElement.value) || 0;
        totalPrice += price;
    });

    document.getElementById('total-price').innerText = totalPrice;
}

// Заполнить списки при загрузке страницы
window.onload = populateSelects;
