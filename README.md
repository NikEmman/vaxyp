# PROJECT DESCRIPTION

This is a tool to help myself and other on day-to-day paper-work of interrogator/investigation duties of a Hellenic Police Officer. The language used in the tool is Greek only, since it is no-use to anyone but. It is HTML/CSS/JavaScript only due to design constraints.

## Work flow

- At the very top users can find localization directions and patch notes.
- Below that the default starting text of any official interrogation/investigation document, formatting day, month year etc, including two dropdown menus to select the document's authors. A button "Αντιγραφή" will copy that text straight to system's clipboard.
- After that, there are 2 text areas, one for victim, one for alleged perpetrator. The user copies the text of the ID document of the person of interest from the Police's internal ID application, and a parsed version is provided to the right, with option for edit and copy to clip board
- The above parsed persons will then be passed below to the documents, depending on role, some use the victim, some the perpetrator, some both.
- Clicking the buttons in the "Εκθέσεις" section will download the relevant document in Word format, with the above provided data, to be further processed.
- Below the person parser, there is the vehicle parser. Copy the vehicle's data from the official Vehicle application and paste it to have it formatted, ready for use in a document.

## Localization

A user, in order to fully use all the features will have to provide the local department's investigators and department data, like address, location etc.

**How to:**

- Download all the files locally, from this [GitHub repo](https://github.com/NikEmman/vaxyp), click the `<> Code` button, "download as zip".
- Extract the content, keep the files in the same folder. Open script.js (windows Notepad works fine) and at the very top, in the `data` section, replace the info with your own.
- Save and close script.js, double-click index.html to open with the browser of choice.
- Local version is now live.

### Localization Troubleshooting

- Make sure all downloaded files are in the same folder as index.html
- If you edited script.js, read `data` line by line, make really sure no comma `,` or quotemark `"` is missing. Compare it to the original version.

### See how it works

In the fakeData.md file, you may find strings of a person's data, as if it would have been copied by the official ID finding application. Paste it in the relevant fields!
