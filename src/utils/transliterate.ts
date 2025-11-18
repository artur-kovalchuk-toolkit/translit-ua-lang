// Ukrainian to Latin transliteration mapping
const ukrainianToLatin: Record<string, string> = {
  'А': 'A', 'а': 'a',
  'Б': 'B', 'б': 'b',
  'В': 'V', 'в': 'v',
  'Г': 'H', 'г': 'h',
  'Ґ': 'G', 'ґ': 'g',
  'Д': 'D', 'д': 'd',
  'Е': 'E', 'е': 'e',
  'Є': 'Ye', 'є': 'ye',
  'Ж': 'Zh', 'ж': 'zh',
  'З': 'Z', 'з': 'z',
  'И': 'Y', 'и': 'y',
  'І': 'I', 'і': 'i',
  'Ї': 'Yi', 'ї': 'yi',
  'Й': 'Y', 'й': 'y',
  'К': 'K', 'к': 'k',
  'Л': 'L', 'л': 'l',
  'М': 'M', 'м': 'm',
  'Н': 'N', 'н': 'n',
  'О': 'O', 'о': 'o',
  'П': 'P', 'п': 'p',
  'Р': 'R', 'р': 'r',
  'С': 'S', 'с': 's',
  'Т': 'T', 'т': 't',
  'У': 'U', 'у': 'u',
  'Ф': 'F', 'ф': 'f',
  'Х': 'Kh', 'х': 'kh',
  'Ц': 'Ts', 'ц': 'ts',
  'Ч': 'Ch', 'ч': 'ch',
  'Ш': 'Sh', 'ш': 'sh',
  'Щ': 'Shch', 'щ': 'shch',
  'Ь': '', 'ь': '', // soft sign
  'Ю': 'Yu', 'ю': 'yu',
  'Я': 'Ya', 'я': 'ya',
  'ʼ': '', // apostrophe
  "'": '', // apostrophe
};

// Latin to Ukrainian transliteration mapping
const latinToUkrainian: Record<string, string> = {
  'A': 'А', 'a': 'а',
  'B': 'Б', 'b': 'б',
  'V': 'В', 'v': 'в',
  'H': 'Г', 'h': 'г',
  'G': 'Ґ', 'g': 'ґ',
  'D': 'Д', 'd': 'д',
  'E': 'Е', 'e': 'е',
  'Ye': 'Є', 'ye': 'є',
  'Ie': 'Є', 'ie': 'є',
  'Zh': 'Ж', 'zh': 'ж',
  'Z': 'З', 'z': 'з',
  'Zgh': 'Зг', 'zgh': 'зг',
  'ZGH': 'ЗГ', 'zGH': 'зГ',
  'Y': 'И', 'y': 'и',
  'I': 'І', 'i': 'і',
  'Yi': 'Ї', 'yi': 'ї',
  'K': 'К', 'k': 'к',
  'L': 'Л', 'l': 'л',
  'M': 'М', 'm': 'м',
  'N': 'Н', 'n': 'н',
  'O': 'О', 'o': 'о',
  'P': 'П', 'p': 'п',
  'R': 'Р', 'r': 'р',
  'S': 'С', 's': 'с',
  'T': 'Т', 't': 'т',
  'U': 'У', 'u': 'у',
  'F': 'Ф', 'f': 'ф',
  'Kh': 'Х', 'kh': 'х',
  'Ts': 'Ц', 'ts': 'ц',
  'Ch': 'Ч', 'ch': 'ч',
  'Sh': 'Ш', 'sh': 'ш',
  'Shch': 'Щ', 'shch': 'щ',
  'Yu': 'Ю', 'yu': 'ю',
  'Iu': 'Ю', 'iu': 'ю',
  'Ya': 'Я', 'ya': 'я',
  'Ia': 'Я', 'ia': 'я',
};

// Helper function to check if position is at word start
// Word starts at beginning, after space, or after apostrophe/soft sign
// We need to look back through apostrophes and soft signs
function isWordStart(text: string, pos: number): boolean {
  if (pos === 0) return true;
  
  // Look back through apostrophes and soft signs to find the actual previous character
  let checkPos = pos - 1;
  while (checkPos >= 0) {
    const char = text[checkPos];
    if (char === ' ' || char === '\n' || char === '\t') {
      return true; // Word boundary found
    }
    if (char === '\'' || char === 'ʼ' || char === 'ь' || char === 'Ь') {
      // Skip apostrophes and soft signs, continue looking back
      checkPos--;
      continue;
    }
    // Found a real character - this is not a word start
    return false;
  }
  
  // Reached beginning of string
  return true;
}

// Ukrainian Cyrillic characters for detection
const ukrainianCyrillicPattern = /[А-Яа-яЄєІіЇїҐґ]/;

