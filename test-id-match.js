// Test ID matching logic locally
const testId = '69e0fc2097e610dd765e1e40';
const searchTerm = '5e1e40';

console.log('Testing ID matching logic:');
console.log('Full ID:', testId);
console.log('Search term:', searchTerm);
console.log('ID lowercase:', testId.toLowerCase());
console.log('Search lowercase:', searchTerm.toLowerCase());
console.log('Does ID contain search term?', testId.toLowerCase().includes(searchTerm.toLowerCase()));

// Test regex pattern
const hexPattern = /^[0-9a-fA-F]{6,24}$/i;
console.log('Does search term match hex pattern?', hexPattern.test(searchTerm));

// Test last 6 characters
console.log('Last 6 chars of ID:', testId.slice(-6));
console.log('Last 6 chars uppercase:', testId.slice(-6).toUpperCase());
console.log('Does last 6 chars match search?', testId.slice(-6).toLowerCase() === searchTerm.toLowerCase());