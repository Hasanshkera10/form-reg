const SUPABASE_URL = "https://fgiouinumbkplrzcfrld.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZnaW91aW51bWJrcGxyemNmcmxkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3MTMwMDUsImV4cCI6MjA4NTI4OTAwNX0.6jWELjDaD8HQ20HuL3llRnuVSByouiLXQxjmz2XOdKw";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

const form = document.getElementById("contact-form");
const errorEl = document.getElementById("form-error");
const successEl = document.getElementById("success");
const resetButton = document.getElementById("reset");

const setActivePanel = (active, inactive) => {
  active.classList.add("is-active");
  active.setAttribute("aria-hidden", "false");
  inactive.classList.remove("is-active");
  inactive.setAttribute("aria-hidden", "true");
};

const setError = (message) => {
  errorEl.textContent = message || "";
};

const showSuccess = () => {
  setActivePanel(successEl, form);
};

const showForm = () => {
  form.reset();
  setError("");
  setActivePanel(form, successEl);
};

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  setError("");

  const formData = new FormData(form);
  const phoneRaw = formData.get("phone")?.trim();
  const consent = formData.get("consent");
  const payload = {
    name: formData.get("name")?.trim(),
    email: formData.get("email")?.trim(),
    phone: phoneRaw ? `+971 ${phoneRaw}` : "",
  };

  if (!payload.name || !payload.email || !payload.phone || !consent) {
    setError("Please complete all fields and accept the consent.");
    return;
  }

  const { error } = await supabaseClient.from("contacts").insert(payload);

  if (error) {
    setError("Something went wrong. Please try again.");
    return;
  }

  showSuccess();
});

resetButton.addEventListener("click", showForm);
