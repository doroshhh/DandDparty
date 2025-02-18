document.addEventListener("DOMContentLoaded", function () {
  const openButtons = document.querySelectorAll(".open-modal");
  const closeButtons = document.querySelectorAll(".new-close-modal");

  // Функция открытия модального окна
  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add("modal-open");
      modal.style.display = "block";
      modal.style.opacity = "1";
      modal.style.visibility = "visible";
      modal.style.zIndex = "1000"; // Поверх других окон
    }
  }

  // Функция закрытия конкретного модального окна
  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove("modal-open");
      modal.style.opacity = "0";
      modal.style.visibility = "hidden";
      modal.style.zIndex = "-1";
      setTimeout(() => {
        modal.style.display = "none";
      }, 200);
    }
  }

  // Привязка кнопок открытия и закрытия
  openButtons.forEach(button => {
    button.addEventListener("click", function () {
      const modalId = this.getAttribute("data-modal");
      if (modalId) {
        openModal(modalId);
      }
    });
  });

  closeButtons.forEach(button => {
    button.addEventListener("click", function () {
      const modal = this.closest(".modal");
      if (modal) {
        closeModal(modal.id);
      }
    });
  });

  // Открытие журнала событий при клике на кнопку "Журнал"
  const logButton = document.getElementById("openLogButton");
  logButton.addEventListener("click", function () {
    openModal("logModal");
  });

  // Фильтрация журнала по типу
  const logFilters = document.getElementById("logFilters").querySelectorAll("button");
  logFilters.forEach(filterBtn => {
    filterBtn.addEventListener("click", function () {
      const filter = this.dataset.filter;
      const logEntries = document.querySelectorAll("#logList li");
      logEntries.forEach(entry => {
        if (filter === "all" || entry.dataset.type === filter) {
          entry.style.display = "block";
        } else {
          entry.style.display = "none";
        }
      });
    });
  });

  // Определение модального окна по типу генерации
  function getModalIdByType(type) {
    const modalMap = {
      "NPC": "npcModal",
      "Квест": "questModal",
      "Локация": "locationModal",
      "Лут": "lootModal",
      "Событие": "eventModal",
      "Столкновение": "encounterModal",
      "Таверна": "tavernModal"
    };
    return modalMap[type] || null;
  }

  // Заполнение модального окна данными из журнала
  function populateModal(modalId, data) {
    if (modalId === "npcModal") {
      document.getElementById("npcResult").innerHTML = `
        <b>${data.name}</b>, ${data.race}, ${data.gender}, ${data.age} <br>
        <b>Характер:</b> ${data.character_description} <br>
        <b>Внешность:</b> ${data.appearance} <br>
        <b>Одежда:</b> ${data.clothing} <br>
        <b>Поведение:</b> ${data.behavior}
      `;
      if (data.quest && data.quest.title) {
        document.getElementById("npcQuestButton").style.display = "inline-block";
        document.getElementById("npcQuestButton").dataset.quest = JSON.stringify(data.quest);
      }
    } else if (modalId === "questModal") {
      document.getElementById("questResult").innerHTML = `
        <b>Квест:</b> ${data.title} <br>
        <b>Описание:</b> ${data.description} <br>
      `;
      document.getElementById("questActionsStandalone").style.display = "block";
    }
  }

  // Функция добавления записи в журнал событий
  function addToLog(type, data) {
    const logList = document.getElementById("logList");
    let logEntry = document.createElement("li");
    logEntry.textContent = `[${type}] ${data.name || data.title || "Неизвестно"}`;
    logEntry.dataset.type = type; // сохраняем тип для фильтрации
    logEntry.style.cursor = "pointer";
    logEntry.addEventListener("click", function () {
      const modalId = getModalIdByType(type);
      if (modalId) {
        openModal(modalId);
        populateModal(modalId, data);
      }
    });
    logList.appendChild(logEntry);
  }

  // Функция генерации NPC
  window.generateNPC = function () {
    const reputation = document.getElementById("npcReputation").value;
    fetch(`php/generate_npc.php?reputation=${reputation}`)
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          document.getElementById("npcResult").innerHTML = `<b>Ошибка:</b> ${data.error}`;
          document.getElementById("npcQuestButton").style.display = "none";
        } else {
          document.getElementById("npcResult").innerHTML = `
            <b>${data.name}</b>, ${data.race}, ${data.gender}, ${data.age} <br>
            <b>Характер:</b> ${data.character_description} <br>
            <b>Внешность:</b> ${data.appearance} <br>
            <b>Одежда:</b> ${data.clothing} <br>
            <b>Поведение:</b> ${data.behavior}
          `;
          let npcQuestButton = document.getElementById("npcQuestButton");
          if (data.quest && data.quest.title) {
            npcQuestButton.style.display = "inline-block";
            npcQuestButton.dataset.quest = JSON.stringify(data.quest);
            // Кнопки "Принять" и "Отказаться" появятся после нажатия на "Узнать про квест"
          } else {
            npcQuestButton.style.display = "none";
            document.getElementById("questActions").style.display = "none";
          }
          addToLog("NPC", data);
        }
      })
      .catch(error => {
        console.error("Ошибка запроса:", error);
        document.getElementById("npcResult").innerHTML = `<b>Ошибка:</b> Не удалось получить NPC`;
      });
  };

  // Функция "Узнать про квест" для NPC
  window.getNPCQuest = function () {
    const npcQuestButton = document.getElementById("npcQuestButton");
    let questData = npcQuestButton.dataset.quest;
    if (!questData || questData === "undefined") {
      console.error("❌ Ошибка: Квест не найден.");
      document.getElementById("npcQuestResult").innerHTML = `<b>Ошибка:</b> Квест отсутствует.`;
      document.getElementById("questActions").style.display = "none";
      return;
    }
    let quest = JSON.parse(questData);
    document.getElementById("npcQuestResult").innerHTML = `
      <b>Квест:</b> ${quest.title} <br>
      <b>Описание:</b> ${quest.description} <br>
    `;
    // Показываем кнопки "Принять" и "Отказаться"
    document.getElementById("questActions").style.display = "block";
  };

  // Функция принятия квеста (из NPC)
  window.acceptQuest = function () {
    const npcResult = document.getElementById("npcResult");
    const npcQuestResult = document.getElementById("npcQuestResult");
    if (!npcResult || !npcQuestResult) {
      console.error("❌ Ошибка: Не удалось извлечь информацию о квесте!");
      return;
    }
    let npcNameMatch = npcResult.innerHTML.match(/<b>(.*?)<\/b>/);
    let questTitleMatch = npcQuestResult.innerHTML.match(/<b>Квест:<\/b> (.*?) <br>/);
    let questDescriptionMatch = npcQuestResult.innerHTML.match(/<b>Описание:<\/b> (.*?) <br>/);
    if (!npcNameMatch || !questTitleMatch || !questDescriptionMatch) return;
    let npcName = npcNameMatch[1];
    let questTitle = questTitleMatch[1];
    let questDescription = questDescriptionMatch[1];
    // Добавляем квест в дневник квестов
    addQuestToJournal(`
      <b>📝 ${questTitle}</b><br>
      <i>От: ${npcName}</i><br>
      ${questDescription} <br>
    `);
    closeModal("npcModal");
    npcResult.innerHTML = "";
    npcQuestResult.innerHTML = "";
    document.getElementById("questActions").style.display = "none";
    document.getElementById("npcQuestButton").style.display = "none";
    addToLog("Квест", { title: questTitle, description: questDescription });
  };

  // Функция для кнопки "Отказаться" (из NPC)
  function declineQuest() {
    document.getElementById("npcQuestResult").innerHTML = "";
    document.getElementById("questActions").style.display = "none";
    document.getElementById("npcQuestButton").dataset.quest = "";
  }

  // Функция добавления квеста в дневник (Quest Journal)
  function addQuestToJournal(questHTML) {
    let activeQuestsContainer = document.getElementById("activeQuests");
    let completedQuestsContainer = document.getElementById("completedQuests");
    if (!activeQuestsContainer || !completedQuestsContainer) {
      console.error("❌ Ошибка: Контейнеры для квестов не найдены!");
      return;
    }
    let questEntry = document.createElement("li");
    questEntry.classList.add("journal-entry");
    questEntry.innerHTML = questHTML;
    let completeButton = document.createElement("button");
    completeButton.innerText = "✅ Завершить";
    completeButton.classList.add("complete-button");
    completeButton.onclick = function () {
      completeQuest(this);
    };
    questEntry.appendChild(completeButton);
    activeQuestsContainer.appendChild(questEntry);
  }

  // Завершение квеста (перемещение из активных в завершённые)
  function completeQuest(button) {
    const questItem = button.parentElement;
    button.remove(); // Удаляем кнопку "Завершить"
    document.getElementById("completedQuests").appendChild(questItem);
  }

  // Функция принятия квеста из окна квеста (standalone)
  window.acceptQuestStandalone = function () {
    const questResult = document.getElementById("questResult");
    if (!questResult || questResult.innerHTML.trim() === "") {
      console.error("❌ Ошибка: Квест не сгенерирован!");
      return;
    }
    let questTitleMatch = questResult.innerHTML.match(/<b>Квест:<\/b> (.*?) <br>/);
    let questDescriptionMatch = questResult.innerHTML.match(/<b>Описание:<\/b> (.*?) <br>/);
    if (!questTitleMatch || !questDescriptionMatch) {
      console.error("❌ Ошибка: Невозможно извлечь детали квеста.");
      return;
    }
    let questTitle = questTitleMatch[1];
    let questDescription = questDescriptionMatch[1];
    addQuestToJournal(`
      <b>📝 ${questTitle}</b><br>
      ${questDescription} <br>
    `);
    closeModal("questModal");
    questResult.innerHTML = "";
    document.getElementById("questActionsStandalone").style.display = "none";
  };

  // Функция для кнопки "Отказаться" в окне квеста
  function declineQuestStandalone() {
    document.getElementById("questResult").innerHTML = "";
    document.getElementById("questActionsStandalone").style.display = "none";
  }

  // Функция генерации квеста
  window.generateQuest = function () {
    const difficulty = document.getElementById("questDifficulty").value;
    fetch(`php/generate_quest.php?difficulty=${difficulty}`)
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          document.getElementById("questResult").innerHTML = `<b>Ошибка:</b> ${data.error}`;
          document.getElementById("questActionsStandalone").style.display = "none";
        } else {
          document.getElementById("questResult").innerHTML = `
            <b>Квест:</b> ${data.title} <br>
            <b>Описание:</b> ${data.description} <br>
          `;
          document.getElementById("questActionsStandalone").style.display = "block";
          addToLog("Квест", data);
        }
      })
      .catch(error => {
        console.error("Ошибка запроса:", error);
        document.getElementById("questResult").innerHTML = `<b>Ошибка:</b> Не удалось получить квест`;
      });
  };

  // Функция для открытия дневника квестов (Quest Journal)
  window.openQuestJournal = function () {
    openModal("questJournalModal");
  };

  // Экспорт decline функций для использования в HTML (если требуется)
  window.declineQuest = declineQuest;
  window.declineQuestStandalone = declineQuestStandalone;

});
const apiKey = "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"; // Твой OpenAI API-ключ

