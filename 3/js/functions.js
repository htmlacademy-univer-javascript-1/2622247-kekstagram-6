const checkStringSize = (string, maxSize) => string.length <= maxSize;

// Cтрока короче 20 символов
console.log(checkStringSize('проверяемая строка', 20)); // true
// Длина строки ровно 18 символов
console.log(checkStringSize('проверяемая строка', 18)); // true
// Строка длиннее 10 символов
console.log(checkStringSize('проверяемая строка', 10)); // false


const isPalindrome = (str) => str.replace(/\s/g, '').toLowerCase() === str.replace(/\s/g, '').toLowerCase().split('').reverse().join('');

// Строка является палиндромом
console.log(isPalindrome('топот')); // true
// Несмотря на разный регистр, тоже палиндром
console.log(isPalindrome('ДовОд')); // true
// Это не палиндром
console.log(isPalindrome('Кекс'));  // false
// Это палиндром
console.log(isPalindrome('Лёша на полке клопа нашёл ')); // true
