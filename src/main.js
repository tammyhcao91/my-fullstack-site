import "./style.css";

// Product content extracted from "handmade soaps.odt"
const products = [
  {
    id: "crystal-triple-butters",
    name: "Crystal Triple Butters Soap",
    tag: "Triple butter",
    image: "/images/triple-butter.jpg",
    features: [
      "<strong>Three butters, one bar:</strong> Cocoa, Mango, and Shea unite for serious skin nourishment.",
      "<strong>Melts in like a treat:</strong> Silky, spa-like texture with a rich, creamy lather.",
      "<strong>Softens rough spots:</strong> Natural emollients smooth elbows, knees, and dry patches.",
      "<strong>Gentle every day:</strong> Cleanses without stripping — no SLS or SLES.",
    ],
    description:
      "A triple hit of Cocoa, Mango, and Shea Butter, blended into one indulgent vegan bar. Glycerin pulls in moisture while it cleanses, so skin feels soft and balanced — never tight. It rinses clean with no residue and a sparkling clarity you'll want to show off.",
    ingredients:
      "Aqua, Glycerin, Sorbitol, Sodium Stearate, Sodium Laurate, Propylene Glycol, Sodium Oleate, Sodium Myristate, Sodium Chloride, Glyceryl Mono Laurate, Cocamidopropyl Betaine, Theobroma Cacao (Cocoa) Seed Butter, Butyrospermum Parkii (Shea Butter), Mangifera Indica (Mango) Seed Butter, Sodium Thiosulphate, Sodium Citrate, Titanium Dioxide, Citric Acid, Trisodium Sulfosuccinate, Pentasodium Pentetate, Tetrasodium Etidronate.",
    color: "Off-white, solid at 25°C (77°F)",
  },
  {
    id: "oatmeal-shea",
    name: "Oatmeal & Shea Butter Soap",
    tag: "Gentle exfoliation",
    image: "/images/oatmeal-shea.jpg",
    features: [
      "<strong>Buff and soften:</strong> Real oatmeal flecks gently polish away dullness.",
      "<strong>Deeply conditioning:</strong> Shea Butter seals in moisture for dry, sensitive skin.",
      "<strong>Creamy comfort:</strong> A soft, soothing lather that calms as it cleanses.",
    ],
    description:
      "The cozy classic. Finely milled oatmeal lifts away dullness while Shea Butter wraps skin in lasting moisture. Speckled, off-white, and utterly soothing — this gentle vegan bar leaves skin smooth, calm, and touchably soft.",
    ingredients:
      "Aqua, Propylene Glycol, Sodium Stearate, Glycerin, Sucrose, Sodium Laureth Sulfate, Sorbitol, Sodium Myristate, Sodium Laurate, Sodium Lauryl Sulfate, Avena Sativa (Oat) Kernel Flour, Silica, Sodium Chloride, Stearic Acid, Titanium Dioxide (CI 77891), Myristic Acid, Butyrospermum Parkii (Shea) Butter, Lauric Acid, Pentasodium Pentetate, Tetrasodium Etidronate.",
    color: "Off-white with visible oatmeal specks; solid at 25°C (77°F)",
  },
  {
    id: "shea-butter",
    name: "Shea Butter Soap",
    tag: "Pure & simple",
    image: "/images/shea-butter.jpg",
    features: [
      "<strong>Velvety-smooth:</strong> Turns everyday washing into a little moment of pampering.",
      "<strong>Skin-friendly balance:</strong> A gentle pH that respects your skin's natural harmony.",
      "<strong>Clean and kind:</strong> 100% vegetable-based, no artificial colors, never tested on animals.",
      "<strong>Shea softness:</strong> Rich Shea Butter melts in to leave skin irresistibly soft.",
    ],
    description:
      "Pure, uncomplicated care. Enriched with nourishing Shea Butter and glycerin, this vegan bar cleanses gently without alcohol or drying agents. It's a mild, mellow lather that rinses clean — perfect for anyone who loves their skincare soft, simple, and honest.",
    ingredients:
      "Aqua, Glycerin, Sodium Stearate, Sorbitol, Sodium Oleate, Butyrospermum Parkii (Shea Butter), Sodium Laurate, Sodium Myristate, Sodium Chloride, Sodium Citrate, Titanium Dioxide, Pentasodium Pentetate, Tetrasodium Etidronate. (The majority of the Shea Butter is saponified with sodium hydroxide to form Shea soap.)",
    color: "White, solid at 25°C (77°F)",
  },
  {
    id: "nco",
    name: "NCO Soap",
    tag: "Clarity & lather",
    image: "/images/nco.jpg",
    features: [
      "<strong>Stays hydrated:</strong> Built-in humectants keep skin smooth and never tight.",
      "<strong>Crystal clarity:</strong> A crisp, transparent base that shows off color and scent.",
      "<strong>Rich, creamy foam:</strong> A luxurious lather that feels as good as it looks.",
      "<strong>Purely vegan:</strong> Plant-derived, no animal fats, never tested on animals.",
    ],
    description:
      "Clear, clean, and quietly luxurious. This transparent vegan bar whips up a rich, creamy lather while humectants keep skin hydrated. Beautifully clear and effortlessly gentle — the everyday soap that feels like a treat.",
    ingredients:
      "Aqua, Glycerin, Sodium Palmate, Sorbitol, Sodium Cocoate, Decyl Glucoside, Sodium Chloride, Palm Acid, Coconut Acid, Pentasodium Pentetate, Tetrasodium Etidronate.",
    color: "Clear, solid at 25°C (77°F)",
  },
];

