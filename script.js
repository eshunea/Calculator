
// Create the queue and call history
const queue = [];
const completedCalls = [];

let activeCaller = null;
let nextId = 1;

// Get HTML elements
const callerForm = document.getElementById("callerForm");
const callerName = document.getElementById("callerName");
const callerPhone = document.getElementById("callerPhone");

const queueList = document.getElementById("queueList");
const historyList = document.getElementById("historyList");
const message = document.getElementById("message");

const serveBtn = document.getElementById("serveBtn");
const completeBtn = document.getElementById("completeBtn");

// Display a message to the user
function showMessage(text) {
    message.textContent = text;
}

// ENQUEUE: Add a caller to the end of the queue
callerForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const name = callerName.value.trim();
    const phone = callerPhone.value.trim();

    if (name === "" || phone === "") {
        showMessage("Please enter the customer's name and phone number.");
        return;
    }

    const caller = {
        id: nextId++,
        name: name,
        phone: phone,
        time: new Date()
    };

    queue.push(caller);

    callerForm.reset();

    showMessage(name + " has joined the waiting queue.");

    displayQueue();
    updateStatistics();
});

// DEQUEUE: Call the first customer in the queue
serveBtn.addEventListener("click", function() {
    if (activeCaller !== null) {
        showMessage("Complete the current call first.");
        return;
    }

    if (queue.length === 0) {
        showMessage("There are no callers waiting.");
        return;
    }

    // Remove the first caller (FIFO)
    activeCaller = queue.shift();

    document.getElementById("currentCall").classList.remove("hidden");

    document.getElementById("activeName").textContent =
        "Name: " + activeCaller.name;

    document.getElementById("activePhone").textContent =
        "Phone: " + activeCaller.phone;

    showMessage("Now serving " + activeCaller.name + ".");

    displayQueue();
    updateStatistics();
});

// Mark the current call as completed
completeBtn.addEventListener("click", function() {
    if (activeCaller === null) {
        return;
    }

    completedCalls.unshift({
        ...activeCaller,
        completedAt: new Date()
    });

    const name = activeCaller.name;

    activeCaller = null;

    document.getElementById("currentCall").classList.add("hidden");

    showMessage("Call with " + name + " completed successfully.");

    displayHistory();
    displayQueue();
    updateStatistics();
});

// Display the waiting callers
function displayQueue() {
    queueList.innerHTML = "";

    if (queue.length === 0) {
        queueList.innerHTML =
            '<p class="empty">No callers are waiting.</p>';
    }

    queue.forEach(function(caller, index) {
        const item = document.createElement("div");

        item.className = "caller" + (index === 0 ? " first" : "");

        const details = document.createElement("div");

        const name = document.createElement("strong");
        name.textContent = (index + 1) + ". " + caller.name;

        const phone = document.createElement("small");
        phone.textContent = caller.phone;

        details.appendChild(name);
        details.appendChild(phone);

        if (index === 0) {
            const next = document.createElement("small");
            next.textContent = " — Next to be served";
            next.style.color = "#2563eb";
            details.appendChild(document.createElement("br"));
            details.appendChild(next);
        }

        item.appendChild(details);
        queueList.appendChild(item);
    });
}

// Display completed calls
function displayHistory() {
    historyList.innerHTML = "";

    if (completedCalls.length === 0) {
        historyList.innerHTML =
            '<p class="empty">No calls completed yet.</p>';
        return;
    }

    completedCalls.forEach(function(caller) {
        const item = document.createElement("div");
        item.className = "caller";

        const details = document.createElement("div");

        const name = document.createElement("strong");
        name.textContent = caller.name;

        const phone = document.createElement("small");
        phone.textContent =
            caller.phone + " — Completed at " +
            caller.completedAt.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
            });

        details.appendChild(name);
        details.appendChild(phone);
        item.appendChild(details);

        historyList.appendChild(item);
    });
}

// Update the dashboard statistics
function updateStatistics() {
    document.getElementById("waitingCount").textContent =
        queue.length;

    document.getElementById("completedCount").textContent =
        completedCalls.length;

    document.getElementById("activeCount").textContent =
        activeCaller !== null ? 1 : 0;

    serveBtn.disabled =
        queue.length === 0 || activeCaller !== null;
}

// Initialize the application
displayQueue();
displayHistory();
updateStatistics();
