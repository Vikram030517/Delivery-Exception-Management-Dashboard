const form = document.getElementById("exceptionForm");
const tableBody = document.querySelector("#dashboard tbody");
const filterType = document.getElementById("filterType");
const filterStatus = document.getElementById("filterStatus");
const openCount = document.getElementById("openCount");
const resolvedCount = document.getElementById("resolvedCount");

let issues = [];

// Handle form submission
form.addEventListener("submit", function(e) {
  e.preventDefault();

  const deliveryId = document.getElementById("deliveryId").value.trim();
  const customerName = document.getElementById("customerName").value.trim();
  const issueType = document.getElementById("issueType").value;
  const priority = document.querySelector("input[name='priority']:checked").value;
  const notes = document.getElementById("notes").value.trim();

  if (!deliveryId || !customerName || !issueType || !priority) {
    alert("Please fill all required fields.");
    return;
  }

  const issue = {
    deliveryId,
    customerName,
    issueType,
    priority,
    notes,
    status: "Open"
  };

  issues.push(issue);
  renderTable();
  form.reset();
});

// Render table with filters
function renderTable() {
  tableBody.innerHTML = "";

  issues.forEach((issue, index) => {
    const row = document.createElement("tr");

    if (issue.priority === "High") row.classList.add("high-priority");

    row.innerHTML = `
      <td>${issue.deliveryId}</td>
      <td>${issue.customerName}</td>
      <td>${issue.issueType}</td>
      <td>${issue.priority}</td>
      <td class="${issue.status === "Resolved" ? "resolved" : ""}">${issue.status}</td>
      <td>
        <button class="resolveBtn" ${issue.status === "Resolved" ? "disabled" : ""}>Resolve</button>
        <button class="deleteBtn">Delete</button>
      </td>
    `;

    // Resolve action
    row.querySelector(".resolveBtn").addEventListener("click", () => {
      issue.status = "Resolved";
      renderTable();
    });

    // Delete action
    row.querySelector(".deleteBtn").addEventListener("click", () => {
      if (confirm("Are you sure you want to delete this issue?")) {
        issues.splice(index, 1);
        renderTable();
      }
    });

    // Apply filters
    if ((filterType.value === "all" || issue.issueType === filterType.value) &&
        (filterStatus.value === "all" || issue.status === filterStatus.value)) {
      tableBody.appendChild(row);
    }
  });

  updateCounts();
}

// Update issue counts
function updateCounts() {
  openCount.textContent = issues.filter(i => i.status === "Open").length;
  resolvedCount.textContent = issues.filter(i => i.status === "Resolved").length;
}

// Filter listeners
filterType.addEventListener("change", renderTable);
filterStatus.addEventListener("change", renderTable);
