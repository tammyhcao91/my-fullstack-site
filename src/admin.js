import "./style.css";
import "./admin.css";
import { supabase, isConfigured } from "./supabase.js";

const root = document.querySelector("#admin");

// Lead content is submitted by the public, so treat every field as hostile
// and escape it before it goes anywhere near innerHTML.
const esc = (value) =>
  String(value ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[c]
  );

const formatDate = (iso) =>
  new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

const shell = (inner, actions = "") => {
  root.innerHTML = `
    <div class="admin-wrap">
      <header class="admin-header">
        <a class="brand" href="/"><span class="dot"></span> Vermazing Admin</a>
        <div class="admin-actions">${actions}</div>
      </header>
      ${inner}
    </div>
  `;
};

const signOutButton = `<button class="btn btn-ghost" id="sign-out">Sign out</button>`;

const wireSignOut = () => {
  document
    .querySelector("#sign-out")
    ?.addEventListener("click", () => supabase.auth.signOut());
};

/* ---------------- Not configured ---------------- */

function renderUnconfigured() {
  shell(`
    <div class="admin-card">
      <h1>Not connected</h1>
      <p class="admin-sub">
        The Supabase environment variables are missing, so this page cannot
        reach the database.
      </p>
    </div>
  `);
}

/* ---------------- Login ---------------- */

function renderLogin() {
  shell(`
    <div class="admin-card admin-card-narrow">
      <h1>Sign in</h1>
      <p class="admin-sub">Admin access only.</p>
      <form id="login-form" novalidate>
        <div class="field">
          <label for="login-email">Email</label>
          <input id="login-email" type="email" autocomplete="username" />
        </div>
        <div class="field">
          <label for="login-password">Password</label>
          <input id="login-password" type="password" autocomplete="current-password" />
        </div>
        <button class="btn btn-primary" type="submit">Sign in</button>
        <div class="form-status" id="login-status"></div>
      </form>
    </div>
  `);

  const form = document.querySelector("#login-form");
  const status = document.querySelector("#login-status");
  const button = form.querySelector("button[type='submit']");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.querySelector("#login-email").value.trim();
    const password = document.querySelector("#login-password").value;

    if (!email || !password) {
      status.textContent = "Enter your email and password.";
      status.classList.add("show", "error");
      return;
    }

    const label = button.textContent;
    button.disabled = true;
    button.textContent = "Signing in…";

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    button.disabled = false;
    button.textContent = label;

    if (error) {
      status.textContent = error.message;
      status.classList.add("show", "error");
    }
    // On success, onAuthStateChange re-renders the page.
  });
}

/* ---------------- Leads ---------------- */

function leadRow(lead) {
  return `
    <article class="lead" data-id="${esc(lead.id)}">
      <div class="lead-head">
        <div>
          <p class="lead-name">${esc(lead.name)}</p>
          <a class="lead-email" href="mailto:${esc(lead.email)}">${esc(lead.email)}</a>
        </div>
        <div class="lead-side">
          <time datetime="${esc(lead.created_at)}">${esc(formatDate(lead.created_at))}</time>
          <button class="lead-delete" data-id="${esc(lead.id)}" title="Delete">Delete</button>
        </div>
      </div>
      ${lead.message ? `<p class="lead-message">${esc(lead.message)}</p>` : `<p class="lead-message lead-empty">No message</p>`}
    </article>
  `;
}

async function renderLeads() {
  shell(`<div class="admin-card"><p class="admin-sub">Loading…</p></div>`, signOutButton);
  wireSignOut();

  // Signed in is not the same as authorised — check the allow-list first so we
  // can tell "no enquiries yet" apart from "this account has no access".
  const { data: isAdmin, error: adminError } = await supabase.rpc("is_admin");

  if (adminError || !isAdmin) {
    shell(
      `
      <div class="admin-card admin-card-narrow">
        <h1>No access</h1>
        <p class="admin-sub">
          This account is signed in but is not on the admin allow-list, so it
          cannot view enquiries.
        </p>
      </div>
    `,
      signOutButton
    );
    wireSignOut();
    return;
  }

  const { data: leads, error } = await supabase
    .from("leads")
    .select("id, created_at, name, email, message")
    .order("created_at", { ascending: false });

  if (error) {
    shell(
      `
      <div class="admin-card">
        <h1>Could not load enquiries</h1>
        <p class="admin-sub">${esc(error.message)}</p>
      </div>
    `,
      signOutButton
    );
    wireSignOut();
    return;
  }

  const count = leads.length;
  shell(
    `
    <div class="admin-head">
      <h1>Enquiries</h1>
      <p class="admin-sub">${count} ${count === 1 ? "message" : "messages"}</p>
    </div>
    ${
      count === 0
        ? `<div class="admin-card"><p class="admin-sub">No enquiries yet. Messages sent through the contact form will appear here.</p></div>`
        : `<div class="lead-list">${leads.map(leadRow).join("")}</div>`
    }
  `,
    signOutButton
  );
  wireSignOut();

  root.querySelectorAll(".lead-delete").forEach((button) => {
    button.addEventListener("click", async () => {
      const { id } = button.dataset;
      if (!confirm("Delete this enquiry? This cannot be undone.")) return;

      button.disabled = true;
      const { error: deleteError } = await supabase.from("leads").delete().eq("id", id);

      if (deleteError) {
        button.disabled = false;
        alert(`Could not delete: ${deleteError.message}`);
        return;
      }
      root.querySelector(`.lead[data-id="${CSS.escape(id)}"]`)?.remove();
    });
  });
}

/* ---------------- Boot ---------------- */

async function start() {
  if (!isConfigured) {
    renderUnconfigured();
    return;
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    await renderLeads();
  } else {
    renderLogin();
  }

  supabase.auth.onAuthStateChange((event) => {
    if (event === "SIGNED_IN") renderLeads();
    if (event === "SIGNED_OUT") renderLogin();
  });
}

start();
