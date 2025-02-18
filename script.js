document.addEventListener(DOMContentLoaded, function () {
  const apiKey = ТВОЙ_API_КЛЮЧ;  Твой ключ API от OpenAI
  const npc = {
    name Трактирщик Том,
    personality грубый, подозрительный, жадный,
    trust 50  Уровень доверия NPC
  };

   Открытие модальных окон
  const openButtons = document.querySelectorAll(.open-modal);
  openButtons.forEach(button = {
    button.addEventListener(click, function () {
      const modalId = this.getAttribute(data-modal);
      if (modalId) openModal(modalId);
    });
  });

   Генерация NPC
  window.generateNPC = function () {
    const reputation = document.getElementById(npcReputation).value;
    const prompt = `Ты NPC ${npc.name}. Твой характер ${npc.personality}. Игрок выбирает репутацию NPC ${reputation}. Опиши его действия.`; 
    fetch(httpsapi.openai.comv1chatcompletions, {
      method POST,
      headers {
        Content-Type applicationjson,
        Authorization `Bearer ${apiKey}`
      },
      body JSON.stringify({
        model gpt-4, 
        messages [{ role system, content prompt }],
        max_tokens 100
      })
    })
    .then(response = response.json())
    .then(data = {
      const npcResponse = data.choices[0].message.content;
      document.getElementById(npcResult).innerHTML = `bОтвет NPCb ${npcResponse}`;
    })
    .catch(error = {
      console.error(Ошибка, error);
      document.getElementById(npcResult).innerHTML = `bОшибка при генерации NPCb`;
    });
  };

   Генерация квеста
  window.generateQuest = function () {
    const difficulty = document.getElementById(questDifficulty).value;
    const prompt = `Создайте квест с уровнем сложности ${difficulty}.`;
    fetch(httpsapi.openai.comv1chatcompletions, {
      method POST,
      headers {
        Content-Type applicationjson,
        Authorization `Bearer ${apiKey}`
      },
      body JSON.stringify({
        model gpt-4, 
        messages [{ role system, content prompt }],
        max_tokens 100
      })
    })
    .then(response = response.json())
    .then(data = {
      const questData = data.choices[0].message.content;
      document.getElementById(questResult).innerHTML = `bКвестb ${questData}`;
    })
    .catch(error = {
      console.error(Ошибка, error);
      document.getElementById(questResult).innerHTML = `bОшибка при генерации квестаb`;
    });
  };

});