// Detect if text is Ukrainian (Cyrillic) or Latin
export function detectLanguage(text: string): 'ukrainian' | 'latin' | null {
  if (!text || text.trim() === '') {
    return null; // Cannot detect empty text
  }
  
  // Check if text contains Ukrainian Cyrillic characters
  const hasCyrillic = ukrainianCyrillicPattern.test(text);
  
  if (hasCyrillic) {
    return 'ukrainian';
  }
  
  // If no Cyrillic characters found, assume it's Latin
  return 'latin';
}

// Helper function to transliterate Ukrainian to Latin
export function transliterateUkrainianToLatin(text: string): string {
  let result = '';
  let i = 0;
  
  while (i < text.length) {
    const char = text[i];
    const nextChar = i + 1 < text.length ? text[i + 1] : '';
    
    // Special case: "зг" combination should be "zgh" (according to official rules)
    if ((char === 'З' || char === 'з') && (nextChar === 'Г' || nextChar === 'г')) {
      // Handle capitalization: ЗГ -> ZGH, Зг -> Zgh, зГ -> zGH, зг -> zgh
      if (char === 'З' && nextChar === 'Г') {
        result += 'ZGH';
      } else if (char === 'З' && nextChar === 'г') {
        result += 'Zgh';
      } else if (char === 'з' && nextChar === 'Г') {
        result += 'zGH';
      } else {
        result += 'zgh';
      }
      i += 2;
      continue;
    }
    
    // Handle Єє: "Ye" at word start, "ie" in other positions
    if (char === 'Є' || char === 'є') {
      if (isWordStart(text, i)) {
        // Preserve case: if char is uppercase, use "Ye", otherwise "ye"
        result += char === 'Є' ? 'Ye' : 'ye';
      } else {
        // Preserve case: if char is uppercase, use "Ie", otherwise "ie"
        result += char === 'Є' ? 'Ie' : 'ie';
      }
      i++;
    }
    // Handle Її: "Yi" at word start, "i" in other positions
    else if (char === 'Ї' || char === 'ї') {
      if (isWordStart(text, i)) {
        // Preserve case
        result += char === 'Ї' ? 'Yi' : 'yi';
      } else {
        // Preserve case
        result += char === 'Ї' ? 'I' : 'i';
      }
      i++;
    }
    // Handle Юю: "Yu" at word start, "iu" in other positions
    else if (char === 'Ю' || char === 'ю') {
      if (isWordStart(text, i)) {
        // Preserve case
        result += char === 'Ю' ? 'Yu' : 'yu';
      } else {
        // Preserve case
        result += char === 'Ю' ? 'Iu' : 'iu';
      }
      i++;
    }
    // Handle Яя: "Ya" at word start, "ia" in other positions
    else if (char === 'Я' || char === 'я') {
      if (isWordStart(text, i)) {
        // Preserve case
        result += char === 'Я' ? 'Ya' : 'ya';
      } else {
        // Preserve case
        result += char === 'Я' ? 'Ia' : 'ia';
      }
      i++;
    }
    // Handle Йй: "Y" at word start, "i" in other positions
    else if (char === 'Й' || char === 'й') {
      if (isWordStart(text, i)) {
        // Preserve case
        result += char === 'Й' ? 'Y' : 'y';
      } else {
        // Preserve case
        result += char === 'Й' ? 'I' : 'i';
      }
      i++;
    }
    // Handle multi-character sequences
    else if (char === 'Щ' || char === 'щ') {
      result += char === 'Щ' ? 'Shch' : 'shch';
      i++;
    } else if (char === 'Ч' || char === 'ч') {
      result += char === 'Ч' ? 'Ch' : 'ch';
      i++;
    } else if (char === 'Ш' || char === 'ш') {
      result += char === 'Ш' ? 'Sh' : 'sh';
      i++;
    } else if (char === 'Ж' || char === 'ж') {
      result += char === 'Ж' ? 'Zh' : 'zh';
      i++;
    } else if (char === 'Х' || char === 'х') {
      result += char === 'Х' ? 'Kh' : 'kh';
      i++;
    } else if (char === 'Ц' || char === 'ц') {
      result += char === 'Ц' ? 'Ts' : 'ts';
      i++;
    } else {
      // Single character mapping (soft sign and apostrophe are skipped)
      const mapped = ukrainianToLatin[char];
      if (mapped !== undefined) {
        result += mapped;
      } else if (char !== 'ь' && char !== 'Ь' && char !== 'ʼ' && char !== '\'') {
        // Keep character if it's not soft sign or apostrophe
        result += char;
      }
      i++;
    }
  }
  
  return result;
}

