/**
 * GyanAI Embeddable Script for Gyanoday Bhavan Google Site
 * Add this script tag to your Google Site Embed HTML section:
 * <script src="https://gyanai.paruluniversity.ac.in/gyanai-widget.js"></script>
 */

export const generateGoogleSiteEmbedSnippet = (): string => {
  return `<!-- GyanAI Floating Chatbot Widget Embed for Gyanoday Bhavan Google Site -->
<iframe 
  src="https://gyanai.paruluniversity.ac.in" 
  style="position: fixed; bottom: 0; right: 0; width: 450px; height: 650px; border: none; z-index: 999999; pointer-events: auto;"
  allow="microphone"
  title="GyanAI Digital Library Intelligence Platform">
</iframe>`;
};
