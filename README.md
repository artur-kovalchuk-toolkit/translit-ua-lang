# Ukrainian Transliteration Tool

> [🇺🇦 Читати українською](README.ua.md)

A modern web application for transliterating Ukrainian text to Latin script and vice versa, following the official Ukrainian transliteration rules.

## Features

- **Bidirectional Transliteration**: Convert Ukrainian text to Latin script and Latin script back to Ukrainian
- **Auto-detection**: Automatically detects the input language and selects the appropriate transliteration direction
- **Manual Language Selection**: Choose between Ukrainian, Latin, or Auto-detect modes
- **Translation History**: Automatically saves your translation history for quick access
- **Saved Translations**: Save frequently used translations for easy reuse
- **Export Functionality**: Export saved translations and history as JSON or CSV
- **Bilingual Interface**: Supports both Ukrainian (УКР) and English (ENG) languages
- **Official Rules Compliance**: Follows the official Ukrainian transliteration rules

## Screenshots

### Main Translation Interface (English)

![Main Translation Interface - English](docs/01-main-translation-interface-en.png)

### Main Translation Interface (Ukrainian)

![Main Translation Interface - Ukrainian](docs/02-main-translation-interface-ua.png)

### Language Auto-detection Dropdown

![Language Auto-detection Dropdown](docs/05-lang-autodetection-dropdown.png)

### Translation History Panel

![Translation History Panel](docs/03-history-panel.png)

### Saved Translations Panel

![Saved Translations Panel](docs/04-saved-panel.png)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/artur-kovalchuk-toolkit/translit-ua-lang.git
cd translit-ua-lang
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The production build will be in the `dist` directory.

## Usage

1. **Enter Text**: Type or paste your text in the input field
2. **Auto-detection**: The app automatically detects the language and transliterates accordingly
3. **Manual Selection**: Click the language selector to choose Ukrainian, Latin, or Auto-detect
4. **Swap Languages**: Use the swap button to exchange input and output text
5. **Save Translations**: Click the star icon to save frequently used translations
6. **View History**: Click the History button to see your translation history
7. **Export Data**: Export your saved translations or history as JSON or CSV files

## Technical Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Routing (if needed)

## Official Rules

This tool follows the official Ukrainian transliteration rules established by the Cabinet of Ministers of Ukraine. For more information, visit the [official document](https://zakon.rada.gov.ua/laws/show/55-2010-%D0%BF#Text).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Links

- [GitHub Repository](https://github.com/artur-kovalchuk-toolkit/translit-ua-lang)
- [Official Transliteration Rules](https://zakon.rada.gov.ua/laws/show/55-2010-%D0%BF#Text)