// Helper function to transliterate Latin to Ukrainian
export function transliterateLatinToUkrainian(text: string): string {
  let result = '';
  let i = 0;
  
  while (i < text.length) {
    let matched = false;
    
    // Check for multi-character sequences (case-insensitive)
    const remaining = text.substring(i).toLowerCase();
    
    // Check 4-character sequences (Shch, Zgh)
    if (remaining.length >= 4) {
      const fourChar = remaining.substring(0, 4);
      if (latinToUkrainian[fourChar]) {
        const original = text.substring(i, i + 4);
        const isUpper = original === original.toUpperCase();
        const isTitleCase = original[0] === original[0].toUpperCase() && original.slice(1) === original.slice(1).toLowerCase();
        
        if (isUpper) {
          result += latinToUkrainian[fourChar].toUpperCase();
        } else if (isTitleCase) {
          const mapped = latinToUkrainian[fourChar];
          result += mapped[0].toUpperCase() + mapped.slice(1);
        } else {
          result += latinToUkrainian[fourChar];
        }
        i += 4;
        matched = true;
      }
    }
    
    // Check 3-character sequences (Shch)
    if (!matched && remaining.length >= 3) {
      const threeChar = remaining.substring(0, 3);
      if (latinToUkrainian[threeChar]) {
        const original = text.substring(i, i + 3);
        const isUpper = original === original.toUpperCase();
        const isTitleCase = original[0] === original[0].toUpperCase() && original.slice(1) === original.slice(1).toLowerCase();
        
        if (isUpper) {
          result += latinToUkrainian[threeChar].toUpperCase();
        } else if (isTitleCase) {
          const mapped = latinToUkrainian[threeChar];
          result += mapped[0].toUpperCase() + mapped.slice(1);
        } else {
          result += latinToUkrainian[threeChar];
        }
        i += 3;
        matched = true;
      }
    }
    
    // Special case: "ii" at end of word or before consonant should be "ій" (check before other 2-char sequences)
    if (!matched && remaining.length >= 2 && remaining.substring(0, 2) === 'ii') {
      const nextChar = i + 2 < text.length ? text[i + 2].toLowerCase() : '';
      // If "ii" is at end or before consonant, it's likely "ій"
      if (i + 2 >= text.length || nextChar === ' ' || !'aeiouy'.includes(nextChar)) {
        const original = text.substring(i, i + 2);
        const isUpper = original === original.toUpperCase();
        result += isUpper ? 'ІЙ' : 'ій';
        i += 2;
        matched = true;
      }
    }
    
    // Check 2-character sequences (Zh, Kh, Ts, Ch, Sh, Ye, Yi, Yu, Ya, Ie, Iu, Ia)
    // Note: Check "Yi" before "Y" to handle "KYIV" -> "КИЇВ" correctly
    if (!matched && remaining.length >= 2) {
      const twoChar = remaining.substring(0, 2);
      if (latinToUkrainian[twoChar]) {
        const original = text.substring(i, i + 2);
        const isUpper = original === original.toUpperCase();
        const isTitleCase = original[0] === original[0].toUpperCase() && original.slice(1) === original.slice(1).toLowerCase();
        
        if (isUpper) {
          result += latinToUkrainian[twoChar].toUpperCase();
        } else if (isTitleCase) {
          const mapped = latinToUkrainian[twoChar];
          result += mapped[0].toUpperCase() + mapped.slice(1);
        } else {
          result += latinToUkrainian[twoChar];
        }
        i += 2;
        matched = true;
      }
    }
    
    // Special case: "Y" at word start should be "Й", not "И"
    // Check this before single character mapping
    if (!matched && (text[i] === 'Y' || text[i] === 'y')) {
      // Check if this is at word start
      let isAtWordStart = false;
      if (i === 0) {
        isAtWordStart = true;
      } else {
        // Look back to find word boundary
        let checkPos = i - 1;
        while (checkPos >= 0) {
          const prevChar = text[checkPos];
          if (prevChar === ' ' || prevChar === '\n' || prevChar === '\t') {
            isAtWordStart = true;
            break;
          }
          if (!(prevChar === '\'' || prevChar === 'ʼ')) {
            break;
          }
          checkPos--;
        }
      }
      
      if (isAtWordStart) {
        result += text[i] === 'Y' ? 'Й' : 'й';
        i++;
        matched = true;
      }
    }
    
    // Check single character
    if (!matched) {
      const char = text[i].toLowerCase();
      if (latinToUkrainian[char]) {
        const isUpper = text[i] === text[i].toUpperCase();
        result += isUpper ? latinToUkrainian[char].toUpperCase() : latinToUkrainian[char];
      } else {
        result += text[i];
      }
      i++;
    }
  }
  
  return result;
}

