document.getElementById("surveyForm").addEventListener("submit", function (e) {
  e.preventDefault();

  let totalScore = 0;
  let totalQuestions = 0;

  // Get all question pages
  const questionPages = document.querySelectorAll(".question-page");

  questionPages.forEach(page => {
    // Get checked radio in this question
    const selectedRadio = page.querySelector("input[type='radio']:checked");

    if (selectedRadio) {
      totalScore += parseInt(selectedRadio.value);
      totalQuestions++;
    }
  });

  // Safety check
  if (totalQuestions === 0) {
    alert("Please answer at least one question.");
    return;
  }

  const maxScore = totalQuestions * 5;
  const happinessPercentage = Math.round((totalScore / maxScore) * 100);

  let happinessLevel = "";

  if (happinessPercentage >= 80) {
    happinessLevel = "😊 Very Happy";
  } else if (happinessPercentage >= 60) {
    happinessLevel = "🙂 Happy";
  } else if (happinessPercentage >= 40) {
    happinessLevel = "😐 Neutral";
  } else {
    happinessLevel = "😟 Unhappy";
  }

  document.getElementById("result").innerHTML = `
    <h3>Survey Result</h3>
    <p>Your Happiness Score: <strong>${happinessPercentage}%</strong></p>
    <p>Status: <strong>${happinessLevel}</strong></p>
  `;
});