<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>D&D Генератор</title>
  <link rel="stylesheet" href="css/style.css">
  <script src="js/script.js" defer></script>
  <style>
   /* Дополнительные стили для кнопок в журнале */
    .log-button {
      position: fixed;
      bottom: 20px;
      right: 20px;
      padding: 10px 15px;
      font-size: 18px;
      background: #333;
      color: #fff;
      border: none;
      cursor: pointer;
      border-radius: 5px;
      box-shadow: 0 0 5px rgba(255, 255, 255, 0.2);
      transition: background 0.3s;
    }
    .log-button:hover {
      background: #444;
    }
    #logList {
      max-height: 300px;
      overflow-y: auto;
      list-style: none;
      padding: 0;
      margin: 0;
    }
    #logList li {
      background: #444;
      margin: 5px 0;
      padding: 8px;
      border-radius: 4px;
      cursor: pointer;
      transition: background 0.3s;
    }
    #logList li:hover {
      background: #555;
    }
    .log-filters {
      margin-bottom: 10px;
      text-align: center;
    }
    .log-filters button {
      margin: 0 5px;
      padding: 5px 10px;
      cursor: pointer;
      border: 2px solid white;
      background: linear-gradient(145deg, #2a2a2a, #3a3a3a);
      color: white;
      border-radius: 5px;
      transition: background 0.3s;
    }
    .log-filters button:hover {
      background: linear-gradient(145deg, #3a3a3a, #4a4a4a);
    }
  </style>
</head>
<body>
  <h1 class="centered-title">Генератор для D&D</h1>

  <div class="button-container">
    <button class="open-modal wide-button" data-modal="npcModal">Генерировать NPC</button>
    <button class="open-modal wide-button" data-modal="questModal">Генерировать Квест</button>
    <button class="open-modal wide-button" data-modal="locationModal">Генерировать Локацию</button>
    <button class="open-modal wide-button" data-modal="eventModal">Генерировать Событие</button>
    <button class="open-modal wide-button" data-modal="lootModal">Генерировать Лут</button>
    <button class="open-modal wide-button" data-modal="encounterModal">Генерировать Столкновение</button>
    <button class="open-modal wide-button" data-modal="tavernModal">Генерировать Таверну</button>
  </div>

  <!-- Контейнер для круглых кнопок -->
  <div class="floating-buttons">
    <button class="circle-generator" onclick="openSimpleGenerator()"></button>
    <!-- Кнопка для открытия дневника квестов -->
    <button class="circle-journal" onclick="openQuestJournal()"></button>
  </div>

  <!-- NPC Modal -->
  <div id="npcModal" class="modal">
    <div class="modal-content">
      <div class="modal-header">
        <h2>Генерация NPC</h2>
        <button class="new-close-modal" onclick="closeModal('npcModal')"></button>
      </div>
      <label for="npcReputation">Выберите репутацию NPC:</label>
      <div class="select-wrapper">
        <select id="npcReputation">
          <option value="low">Незначительная</option>
          <option value="medium">Влиятельная</option>
          <option value="high">Могущественная</option>
        </select>
      </div>
      <button id="npcButton" class="generate-button" onclick="generateNPC()">Сгенерировать</button>
      <div id="npcResult" class="generated-text"></div>
      <button id="npcQuestButton" class="quest-button" style="display:none;" onclick="getNPCQuest()">Узнать про квест</button>
      <div id="npcQuestResult" class="generated-text"></div>
      <div id="questActions" style="display:none;">
        <button class="accept-button" onclick="acceptQuest()">✔ Взять</button>
        <button class="decline-button" onclick="declineQuest()">✖ Отказаться</button>
      </div>
    </div>
  </div>

  <!-- Quest Modal -->
  <div id="questModal" class="modal">
    <div class="modal-content">
      <div class="modal-header">
        <h2>Генерация Квеста</h2>
        <button class="new-close-modal" onclick="closeModal('questModal')"></button>
      </div>
      <label for="questDifficulty">Выберите сложность:</label>
      <div class="select-wrapper">
        <select id="questDifficulty">
          <option value="easy">Простой</option>
          <option value="medium">Средний</option>
          <option value="hard">Трудный</option>
        </select>
      </div>
      <button id="questButton" class="generate-button" onclick="generateQuest()">Сгенерировать</button>
      <div id="questResult" class="generated-text"></div>
      <div id="questActionsStandalone" style="display:none;">
        <button class="accept-button" onclick="acceptQuestStandalone()">✔ Взять</button>
        <button class="decline-button" onclick="declineQuestStandalone()">✖ Отказаться</button>
      </div>
    </div>
  </div>

  <!-- Журнал Событий -->
  <button id="openLogButton" class="log-button">📜 Журнал</button>
  <div id="logModal" class="modal">
    <div class="modal-content">
      <div class="modal-header">
        <h2>Журнал генераций</h2>
        <button class="new-close-modal" onclick="closeModal('logModal')"></button>
      </div>
      <!-- Фильтры по типу -->
      <div id="logFilters" class="log-filters">
        <button data-filter="all">Все</button>
        <button data-filter="NPC">NPC</button>
        <button data-filter="Квест">Квест</button>
        <button data-filter="Лут">Лут</button>
        <button data-filter="Локация">Локация</button>
        <button data-filter="Событие">Событие</button>
        <button data-filter="Столкновение">Столкновение</button>
        <button data-filter="Таверна">Таверна</button>
      </div>
      <ul id="logList" class="log-list"></ul>
    </div>
  </div>

  <!-- Quest Journal Modal (Дневник квестов) -->
  <div id="questJournalModal" class="modal">
    <div class="modal-content">
      <div class="modal-header">
        <h2>Дневник квестов</h2>
        <button class="new-close-modal" onclick="closeModal('questJournalModal')"></button>
      </div>
      <div class="journal-container">
        <h3>🟢 Активные квесты</h3>
        <ul id="activeQuests"></ul>
        <h3>⚪ Завершенные квесты</h3>
        <ul id="completedQuests"></ul>
      </div>
    </div>
  </div>
<button id="askNpc">Говорить с NPC</button>

<div id="dialogWindow" style="display: none;">
    <div id="npcDialog"></div>
    <input type="text" id="playerInput" placeholder="Напишите что-то...">
    <button id="sendMessage">Отправить</button>
</div>

</body>
</html>
