const fs = require('fs');
const path = require('path');

const talks = JSON.parse(fs.readFileSync('talks.json', 'utf-8'));
const template = fs.readFileSync(path.join('views', 'template.html'), 'utf-8');
const style = fs.readFileSync(path.join('public', 'style.css'), 'utf-8');
const script = fs.readFileSync(path.join('public', 'script.js'), 'utf-8');

let scheduleHtml = '';
let currentTime = new Date('2024-01-01T10:00:00');

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

talks.forEach((talk, index) => {
  const startTime = new Date(currentTime);
  const endTime = new Date(currentTime.getTime() + talk.duration * 60000);

  scheduleHtml += `
    <div class="talk" data-category="${talk.category.join(', ')}">
      <div class="time">${formatTime(startTime)} - ${formatTime(endTime)}</div>
      <h3>${talk.title}</h3>
      <div class="speakers">By: ${talk.speakers.join(', ')}</div>
      <p>${talk.description}</p>
      <div class="categories">
        ${talk.category.map(cat => `<span class="category">${cat}</span>`).join('')}
      </div>
    </div>
  `;

  currentTime = new Date(endTime.getTime() + 10 * 60000); // 10 minute break

  if (index === 2) { // Lunch break after the 3rd talk
    const lunchStartTime = new Date(currentTime);
    const lunchEndTime = new Date(currentTime.getTime() + 60 * 60000);
    scheduleHtml += `<div class="break">Lunch Break: ${formatTime(lunchStartTime)} - ${formatTime(lunchEndTime)}</div>`;
    currentTime = lunchEndTime;
  }
});

const finalHtml = template
  .replace('<style>', `<style>${style}</style>`)
  .replace('<script>', `<script>${script}</script>`)
  .replace('<!-- Schedule will be injected here by the build script -->', scheduleHtml);

fs.writeFileSync('index.html', finalHtml);

console.log('Successfully built index.html');
