async completePrompt({a}) {
        //Remove trailing spaces, required for model to work properly
        const text = a.trim();
        //Request text completion using Davinci3
        const url = `https://api.openai.com/v1/engines/davinci3/completions`;

        const options = {
            //Has to be post for some reason
            method: "POST",
            //Input prompt and a decent length
            body: JSON.stringify({
                prompt: text,
                max_tokens: 300,
            }),
            //API key, and JSON content type
            headers: {
                Authorization: "Bearer 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",
                "Content-type": "application/json; charset=UTF-8"
            },
        };

        console.log("REQUEST:" + url);

        //Fetch and await promise.
        const response = await fetch(url, options);
        //Get JSON data
        const jsonData = await response.json();

        //The ai response will be the first (and only) choices text
        const output = jsonData.choices[0].text;
        return output;
    }

