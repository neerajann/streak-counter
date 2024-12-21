document.addEventListener("DOMContentLoaded", () => {
    const habitInput = document.getElementById("habit-input");
    const addHabitBtn = document.getElementById("add-habit-btn");
    const habitList = document.getElementById("habit-list");

    // Load habits from localStorage
    let habits = JSON.parse(localStorage.getItem("habits")) || [];

    // Function to render habits
    function renderHabits() {
        habitList.innerHTML = "";
        habits.forEach((habit, index) => {
            const li = document.createElement("li");
            li.classList.add("habit-item");
            li.innerHTML = `
                <span>${habit.name}</span>
                <span class="streak">Streak: ${habit.streak}</span>
                <button class="check-btn" onclick="markHabit(${index})">✔</button>
            `;
            habitList.appendChild(li);
        });
    }

    // Add new habit
    addHabitBtn.addEventListener("click", () => {
        const habitName = habitInput.value.trim();
        if (habitName) {
            habits.push({ name: habitName, streak: 0, lastChecked: null });
            habitInput.value = "";
            saveHabits();
            renderHabits();
        }
    });

    // Mark habit as done
    window.markHabit = (index) => {
        const today = new Date().toDateString();
        if (habits[index].lastChecked !== today) {
            habits[index].streak += 1;
            habits[index].lastChecked = today;
        } else {
            alert("You have already checked this habit today!");
        }
        saveHabits();
        renderHabits();
    };

    // Save habits to localStorage
    function saveHabits() {
        localStorage.setItem("habits", JSON.stringify(habits));
    }

    // Check for missed days and reset streaks
    function resetMissedStreaks() {
        const today = new Date().toDateString();
        habits.forEach((habit) => {
            if (habit.lastChecked && habit.lastChecked !== today) {
                const lastDate = new Date(habit.lastChecked);
                const currentDate = new Date();
                const timeDiff = currentDate - lastDate;
                const daysDiff = timeDiff / (1000 * 60 * 60 * 24);
                if (daysDiff >= 1) {
                    habit.streak = 0;
                }
            }
        });
        saveHabits();
        renderHabits();
    }

    // Initialize
    resetMissedStreaks();
    renderHabits();
});
