async function generateWord(originalFileArrayBuffer, replacements) {
  const modifiedDocx = await processDocument(
    originalFileArrayBuffer.string,
    replacements
  );

  // Create a blob and download it
  const blob = new Blob([modifiedDocx], {
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${originalFileArrayBuffer.title}.docx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  console.log("Document generated successfully");
}

async function processDocument(arrayBuffer, replacements) {
  // Load the document using JSZip
  const zip = await JSZip.loadAsync(arrayBuffer);

  // Find the main document content
  const documentXml = zip.file("word/document.xml");

  if (!documentXml) {
    throw new Error("Could not find document.xml in the Word file");
  }

  // Get the content
  const content = await documentXml.async("string");

  // Replace placeholders with values
  let modifiedContent = content;
  for (const [placeholder, value] of Object.entries(replacements)) {
    const regex = new RegExp(`\\{${placeholder}\\}`, "g");
    modifiedContent = modifiedContent.replace(regex, value);
  }

  // Update the document.xml file in the ZIP
  zip.file("word/document.xml", modifiedContent);

  // Generate the modified ZIP file as ArrayBuffer
  const modifiedZip = await zip.generateAsync({ type: "arraybuffer" });

  return modifiedZip;
}

// Example replacements
const replacements = {
  initial: "Σημερα στην Ανατολη 12 του μηνα ενωπιων εμας ολων",
  name: "John Doe",
};