const productSection = (p, index) => `
  <article class="product ${index % 2 === 1 ? "reverse" : ""}" id="${p.id}">
    <div class="product-art">
      <img src="${p.image}" alt="${p.name}" loading="lazy" />
    </div>
    <div class="product-body">
      <p class="eyebrow">${p.tag}</p>
      <h3>${p.name}</h3>

      <h4 class="block-label">Features</h4>
      <ul class="feature-list">
        ${p.features.map((f) => `<li>${f}</li>`).join("")}
      </ul>

      <h4 class="block-label">Description</h4>
      <p class="product-desc">${p.description}</p>

      <h4 class="block-label">Ingredients</h4>
      <p class="product-ingredients">${p.ingredients}</p>

      <dl class="product-meta">
        <div><dt>Color / Consistency</dt><dd>${p.color}</dd></div>
      </dl>
    </div>
  </article>
`;

const app = document.querySelector("#app");

app.innerHTML = `
  <header class="site-header">
    <div class="container">
      <a class="brand" href="#top">
        <span class="dot"></span>
        Vermazing Soaps
      </a>
      <nav class="nav">
        <a href="#products">Soaps</a>
        <a href="#contact">Contact</a>
      </nav>
      <a class="btn btn-primary" href="#contact">Get in touch</a>
    </div>
  </header>

  <main id="top">
    <!-- 1) Hero: headline + CTA -->
    <section class="hero">
      <div class="container hero-grid">
        <div class="hero-copy">
          <h1>Hand Crafted Vegan Soap</h1>
          <p class="hero-tagline">Deeply moisturizing</p>
          <p class="lead">
            Plant-based bars made in small batches with natural butters and
            glycerin — no animal fats, no harsh detergents. Kind to your skin,
            kind to the planet.
          </p>
          <div class="hero-actions">
            <a class="btn btn-primary" href="#products">Explore our soaps</a>
          </div>
        </div>
        <div class="hero-art">
          <img src="/images/hero.jpg" alt="Hand crafted vegan soaps — a heart-shaped bar and a floral bar" loading="eager" />
        </div>
      </div>
    </section>

    <!-- 2) Four product blocks -->
    <section class="section products" id="products">
      <div class="container">
        <div class="section-head">
          <h2 class="collection-title">Our Collection</h2>
          <p class="collection-sub">Hand crafted from Stephenson soap base made in the United Kingdom.</p>
        </div>
        ${products.map((p, i) => productSection(p, i)).join("")}
      </div>
    </section>

    <!-- 3) Contact / lead capture (static form, no backend yet) -->
    <section class="section contact" id="contact">
      <div class="container contact-grid">
        <div class="contact-copy">
          <p class="eyebrow">Say hello</p>
          <h2>Questions, wholesale, or custom scents?</h2>
          <p>
            Leave your details and we'll get back to you within a couple of days.
            Prefer email? Reach us directly any time.
          </p>
          <ul class="contact-list">
            <li>✉️ hello@vermazingsoaps.example</li>
            <li>📍 Studio pickup available by appointment</li>
            <li>⏱️ We reply within 1–2 business days</li>
          </ul>
        </div>

        <form class="form-card" id="lead-form" novalidate>
          <div class="field">
            <label for="name">Name</label>
            <input id="name" name="name" type="text" placeholder="Your name" required />
          </div>
          <div class="field">
            <label for="email">Email</label>
            <input id="email" name="email" type="email" placeholder="you@example.com" required />
          </div>
          <div class="field">
            <label for="message">Message</label>
            <textarea id="message" name="message" placeholder="Tell us what you're looking for…"></textarea>
          </div>
          <button class="btn btn-primary" type="submit">Send message</button>
          <p class="form-note">
            This is a demo form — nothing is sent yet. We'll wire it up to a backend later.
          </p>
          <div class="form-status" id="form-status" role="status" aria-live="polite"></div>
        </form>
      </div>
    </section>
  </main>

  <!-- 4) Footer -->
  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <a class="brand" href="#top">
          <span class="dot"></span>
          Vermazing Soaps
        </a>
        <nav class="footer-links">
          <a href="#products">Soaps</a>
          <a href="#contact">Contact</a>
          <a href="#top">Back to top</a>
        </nav>
      </div>
      <div class="footer-bottom">
        © ${new Date().getFullYear()} Vermazing Soaps · Hand Crafted Vegan Soap · Made with care.
      </div>
    </div>
  </footer>
`;

// Lead form — static demo handling (no backend yet)
const form = document.querySelector("#lead-form");
const status = document.querySelector("#form-status");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = form.name.value.trim();
  const email = form.email.value.trim();

  if (!name || !email) {
    status.textContent = "Please add your name and email so we can reply.";
    status.classList.add("show");
    return;
  }

  status.textContent = `Thanks, ${name}! This is a demo — your message wasn't actually sent yet.`;
  status.classList.add("show");
  form.reset();
});