const npc = {
    name: "Трактирщик Том",
    personality: "грубый, подозрительный, жадный",
    trust: 50 // Уровень доверия NPC
};

document.getElementById("askNpc").addEventListener("click", function() {
    document.getElementById("dialogWindow").style.display = "block";
});

document.getElementById("sendMessage").addEventListener("click", async function() {
    const playerMessage = document.getElementById("playerInput").value;
    let npcTrust = npc.trust;

 // 📉 Если игрок хамит - NPC злится
    if (playerMessage.toLowerCase().includes("дурак") || playerMessage.toLowerCase().includes("идиот")) {
        npcTrust -= 10;
    } else if (playerMessage.toLowerCase().includes("спасибо") || playerMessage.toLowerCase().includes("помогу")) {
        npcTrust += 5;
    }

    npc.trust = Math.max(0, Math.min(100, npcTrust)); // Не даем уйти за пределы 0-100

    const messages = `
    Ты ${npc.name}. Твой характер: ${npc.personality}. 
    Текущий уровень доверия к игроку: ${npc.trust}. 
    Игрок говорит: "${playerMessage}". Как ты ответишь?
    `;

const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
        model: "gpt-4", // Или "gpt-3.5-turbo"
        messages: [{ role: "system", content: messages }],
        max_tokens: 100
    })
});


const data = await response.json();
if (data && data.choices && data.choices[0]) {
    const npcResponse = data.choices[0].message.content;
    document.getElementById("npcDialog").innerHTML += `<p><b>${npc.name}:</b> ${npcResponse}</p>`;
} else {
    console.error("❌ Ошибка: Не получен правильный ответ от API", data);
}
});
