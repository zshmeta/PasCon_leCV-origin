
async function writeCV(text) {
  try {

    const config = {
      model: "text-davinci-003",
      prompt: text,
      temperature: 0.6,
      max_tokens: 250,
      top_p: 1,
      frequency_penalty: 1,
      presence_penalty: 1,
    };

    const response = await openai.createCompletion(config);
    return response.data.choices[0].text;
  } catch (error) {
    if (error.response) {
      console.error('erreur chez OpenAI', error.response.data);
    }
    return null;
  }
}

const generateID = () => Math.random().toString(36).substring(2, 10);


app.post("/resume/create", upload.single("headshotImage"), async (req, res) => {
	const {
		fullName,
		currentPosition,
		currentLength,
		currentTechnologies,
		workHistory,
	} = req.body;

	const workArray = JSON.parse(workHistory);
	const newEntry = {
		id: generateID(),
		fullName,
		image_url: `http://localhost:4000/uploads/${req.file.filename}`,
		currentPosition,
		currentLength,
		currentTechnologies,
		workHistory: workArray,
	};

	const prompt1 = `J'ecris mon cv  en francais, mes details sont \n nom: ${fullName} \n position: ${compLvl} (entre ${fromYear} et ${toYear}). Can you write a 100 words description in french for the top of the resume(first person writing)?`;

	const prompt2 = `J'ecris mon cv  en francais, mes details sont \n nom: ${fullName} \n position: ${compLvl} (entre ${fromYear} et ${toYear}). Can you write 10 points in french for a resume on what I am good at?`;

	const remainderText = () => {
		let stringText = "";
		for (let i = 0; i < workArray.length; i++) {
			stringText += ` ${workArray[i].name} as a ${workArray[i].position}.`;
		}
		return stringText;
	};

	const prompt3 = `I am writing a resume in french, my details are \n name: ${fullName} \n role: ${currentPosition} (${currentLength} years). \n During my years I worked at ${
		workArray.length
	} companies. ${remainderText()} \n Can you write me 50 words in french for each company seperated in numbers of my succession in the company (in first person)?`;

	const objective = await ChatGPTFunction(prompt1);
	const keypoints = await ChatGPTFunction(prompt2);
	const jobResponsibilities = await ChatGPTFunction(prompt3);

	const chatgptData = { objective, keypoints, jobResponsibilities };
	const data = { ...newEntry, ...chatgptData };
	database.push(data);

	res.json({
		message: "Connection aux serveur etablie",
		data,
	});
});


// index.js
document.addEventListener("DOMContentLoaded", () => {
    // Helper functions
    const replaceWithBr = (string) => {
      return string.replace(/\n/g, "<br />");
    };
  
    const buildResume = (result) => {
      const appDiv = document.getElementById("app");
  
      const container = document.createElement("main");
      container.className = "container";
  
      // Add header
      const header = document.createElement("header");
      header.className = "header";
      const fullName = document.createElement("h1");
      fullName.textContent = result.fullName;
      header.appendChild(fullName);
  
      // Add other elements ...
  
      container.appendChild(header);
  
      appDiv.appendChild(container);
    };
  
    // Your result object here
    const result = {
      fullName: "John Doe",
      // ... other properties ...
    };
  
    buildResume(result);
  });
  