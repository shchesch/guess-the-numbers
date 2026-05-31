const MIN_NUMBER = 40;
const MAX_NUMBER = 100;

document.addEventListener('DOMContentLoaded', function() {
    
    // ========== тут находим все элементы йоу ==========
    
    const guessButton = document.querySelector('.but:first-child');     // Кнопка "Угадать"
    const resetButton = document.querySelector('.but:last-child');      // Кнопка "Начать заново"
    const numberInput = document.querySelector('.number-input');        // Поле ввода числа
    const hintText = document.querySelector('.hint-text');              // Текст подсказки (больше/меньше)
    const historyText = document.querySelector('.history-text');        // история
    const attemptsText = document.querySelector('.range-2-text');       // кол-во попытокTe
    const rangeText = document.querySelector('.range-text')

    if (rangeText) {
        rangeText.textContent = `Задано число в диапозоне от ${MIN_NUMBER} до ${MAX_NUMBER}`
    }
    
    // ========== 2. Переменные игры (состояние) ==========

    function calculateMaxAttempts() {
        const rangeSize = MAX_NUMBER - MIN_NUMBER + 1;
        return Math.ceil(Math.log2(rangeSize));
    }

    const maxAttempts = calculateMaxAttempts();
    let secretNumber;           // Загаданное число (будет задано при старте)
    let attemptsLeft;           // Оставшиеся попытки
    let history = [];           // Массив для хранения истории попыток
    let gameActive = true;      // Активна ли игра (не закончена победой/поражением)
    
    // ========== 3. Функция запуска/сброса игры ==========
    // простая математика 0-0
    function startNewGame() {
        secretNumber = Math.floor(Math.random() * (MAX_NUMBER - MIN_NUMBER + 1)) + MIN_NUMBER;
        
        // сброс попыток
        attemptsLeft = maxAttempts;
        
        // очищаем историю
        history = [];
        
        gameActive = true;
        
        // анблокаем поле ввода и кнопочки
        numberInput.disabled = false;
        guessButton.disabled = false;
        
        // Очищаем поле ввода
        numberInput.value = '';
        
        // Обновляем текст с попытками
        updateAttemptsDisplay();
        
        // Обновляем историю (очищаем)
        updateHistoryDisplay();
        
        // Обновляем подсказку
        hintText.innerHTML = '<strong> Введи число и нажми "Угадать"!</strong>';
        
        // Ставим фокус на поле ввода
        numberInput.focus();
        
        // чтобы проверять правельное число f12
        console.log('Загадано число:', secretNumber);
    }
    
    // ========== 4. Функция обновления счётчика попыток ==========
    function updateAttemptsDisplay() {
        // Меняем текст у элемента с классом range-2-text
        // Вместо буквы n подставляем текущее количество попыток
        attemptsText.textContent = `У вас есть ${attemptsLeft} попыток его угадать. Удачи!`;
    }
    
    // ========== Функция обновления истории ==========
    function updateHistoryDisplay() {
        if (history.length === 0) {
            // Если история пуста, показываем заглушку
            historyText.innerHTML = '<strong>История:</strong> Пока нет попыток';
        } else {
            // Вывод истории
            historyText.innerHTML = `<strong>История:</strong> ${history.join(' ; ')}`;
        }
    }
    
    // ========== 5. Функция проверки числа (главная логика) ==========
    function checkGuess() {
        // Если игра закончена — ничего не делаем
        if (!gameActive) {
            hintText.innerHTML = '<strong> Игра окончена! Нажми "Начать заново"</strong>';
            return;
        }
        
        // Получаем введённое число и преобразуем в целое
        const guess = parseInt(numberInput.value);
        
        // ========== Проверка на валидность ==========
        // isNaN() проверяет, является ли значение НЕ числом
        if (isNaN(guess)) {
            hintText.innerHTML = '<strong> Введите число!</strong>';
            numberInput.value = '';
            return;
        }
        
        if (guess < MIN_NUMBER || guess > MAX_NUMBER) {
            hintText.innerHTML = `<strong> Число должно быть от ${MIN_NUMBER} до ${MAX_NUMBER}!</strong>`;
            numberInput.value = '';
            return;
        }
        
        
        // ========== Уменьшаем количество попыток ==========
        attemptsLeft--;
        updateAttemptsDisplay();
        
        // ========== Сравниваем введённое число с загаданным ==========
        let comparison = '';   // Будет "больше" или "меньше"
        let isWin = false;
        
        if (guess === secretNumber) {
            // ПОБЕДА!
            comparison = 'равно';
            isWin = true;
            gameActive = false;  // Игра заканчивается
            hintText.innerHTML = `<strong> ПОБЕДА! Ты угадал число ${secretNumber}! </strong>`;
            
            // Блокируем поле ввода и кнопку
            numberInput.disabled = true;
            guessButton.disabled = true;
            
            // Добавляем победу в историю
            history.push(` ${guess} — УГАДАЛ!`);
            updateHistoryDisplay();
            
            return;  // Выходим, так как игра закончена
        }
        
        // ========== Если не угадал, определяем больше или меньше ==========
        if (guess < secretNumber) {
            comparison = 'больше';
            hintText.innerHTML = `<strong> Загаданное число БОЛЬШЕ, чем ${guess}</strong>`;
        } else {
            comparison = 'меньше';
            hintText.innerHTML = `<strong> Загаданное число МЕНЬШЕ, чем ${guess}</strong>`;
        }
        
        // ========== Добавляем в историю ==========
        // больше или меньше
        const historySymbol = (guess < secretNumber) ? '>' : '<';
        history.push(`${historySymbol} ${guess}`);
        updateHistoryDisplay();
        
        // ========== Проверка на поражение (кончились попытки) ==========
        if (attemptsLeft === 0 && !isWin) {
            gameActive = false;
            hintText.innerHTML = `<strong> ИГРА ОКОНЧЕНА! Загаданное число было ${secretNumber}</strong>`;
            numberInput.disabled = true;
            guessButton.disabled = true;
        }
        
        // Очищаем поле ввода и ставим фокус
        numberInput.value = '';
        numberInput.focus();
    }
    
    // ========== 99?. обработчик событий ==========
    // Угадать
    guessButton.addEventListener('click', checkGuess);
    // начать заново
    resetButton.addEventListener('click', function() {
        startNewGame();
    });
    
    // Нажатие клавиши Enter в поле ввода
    numberInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            checkGuess();
        }
    });
    
    // ========== Запускаем игру! ==========
    startNewGame();
});
