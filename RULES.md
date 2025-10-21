Okay, great idea to consolidate all the rules\! Here's a clear list outlining the process and standards for creating each case page:

-----

## Rules for Creating Case Article HTML Pages

1.  **File Creation:**

      * Create a **new HTML file** for each case.
      * Name the file logically (e.g., `case-name.html`).
      * Save it in the **same folder** as `index.html` and `style.css`.

2.  **Basic HTML Structure:**

      * Use the standard HTML5 doctype (`<!DOCTYPE html>`).
      * Include the `charset="UTF-8"` and viewport meta tags.
      * Set the `<title>` tag appropriately.
      * Link to the **Google Inter font**.
      * Link to the **`style.css` stylesheet**.
      * Include the standard `<script>` block at the end for theme toggling and fade-in animation.
      * Include the standard `<div class="mock-nav">...</div>` at the beginning of the `<body>`.
      * Wrap the main content in `<div class="container"><div class="content-card">...</div></div>`.

3.  **Content Structure & Order (Strict):**
    Follow this **exact 12-section order** inside the `<main>` tag within the `content-card`:

    1.  **Header:** `<h1>` title (with `<span class="v-text">v.</span>`), `<p class="meta-info">` (Delivered Date, Bench Type). Add `<a href="index.html" class="back-link">← Home</a>`.
    2.  **Judge Section (`<div class="justice-section">`):**
          * Use `<div class="justice-card [yes/no/concurring]">`.
          * Inside, use `<div class="photo-circle">[INITIALS]</div>` (use 2-4 letter initials only).
          * Follow with `<p>[Full Judge Name/Title]</p>`.
          * Arrange judges side-by-side, centered.
    3.  **Ruling Info (`<div class="ruling-info">`):** Include vote count and outcome in `<span class="ruling-text">`.
    4.  **Case Details Section (`<div class="case-details-section">`):** Use the specific layout with `.details-row`, `.detail-item`, `<strong>` labels, `.judges-list`, and `.acts-citations-row`. Fill all fields accurately.
    5.  **Main Intro Paragraphs:** 2-3 concise paragraphs summarizing the case context and core issue.
    6.  **Arguments Section (`<h3 class="section-heading">ARGUMENTS</h3><div class="arguments-section">`):** Use the `.arguments-grid` for side-by-side Petitioner/Appellant vs. Respondent arguments in `<ol>` lists.
    7.  **Case Progression Timeline (`<h3 class="section-heading">Case Progression Timeline</h3><div class="timeline-section">`):** Use the vertical layout with `.timeline-line`, `.timeline-item`, `.timeline-dot` (centered), and `.timeline-card`.
    8.  **Main Concluding Paragraphs:** Further details, reasoning summary, and impact.
    9.  **Court's Analysis Section (`<div class="analysis-section"><h3 class="section-heading">COURT'S ANALYSIS</h3>...</div>`):** Detailed explanation of the court's reasoning (approx. 400 words, but flexible).
    10. **Final Verdict Section (`<div class="small-font-section"><h4>FINAL VERDICT</h4>...</div>`):** Bulleted list (`<ul>`) of the specific outcomes/orders. Use smaller font size.
    11. **Ratio Decidendi Section (`<div class="small-font-section"><h4>RATIO DECIDENDI</h4>...</div>`):** The core legal principle established by the judgment. Use smaller font size. Include notes on subsequent overruling/modification if applicable.
    12. **Metadata Footer (`<div class="metadata-footer">`):** Case No, Bench details, Counsel names, Hearing Dates.

4.  **Styling & UI:**

      * The page must link to `style.css` for the **borderless frosted glass UI**.
      * The main `content-card` and `mock-nav` must **not** have visible borders.
      * Internal sections use `var(--section-bg-blend)` for subtle background separation, but generally no borders unless it's a separator line (`.thin-separator`, `.section-heading` border-bottom, etc.).
      * Theme should default based on device preference and be toggleable.
      * The 'v.' in case titles (header and homepage links) **must** use `<span class="v-text">` for crimson red color. Do not apply this class elsewhere.
      * All hyperlinks (`<a>`) must have a yellow hover effect (as defined in `style.css`).
      * Navigation icons (`<`, `>`, refresh, menu) must use `cursor: pointer;` and functional JavaScript (`history.back()`, `history.forward()`, `location.reload()`, link to `about.html`).

5.  **Content Accuracy & Completeness:**

      * **Research thoroughly** from reliable sources (official SC website, reputable legal news sites like LiveLaw/SCC Online, academic articles).
      * **Double-check** all details: Full case name, delivery date, judge names (correct bench), vote split, petitioner/respondent names, acts/sections cited, key precedent cases, timeline dates/events, final orders, and the precise legal reasoning (ratio).
      * **Fill all sections completely.** No placeholder text like "[...]". Find the actual Case No., Counsel names, Hearing Dates, etc.
      * **Text Length:** Intro/Summary paragraphs should be concise (2-3 sentences). Arguments/Analysis can be more detailed (e.g., Analysis around 400 words, but prioritize clarity over strict word count). Verdict/Ratio should be precise legal statements.

6.  **Formatting:**

      * Use `<em>` or `<i>` tags for *italics* (e.g., case names within paragraphs, legal terms).
      * Use `<strong>` or `<b>` tags for **bold** text where strong emphasis is needed. **Do not** use asterisks (`*`) for formatting in the final HTML.
      * **No comments** (\`\` or `/* */`) should be present within the visible \`\<body\>\` content unless explicitly requested for a specific reason.

-----

Following these rules should allow anyone (or any script/tool like the "MCP" you mentioned) to consistently create high-quality, accurate, and stylistically correct case pages for your website. 👍
