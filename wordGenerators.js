export async function generateWord(ekthesi, replacements, person) {
  if (!person.surname) {
    const notificationText = `Σφαλμα της ${ekthesi.title}, ελέγξτε το πεδίο παθόντα / δράστη. &cross;`;
    displayNotification(notificationText, true);
    return;
  }

  let decodedArrayBuffer = base64ToArrayBuffer(ekthesi.string);

  try {
    const modifiedDocx = await processDocument(
      decodedArrayBuffer,
      replacements
    );

    // Create a blob and download it
    const blob = new Blob([modifiedDocx], {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;

    const docTitle = `${ekthesi.title}-${person.surname}`;
    const notificationText = `Κατέβηκε επιτυχώς η ${docTitle} &check;`;
    a.download = `${docTitle}.docx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    displayNotification(notificationText);
  } catch (error) {
    console.error("Error generating Word document:", error);
    alert("Error generating Word document: " + error.message);
  }
}
export async function processDocument(arrayBuffer, replacements) {
  try {
    console.log("Processing document...");

    // Load the document using JSZip
    const zip = await JSZip.loadAsync(arrayBuffer);
    console.log("ZIP loaded successfully");

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
    console.log("Updated document.xml in ZIP");

    // Generate the modified ZIP file as ArrayBuffer
    const modifiedZip = await zip.generateAsync({ type: "arraybuffer" });
    console.log("Generated modified ZIP");

    return modifiedZip;
  } catch (error) {
    console.error("Error in processDocument:", error);
    throw error;
  }
}
export function base64ToArrayBuffer(base64) {
  let binary = atob(base64);
  let length = binary.length;
  let buffer = new Uint8Array(length);
  for (let i = 0; i < length; i++) {
    buffer[i] = binary.charCodeAt(i);
  }
  return buffer.buffer;
}

//notifications display
export function displayNotification(text, alert = false) {
  const notifications = document.getElementById("notifications");
  const newNotification = document.createElement("div");
  newNotification.classList.add("notification");
  if (alert) {
    newNotification.classList.add("alert");
  }

  newNotification.innerHTML = text;

  newNotification.innerHTML = text;

  notifications.innerHTML = "";
  notifications.appendChild(newNotification);
  notficationPhaseOut(newNotification);
}
//notification fade away timer
const notficationPhaseOut = (notificationElement) => {
  setTimeout(() => {
    notificationElement.remove();
  }, 5000);
};

//copy to clipboard
export function copyToClipboard(textToCopy) {
  if (navigator.clipboard) {
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        console.log("Text copied to clipboard successfully!");
      })
      .catch((err) => {
        console.error("Could not copy text to clipboard: ", err);
      });
  } else {
    // Fallback for older browsers
    const textArea = document.createElement("textarea");
    textArea.value = textToCopy;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand("copy");
      console.log("Text copied to clipboard using fallback method!");
    } catch (err) {
      console.error("Could not copy text using fallback method: ", err);
    }
    document.body.removeChild(textArea);
  }
}
