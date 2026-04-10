export const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSfBeYaN8UxDLVinrznEoDbHIapooJ3n-9BRTbmi5ST-fSt1Mw/formResponse';
export const EMAIL_ENTRY_ID = 'entry.1492105275'; // Placeholder, user might need to update this

export const reportVisit = async (email: string) => {
  try {
    const formData = new FormData();
    formData.append(EMAIL_ENTRY_ID, email);

    // Using no-cors because Google Forms doesn't support CORS for JS submissions
    // This will still send the data but we won't be able to read the response
    await fetch(GOOGLE_FORM_URL, {
      method: 'POST',
      mode: 'no-cors',
      body: formData
    });
    
    console.log('Visit reported for:', email);
  } catch (error) {
    console.error('Error reporting visit:', error);
  }
};
