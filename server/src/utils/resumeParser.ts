import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import natural from 'natural';
import compromise from 'compromise';

const WordTokenizer = natural.WordTokenizer;
const SentenceTokenizer = natural.SentenceTokenizer;
const PorterStemmer = natural.PorterStemmer;
const abbreviations = ['i.e.', 'e.g.', 'Dr.']

const wordTokenizer = new WordTokenizer();
const sentenceTokenizer = new SentenceTokenizer(abbreviations);

/**
 * Parse the resume content and extract relevant keywords
 * @param file The resume file
 * @returns Array of extracted keywords
 */
export const parseResume = async (file: Buffer, fileType: string): Promise<string[]> => {
  console.log("starting here");
  try {
    let text = '';
    console.log("fileType: " + fileType);
    if (fileType === 'application/pdf') {
      const pdfData = await pdfParse(file);
      console.log("did we get here?");
      text = pdfData.text;
    } else if (
      fileType ===
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      fileType === 'application/msword'
    ) {
      const result = await mammoth.extractRawText({ arrayBuffer: file });
      text = result.value;
    } else {
      throw new Error('Unsupported file type');
    }
    console.log("progress report");

    console.log(text);

    // NLP-based keyword extraction
    const tokenizedText = wordTokenizer.tokenize(text);
    const stemmedTokens = tokenizedText.map(token => PorterStemmer.stem(token));

    const nlp = compromise(stemmedTokens.join(' '));
    const keywords = nlp
      .nouns()
      .out('array')
      .map((keyword: string) => keyword.toLowerCase())
      .filter((word: string, index: number, self: string[]) => self.indexOf(word) === index); // Remove duplicates

    

    return keywords;
  } catch (error: any) {
    if (error.message.includes('bad XRef entry')) {
      console.log('PDF has formatting issues but attempting to extract text anyways');
      const pdfData = await pdfParse(file);
    }
    console.error('Error parsing resume:', error);
    throw error;
  }
};
