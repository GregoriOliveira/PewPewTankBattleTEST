export function reset(t1_hits, t2_hits) {
    // Create container element for text with full-screen positioning
    const messageContainer = document.createElement('div');
    messageContainer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background-color: rgba(0, 0, 0, 0.7);
      color: white;
    `;

    // Create element for "GAME OVER" with larger font
    const gameOver = document.createElement('h1');
    gameOver.textContent = 'GAME OVER';
    gameOver.style.cssText = `
      font-size: 15svw;
      margin: 0;
      color: red;
    `;

    // Create elements for "Tank1" and "Tank2" labels
    const tank1Label = document.createElement('p');
    tank1Label.textContent = 'Tank 1';
    tank1Label.style.cssText = `
      font-size: 7vw;
      font-weight: bold;
      margin: 0;
      text-align: right;
      flex: 1;
    `;

    const tank2Label = document.createElement('p');
    tank2Label.textContent = 'Tank 2';
    tank2Label.style.cssText = `
      font-size: 7vw;
      font-weight: bold;
      margin: 0;
      text-align: left;
      flex: 1;
    `;

    // Create elements for displaying scores
    const t2Hits = document.createElement('span');
    t2Hits.textContent = t1_hits;
    t2Hits.style.cssText = `
      font-size: 8vw;
      margin: 0;
      text-align: left;
    `;

    const t1Hits = document.createElement('span');
    t1Hits.textContent = t2_hits;
    t1Hits.style.cssText = `
      font-size: 8vw;
      margin: 0;
      text-align: right;
    `;

    // Combine elements for scoreboard layout
    const scoreboard1 = document.createElement('div');
    scoreboard1.style.cssText = `
    display: flex;
    justify-content: space-between;
    gap: 500px;
    `;
    scoreboard1.appendChild(tank1Label);
    scoreboard1.appendChild(tank2Label);

    const scoreboard2 = document.createElement('div');
    scoreboard2.style.cssText = `
    display: flex;
    justify-content: space-between;
    margin-top: 1vw;
    gap: 500px
    `;
    scoreboard2.appendChild(t1Hits);
    scoreboard2.appendChild(t2Hits);

    // Append elements to container in the desired order:
    messageContainer.appendChild(gameOver);
    messageContainer.appendChild(scoreboard1); // Scoreboard labels after game over message
    messageContainer.appendChild(scoreboard2); // Scoreboard scores after labels

    // Append container to body
    document.body.appendChild(messageContainer);

    // Clear the displayed messages after 5 seconds with fade-out
    setTimeout(() => {
        messageContainer.style.opacity = 0; // Initiate fade-out animation
        setTimeout(() => {
            messageContainer.remove();
        }, 1000); // Remove after fade-out duration
    }, 5000);

    // Reload the page after a short delay
    setTimeout(() => {
        window.location.reload();
    }, 5000);
}
