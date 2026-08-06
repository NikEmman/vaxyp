export async function generateWord(ekthesi, replacements, person) {
  if (!person.surname) {
    const notificationText = `Σφαλμα της ${ekthesi.title}, ελέγξτε το πεδίο παθόντα / δράστη. ✗`;
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
    const notificationText = `Κατέβηκε επιτυχώς η ${docTitle} ✓`;
    a.download = `${docTitle}.docx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    displayNotification(notificationText);
  } catch (error) {
    console.error("Error generating Word document:", error);
    displayNotification(
      "Error generating Word document: " + error.message,
      true,
    );
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
const SUCCESS_ICON_PATH = "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z";
const ALERT_ICON_PATH = "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z";

export function displayNotification(text, alert = false) {
  const notifications = document.getElementById("notifications");
  const newNotification = document.createElement("div");
  newNotification.classList.add("notification");
  newNotification.setAttribute("role", "alert");
  if (alert) {
    newNotification.classList.add("alert");
  }

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "none");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("stroke-linecap", "round");
  path.setAttribute("stroke-linejoin", "round");
  path.setAttribute("stroke-width", "2");
  path.setAttribute("d", alert ? ALERT_ICON_PATH : SUCCESS_ICON_PATH);
  svg.appendChild(path);

  const textSpan = document.createElement("span");
  textSpan.textContent = text;

  newNotification.appendChild(svg);
  newNotification.appendChild(textSpan);

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
