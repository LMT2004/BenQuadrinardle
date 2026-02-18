let todayPuzzle = null;
async function loadDailyNames() {
  const startDate = new Date("2026-02-16");
  const today = new Date();

  startDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const msPerDay = 1000 * 60 * 60 * 24;
  const daysSinceStart = Math.floor((today - startDate) / msPerDay);

  if (daysSinceStart < 0) {
    console.log("Game has not started yet!");
    return;
  }

  const response = await fetch("RealName.json");
  const data = await response.json();

  /* ----- REAL NAME ----- */
  const realIndex = daysSinceStart % data.characters.length;
  const realName = data.characters[realIndex];

  /* ----- FAKE NAMES ----- */
  const fakeStart = (daysSinceStart * 3) % data.fake.length;

  const fakeNames = [
    data.fake[fakeStart % data.fake.length],
    data.fake[(fakeStart + 1) % data.fake.length],
    data.fake[(fakeStart + 2) % data.fake.length]
  ];

  console.log("Real:", realName);
  console.log("Fakes:", fakeNames);

  return {
    realName,
    fakeNames
  };
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

document.getElementById("startBtn").addEventListener("click", async () => {

    document.querySelector(".start-container").classList.add("hide");
    document.querySelector(".game-container").classList.add("unhide");

    try {
        // Load puzzle ONLY ONCE
        if (!todayPuzzle) {
            todayPuzzle = await loadDailyNames();
        }

        if (!todayPuzzle) return;

        let all = [todayPuzzle.realName, ...todayPuzzle.fakeNames];
        shuffle(all);

        const buttons = document.querySelectorAll(".option-btn");

        buttons.forEach((button, index) => {

            const name = all[index];

            button.innerText = name;

            // Store hidden correctness flag
            button.dataset.correct = (name === todayPuzzle.realName);
        });

    } catch (error) {
        console.error("Error:", error);
    }
});


const buttons = document.querySelectorAll(".option-btn");

buttons.forEach(button => {
    button.addEventListener("click", () => {

        const isCorrect = button.dataset.correct === "true";
        const selectedName = button.innerText;

        console.log("Clicked:", selectedName);

        document.querySelector(".game-container").classList.remove("unhide");
        document.querySelector(".results-container").classList.remove("hide");

        const resultEl = document.querySelector(".result");
        const actualEl = document.querySelector(".actual");

        if (isCorrect) {
            resultEl.innerHTML = "Correct";
            actualEl.innerHTML = "Your Answer Was " + selectedName;
        } else {
            const correctButton = document.querySelector('.option-btn[data-correct="true"]');
            const correctName = correctButton?.innerText ?? "Unknown";

            resultEl.innerHTML = selectedName +" is wrong";
            actualEl.innerHTML = "Correct Answer Was " + correctName;
        }

    });
});