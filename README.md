# Ramsey's Legal Archive

A modern, responsive website showcasing landmark Supreme Court cases from India, featuring a beautiful frosted glass UI design with dark/light mode support.

![Homepage Light Mode](https://github.com/user-attachments/assets/fb3a494f-86ca-4973-a5ab-7edbf47a6cc5)

## 🌟 Features

### 📚 Case Library
- **Comprehensive Case Collection**: Curated collection of landmark Supreme Court judgments
- **Chronological Organization**: Cases sorted in reverse chronological order (most recent first)
- **Detailed Case Pages**: Each case includes:
  - Full case title with proper formatting
  - Judge information with initials displayed in circular badges
  - Detailed arguments from both sides
  - Timeline of case progression (without borders for clean presentation)
  - Court's analysis and reasoning
  - Final verdict and ratio decidendi
  - Relevant acts, sections, and key citations

### 🎨 Modern UI/UX
- **Frosted Glass Design**: Beautiful, modern aesthetic with glassmorphism effects
- **Dark/Light Mode Toggle**: Seamless theme switching with user preference detection
- **Responsive Layout**: Optimized for all device sizes
- **Clean Navigation**: 
  - Hamburger menu for accessing About page
  - Back/Forward navigation buttons
  - Refresh functionality
  - Home link on all case pages

![Homepage Dark Mode](https://github.com/user-attachments/assets/fe445b07-e0c2-4d04-a212-c5254ae690e6)

### 💬 Feedback System
- **Interactive Feedback Form**: Submit suggestions, corrections, or bug reports
- **Unique Trace ID Generation**: Each feedback submission receives a unique trace ID for debugging and tracking
- **User-Friendly Interface**: Clear success messages with trace ID display

![Feedback System](https://github.com/user-attachments/assets/d03dd08e-f8a1-4e8e-94e3-1a8ce9c79743)

### 🎯 Judge Information Display
- **Initials Format**: Judge names are represented by their initials (first letter of each word)
- **Visual Indicators**: Color-coded badges show voting patterns:
  - Green: Favored the decision
  - Red: Opposed the decision
  - Yellow: Concurring opinion

### 📱 Support Integration
- **UPI Support**: QR code placeholder for easy donations
- **Patreon Link**: Support ongoing development
- **Multiple Channels**: Various ways for users to contribute

### 🔒 Security
- **Content Security Policy**: Implemented via headers files
- **XSS Protection**: X-XSS-Protection headers enabled
- **Clickjacking Prevention**: X-Frame-Options set to DENY
- **MIME Sniffing Protection**: X-Content-Type-Options headers
- **Referrer Policy**: Strict referrer policy implemented

![Case Page with Timeline](https://github.com/user-attachments/assets/5d457fbe-f100-43c6-954e-78271eddd37f)

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- A web server (for local development, you can use Python's built-in server)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/anacondy/powershell-cl-sc-cases-site-htmls-.git
cd powershell-cl-sc-cases-site-htmls-
```

2. Serve the files using a web server:

**Using Python 3:**
```bash
python3 -m http.server 8080
```

**Using Python 2:**
```bash
python -m SimpleHTTPServer 8080
```

**Using Node.js (with http-server):**
```bash
npx http-server -p 8080
```

3. Open your browser and navigate to:
```
http://localhost:8080
```

## 📁 Project Structure

```
.
├── index.html              # Homepage with case listing
├── about.html              # About page with support and feedback
├── style.css               # Main stylesheet with theme variables
├── RULES.md               # Guidelines for case page structure
├── _headers               # Security headers for Netlify/similar platforms
├── .htaccess              # Security headers for Apache servers
├── [case-name].html       # Individual case pages
└── README.md              # This file
```

## 🎨 Styling Guidelines

The website follows specific styling rules outlined in `RULES.md`:

- **Frosted Glass Theme**: Semi-transparent backgrounds with backdrop blur
- **Borderless Timeline**: Case progression timelines have no borders or shaded boxes
- **Consistent Typography**: Inter font family throughout
- **Color Scheme**: 
  - Light mode: Light backgrounds with dark text
  - Dark mode: Dark backgrounds with light text
  - Accent color: Red (#DC143C) for "v." in case titles
  - Link color: Blue (#007bff in light, #FFFF00 in dark)

## 🛠️ Technology Stack

- **HTML5**: Semantic markup
- **CSS3**: Custom properties (CSS variables) for theming
- **Vanilla JavaScript**: No frameworks, pure JS for functionality
- **Google Fonts**: Inter font family

## ✨ Key Features Explained

### Dark/Light Mode
The theme system:
- Detects user's system preference on first visit
- Saves user's manual selection to localStorage
- Responds to system theme changes automatically
- Smooth transitions between themes

### Timeline View
Case progression timelines feature:
- Vertical line connecting events
- Alternating left/right card placement
- Clean, borderless design
- Color-coded dots for visual interest

### Feedback System
The feedback form includes:
- Input validation
- Unique trace ID generation using timestamp and random string
- Success/error message display
- Console logging for debugging (would be server-side in production)

### Security Headers
Multiple layers of security:
- `_headers` file for Netlify, Vercel, and similar platforms
- `.htaccess` file for Apache servers
- Content Security Policy to prevent XSS attacks
- Frame protection to prevent clickjacking

## 📝 Adding New Cases

To add a new case, follow the structure defined in `RULES.md`:

1. Create a new HTML file named `case-name.html`
2. Follow the 12-section structure outlined in RULES.md
3. Use proper judge initials (first letter of each word in name)
4. Ensure timeline has no borders or backgrounds
5. Use `<em>` for italics and `<strong>` for bold (no asterisks)
6. Add the case to `index.html` in chronological order

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Guidelines:
1. Follow the styling rules in `RULES.md`
2. Ensure all text formatting uses HTML tags (not asterisks)
3. Verify judge initials are correct
4. Test dark/light mode compatibility
5. Check responsive design on mobile devices

## 📄 License

This project is open source and available for educational purposes.

## 📞 Contact & Support

- **Feedback**: Use the feedback form on the About page
- **Support**: Consider supporting via UPI or Patreon (links on About page)
- **Issues**: Report bugs using the feedback system with your trace ID

## 🙏 Acknowledgments

- Supreme Court of India for the public record of judgments
- Legal scholars and researchers who have documented these cases
- The open-source community for inspiration and tools

## 📊 Current Case Collection

The archive currently includes landmark cases spanning from 1950 to 2024, covering:
- Constitutional law
- Fundamental rights
- Parliamentary powers
- Basic structure doctrine
- Emergency provisions
- Electoral reforms
- And more...

---

## 🌐 Live Site

**GitHub Pages**: [https://anacondy.github.io/powershell-cl-sc-cases-site-htmls-/](https://anacondy.github.io/powershell-cl-sc-cases-site-htmls-/)

## ✍️ Authors

💫 *"You have all the weapons you need. Now fight!"* 💫  
— From *Sucker Punch* 🎬  
**Created by**: anacondy & GitHub Copilot 🚀✨🔮  
*Fighting for justice, one case at a time* ⚖️💪🌟

---

**Note**: This website is for informational and educational purposes only. It does not provide legal advice. The information presented constitutes fair reporting and analysis of judicial pronouncements, which are matters of public record.
