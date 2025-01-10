const button = document.querySelector("button");
const form = document.querySelector("form");
const input = document.getElementById("item");
const products = document.querySelector(".products");

const colorBrand = "#CA3884";
const alwaysWhite = "#FFFFFF";
const borderPrimary = "#D1D5DB";

// Evento que carrega os itens salvos quando a página é aberta
document.addEventListener("DOMContentLoaded", () => {
	renderItems(loadFromLocalStorage()); // Carrega os itens salvos no LocalStorage e renderiza
});

// Evento de envio do formulário
form.addEventListener("submit", (event) => {
	event.preventDefault();

	const inputValue = input.value.trim();
	if (inputValue === "") return;

	// Carrega os itens salvos do LocalStorage
	const items = loadFromLocalStorage();

	// Cria um novo item com um ID único, o nome inserido e estado "unchecked"
	const newItem = {
		id: Date.now(),
		name: inputValue,
		checked: false,
	};

	items.push(newItem); // Adiciona o novo item ao array de itens
	saveToLocalStorage(items); // Salva o array atualizado no LocalStorage
	renderItems(items); // Renderiza a lista de itens atualizada na interface

	input.value = ""; // Limpa o campo de texto para entrada de novos itens
	input.focus(); // Retorna o foco ao campo de entrada
});

// Função para criar e adicionar o elemento visual de um item na interface
function createItem(itemId, itemName, isChecked) {
	let checked = isChecked;
	const flexDiv = document.createElement("div");
	flexDiv.classList.add("flex");

	const checkboxDiv = document.createElement("div");
	checkboxDiv.classList.add("checkbox");

	const checkImg = document.createElement("img");
	checkImg.src = "assets/icons/check.svg";
	checkImg.alt = "Ícone de verificado";

	const productText = document.createElement("p");
	productText.textContent = itemName;

	const dustbinImg = document.createElement("img");
	dustbinImg.src = "assets/icons/dustbin.svg";
	dustbinImg.alt = "Ícone de lixeira";

	// Aplica estilos visuais ao checkbox, caso o item já esteja marcado
	if (checked) {
		checkboxDiv.style.backgroundColor = colorBrand;
		checkboxDiv.style.border = "none";
	}

	// Adiciona evento de clique no checkbox
	checkImg.addEventListener("click", () => {
		checked = !checked;

		// Atualiza o estilo visual do checkbox conforme o estado atual
		if (checked) {
			checkboxDiv.style.backgroundColor = colorBrand;
			checkboxDiv.style.border = "none";
		} else {
			checkboxDiv.style.backgroundColor = alwaysWhite;
			checkboxDiv.style.border = `1.5px solid ${borderPrimary}`;
		}

		// Atualiza o estado do item no LocalStorage
		const items = loadFromLocalStorage();
		const updatedItems = items.map((item) =>
			item.id === itemId ? { ...item, checked: isChecked } : item,
		);
		saveToLocalStorage(updatedItems);
	});

	// Adiciona evento de exclusão
	dustbinImg.addEventListener("click", () => {
		// Remove o item correspondente ao ID clicado
		const items = loadFromLocalStorage();
		const updatedItems = items.filter((product) => product.id !== itemId);
		saveToLocalStorage(updatedItems);
		renderItems(updatedItems);

		// Mostra a notificação de exclusão com animação
		showDeletionNotification();
	});

	// Monta o elemento visual, adicionando um elemento dentro do outro
	checkboxDiv.appendChild(checkImg);
	flexDiv.appendChild(checkboxDiv);
	flexDiv.appendChild(productText);
	flexDiv.appendChild(dustbinImg);
	products.appendChild(flexDiv);
}

// Função para salvar os itens no LocalStorage
function saveToLocalStorage(items) {
	// Converte o array de itens para uma string JSON e armazena no LocalStorage
	localStorage.setItem("products", JSON.stringify(items));
}

// Função para carregar os itens salvos do LocalStorage
function loadFromLocalStorage() {
	const savedItems = localStorage.getItem("products");
	return savedItems ? JSON.parse(savedItems) : [];
}

// Função para renderizar os itens na página
function renderItems(items) {
	// Remove da tela todos os itens que já foram excluidos
	products.innerHTML = "";
	// Para cada item no array, cria e adiciona o elemento correspondente à interface
	for (const item of items) {
		createItem(item.id, item.name, item.checked);
	}
}

let deletionAnimationTimeout;

function showDeletionNotification() {
	const notificationMessage = document.querySelector(".exclusion-message");
	if (!notificationMessage) return;

	// Remove a classe de animação, caso já esteja presente
	if (notificationMessage.classList.contains("animate")) {
		notificationMessage.classList.remove("animate");

		void notificationMessage.offsetWidth; // Força o reflow para reiniciar a animação
	}

	// Adiciona a classe de animação novamente
	notificationMessage.classList.add("animate");

	// Cancela qualquer timeout anterior
	if (deletionAnimationTimeout) clearTimeout(deletionAnimationTimeout);

	// Define um novo timeout para remover a classe
	deletionAnimationTimeout = setTimeout(() => {
		notificationMessage.classList.remove("animate-deletion");
	}, 3000); // Tempo igual ao da animação CSS
}